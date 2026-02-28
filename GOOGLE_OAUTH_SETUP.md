# Google OAuth Setup Guide

This guide explains how to set up Google OAuth for sign-in and account creation in the RentRide application.

## Prerequisites

- Google Cloud Console account
- Project created in Google Cloud Console
- OAuth 2.0 credentials configured

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter project name (e.g., "RentRide")
5. Click "CREATE"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "ENABLE"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "CREATE CREDENTIALS" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: "RentRide"
     - User support email: your email
     - Developer contact: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if in development
4. After consent screen is configured, create OAuth client ID:
   - Application type: "Web application"
   - Name: "RentRide Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
5. Click "CREATE"
6. Copy the Client ID and Client Secret

## Step 4: Configure Environment Variables

Add the following to your `.env` file:

```env
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

Replace `your_google_client_id` and `your_google_client_secret` with the values from Step 3.

## Step 5: Verify Configuration

The following files have been updated to support Google OAuth:

### Authentication Configuration

- `src/core/lib/auth.ts` - Added GoogleProvider with automatic user creation

### Login Page

- `src/features/authentication/components/LoginForm.tsx` - Added Google sign-in button

### Registration Page

- `src/features/authentication/components/RegisterForm.tsx` - Added Google sign-up button

## Features Implemented

### Sign-In with Google

- Users can click "Google" button on login page
- Existing users are automatically logged in
- New users are automatically created with:
  - Email from Google account
  - Name from Google profile
  - Default role: USER (renter)
  - Empty password hash (OAuth users don't have passwords)

### Sign-Up with Google

- Users can click "Google" button on registration page
- New account is created automatically
- Users are redirected to their dashboard based on role

### Return URL Preservation

- After Google sign-in, users are redirected to:
  - The vehicle detail page they were viewing (if returnUrl was provided)
  - Their role-based dashboard (if no returnUrl)

### Account Linking

- If a user signs in with Google using an email that already exists:
  - The existing account is used
  - User is logged in successfully
  - No duplicate accounts are created

## Testing

### Local Development

1. Start the application:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click the "Google" button

4. Sign in with your Google account

5. You should be redirected to your dashboard

### Testing Sign-Up

1. Navigate to `http://localhost:3000/register`

2. Click the "Google" button

3. Sign in with a Google account that hasn't been used before

4. A new account should be created and you should be redirected to the renter dashboard

## Troubleshooting

### "Invalid redirect URI" Error

- Ensure the redirect URI in Google Cloud Console matches exactly:
  - `http://localhost:3000/api/auth/callback/google` for development
  - `https://yourdomain.com/api/auth/callback/google` for production

### "Client ID not found" Error

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`
- Restart the development server after updating `.env`

### User Not Created

- Check database connection
- Verify Prisma migrations are up to date
- Check server logs for database errors

### Redirect Loop

- Clear browser cookies
- Verify `NEXTAUTH_URL` is set correctly in `.env`
- Check that `NEXTAUTH_SECRET` is set

## Security Considerations

1. **Never commit credentials** - Keep `.env` file in `.gitignore`
2. **Use HTTPS in production** - Google OAuth requires HTTPS for production
3. **Validate redirect URLs** - The application validates return URLs to prevent open redirects
4. **Secure cookies** - Session cookies are marked as secure and httpOnly in production
5. **CSRF protection** - NextAuth v5 provides built-in CSRF protection

## Production Deployment

1. Update Google Cloud Console OAuth credentials:
   - Add production domain to "Authorized JavaScript origins"
   - Add production callback URL to "Authorized redirect URIs"

2. Update environment variables:

   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   GOOGLE_CLIENT_ID="your_production_client_id"
   GOOGLE_CLIENT_SECRET="your_production_client_secret"
   ```

3. Ensure `NODE_ENV=production` is set

4. Verify HTTPS is enabled on your domain

## Additional Resources

- [NextAuth.js Google Provider Documentation](https://next-auth.js.org/providers/google)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
