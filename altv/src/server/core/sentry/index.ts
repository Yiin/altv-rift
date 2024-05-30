import Sentry from "@sentry/node";
import "@sentry/tracing";

Sentry.init({
  dsn: "https://6a3b699db0e041e6bdb87ccbace97266@o4504504034918400.ingest.sentry.io/4504504038064128",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
