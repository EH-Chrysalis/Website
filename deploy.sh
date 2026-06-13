#!/usr/bin/env bash
# =====================================================================
# deploy.sh — upload the Elephant Hawk site to Network Solutions via FTP
#
# Reads FTP credentials from a local, git-ignored ".deploy-secrets" file
# so no password is ever typed on the command line or committed.
#
# Usage:
#   ./deploy.sh list      # connect and list the remote directory (FTP_DIR)
#   ./deploy.sh upload     # upload the website files to FTP_DIR
#   ./deploy.sh            # same as "upload"
#
# Network Solutions FTP is plain FTP; curl's --ssl tries TLS first and
# falls back to plain automatically, so this works either way.
# =====================================================================
set -euo pipefail
cd "$(dirname "$0")"

# --- Load credentials -------------------------------------------------
if [[ ! -f .deploy-secrets ]]; then
  echo "ERROR: .deploy-secrets not found."
  echo "Copy .deploy-secrets.example to .deploy-secrets and fill it in."
  exit 1
fi
# shellcheck disable=SC1091
source .deploy-secrets

: "${FTP_HOST:?set FTP_HOST in .deploy-secrets}"
: "${FTP_USER:?set FTP_USER in .deploy-secrets}"
: "${FTP_PASS:?set FTP_PASS in .deploy-secrets}"
FTP_DIR="${FTP_DIR:-/}"

# Only the actual website files get uploaded — NOT .git, .github, README,
# the secrets file, or this script.
FILES=(index.html about.html approach.html styles.css script.js)

# Common curl options. --ssl = use TLS if the server offers it, else plain.
CURL_OPTS=(--ssl --user "$FTP_USER:$FTP_PASS" --connect-timeout 20 -sS)

action="${1:-upload}"

case "$action" in
  list)
    echo "Listing ftp://$FTP_HOST$FTP_DIR ..."
    # A trailing slash makes curl list the directory contents.
    curl "${CURL_OPTS[@]}" "ftp://${FTP_HOST}${FTP_DIR%/}/"
    ;;
  upload)
    echo "Uploading ${#FILES[@]} files to ftp://$FTP_HOST$FTP_DIR ..."
    for f in "${FILES[@]}"; do
      printf '  → %s ... ' "$f"
      curl "${CURL_OPTS[@]}" -T "$f" "ftp://${FTP_HOST}${FTP_DIR%/}/${f}"
      echo "ok"
    done
    echo "Done. Visit your site to confirm."
    ;;
  *)
    echo "Unknown action '$action'. Use: list | upload"
    exit 1
    ;;
esac
