#!/bin/bash

# build-next.sh - Fetches and builds the NEXT version of AlaSQL from the git submodule

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NEXT_DIR="$SCRIPT_DIR/alasql-next"

echo "🔧 Building AlaSQL NEXT from submodule..."

# Initialize and update submodule
echo "   Initializing/updating submodule..."
cd "$SCRIPT_DIR"
git submodule update --init --recursive --remote

# Go to submodule directory
cd "$NEXT_DIR"

# Install dependencies
echo "   Installing dependencies..."
npm install

# Build
echo "   Building..."
./build.sh

# Get commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)
echo "   ✅ AlaSQL NEXT build complete (commit: $COMMIT_HASH)"
