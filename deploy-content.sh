#!/usr/bin/env bash
# Fast path for npc/db-only changes: syncs the repo on the prod host and restarts the
# map-server container - no docker build, no C++ recompile. Do NOT use this after a
# server/src, server/conf, or Dockerfile change - those still need deploy.sh so the
# image actually gets rebuilt.
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
REPO_URL="https://github.com/LvcLaurent/MidgardRO"
BRANCH="docker"

run_remote() {
    echo y | "$PLINK" -ssh -pw "$DEPLOY_PASSWORD" "$DEPLOY_USER@$DEPLOY_HOST" "$1"
}

echo "==> Synchronisation de npc/ et db/ uniquement sur $DEPLOY_HOST"
# Scoped à ces deux chemins seulement (pas de "git reset --hard" global) : ça évite de
# toucher asset-prod/inter_conf.txt et tout le reste du dépôt. Une bascule complète
# (git reset --hard) a déjà écrasé les identifiants réels une fois plus tôt ce soir -
# ne pas y revenir.
run_remote "if [ -d $REMOTE_DIR/.git ]; then cd $REMOTE_DIR && git fetch origin $BRANCH && git checkout origin/$BRANCH -- server/npc server/db; else git clone --branch $BRANCH $REPO_URL $REMOTE_DIR; fi"

echo "==> Reconstruction de db/import (gitignored, non couvert par le checkout)"
# server/db/import est gitignored - le checkout ci-dessus ne le touche pas, et le bind
# mount de server/db écrase la copie que l'image avait construite au build (via la
# cible "import" du Makefile). On reproduit cette même logique ici : copier depuis
# import-tmpl uniquement les fichiers absents, jamais écraser un import/ déjà présent.
run_remote "cd $REMOTE_DIR/server/db && mkdir -p import && for f in \$(ls import-tmpl); do if [ ! -e import/\$f ]; then cp import-tmpl/\$f import/\$f; fi; done"

echo "==> Redémarrage du map-server (pas de rebuild)"
run_remote "cd $REMOTE_DIR/server/tools/docker && docker-compose -f docker-compose.prod.yml restart map"

echo "==> Statut"
run_remote "cd $REMOTE_DIR/server/tools/docker && docker-compose -f docker-compose.prod.yml ps map"
