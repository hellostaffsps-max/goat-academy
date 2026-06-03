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
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

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
- **Default Admin:** `admin@goatjourney.com` / `admin123`

## Supabase Setup

1. Create a Supabase project
2. Run the SQL schemas:
   - `supabase-schema.sql` — core tables (lessons, cafes, admin_settings)
   - `supabase-auth-schema.sql` — auth & user isolation (profiles, user_favorites, user_progress, user_settings)
   - `supabase-full.sql` — seed data (90 lessons)
3. Fix the `profiles` RLS policy if needed using `fix-profiles-rls.sql`
4. Configure Auth settings:
   - Disable signups (`disable_signup: true`)
   - Enable email auto-confirm (`mailer_autoconfirm: true`)

## License

Private — GoatJourney
