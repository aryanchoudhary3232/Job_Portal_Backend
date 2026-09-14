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
import {
  requireProviderConfig,
  getCallbackUrl,
  exchangeGoogleCode,
  exchangeGithubCode,
  fetchGoogleProfile,
  fetchGithubProfile,
} from "./oauth-providers.js";

const stateStore = new Map();
const stateTtlMs = 10 * 60 * 1000;
const clientRedirect =
  process.env.OAUTH_CLIENT_REDIRECT || "http://localhost:3000/oauth/callback";

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
  return createUser({
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
