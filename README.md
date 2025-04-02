# Next.js SaaS Starter

This Project based on a original [Next.js SaaS Starter](https://github.com/nextjs/saas-starter) template for building a SaaS application using Next.js with support for authentication, StepPay integration for payments, and a dashboard for logged-in users.

**Demo: [https://saas-starter-ko.vercel.app/en](https://saas-starter-ko.vercel.app/en)**

## New features and modifications

1. Payment method change (Stripe -> StepPay)
2. Support StepPay Webhook-Based Subscription Payment
3. Dark mode
4. KO/EN Multi-languages support
5. Parsing scripts to convert Excel translation files to JSON format for i18next.
6. Google & NAVER login

## Features

- Marketing landing page (`/`) with animated Terminal element
- Pricing page (`/pricing`) which connects to StepPay Checkout
- Dashboard pages with CRUD operations on users/teams
- Basic RBAC with Owner and Member roles
- Subscription management with StepPay Customer Portal
- Email/password authentication with JWTs stored to cookies
- Global middleware to protect logged-in routes
- Local middleware to protect Server Actions or validate Zod schemas
- Activity logging system for any user events

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Payments**: [StepPay](https://steppay.kr/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

```bash
git clone https://github.com/kych0912/saas-starter-ko
cd saas-starter
pnpm install
```

## Running Locally

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

Then, run the database migrations and seed the database with a default user and team:

```bash
pnpm db:migrate
pnpm db:seed
```

This will create the following user and team:

- User: `test@test.com`
- Password: `admin123`

You can, of course, create new users as well through `/sign-up`.

Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## Testing Payments

For testing StepPay payments, you'll need to:
Use your real card number for testing, but please test locally as this is required for proper testing functionality. The good news is that when testing locally and Demo, no actual charges will be made to your card.

You can use either your actual credit/debit card or KakaoPay for testing purposes.

Card Number: You'll need to use your actual card number
Expiration Date: Any future date is fine

## Going to Production

When you're ready to deploy your SaaS application to production, follow these steps:

### Set up a production StepPay webhook

1. Go to the StepPay Dashboard and create a new webhook for your production environment.
2. Set the endpoint URL to your production API route (e.g., `https://yourdomain.com/api/steppay/webhook`).
3. Select the events you want to listen for

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to [Vercel](https://vercel.com/) and deploy it.
3. Follow the Vercel deployment process, which will guide you through setting up your project.

### Add environment variables

In your Vercel project settings (or during deployment), add all the necessary environment variables. Make sure to update the values for the production environment, including:

1. `BASE_URL`: Set this to your production domain.
2. `STEPPAY_SECRET_KEY`: Use your StepPay secret key for the production environment.
3. `STEPPAY_WEBHOOK_SECRET`: Use the webhook secret from the production webhook you created in step
4. `POSTGRES_URL, NEXTAUTH_SECRET`: Set this to your production database URL.
5. `AUTH_SECRET`: Set this to a random string. `openssl rand -base64 32` will generate one.
6. `GOOGLE_ID, NAVER_ID`: Set these to your Google and NAVER OAuth client IDs.
7. `GOOGLE_SECRET, NAVER_SECRET`: Set these to your Google and NAVER OAuth client secrets.
