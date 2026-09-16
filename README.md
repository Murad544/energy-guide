# Energy Guide

Azərbaycan dilində günəş enerjisi üzrə dərslər, mühəndislik hesablayıcıları və seçilmiş istinad mənbələri təqdim edən Next.js tətbiqi.

## Local setup

1. Copy `.env.example` to `.env` and replace the admin hash and JWT secret.
2. Run `pnpm db:up`, `pnpm db:generate`, `pnpm db:migrate`, then `pnpm db:seed`.
3. Start the app with `pnpm dev`.

Prisma 8 uses `prisma/contract.prisma` as the database contract. Use
`pnpm db:update` while developing after changing the contract. For a reviewed
migration, run `pnpm db:migration:plan --name <migration-name>` and then
`pnpm db:migrate`. `pnpm db:verify` checks whether the database matches the
contract. Use `pnpm db:init` only to adopt an existing database that already
contains the contract's tables, such as a database created by Prisma 6.

To deploy the app and its managed Prisma Postgres database to Prisma Compute,
run `pnpm exec prisma auth login` once and then `pnpm deploy:prisma`. In CI,
provide `PRISMA_SERVICE_TOKEN` and `PRISMA_WORKSPACE_ID` instead of using an
interactive login.

The public site is available at `/`; the single-account admin panel starts at `/login`.

## Tests

Run the test suite locally with `pnpm test:run`.
The `Tests` GitHub Actions workflow runs the suite on pull requests targeting
`main`, using Node.js 24 and pnpm 12.3.4. New commits cancel older runs for the
same pull request. No repository secrets or running database are required.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
