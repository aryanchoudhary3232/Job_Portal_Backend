# Job Portal Backend

Microservices-backed demo job portal backend with:

- `api-gateway`
- `auth-service`
- `user-service`
- `job-service`
- `application-service`
- `admin-service`

## Demo accounts

- Student: `student@demo.com` / `Password123`
- Recruiter: `recruiter@demo.com` / `Password123`
- Staff: `staff@demo.com` / `Password123`

## Run

1. Copy `.env.example` to `.env`.
2. Run `npm install` in `JOBPORTAL_Backend`.
3. Start each service:
   - `npm run start:auth`
   - `npm run start:users`
   - `npm run start:jobs`
   - `npm run start:applications`
   - `npm run start:admin`
   - `npm run start:gateway`
