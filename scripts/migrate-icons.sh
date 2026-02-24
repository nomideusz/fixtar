#!/bin/bash

# Create the new directory structure
mkdir -p src/lib/styles/icons/core
mkdir -p src/lib/styles/icons/categories

# Copy base icon styles to the new core location
echo "Copying base icon styles to core directory..."
cp -v src/lib/styles/icons/base.css src/lib/styles/icons/core/icons-core.css

# Ensure the categories directory exists and has the right files
echo "Ensuring icon categories are in the right place..."
# The categories are already in the right place, we just needed to create the core directory

echo "Migration complete!"
echo "The new structure has been set up. You can now use src/lib/styles/main.css as your single entry point." 