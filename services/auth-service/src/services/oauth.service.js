import crypto from "node:crypto";
import { roles } from "../../../../shared/src/domain/constants.js";
import { ensure } from "../../../../shared/src/http/errors.js";
import { signToken } from "../../../../shared/src/auth/token.js";
import { createId } from "../../../../shared/src/utils/ids.js";
import {
  createUser,
  findUserByEmail,
  findUserByProvider,
  updateUser,
} from "../repositories/auth.repository.js";

const stateStore = new Map();
const stateTtlMs = 10 * 60 * 1000;

const callbackBase =
  process.env.OAUTH_CALLBACK_BASE_URL || "http://localhost:4000/api/auth/oauth";
const clientRedirect =
  process.env.OAUTH_CLIENT_REDIRECT || "http://localhost:3000/oauth/callback";

const providers = {
  google: {
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
    scopes: ["openid", "email", "profile"],
    clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
  },
  github: {
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userUrl: "https://api.github.com/user",
    emailUrl: "https://api.github.com/user/emails",
    scopes: ["read:user", "user:email"],
    clientId: process.env.OAUTH_GITHUB_CLIENT_ID,
    clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
  },
};

const createState = (provider) => {
  const state = crypto.randomUUID();
  stateStore.set(state, { provider, createdAt: Date.now() });
  return state;
};

const consumeState = (provider, state) => {
  const record = stateStore.get(state);
  ensure(record, 400, "Invalid OAuth state");
  ensure(record.provider === provider, 400, "Invalid OAuth state");
  ensure(
    Date.now() - record.createdAt < stateTtlMs,
    400,
    "OAuth state expired",
  );
  stateStore.delete(state);
};

const getCallbackUrl = (provider) => `${callbackBase}/${provider}/callback`;

const requireProviderConfig = (provider) => {
  const config = providers[provider];
  ensure(config, 400, "Unsupported OAuth provider");
  ensure(config.clientId, 500, "OAuth client ID missing");
  ensure(config.clientSecret, 500, "OAuth client secret missing");
  return config;
};

export const buildOAuthUrl = (provider) => {
  const config = requireProviderConfig(provider);
  const state = createState(provider);
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: getCallbackUrl(provider),
    response_type: "code",
    scope: config.scopes.join(" "),
    state,
  });
  if (provider === "google") {
    params.set("access_type", "offline");
    params.set("prompt", "select_account");
  }
  return { url: `${config.authorizeUrl}?${params.toString()}`, state };
};

const exchangeGoogleCode = async (code) => {
  const config = requireProviderConfig("google");
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: getCallbackUrl("google"),
    grant_type: "authorization_code",
    code,
  });
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = await response.json();
  ensure(response.ok, 401, "Google OAuth failed", payload);
  return payload.access_token;
};

const exchangeGithubCode = async (code) => {
  const config = requireProviderConfig("github");
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: getCallbackUrl("github"),
    code,
  });
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  });
  const payload = await response.json();
  ensure(response.ok, 401, "GitHub OAuth failed", payload);
  ensure(payload.access_token, 401, "GitHub OAuth token missing", payload);
  return payload.access_token;
};

const fetchGoogleProfile = async (accessToken) => {
  const response = await fetch(providers.google.userUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await response.json();
  ensure(response.ok, 401, "Google profile lookup failed", payload);
  return {
    providerId: payload.sub,
    email: payload.email,
    fullName: payload.name,
    avatarUrl: payload.picture,
  };
};

const fetchGithubProfile = async (accessToken) => {
  const response = await fetch(providers.github.userUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "ncrjobs-auth",
    },
  });
  const payload = await response.json();
  ensure(response.ok, 401, "GitHub profile lookup failed", payload);

  let email = payload.email;
  if (!email) {
    const emailResponse = await fetch(providers.github.emailUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "ncrjobs-auth",
      },
    });
    const emails = await emailResponse.json();
    const primary = Array.isArray(emails)
      ? emails.find((item) => item.primary && item.verified)
      : null;
    email =
      primary?.email || (Array.isArray(emails) ? emails[0]?.email : undefined);
  }

  return {
    providerId: String(payload.id),
    email,
    fullName: payload.name || payload.login,
    avatarUrl: payload.avatar_url,
  };
};

const sanitize = ({ passwordHash, ...user }) => user;

const findOrCreateUser = async ({ provider, profile }) => {
  ensure(profile.email, 400, "Email not available from provider");
  const email = profile.email.toLowerCase();
  const existingByProvider = await findUserByProvider(
    provider,
    profile.providerId,
  );
  if (existingByProvider) {
    return existingByProvider;
  }
  const existingByEmail = await findUserByEmail(email);
  if (existingByEmail) {
    if (
      existingByEmail.oauthProvider &&
      existingByEmail.oauthProvider !== provider
    ) {
      ensure(false, 409, "Email already linked with another provider");
    }
    return updateUser(existingByEmail.id, {
      oauthProvider: provider,
      oauthProviderId: profile.providerId,
      avatarUrl: profile.avatarUrl || existingByEmail.avatarUrl,
    });
  }
  const user = await createUser({
    id: createId("usr"),
    fullName: profile.fullName || "Student",
    email,
    passwordHash: null,
    role: roles.student,
    headline: "Student candidate",
    location: "India",
    bio: "Profile created with social login.",
    skills: [],
    college: "",
    phone: "",
    oauthProvider: provider,
    oauthProviderId: profile.providerId,
    avatarUrl: profile.avatarUrl || "",
  });
  return user;
};

export const handleOAuthCallback = async ({ provider, code, state }) => {
  consumeState(provider, state);
  const accessToken =
    provider === "google"
      ? await exchangeGoogleCode(code)
      : await exchangeGithubCode(code);
  const profile =
    provider === "google"
      ? await fetchGoogleProfile(accessToken)
      : await fetchGithubProfile(accessToken);
  const user = await findOrCreateUser({ provider, profile });
  return { accessToken: signToken(user), user: sanitize(user) };
};

export const buildClientRedirect = (result) => {
  const params = new URLSearchParams({ token: result.accessToken });
  return `${clientRedirect}?${params.toString()}`;
};
