#!/bin/bash
set -e

# Run migrations first
echo "Running database migrations..."
bun dist/migrate.js

# Then start the application
echo "Starting application..."
exec "$@"

