#!/bin/bash

cd /source

stow --target=/altv .

cd /altv

bun install
bun run prisma:generate

case "$1" in
  builder)
    bun run dev
    ;;
  webview)
    cd src/webview
    bun install
    bun run dev
    ;;
  server)
    bunx altv-pkg $ALTV_BRANCH
    chmod +x altv-server altv-crash-handler
    bun run /root/setup/server.js
    bun run server
    ;;
  *)
    echo "Unknown command: $1"
    ;;
esac

# Execute the passed command if it exists
if [ "$#" -gt 1 ]; then
  shift
  exec "$@"
fi
