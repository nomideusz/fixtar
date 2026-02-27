# PocketBase Collection Management Scripts

A set of utilities to manage PocketBase collections directly from the command line. These scripts use environment variables from your `.env` file for authentication.

## Prerequisites

Ensure your `.env` file contains:

```env
POCKETBASE_URL="https://your-pocketbase-instance.com"
PB_ADMIN_EMAIL="admin@example.com"
PB_ADMIN_PASSWORD="your-secure-password"
```

## Collection Viewing

### List all collections

```bash
npm run list-collections
```

### View details of a specific collection

```bash
npm run view-collection -- users
```

### View collection templates and default fields

```bash
npm run get-scaffolds
```

Useful for understanding the default structure of different collection types.

## Collection Management

### Create a new collection

```bash
# Basic collection with default fields
npm run create-collection -- posts

# Specify collection type (base, auth, or view)
npm run create-collection -- users auth
npm run create-collection -- stats view
```

### Update a collection property

```bash
# Update a collection rule
npm run update-collection -- posts listRule "created > '2023-01-01'"

# Change collection name
npm run update-collection -- old_collection name new_collection
```

### Delete a collection

```bash
# The --confirm flag is required as a safety measure
npm run delete-collection -- unwanted_collection --confirm
```

### Empty a collection (keep structure)

```bash
# Deletes all records but keeps the collection and fields
npm run truncate-collection -- posts --confirm
```

## Collection Import/Export

### Import collections from a JSON file

```bash
# Basic import (keeps existing collections)
npm run import-collections -- ./collections.json

# Delete collections/fields not in the import file
npm run import-collections -- ./collections.json --delete-missing --confirm
```

### Recommended JSON Format for Import

```json
[
	{
		"name": "posts",
		"type": "base",
		"fields": [
			{
				"name": "title",
				"type": "text",
				"required": true
			},
			{
				"name": "content",
				"type": "text"
			}
		],
		"listRule": "@request.auth.id != ''"
	}
]
```

## Safety Features

- Destructive operations require explicit `--confirm` flag
- Detailed logging for all operations
- Error handling with meaningful messages
- Environment variable support for secure credentials

## Tips

- Use `get-scaffolds` to see default field structures before creating collections
- For complex collection schemas, create a JSON file and use `import-collections`
- Combine these scripts with backup systems for safe migrations
- Scripts use the same environment variables as your main application
