English | [한국어](https://github.com/kych0912/saas-starter-ko/blob/main/README-ko.md)

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
cd saas-starter-ko
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

## Resend (Email) Usage

We use Resend for transactional emails such as team invitations. Currently, the dashboard “invite team” action sends an email that includes an invitation link.

Template

```
apps/client/components/email/invite-team.tsx
```

This template is built with React Email.

### Recommended: Domain Authentication (SPF/DKIM)

For better deliverability, connect a custom domain in Resend and complete DNS (SPF/DKIM) verification. You can test without a domain, but in production there’s a higher chance of emails being filtered as spam.

## Excel to i18n JSON Translation Guide

This guide explains how to use the translation script in the Next.js SaaS Starter project to convert Excel files to i18n JSON format.

### Excel File Format

The translation Excel file should be structured in the following format:

```
namespace.key English Korean
```

Example:

```
signup.title Create your account 계정 생성
signup.email email 이메일
```

### Converting Excel to JSON

Follow these steps to convert your Excel translation file to i18n JSON format:

1. Prepare your Excel file in the format described above with keys, English translations, and Korean translations.

2. Save the Excel file in the designated directory in your project.
   (Typically in the `/data` folder)

3. Run the following command in your terminal:

```bash
pnpm prebuild
```

4. This command will automatically parse the Excel file and convert it to JSON format compatible with i18n.

### Generated JSON Structure

After conversion, the script will generate JSON files for each language and namespace in your project's locale directories. Here are examples of the generated files:

#### `/i18n/locales/en/activity.json`

```json
{
  "title": "Activity Log",
  "card_title": "Recent Activity",
  "sign_up": "You signed up",
  "sign_in": "You signed in",
  "sign_out": "You signed out",
  "update_password": "You changed your password",
  "delete_account": "You deleted your account",
  "update_account": "You updated your account",
  "create_team": "You created a new team",
  "remove_team_member": "You removed a team member",
  "invite_team_member": "You invited a team member",
  "accept_invitation": "You accepted an invitation",
  "unknown": "Unknown action occurred",
  "no_activity": "No activity yet",
  "when_you_perform_actions": "When you perform actions like signing in or updating your account, they'll appear here.",
  "just_now": "just now",
  "minutes_ago": "{{count}} minutes ago",
  "hours_ago": "{{count}} hours ago",
  "days_ago": "{{count}} days ago"
}
```

#### `/i18n/locales/ko/activity.json`

```json
{
  "title": "활동 로그",
  "card_title": "최근 활동",
  "sign_up": "회원가입 완료",
  "sign_in": "로그인 완료",
  "sign_out": "로그아웃 완료",
  "update_password": "비밀번호 변경 완료",
  "delete_account": "계정 삭제 완료",
  "update_account": "계정 정보 업데이트 완료",
  "create_team": "새 팀 생성 완료",
  "remove_team_member": "팀 멤버 제거 완료",
  "invite_team_member": "팀 멤버 초대 완료",
  "accept_invitation": "초대 수락 완료",
  "unknown": "알 수 없는 작업이 발생했습니다",
  "no_activity": "아직 활동이 없습니다.",
  "when_you_perform_actions": "로그인 또는 업데이트 시, 이곳에 표시됩니다.",
  "just_now": "방금",
  "minutes_ago": "{{count}}분 전",
  "hours_ago": "{{count}}시간 전",
  "days_ago": "{{count}}일 전"
}
```

These JSON files are created with nested object structures for each language (English and Korean) that can be used by the i18n system.

In your application, you can reference these translations using keys like this:

```typescript
// Import the translation hook with language, namespace, and options in client component
const { t } = useTranslation(lng, 'setting', {})

//In server component, import useTranslation in /useTranslation
const { t } = useTranslation(lng,'setting')

<div>
    {t('title')}
    {t('card_title')}
</div>

```

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
2. Connect the repository to Vercel and deploy it.
3. Go to your project, then navigate to the Settings tab and find the Build and Deployment section.
4. In the Root Directory setting, enter apps/client.
5. Follow the Vercel deployment process for guided project setup.

### Add environment variables

In your Vercel project settings (or during deployment), add all the necessary environment variables. Make sure to update the values for the production environment, including:

1. `BASE_URL`: Set this to your production domain.
2. `STEPPAY_SECRET_KEY`: Use your StepPay secret key for the production environment.
3. `STEPPAY_WEBHOOK_SECRET`: Use the webhook secret from the production webhook you created in step
4. `POSTGRES_URL, NEXTAUTH_SECRET`: Set this to your production database URL.
5. `AUTH_SECRET`: Set this to a random string. `openssl rand -base64 32` will generate one.
6. `GOOGLE_ID, NAVER_ID`: Set these to your Google and NAVER OAuth client IDs.
7. `GOOGLE_SECRET, NAVER_SECRET`: Set these to your Google and NAVER OAuth client secrets.
8. `RESEND_API_KEY`: Your API key issued by Resend.
9. `RESEND_FROM`: The email address to send from via Resend. If not set, it defaults to onboarding@resend.dev.
