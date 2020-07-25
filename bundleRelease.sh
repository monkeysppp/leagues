#!/bin/bash

echo "Building release TGZ"

tar -C .. -czf leagues.tgz \
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

echo "leagues.tgz built successfully"
