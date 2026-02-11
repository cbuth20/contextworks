# Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **Supabase Account**
   - Create a project at https://supabase.com
   - Note your project URL and keys

2. **Dropbox Sign Account**
   - Create an account at https://www.dropbox.com/sign
   - Get your API key and Client ID
   - Configure webhook URL

3. **Netlify Account**
   - Create an account at https://netlify.com
   - Connect your GitHub repository

## Step 1: Set Up Supabase

1. Create a new Supabase project
2. Run the migrations in order:
   ```bash
   # In Supabase SQL Editor
   # Run 001_initial_schema.sql
   # Run 002_rls_policies.sql
   # Run 003_storage_buckets.sql
   ```

3. Get your credentials:
   - Go to Settings > API
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

4. Configure Admin Email:
   - In SQL Editor, run:
   ```sql
   ALTER DATABASE postgres SET app.admin_email = 'your-admin@email.com';
   ```

## Step 2: Set Up Dropbox Sign

1. Create a Dropbox Sign account
2. Go to Settings > API
3. Create an API app
4. Copy your credentials:
   - API Key → `DROPBOX_SIGN_API_KEY`
   - Client ID → `DROPBOX_SIGN_CLIENT_ID` and `NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID`

5. Configure webhook:
   - URL: `https://your-app.netlify.app/api/webhooks/dropbox-sign`
   - Events: signature_request_sent, signature_request_viewed, signature_request_signed

## Step 3: Deploy to Netlify

1. Push your code to GitHub

2. In Netlify:
   - Click "New site from Git"
   - Connect to your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
     - Functions directory: `netlify/functions`

3. Set environment variables in Netlify:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DROPBOX_SIGN_API_KEY=your_dropbox_sign_api_key
   DROPBOX_SIGN_CLIENT_ID=your_client_id
   NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID=your_client_id
   DROPBOX_SIGN_WEBHOOK_SECRET=your_webhook_secret
   NEXT_PUBLIC_APP_URL=https://your-app.netlify.app
   NEXT_PUBLIC_ADMIN_EMAIL=your-admin@email.com
   ```

4. Deploy the site

## Step 4: Configure Supabase Auth

1. In Supabase Dashboard:
   - Go to Authentication > URL Configuration
   - Set Site URL: `https://your-app.netlify.app`
   - Add Redirect URLs:
     - `https://your-app.netlify.app/auth/callback`
     - `http://localhost:3000/auth/callback` (for local dev)

2. Configure Email Templates:
   - Go to Authentication > Email Templates
   - Customize the magic link email template

## Step 5: Update Dropbox Sign Webhook

1. Go back to Dropbox Sign settings
2. Update webhook URL to your deployed Netlify URL:
   - `https://your-app.netlify.app/api/webhooks/dropbox-sign`

## Step 6: Test Production Deployment

1. Visit your deployed site
2. Test the complete flow:
   - Admin login
   - Create client
   - Upload document
   - Send for signature
   - Client login
   - View document
   - Sign document
   - Download signed PDF

## Troubleshooting

### Build Errors

- Check Netlify build logs
- Ensure all dependencies are installed
- Verify environment variables are set

### Authentication Issues

- Check Supabase URL configuration
- Verify redirect URLs
- Check admin email is set correctly

### Webhook Not Working

- Verify webhook URL is correct
- Check Dropbox Sign event subscriptions
- Review webhook signature verification
- Check Netlify function logs

### RLS Errors

- Ensure migrations ran successfully
- Verify admin email is configured in database
- Check Supabase logs

## Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in all environment variables
3. Run: `npm run dev`
4. Visit: http://localhost:3000

## Security Checklist

- [ ] Service role key is kept secret (never in client code)
- [ ] Admin email is properly configured
- [ ] RLS policies are enabled on all tables
- [ ] Webhook signature verification is working
- [ ] HTTPS is enforced
- [ ] File upload validation is in place
- [ ] Signed URLs have appropriate expiry times

## Monitoring

- Check Netlify analytics for traffic
- Monitor Supabase usage and errors
- Review Dropbox Sign API usage
- Set up alerts for failed webhooks

## Updates

To update the deployed application:

1. Push changes to GitHub
2. Netlify will automatically redeploy
3. Run any new migrations in Supabase if needed

## Support

For issues:
- Check Netlify function logs
- Check Supabase logs
- Review browser console
- Contact support if needed
