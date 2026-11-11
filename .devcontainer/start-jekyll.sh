#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Keep each checkout's lock and log separate, outside the watched source tree.
workspace_id=$(pwd -P | sha256sum | cut -c1-16)
state_dir="${TMPDIR:-/tmp}/al-folio-dev-${UID}-${workspace_id}"
mkdir -p "$state_dir"

# flock holds the lock while Jekyll runs and releases it when the server exits.
# Repeated or concurrent starts exit successfully without launching another server.
# Detach from the lifecycle command's session so its cleanup cannot stop Jekyll.
nohup setsid flock --nonblock --conflict-exit-code 0 "$state_dir/server.lock" \
    bundle exec jekyll serve --host=0.0.0.0 --port=8080 --livereload --force_polling \
    >> "$state_dir/server.log" 2>&1 < /dev/null &
launcher_pid=$!

# Surface immediate launch failures instead of reporting success unconditionally.
sleep 1
if ! kill -0 "$launcher_pid" 2>/dev/null; then
    if wait "$launcher_pid"; then
        echo "Jekyll is already starting or running. Log: $state_dir/server.log"
        exit 0
    else
        status=$?
        echo "Jekyll startup failed. Log: $state_dir/server.log" >&2
        tail -n 40 "$state_dir/server.log" >&2
        exit "$status"
    fi
fi

echo "Jekyll is starting on port 8080. Log: $state_dir/server.log"
