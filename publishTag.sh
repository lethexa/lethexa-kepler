#!/bin/sh

MESSAGE="Updated to version $1"
grunt && git add . && git add package.json && git commit -m "$MESSAGE" && git push && git tag -s -m "$MESSAGE" v$1 && git push origin v$1 && git push github v$1 && npm publish
