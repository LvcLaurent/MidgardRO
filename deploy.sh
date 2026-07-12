#!/usr/bin/env bash
# Deploys the "docker" branch of the rAthena server to the production host
# defined in deploy.properties (see deploy.properties.example).
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
run_remote "printf 'DB_PASSWORD=%s\n' '$DB_PASSWORD' > $REMOTE_DIR/server/tools/docker/.env"

echo "==> Écriture des identifiants DB dans inter_conf.txt (asset-prod)"
run_remote "cat > $REMOTE_DIR/server/tools/docker/asset-prod/inter_conf.txt <<EOF_INTER
login_server_ip: db
login_server_pw: $DB_PASSWORD
ipban_db_ip: db
ipban_db_pw: $DB_PASSWORD
char_server_ip: db
char_server_pw: $DB_PASSWORD
map_server_ip: db
map_server_pw: $DB_PASSWORD
web_server_ip: db
web_server_pw: $DB_PASSWORD
log_db_ip: db
log_db_pw: $DB_PASSWORD
EOF_INTER"

echo "==> Build et démarrage des conteneurs"
run_remote "cd $REMOTE_DIR/server/tools/docker && docker-compose -f docker-compose.prod.yml up -d --build --force-recreate"

echo "==> Statut des conteneurs"
run_remote "cd $REMOTE_DIR/server/tools/docker && docker-compose -f docker-compose.prod.yml ps"
