#!/usr/bin/env bash
# Publishes a single .thor patch to the hosting server: uploads it into patches/data/
# and appends a line to the remote plist.txt with the next sequential index. Run
# deploy-patcher-hosting.sh at least once before the first use so the service exists.
# Usage: ./publish-patch.sh <path-to-thor-file>
set -euo pipefail

if [ $# -ne 1 ]; then
    echo "Usage: $0 <path-to-thor-file>" >&2
    exit 1
fi
THOR_FILE="$1"
if [ ! -f "$THOR_FILE" ]; then
    echo "Fichier introuvable : $THOR_FILE" >&2
    exit 1
fi
THOR_NAME="$(basename "$THOR_FILE")"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROPS_FILE="$SCRIPT_DIR/deploy.properties"

if [ ! -f "$PROPS_FILE" ]; then
    echo "Missing $PROPS_FILE - copy deploy.properties.example and fill it in." >&2
    exit 1
fi
set -a
source "$PROPS_FILE"
set +a

for var in DEPLOY_HOST DEPLOY_USER DEPLOY_PASSWORD; do
    if [ -z "${!var:-}" ]; then
        echo "Missing $var in deploy.properties" >&2
        exit 1
    fi
done

PLINK="/c/Program Files/PuTTY/plink.exe"
PSCP="/c/Program Files/PuTTY/pscp.exe"
REMOTE_PATCHES_DIR="ragnarok-server/patcher/hosting/patches"

run_remote() {
    echo y | "$PLINK" -ssh -pw "$DEPLOY_PASSWORD" "$DEPLOY_USER@$DEPLOY_HOST" "$1"
}

echo "==> Upload de $THOR_NAME"
echo y | "$PSCP" -pw "$DEPLOY_PASSWORD" "$THOR_FILE" "$DEPLOY_USER@$DEPLOY_HOST:$REMOTE_PATCHES_DIR/data/$THOR_NAME"

echo "==> Calcul du prochain index de plist.txt"
NEXT_INDEX="$(run_remote "cd $REMOTE_PATCHES_DIR && tail -n1 plist.txt 2>/dev/null | awk '{print \$1+1}'")"
NEXT_INDEX="${NEXT_INDEX:-1}"

echo "==> Ajout de l'entrée $NEXT_INDEX $THOR_NAME dans plist.txt"
run_remote "cd $REMOTE_PATCHES_DIR && echo '$NEXT_INDEX $THOR_NAME' >> plist.txt"

echo "==> Patch publié : index $NEXT_INDEX -> $THOR_NAME"
