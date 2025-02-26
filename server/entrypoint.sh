#!/bin/bash

cd /source

stow --target=/altv --adopt .

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
    # mkdir modules/js-module
    bunx --bun altv-pkg@latest $ALTV_BRANCH

    if [ "$USE_CUSTOM_MODULE" = "true" ]; then
      rsync -a /source/custom-modules/ /altv/modules/
    fi

    echo "===== Environment variables ====="
    echo "ALTV_DEBUG: $ALTV_DEBUG"
    echo "ALTV_MODULES: $ALTV_MODULES"
    echo "ALTV_RESOURCES: $ALTV_RESOURCES"
    echo "SERVER_ENV: $SERVER_ENV"
    echo "USE_CUSTOM_MODULE: $USE_CUSTOM_MODULE"
    echo "================================"

    chmod +x altv-server altv-crash-handler
    bun run /root/setup/server.js
    bun run migration:run
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
