#!/bin/sh

VERSION=$(git show :packages/core-config/package.json | node -p "JSON.parse(require('fs').readFileSync(0)).version")
git show :CHANGELOG.md | egrep -q "^## \[$VERSION\] - [0-9]{4}-[0-9]{2}-[0-9]{2}\$"
if [ $? -ne 0 ]; then
  echo "Error: /^## [$VERSION] - [0-9]{4}-[0-9]{2}-[0-9]{2}\$/ not found in CHANGELOG.md"
  exit 1
fi

git show :CHANGELOG.md | egrep -q "^\[$VERSION\]: https://github.com/shellicar/.*${VERSION}\$"
if [ $? -ne 0 ]; then
  echo "Error: /^[$VERSION]: https://github.com/shellicar/.*${VERSION}\$/ not found in CHANGELOG.md"
  exit 1
fi
