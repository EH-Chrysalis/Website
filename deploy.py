#!/usr/bin/env python3
"""Deploy the Elephant Hawk site to Network Solutions over SFTP (port 22).

Reads credentials from the local, git-ignored ".deploy-secrets" file, so no
password is ever typed on the command line or committed. Uploads only the
website files — never repo internals.

Run it through uv so the SFTP library is available without a global install:

    uv run --with paramiko python deploy.py list      # list the remote web root
    uv run --with paramiko python deploy.py upload     # upload the site
    uv run --with paramiko python deploy.py            # same as "upload"

(The deploy.sh wrapper does the "uv run --with paramiko" part for you.)
"""
import os, sys, paramiko

# --- Load credentials from .deploy-secrets ----------------------------
here = os.path.dirname(os.path.abspath(__file__))
secrets = os.path.join(here, ".deploy-secrets")
if not os.path.exists(secrets):
    sys.exit("ERROR: .deploy-secrets not found. Copy .deploy-secrets.example to it and fill it in.")

cfg = {}
with open(secrets) as fh:
    for line in fh:
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        cfg[k.strip()] = v.strip().strip('"').strip("'")

HOST = cfg.get("FTP_HOST"); USER = cfg.get("FTP_USER"); PW = cfg.get("FTP_PASS")
PORT = int(cfg.get("SFTP_PORT", "22"))
REMOTE = cfg.get("FTP_DIR", "/htdocs").rstrip("/") or "/htdocs"
if not (HOST and USER and PW):
    sys.exit("ERROR: FTP_HOST, FTP_USER, FTP_PASS must all be set in .deploy-secrets.")

# Only these files are ever uploaded.
FILES = ["index.html", "about.html", "approach.html", "contact.html", "privacy.html", "styles.css", "script.js",
         "favicon.svg", "favicon-32.png", "apple-touch-icon.png", "og-image.png", "rupesh.jpg"]

action = sys.argv[1] if len(sys.argv) > 1 else "upload"

transport = paramiko.Transport((HOST, PORT))
transport.connect(username=USER, password=PW)
sftp = paramiko.SFTPClient.from_transport(transport)

try:
    if action == "list":
        print(f"Listing {REMOTE} on {HOST}:")
        for name in sorted(sftp.listdir(REMOTE)):
            print("  ", name)
    elif action == "upload":
        print(f"Uploading {len(FILES)} files to {REMOTE} on {HOST} over SFTP...")
        for f in FILES:
            local = os.path.join(here, f)
            sftp.put(local, f"{REMOTE}/{f}")
            print(f"  -> {f}  ok")
        print("Done. Visit https://www.elephanthawk.com to confirm.")
    else:
        sys.exit(f"Unknown action '{action}'. Use: list | upload")
finally:
    sftp.close(); transport.close()
