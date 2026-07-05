<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 16.2.6 App Router project. PostHog is initialised on the client side via `src/instrumentation-client.ts` (alongside the existing Sentry setup) using the Next.js 15.3+ `instrumentation-client` pattern. A reverse proxy is configured in `next.config.ts` so that PostHog requests are routed through `/ingest/*`, avoiding ad-blockers. A server-side PostHog singleton (`src/lib/posthog-server.ts`) is used to capture events from API route handlers. The homepage CTA buttons were extracted into a client component (`src/app/_components/home-cta-links.tsx`) to track clicks without converting the Server Component page. Environment variables for the project token and host are written to `.env.local`.

| Event name | Description | File |
|---|---|---|
| `deploy_now_clicked` | User clicks the 'Deploy Now' CTA button on the home page. | `src/app/_components/home-cta-links.tsx` |
| `documentation_clicked` | User clicks the 'Documentation' link on the home page. | `src/app/_components/home-cta-links.tsx` |
| `health_check_requested` | Server-side health check endpoint was called. | `src/app/api/health-check/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/497395/dashboard/1799005)
- [Homepage CTA Overview (wizard)](https://us.posthog.com/project/497395/insights/1XrnQ98V)
- [Deploy Now Clicks (wizard)](https://us.posthog.com/project/497395/insights/83U1WGNV)
- [Documentation Clicks (wizard)](https://us.posthog.com/project/497395/insights/AmadbKrL)
- [Health Check Requests (wizard)](https://us.posthog.com/project/497395/insights/7eavIrnU)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
