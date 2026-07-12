#!/usr/bin/env bash
# Deploys the "docker" branch's site/ (Spring Boot + Angular) to the
# production host defined in deploy.properties (see deploy.properties.example).
# Runs on the same "docker_default" network as the rAthena stack so it can
# reach the "db" service directly - deploy.sh (server) should be run at least
# once before this so that network already exists.
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

for var in DEPLOY_HOST DEPLOY_USER DEPLOY_PASSWORD DB_PASSWORD; do
    if [ -z "${!var:-}" ]; then
        echo "Missing $var in deploy.properties" >&2
        exit 1
    fi
done

PLINK="/c/Program Files/PuTTY/plink.exe"
REMOTE_DIR="ragnarok-server"
REPO_URL="https://github.com/LvcLaurent/MidgardRO"
BRANCH="docker"

run_remote() {
    echo y | "$PLINK" -ssh -pw "$DEPLOY_PASSWORD" "$DEPLOY_USER@$DEPLOY_HOST" "$1"
}

echo "==> Synchronisation du dépôt sur $DEPLOY_HOST"
run_remote "if [ -d $REMOTE_DIR/.git ]; then cd $REMOTE_DIR && git fetch origin $BRANCH && git checkout $BRANCH && git reset --hard origin/$BRANCH; else git clone --branch $BRANCH $REPO_URL $REMOTE_DIR; fi"

echo "==> Écriture du .env de production"
run_remote "printf 'DB_PASSWORD=%s\n' '$DB_PASSWORD' > $REMOTE_DIR/site/.env"

echo "==> Build et démarrage du site"
run_remote "cd $REMOTE_DIR/site && docker-compose -f docker-compose.prod.yml up -d --build --force-recreate"

echo "==> Statut du conteneur"
run_remote "cd $REMOTE_DIR/site && docker-compose -f docker-compose.prod.yml ps"
