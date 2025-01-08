#!/bin/sh

VERSION=$(git show :packages/core-config/package.json | node -p "JSON.parse(require('fs').readFileSync(0)).version")
COUNT=$(git show :CHANGELOG.md | grep -c "\[$VERSION\]")
if [ "$COUNT" -ne 2 ]; then
  echo "Error: Version $VERSION should appear exactly twice in CHANGELOG.md (entry and link), found $COUNT times"
  exit 1
fi
