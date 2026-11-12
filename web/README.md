# Marketplace Web

The Next.js frontend for the [PC Parts Marketplace](https://github.com/min-kim-careers/marketplace). See that repo for the demo and the architecture.

- Image-first listing grid, item pages and seller profiles
- Firebase Auth (Google and email/password), with route protection in `middleware.ts`
- Cloudflare Turnstile on sign-in
- Real-time chat over WebSocket (`NEXT_PUBLIC_CHAT_URL`)
- Zustand for client state, and Tailwind + shadcn for the UI

**Stack:** Next.js 15 · React · TypeScript · Zustand · Tailwind · Firebase

Run it through the [marketplace](https://github.com/min-kim-careers/marketplace) repo's Docker Compose.
