This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## For the Flexlists backend; 

- install docker, docker-compose 
- add to the .env file in this repository: 

```
NEXT_PUBLIC_FLEXLIST_API_URL=http://localhost:8080
NEXT_PUBLIC_FLEXLIST_API_URL_SSR=http://localhost:8080
NEXT_PUBLIC_FLEXLIST_CLIENT_URL=http://localhost:8080
NEXT_PUBLIC_FLEXLIST_VIEWS=list,calendar,kanban,gallery,map
NEXT_PUBLIC_FLEXLIST_COMINGSOON_VIEWS=kanban,map,gantt,timeline
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY={NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}                                 
```

The SSR url is for real deployments, so the call to the backend via NEXTJS doesn't roundtrip over the entire
internet before calling the localhost backend :]


- start this repository in dev mode 

```
yarn dev
```

- run

```
docker-compose -f ./docker-compose.dev.frontendbackend.yml up -d
```

- go to http://localhost:8080




## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
## local development steps
1. get latest code in master and merge to you branch
2. run: docker-compose -f docker-compose.dev.frontendbackend.yml  down
3. run: docker-compose -f docker-compose.dev.frontendbackend.yml  up -d
4. run: yarn dev
5. run http://127.0.0.1:8080/ and you have to create new account
## Config stripe steps :
1. get Publisable key in test mode(https://dashboard.stripe.com/test/apikeys) or live mode(https://dashboard.stripe.com/apikeys)
2. add to .env : NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY={NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}  
