#!/usr/bin/env bash
# Deploys/updates the patcher hosting (nginx serving the RPatchur UI + patch feed) on
# the production host defined in deploy.properties. No Docker build needed - nginx:alpine
# is a stock image, only config/UI files need syncing. Run this once to bring the
# service up, and again any time patcher/hosting/{nginx.conf,ui,docker-compose.prod.yml}
# change. For publishing a new .thor patch, use publish-patch.sh instead.
set -euo pipefail

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
REMOTE_DIR="ragnarok-server"
BRANCH="docker"

run_remote() {
    echo y | "$PLINK" -ssh -pw "$DEPLOY_PASSWORD" "$DEPLOY_USER@$DEPLOY_HOST" "$1"
}

echo "==> Synchronisation de patcher/hosting/ sur $DEPLOY_HOST"
# Scopé à ce dossier (pas de "git reset --hard" global) - même prudence que
# deploy-content.sh vis-à-vis de asset-prod/inter_conf.txt.
run_remote "cd $REMOTE_DIR && git fetch origin $BRANCH && git checkout origin/$BRANCH -- patcher/hosting/nginx.conf patcher/hosting/ui patcher/hosting/docker-compose.prod.yml"

echo "==> Préparation du dossier patches (gitignored, jamais touché par le checkout ci-dessus)"
run_remote "mkdir -p $REMOTE_DIR/patcher/hosting/patches/data && ( [ -f $REMOTE_DIR/patcher/hosting/patches/plist.txt ] || touch $REMOTE_DIR/patcher/hosting/patches/plist.txt )"

echo "==> Démarrage du conteneur d'hébergement"
run_remote "cd $REMOTE_DIR/patcher/hosting && docker-compose -f docker-compose.prod.yml up -d"

echo "==> Statut"
run_remote "cd $REMOTE_DIR/patcher/hosting && docker-compose -f docker-compose.prod.yml ps"
