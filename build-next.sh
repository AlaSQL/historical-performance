#!/bin/bash

# build-next.sh - Fetches and builds the NEXT version of AlaSQL from the git submodule

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NEXT_DIR="$SCRIPT_DIR/alasql-next"

echo "🔧 Building AlaSQL NEXT from submodule..."

# Check if submodule exists
if [ ! -d "$NEXT_DIR" ]; then
    echo "   Initializing submodule..."
    git submodule update --init --recursive
fi

# Update submodule to latest
echo "   Updating submodule to latest..."
cd "$NEXT_DIR"
git fetch origin
git checkout develop
git pull origin develop

# Install dependencies
echo "   Installing dependencies..."
npm install

# Build - prefer build-only if available
if npm run | grep -q "build-only"; then
    echo "   Building with build-only..."
    npm run build-only
else
    echo "   Building..."
    npm run build
fi

# Get commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)
echo "   ✅ AlaSQL NEXT build complete (commit: $COMMIT_HASH)"
