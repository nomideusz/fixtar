# E-Commerce Web Application

This is an e-commerce web application built with SvelteKit, Svelte 5 Runes, and the Runed package for state management.

## Project Overview

This application provides a modern e-commerce experience with features such as:

- Product browsing and searching
- Shopping cart functionality
- User authentication
- Checkout process
- Order management
- Admin dashboard

## Technology Stack

- **Frontend**: SvelteKit + Svelte 5 Runes
- **State Management**: Runed package
- **Styling**: TailwindCSS
- **Database**: PocketBase
- **Authentication**: PocketBase Auth

## Development Tasks

The development process is organized into tasks located in the `tasks/` directory. Each task has detailed information about what needs to be implemented.

### Task Structure

- Each task is represented by a JSON object in `tasks/tasks.json`
- Individual task files are generated in markdown format as `tasks/task-{id}.md`
- Tasks include priority, dependencies, and detailed implementation notes

### Working with Tasks

1. Review the task list to identify the next task to work on
2. Check task dependencies to ensure prerequisites are completed
3. Implement the task according to the details and test strategy
4. Update the task status when completed

### Generate Task Files

To regenerate task files from `tasks.json`, run:

```bash
node scripts/generate-task-files.js
```

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```

## Directory Structure

- `src/` - Application source code
  - `routes/` - SvelteKit routes
  - `lib/` - Shared components and utilities
- `static/` - Static assets
- `tasks/` - Development tasks
- `pb_migrations/` - PocketBase migrations and schemas

## License

MIT
