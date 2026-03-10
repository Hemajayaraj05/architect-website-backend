# Architect Website Backend

## Keep Server Awake

This backend exposes a health endpoint at:

- `GET /health`

To reduce cold starts on hosts that idle/sleep free services, configure an external uptime monitor to ping this URL every 14 minutes.

Example target URL:

- `https://<your-backend-domain>/health`

Recommended tools:

- UptimeRobot
- cron-job.org
- Better Stack Uptime

Note:

- Do not rely on in-app timers (`setInterval`/cron inside this server) for keep-awake behavior. If the host sleeps the app, internal timers stop running.
