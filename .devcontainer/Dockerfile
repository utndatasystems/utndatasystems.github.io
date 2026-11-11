FROM node:22-bookworm-slim AS node
FROM mcr.microsoft.com/devcontainers/jekyll

# The base image includes an obsolete Yarn apt key. This project uses npm.
RUN rm -f /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        imagemagick \
        inotify-tools \
        jupyter-nbconvert \
        procps \
        util-linux \
        zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -sf ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -sf ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx
