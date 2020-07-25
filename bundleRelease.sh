#!/bin/bash

echo "Building release TGZ"

echo "Getting version"
VERSION=$(grep "\"version\": " package.json | cut -d'"' -f4)
echo "Bundling version ${VERSION}"

tar -C .. -czf leagues-${VERSION}.tgz \
  leagues/api \
  leagues/cert/README.md \
  leagues/config/development.json \
  leagues/jsdoc \
  leagues/lib \
  leagues/public \
  leagues/src \
  leagues/leagues.js \
  leagues/LICENSE \
  leagues/package-lock.json \
  leagues/package.json \
  leagues/README.md

echo "leagues-${VERSION}.tgz built successfully"
