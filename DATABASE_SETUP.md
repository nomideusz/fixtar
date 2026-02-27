# Database Setup Guide

This guide will help you set up PocketBase with real product data for the FixTar e-commerce application.

## Prerequisites

1. **PocketBase Server**: Download and run PocketBase locally or use a hosted instance
2. **Environment Variables**: Configure your PocketBase connection
3. **Admin Account**: Create an admin account in PocketBase

## Step 1: Install PocketBase

### Option A: Local Development (Recommended)

1. Download PocketBase from [https://pocketbase.io/docs/](https://pocketbase.io/docs/)
2. Extract and run:

   ```bash
   # Windows
   ./pocketbase.exe serve

   # macOS/Linux
   ./pocketbase serve
   ```

3. PocketBase will start on `http://127.0.0.1:8090`
4. Visit the admin UI and create your first admin account

### Option B: Hosted Instance

Use PocketBase Cloud or deploy to your preferred hosting provider.

## Step 2: Configure Environment Variables

Create a `.env` file in your project root:

```env
# PocketBase Configuration
POCKETBASE_URL=http://127.0.0.1:8090
PB_ADMIN_EMAIL=admin@FixTar.local
PB_ADMIN_PASSWORD=your_secure_password_here

# Optional: Production settings
# POCKETBASE_URL=https://your-pocketbase-instance.com
# PB_ADMIN_EMAIL=admin@yourcompany.com
# PB_ADMIN_PASSWORD=your_production_password
```

**Important**:

- Replace `your_secure_password_here` with the actual password you created in PocketBase
- Add `.env` to your `.gitignore` file to keep credentials secure

## Step 3: Install Dependencies

```bash
npm install
# or
pnpm install
```

## Step 4: Run Database Setup

### Quick Setup (Recommended)

Run the comprehensive setup script that creates all collections and sample data:

```bash
npm run db:setup
```

This script will:

- ✅ Create the `categories` collection with 5 sample categories
- ✅ Create the `products` collection with proper schema
- ✅ Populate with 5 real products (iPhone 15 Pro, Galaxy S24 Ultra, MacBook Pro, etc.)
- ✅ Set up proper relationships between products and categories
- ✅ Configure access rules for public viewing and admin management

### Manual Setup (Alternative)

If you prefer to run individual scripts:

```bash
# Create categories first
npm run db:categories

# Then create products (requires categories to exist)
npm run db:products
```

## Step 5: Verify Setup

1. **Check PocketBase Admin**: Visit `http://127.0.0.1:8090/_/` and log in
2. **View Collections**: You should see `categories` and `products` collections
3. **Check Data**: Verify that sample categories and products were created
4. **Test API**: Visit `http://127.0.0.1:8090/api/collections/products/records` to see products

## Step 6: Add Product Images (Optional)

The setup script creates products without images. To add images:

1. Visit the PocketBase admin interface
2. Go to Collections → products
3. Edit each product record
4. Upload images to the `mainImage` and `gallery` fields

### Recommended Product Images

For the sample products, you can use these image types:

- **iPhone 15 Pro**: Product shots in different colors
- **Galaxy S24 Ultra**: Official Samsung product images
- **MacBook Pro**: Apple's official product photography
- **Dell XPS 13**: Dell's marketing images
- **AirPods Pro**: Apple's product shots

## Database Schema

### Categories Collection

| Field        | Type     | Description                         |
| ------------ | -------- | ----------------------------------- |
| name         | text     | Category name (e.g., "Electronics") |
| slug         | text     | URL-friendly identifier             |
| description  | text     | Category description                |
| parent       | relation | Parent category (for subcategories) |
| image        | file     | Category image                      |
| featured     | bool     | Show on homepage                    |
| displayOrder | number   | Sort order                          |
| seo          | json     | SEO metadata                        |
| metadata     | json     | Additional data                     |

### Products Collection

| Field            | Type     | Description             |
| ---------------- | -------- | ----------------------- |
| name             | text     | Product name            |
| slug             | text     | URL-friendly identifier |
| description      | editor   | Rich text description   |
| shortDescription | text     | Brief summary           |
| price            | number   | Current price           |
| compareAtPrice   | number   | Original/MSRP price     |
| cost             | number   | Cost basis              |
| sku              | text     | Stock keeping unit      |
| barcode          | text     | Product barcode         |
| categories       | relation | Associated categories   |
| mainImage        | file     | Primary product image   |
| gallery          | file     | Additional images       |
| status           | select   | draft/active/archived   |
| inventory        | json     | Stock information       |
| variants         | json     | Product variations      |
| attributes       | json     | Product specifications  |
| weight           | number   | Product weight          |
| dimensions       | json     | Product dimensions      |
| featured         | bool     | Show on homepage        |
| shipping         | json     | Shipping information    |
| taxable          | bool     | Subject to tax          |
| taxClass         | text     | Tax classification      |
| seo              | json     | SEO metadata            |
| metadata         | json     | Additional data         |

## Sample Data

The setup script creates these sample products:

1. **iPhone 15 Pro** - $999.00
   - Categories: Electronics, Smartphones
   - Features: Titanium design, A17 Pro chip
   - Variants: Storage (128GB-1TB), Colors

2. **Samsung Galaxy S24 Ultra** - $1,199.00
   - Categories: Electronics, Smartphones
   - Features: S Pen, 200MP camera
   - Variants: Storage, Colors

3. **MacBook Pro 14-inch M3** - $1,599.00
   - Categories: Electronics, Laptops
   - Features: M3 chip, Liquid Retina XDR
   - Variants: Storage, Memory, Colors

4. **Dell XPS 13 Plus** - $1,299.00
   - Categories: Electronics, Laptops
   - Features: InfinityEdge display
   - Variants: Processor, Memory, Storage

5. **AirPods Pro (2nd gen)** - $249.00
   - Categories: Electronics, Accessories
   - Features: Active Noise Cancellation

## Troubleshooting

### Authentication Failed

- Verify your `.env` file has correct credentials
- Ensure PocketBase is running
- Check that admin account exists in PocketBase

### Collection Already Exists

- The script safely skips existing collections
- To recreate, delete collections in PocketBase admin first

### Network Connection Issues

- Verify `POCKETBASE_URL` in `.env`
- Check firewall settings
- Ensure PocketBase is accessible

### Missing Dependencies

```bash
npm install tsx dotenv pocketbase
```

## Next Steps

1. **Start Development**: `npm run dev`
2. **Visit Admin Panel**: Access product management at `/admin`
3. **Add More Products**: Use the admin interface or create additional scripts
4. **Upload Images**: Add product photos through PocketBase admin
5. **Customize Schema**: Modify collections as needed for your use case

## Production Deployment

For production:

1. **Secure Environment**: Use strong passwords and HTTPS
2. **Backup Strategy**: Set up regular database backups
3. **Access Rules**: Review and tighten collection access rules
4. **Image Storage**: Consider CDN for product images
5. **Monitoring**: Set up logging and monitoring

## Support

- **PocketBase Docs**: [https://pocketbase.io/docs/](https://pocketbase.io/docs/)
- **SvelteKit Integration**: Check `src/lib/pocketbase.ts`
- **Admin Interface**: Built-in at `/admin` route
