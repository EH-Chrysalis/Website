#!/usr/bin/env bash
# =====================================================================
# deploy.sh — upload the Elephant Hawk site to Network Solutions via SFTP
#
# Thin wrapper around deploy.py. Uses uv to provide the SFTP library
# (paramiko) without a global install. Credentials are read from the
# local, git-ignored ".deploy-secrets" file — never typed or committed.
#
# Usage:
#   ./deploy.sh list      # list the remote web root
#   ./deploy.sh upload     # upload the website files
#   ./deploy.sh            # same as "upload"
# =====================================================================
set -euo pipefail
cd "$(dirname "$0")"
exec uv run --quiet --with paramiko python deploy.py "${1:-upload}"
