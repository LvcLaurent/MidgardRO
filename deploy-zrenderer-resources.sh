#!/usr/bin/env bash
# One-time (or occasional) transfer of the curated RO client assets (sprites/palettes/lua)
# that zrenderer needs, from ./zren-resources locally to ~/zren-resources on the production
# host. Not part of deploy-site.sh's regular flow: these assets basically never change,
# unlike the site code, and are ~1GB+ so we don't want to re-transfer them on every deploy.
# Run this once before the first deploy-site.sh that enables the character sprite feature,
# and again only if the curated resource set changes (e.g. new jobs added).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROPS_FILE="$SCRIPT_DIR/deploy.properties"
RESOURCES_DIR="$SCRIPT_DIR/zren-resources"

if [ ! -f "$PROPS_FILE" ]; then
    echo "Missing $PROPS_FILE - copy deploy.properties.example and fill it in." >&2
    exit 1
fi
if [ ! -d "$RESOURCES_DIR" ]; then
    echo "Missing $RESOURCES_DIR - build the curated zrenderer resource folder first." >&2
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
ARCHIVE="$SCRIPT_DIR/zren-resources.tar.gz"

run_remote() {
    echo y | "$PLINK" -ssh -pw "$DEPLOY_PASSWORD" "$DEPLOY_USER@$DEPLOY_HOST" "$1"
}

echo "==> Compression locale de zren-resources (peut prendre plusieurs minutes, ~130k fichiers)"
tar czf "$ARCHIVE" -C "$SCRIPT_DIR" zren-resources

echo "==> Transfert de l'archive vers $DEPLOY_HOST"
"$PSCP" -pw "$DEPLOY_PASSWORD" "$ARCHIVE" "$DEPLOY_USER@$DEPLOY_HOST:zren-resources.tar.gz"

echo "==> Extraction sur le serveur"
run_remote "rm -rf ~/zren-resources && tar xzf ~/zren-resources.tar.gz -C ~ && rm ~/zren-resources.tar.gz"

echo "==> Nettoyage local"
rm -f "$ARCHIVE"

echo "==> Terminé. Redéployez le site (deploy-site.sh) pour que le conteneur zrenderer prenne en compte ces ressources."
