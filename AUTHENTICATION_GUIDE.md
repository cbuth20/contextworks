# Authentication Guide

## Overview

ContextWorks Client Portal supports **two authentication methods**:

1. **Magic Link** (Passwordless) - Default for all users
2. **Password** - Optional for admins and registered users

## Authentication Methods

### 1. Magic Link (Passwordless)

**How it works:**
1. User enters their email
2. Clicks "Send Magic Link"
3. Receives email with secure link
4. Clicks link to authenticate
5. Automatically logged in

**Best for:**
- Quick access
- Clients who don't want to remember passwords
- Enhanced security (no password to steal)
- Mobile users

**Pros:**
- ✅ No password to remember
- ✅ More secure (phishing resistant)
- ✅ No password reset flows needed
- ✅ Works on any device

**Cons:**
- ⚠️ Requires email access
- ⚠️ Slightly slower (email delay)

### 2. Password-Based Login

**How it works:**
1. User enters email and password
2. Clicks "Sign In"
3. Immediately authenticated
4. Redirected to appropriate dashboard

**Best for:**
- Admins who login frequently
- Users who prefer traditional login
- Environments with reliable password managers
- Quick access without email checks

**Pros:**
- ✅ Instant login (no email delay)
- ✅ Works offline (after initial setup)
- ✅ Familiar user experience
- ✅ Can use password managers

**Cons:**
- ⚠️ Must set password first
- ⚠️ Need password reset flow
- ⚠️ Less secure if weak password

## Setting Up Password Authentication

### For Admins

1. **First Time Login:**
   - Use magic link to login
   - Go to Admin → Settings
   - Set a password (8+ characters)
   - Now you can use either method!

2. **Via Settings Page:**
   ```
   Admin Dashboard → Settings → Set/Change Password
   ```

3. **Password Requirements:**
   - Minimum 8 characters
   - Should be unique and strong
   - Consider using a password manager

### For Clients

By default, clients use magic links only. To enable password login for a client:

1. Client logs in via magic link (first time)
2. They would need a settings page (not yet implemented for clients)
3. Alternatively, admin can send password reset link

## Login Flow

### On the Login Page

Users see **two tabs**:
- **Magic Link** (left tab)
- **Password** (right tab)

They can switch between them at any time.

### Magic Link Tab
```
┌─────────────────────────────┐
│  [Magic Link] [Password]     │
├─────────────────────────────┤
│  Email address               │
│  ┌─────────────────────────┐│
│  │ you@example.com         ││
│  └─────────────────────────┘│
│                             │
│  [Send Magic Link]          │
│                             │
│  We'll email you a secure   │
│  link to sign in            │
└─────────────────────────────┘
```

### Password Tab
```
┌─────────────────────────────┐
│  [Magic Link] [Password]     │
├─────────────────────────────┤
│  Email address               │
│  ┌─────────────────────────┐│
│  │ you@example.com         ││
│  └─────────────────────────┘│
│  Password                    │
│  ┌─────────────────────────┐│
│  │ ••••••••                ││
│  └─────────────────────────┘│
│  [Sign In]                  │
│                             │
│  For admin and registered   │
│  users                      │
└─────────────────────────────┘
```

## User Flows

### Admin First-Time Setup

```
1. Login with magic link (email sent during setup)
2. Set admin email in environment variables
3. Go to Settings page
4. Set a strong password
5. Next time: Choose password or magic link!
```

### Admin Daily Login

```
Option A: Password (faster)
1. Go to login page
2. Click "Password" tab
3. Enter email + password
4. Click "Sign In"
5. ✅ Instant access

Option B: Magic Link (more secure)
1. Go to login page
2. Stay on "Magic Link" tab
3. Enter email
4. Click "Send Magic Link"
5. Check email
6. Click link
7. ✅ Authenticated
```

### Client Login

```
1. Go to login page
2. Use "Magic Link" tab
3. Enter email
4. Check email
5. Click link
6. ✅ View documents
```

## Security Considerations

### Magic Links
- ✅ **More Secure**: No password to guess/steal
- ✅ **Phishing Resistant**: Link tied to specific session
- ✅ **Automatic Expiry**: Links expire after use/time
- ⚠️ **Email Security**: Only as secure as email account

### Passwords
- ⚠️ **Phishing Risk**: Users can be tricked into entering on fake sites
- ⚠️ **Reuse Risk**: Users may reuse passwords
- ✅ **Familiar**: Users understand the security model
- ✅ **Password Managers**: Can use strong, unique passwords

### Recommendations

**For Admins:**
- Use password + password manager for daily use
- Keep magic link as backup
- Use strong, unique password (16+ characters)
- Enable 2FA if available (future enhancement)

**For Clients:**
- Magic link is perfect for occasional use
- No password to remember
- Secure by default

## Technical Implementation

### Supabase Auth Configuration

The app uses Supabase Auth which supports:
- Email/Password authentication
- Magic link (OTP) authentication
- Session management
- Automatic token refresh

### Code Structure

**Login Form:** `components/shared/LoginForm.tsx`
- Tabbed interface
- Handles both auth methods
- Shows appropriate messages

**Settings Page:** `app/admin/settings/page.tsx`
- Password management
- Account information
- Admin only

**Auth Callback:** `app/auth/callback/route.ts`
- Handles magic link redirects
- Exchanges code for session
- Redirects to correct dashboard

## Environment Variables

```bash
# No additional variables needed!
# Both auth methods use the same Supabase config

NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

## Troubleshooting

### "Invalid login credentials"
- Check email is correct
- Verify password is set (go to Settings)
- Try magic link instead

### "Email not confirmed"
- Check spam folder for confirmation email
- Resend magic link
- Contact admin

### Magic link not working
- Check email spam folder
- Link may be expired (try again)
- Ensure email matches registered account

### Can't set password
- Must be logged in first (via magic link)
- Password must be 8+ characters
- Try refreshing the page

## Future Enhancements

Possible additions:

1. **Two-Factor Authentication (2FA)**
   - TOTP codes
   - SMS verification
   - Backup codes

2. **Social Login**
   - Google OAuth
   - GitHub OAuth
   - Microsoft OAuth

3. **Password Reset Flow**
   - Forgot password link
   - Reset via email
   - Temporary passwords

4. **Client Settings Page**
   - Let clients set their own passwords
   - Manage their account
   - Notification preferences

5. **Session Management**
   - View active sessions
   - Logout from all devices
   - Session duration settings

## Best Practices

### For Users
- ✅ Use password manager for strong passwords
- ✅ Keep email secure (2FA on email)
- ✅ Don't share magic links
- ✅ Logout on shared devices

### For Admins
- ✅ Set strong admin password immediately
- ✅ Use password manager
- ✅ Monitor failed login attempts
- ✅ Review user access regularly
- ✅ Keep backup access method (magic link)

---

**Both authentication methods are secure and reliable. Choose what works best for your workflow!** 🔐
