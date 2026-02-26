# Environment Variables Setup

To run this application, create a `.env` file in the project root with the variables below.

## Required Environment Variables

```env
# PocketBase Configuration
PUBLIC_POCKETBASE_URL=https://k.xeon.pl
POCKETBASE_URL=https://k.xeon.pl

# PocketBase Admin Credentials (server-side operations)
PB_ADMIN_EMAIL=your-pocketbase-admin@email.com
PB_ADMIN_PASSWORD=your-pocketbase-admin-password

# BaseLinker API
# Get your token from: BaseLinker -> My Account -> API
BASELINKER_API_TOKEN=your-baselinker-api-token

# Cron Job Security
CRON_SECRET=your-secure-random-string-here
```

## Variable Descriptions

### PocketBase

- **PUBLIC_POCKETBASE_URL**: Public PocketBase URL used by browser/client code.
- **POCKETBASE_URL**: Server-side PocketBase URL (usually same as public URL).
- **PB_ADMIN_EMAIL**: PocketBase superuser email for server-side admin actions.
- **PB_ADMIN_PASSWORD**: PocketBase superuser password for server-side admin actions.

### BaseLinker

- **BASELINKER_API_TOKEN**: API token used for product and order sync via BaseLinker (Base.com).

### Security

- **CRON_SECRET**: Secret used to authenticate scheduled/automation endpoints.
  Generate one with:

```bash
openssl rand -base64 32
```

## Optional Environment Variables

```env
# Development/Production
NODE_ENV=development

# Email Configuration (future use)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@fixtar.pl

# Notification Webhooks (future use)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/WEBHOOK/URL

# Analytics (future use)
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PUBLIC_HOTJAR_ID=XXXXXXX
```

## Production Deployment

### Vercel

```bash
vercel env add PUBLIC_POCKETBASE_URL
vercel env add POCKETBASE_URL
vercel env add BASELINKER_API_TOKEN
vercel env add CRON_SECRET
```

### Netlify

1. Go to Site Settings -> Environment Variables.
2. Add each variable with its value.
3. Deploy your site.

### Railway

1. Go to your service settings.
2. Open **Variables**.
3. Add each environment variable.

### Docker

Add to `docker-compose.yml`:

```yaml
services:
  app:
    environment:
      - PUBLIC_POCKETBASE_URL=https://k.xeon.pl
      - POCKETBASE_URL=https://k.xeon.pl
      - BASELINKER_API_TOKEN=${BASELINKER_API_TOKEN}
      - CRON_SECRET=${CRON_SECRET}
```

## Security Notes

- Never commit `.env` to version control.
- Use separate secrets for development and production.
- Rotate `CRON_SECRET` periodically.
- Keep your BaseLinker token confidential.
