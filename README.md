# ContextWorks Client Portal

A secure client portal for document management and electronic signing.

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** + ShadCN/UI components
- **Supabase** (Auth, Database, Storage)
- **Native PDF Signing** (react-pdf + pdf-lib)
- **Netlify** (hosting)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Features

### Admin Portal
- Client management (CRUD operations)
- Document upload
- Send documents for electronic signature
- Track document status
- Download signed documents

### Client Portal
- Magic link authentication (passwordless)
- View assigned documents
- **Native PDF signing** (draw signature, click to place)
- Download signed PDFs
- Document status tracking
- Mobile-friendly touch signature drawing

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard routes
│   ├── documents/         # Client portal routes
│   ├── auth/              # Authentication routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # ShadCN/UI components
│   ├── admin/            # Admin-specific components
│   ├── client/           # Client-specific components
│   └── shared/           # Shared components
├── lib/                  # Utilities and clients
│   ├── supabase/        # Supabase clients
│   └── dropbox-sign/    # Dropbox Sign API wrapper
├── types/                # TypeScript types
├── hooks/                # Custom React hooks
├── netlify/functions/    # Serverless functions
└── supabase/migrations/  # Database migrations
```

## Environment Variables

See `.env.example` for all required environment variables.

## Security

- Row Level Security (RLS) on all database tables
- Magic link authentication via Supabase Auth
- Signed URLs for secure file downloads
- Webhook signature verification
- Admin role verification

## License

Proprietary - ContextWorks LLC
