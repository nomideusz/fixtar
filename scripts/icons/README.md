# Icon Management Scripts

This directory contains scripts for managing the icon system in the application.

## add-icon.ts

This script allows you to easily add SVG icons to the CSS-based icon system. It automates the process of:

1. Reading SVG files from your collection
2. Converting them to the CSS mask format
3. Adding them to the icons.css file
4. Updating the icon categories in the index.ts file

### Usage

```bash
npx tsx scripts/icons/add-icon.ts --name=icon-name --file=path/to/svg/file.svg [--category=category-name]
```

You can also use the npm script shortcut:

```bash
npm run icon:add -- --name=icon-name --file=path/to/svg/file.svg [--category=category-name]
```

#### Parameters

- `--name`: Name of the icon to add (required)
- `--file`: Path to the SVG file (required)
- `--category`: Category to add the icon to (default: "general")

#### Examples

```bash
# Add a calendar icon to the general category
npx tsx scripts/icons/add-icon.ts --name=calendar --file=./SVGs/calendar.svg

# Add a dashboard icon to the cyberpunk category
npx tsx scripts/icons/add-icon.ts --name=dashboard --file=./SVGs/dashboard.svg --category=cyberpunk

# Add a new category icon with a specific path
npx tsx scripts/icons/add-icon.ts --name=upload --file=./collection/upload.svg --category=actions
```

### Features

- Extracts SVG path data and viewBox attributes
- Handles SVGs with multiple paths
- Properly encodes SVG data for CSS
- Checks if the icon already exists to prevent duplicates
- Validates that the category exists in the index.ts file
- Provides helpful error messages

## advanced-svg-processing.ts

For complex SVG files that may contain elements other than simple paths, this script helps preprocess them before adding to the icon system.

### Usage

```bash
npx tsx scripts/icons/advanced-svg-processing.ts --file=path/to/svg/file.svg [--output=output-file.svg]
```

You can also use the npm script shortcut:

```bash
npm run icon:process -- --file=path/to/svg/file.svg [--output=output-file.svg]
```

#### Parameters

- `--file`: Path to the SVG file to process (required)
- `--output`: Path where the processed SVG should be saved (optional, if not provided, outputs to console)
- `--optimize`: Whether to optimize the SVG (default: true)

#### Examples

```bash
# Process a complex SVG and save to a new file
npx tsx scripts/icons/advanced-svg-processing.ts --file=./complex-icon.svg --output=./processed-icon.svg

# Process and output to console
npx tsx scripts/icons/advanced-svg-processing.ts --file=./complex-icon.svg
```

### Features

- Cleans up SVG code by removing comments, unnecessary whitespace, etc.
- Extracts and preserves the viewBox attribute
- Handles complex SVGs with multiple elements
- Preserves important attributes like fill and stroke
- Outputs an optimized SVG ready for use with the add-icon.ts script
- Provides the URL-encoded version ready for CSS

## batch-process.ts

This script allows you to process multiple SVG files at once and add them to the icon system.

### Usage

```bash
npx tsx scripts/icons/batch-process.ts --directory=path/to/svg/dir [--category=category-name] [--pattern=*.svg] [--optimize=true] [--dry-run=false]
```

You can also use the npm script shortcut:

```bash
npm run icon:batch -- --directory=path/to/svg/dir [--category=category-name]
```

#### Parameters

- `--directory`: Directory containing SVG files to process (required)
- `--category`: Category to add the icons to (default: "general")
- `--pattern`: Pattern to match SVG files (default: "*.svg")
- `--optimize`: Whether to optimize SVGs before adding (default: true)
- `--dryRun`: Preview what would be done without making changes (default: false)

#### Examples

```bash
# Process all SVGs in a directory
npx tsx scripts/icons/batch-process.ts --directory=./SVGs/social --category=social

# Process files matching a pattern
npx tsx scripts/icons/batch-process.ts --directory=./SVGs --pattern="icon-*.svg" --category=ui

# Process files without optimization
npx tsx scripts/icons/batch-process.ts --directory=./SVGs/simple --optimize=false

# Preview without making changes
npx tsx scripts/icons/batch-process.ts --directory=./SVGs/new --dryRun=true
```

### Features

- Processes multiple SVG files in one command
- Automatically generates icon names from filenames
- Optionally optimizes SVGs before adding them
- Supports file pattern matching
- Provides a dry run option to preview changes

### Workflow for Complex SVGs

1. Process the complex SVG:
   ```bash
   npx tsx scripts/icons/advanced-svg-processing.ts --file=./complex-icon.svg --output=./processed-icon.svg
   ```

2. Add the processed SVG to your icon system:
   ```bash
   npx tsx scripts/icons/add-icon.ts --name=complex-icon --file=./processed-icon.svg
   ```

## Integration with npm scripts

You can use the npm scripts defined in package.json:

```bash
# Add a single icon
npm run icon:add -- --name=calendar --file=./SVGs/calendar.svg

# Process a complex SVG
npm run icon:process -- --file=./complex-icon.svg --output=./processed-icon.svg

# Batch process multiple icons
npm run icon:batch -- --directory=./SVGs/social --category=social

# View help for icon scripts
npm run icon:help
```

## Integration with dev.js

These scripts are also integrated with the dev.js script for easier usage:

```bash
# Add a single icon
node scripts/dev.js add-icon --name=calendar --file=./SVGs/calendar.svg

# Process a complex SVG
node scripts/dev.js process-svg --file=./complex-icon.svg --output=./processed-icon.svg

# Batch process multiple icons
node scripts/dev.js batch-icons --directory=./SVGs/social --category=social

# View help for icon scripts
node scripts/dev.js help-icons
```

## After Adding Icons

After adding a new icon, you can use it in your application immediately:

```svelte
<script>
  import Icon from '$lib/components/Icon.svelte';
</script>

<Icon name="your-new-icon" size="md" />
```

## Adding a New Category

If you need to add a new category, you'll need to modify the `iconCategories` object in `src/lib/icons/index.ts` first:

```typescript
export const iconCategories = {
  general: [...],
  arrows: [...],
  // Add your new category
  newCategory: []
};
```

Then you can add icons to this category using the script. 