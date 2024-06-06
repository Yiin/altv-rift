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
    # MODULES_DIR="modules"
    # BACKUP_DIR="/tmp/modules"

    # mkdir -p "$MODULES_DIR"
    # mkdir -p "$BACKUP_DIR"

    # if [ -d "$MODULE_DIR" ] && [ "$(ls -A $MODULE_DIR)" ]; then
    #   echo "Saving"
    #   rsync -av --delete "$MODULE_DIR/" "$BACKUP_DIR/"
    # fi

    bunx altv-pkg $ALTV_BRANCH

    # if [ -d "$BACKUP_DIR" ] && [ "$(ls -A $BACKUP_DIR)" ]; then
    #   echo "Loading"
    #   rsync -av --delete "$BACKUP_DIR/" "$MODULE_DIR/"
    # fi

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
