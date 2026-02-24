# Environment Variables Setup

To run this application, you need to create a `.env` file in the root directory with the following variables:

## Required Environment Variables

```env
# PocketBase Configuration
PUBLIC_POCKETBASE_URL=https://k.xeon.pl
POCKETBASE_URL=https://k.xeon.pl

# PocketBase Admin Credentials (for server-side operations)
PB_ADMIN_EMAIL=your-pocketbase-admin@email.com
PB_ADMIN_PASSWORD=your-pocketbase-admin-password

# Qoltec XML Integration
QOLTEC_API_KEY=WBsntRtz30BQayYMZC8hQTfqb6PXeTja

# Cron Job Security
CRON_SECRET=your-secure-random-string-here
```

## Environment Variable Descriptions

### PocketBase Configuration

- **PUBLIC_POCKETBASE_URL**: The public URL of your PocketBase instance. Used by the client-side code.
- **POCKETBASE_URL**: The server-side URL of your PocketBase instance. Usually the same as PUBLIC_POCKETBASE_URL.
- **PB_ADMIN_EMAIL**: Your PocketBase superuser email address (required for server-side operations).
- **PB_ADMIN_PASSWORD**: Your PocketBase superuser password (required for server-side operations).

### Qoltec XML Integration

- **QOLTEC_API_KEY**: Your API key for accessing the Qoltec XML product feed.

### Security

- **CRON_SECRET**: A secure random string used to authenticate cron job requests. Generate one using:
  ```bash
  openssl rand -base64 32
  ```

## Optional Environment Variables

```env
# Development/Production
NODE_ENV=development

# Email Configuration (for future use)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@FixTar.pl

# Notification Webhooks (for future use)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/WEBHOOK/URL

# Analytics (for future use)
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PUBLIC_HOTJAR_ID=XXXXXXX
```

## Setting Up Environment Variables

### Local Development

1. Create a `.env` file in the root directory
2. Copy the required variables from above
3. Update the values as needed for your environment

### Production Deployment

#### Vercel
```bash
vercel env add PUBLIC_POCKETBASE_URL
vercel env add POCKETBASE_URL
vercel env add QOLTEC_API_KEY
vercel env add CRON_SECRET
```

#### Netlify
1. Go to Site Settings → Environment Variables
2. Add each variable with its value
3. Deploy your site

#### Railway
1. Go to your service settings
2. Click on "Variables"
3. Add each environment variable

#### Docker
Add to your `docker-compose.yml`:
```yaml
services:
  app:
    environment:
      - PUBLIC_POCKETBASE_URL=https://k.xeon.pl
      - POCKETBASE_URL=https://k.xeon.pl
      - QOLTEC_API_KEY=${QOLTEC_API_KEY}
      - CRON_SECRET=${CRON_SECRET}
```

## Security Notes

- Never commit the `.env` file to version control
- Use different API keys for development and production
- Rotate your CRON_SECRET periodically
- Keep your Qoltec API key confidential 