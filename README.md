# UTN Data Systems Lab Website

The website is built using Jekyll with a modified version of the [al-folio](https://github.com/alshedivat/al-folio) theme.

It makes use of:

- [Bootstrap@v4.6.2](https://getbootstrap.com/docs/4.6/getting-started/introduction/)
- [Fontawesome@v6.7.1](https://fontawesome.com/icons)
- [Academicons](https://jpswalsh.github.io/academicons/)

## Development Setup

### Local VS Code devcontainer

1. Start Docker and open this repository in VS Code.
2. Run **Dev Containers: Rebuild and Reopen in Container** from the command palette.
3. Wait for `bundle install` and `npm ci` to finish during setup.
4. Jekyll starts automatically whenever the container starts or VS Code attaches.
5. Open the forwarded port 8080 in your browser once the initial build finishes.

The startup script uses a per-checkout lock to prevent duplicate servers. It prints
the server log location in the container startup output. To start it again after
it exits, run `bash .devcontainer/start-jekyll.sh`. After changing `_config.yml`,
restart the container to reload the configuration. Formatting uses the project's
locked Prettier and Liquid plugin.

### Use our `watzmann` Server

Our `watzmann` server has everything set up for local development. The following instructions assume you use VSCode.

1. Connect to `watzmann` in VSCode. Ask Alex if you need access.
2. The (shared) repository is located at `/space/websites/utndatasystems.github.io`.
3. VSCode will ask you to "reopen the project in a devcontainer". Click "No" (this would require Docker being set up on Watzmann, which is not the case).
4. Run `bundle exec jekyll serve` in the terminal.
5. VSCode will ask you to setup port forwarding. Click "Open in Browser".

You can use this setup for local development. When you push the changes to `main`, the website will be re-deployed automatically.

### General Instructions

Follow the instructions in the `al-folio` repository in [`INSTALL.md`](https://github.com/alshedivat/al-folio/blob/main/INSTALL.md).

**TL;DR:**

```
docker compose pull
docker compose up
```

## Updating al-folio

This site uses al-folio v1.2 through pinned plugin gems. Shared layouts, styles,
JavaScript, icons, search, and Distill assets come from those gems. Site content
and the lab's branding stay in this repository.

1. Review the upstream release notes and update the exact plugin versions in `Gemfile`.
2. Run `bundle install` and `npm ci` (Node.js 22 or newer).
3. Run `bundle exec al-folio upgrade audit` and
   `bundle exec al-folio upgrade overrides audit --fail-on-stale`.
4. Review each changed override with
   `bundle exec al-folio upgrade overrides diff LOCAL_PATH`, reconcile it with the
   updated theme, then acknowledge that file with
   `bundle exec al-folio upgrade overrides accept LOCAL_PATH`.
5. Run the checks below, then commit the changes, including `Gemfile.lock`,
   `package-lock.json`, and `.al-folio-overrides.yml`.

Local overrides preserve the two logos, header photo, clickable publication titles
and author prefixes, project card images, post image defaults, reference headings,
and the existing analytics consent banner. `_sass/_site.scss` contains the lab's
styles. Analytics uses `analytics.google`; denied consent is initialized before
analytics loads and the banner remembers the visitor's choice.

Bootstrap compatibility remains enabled for existing content, using the v1
compatibility gem rather than the old Bootstrap, MDB, or jQuery runtime. Upstream
supports this layer through v1.2; revisit it before upgrading beyond that window.
Do not run PurgeCSS or enable `jekyll-minifier.compress_css`: the theme supplies
compiled Tailwind CSS and runtime selectors that these older tools can damage.

### Checks

```sh
bundle exec al-folio upgrade audit
bundle exec al-folio upgrade overrides audit --fail-on-stale
JEKYLL_ENV=production bundle exec jekyll build
npm run lint:style-contract
npx playwright install --with-deps chromium
npm run test:site
npm run lint:prettier
```

The browser checks cover mobile/tablet/desktop navigation, publication controls,
search, and analytics consent. Third-party requests are blocked during these
checks; they verify local behavior rather than external services.
