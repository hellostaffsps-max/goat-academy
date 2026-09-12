# GoatJourney Academy

أكاديمية تفاعلية لتعلم القهوة والمقاهي في فلسطين — مشروبات، تحضير، معدات، بن، مصطلحات، وتأسيس مقاهي.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **State:** Zustand
- **Backend:** Supabase (Auth, Database, Storage)
- **Deployment:** Vercel

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Local Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Read [SEO-DEPLOYMENT.md](SEO-DEPLOYMENT.md) for the required database and verification steps.

### 1. GitHub
Push this repo to your GitHub account.

### 2. Vercel
1. Import your GitHub repo on [Vercel](https://vercel.com)
2. Add the environment variables from `.env.local.example`
3. Deploy

### 3. Custom Domain
1. In Vercel project settings → Domains, add your custom domain
2. Follow Vercel's DNS configuration instructions
3. Update your domain's DNS records (CNAME or A record)

## Admin Dashboard

- **URL:** `/admin`
- **Login:** `/auth/login`
- **Authorization:** an existing Supabase Auth account with `app_metadata.role = "admin"`, assigned through the trusted Auth Admin API. No default account or password is shipped.

## Supabase and SEO release setup

Follow [SEO-DEPLOYMENT.md](SEO-DEPLOYMENT.md) before deploying this release. It covers the verified project, role provisioning, RLS repair, tests and search ownership settings. Do not run bootstrap/seed SQL against an existing production database.

Public local preview works without Supabase credentials using repository content. With credentials configured, the server uses RLS-visible Supabase content; database failures are not silently replaced with local seed data.

```bash
npm run build
npm run start
# In a second terminal:
npm run verify:seo -- http://localhost:3000
```

## License

Private — GoatJourney
