# Deployment guide

The application is deployment-ready, but the final public URL requires access to your hosting accounts. This repository does not contain any hosting credentials.

## 1. Deploy MongoDB

Create/use a MongoDB Atlas database and allow the deployed API server to connect. Put the connection string in the backend host's `MONGODB_URI` environment variable.

## 2. Deploy backend

The included `render.yaml` is configured for Render. If deploying manually, use:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

Set:

```text
MONGODB_URI=<your MongoDB Atlas URI>
FRONTEND_URL=https://<your-frontend-domain>
```

The API health endpoint is `/`.

## 3. Deploy frontend

The included `vercel.json` supports a Vite SPA. Set:

```text
VITE_API_URL=https://<your-backend-domain>
```

Then deploy the `frontend` directory as the Vercel project root.

## 4. Final verification

From the public frontend URL, verify:

1. Register a new user.
2. Confirm the generated 6-digit code is displayed.
3. Enter the registered email in checkout.
4. Confirm the recognition request opens the OTP modal.
5. Verify an incorrect code shows an error in the modal.
6. Verify the correct code logs the user in and displays their name.
7. Verify Skip Login returns to checkout.
8. Submit checkout and confirm the API responds successfully.
9. Confirm the record appears in MongoDB.

Do not put MongoDB credentials, `.env` files, or other secrets into GitHub.
