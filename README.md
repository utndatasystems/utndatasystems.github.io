UTN Data Systems Lab Website
============================

The website is built using Jekyll with a modified version of the [al-folio](https://github.com/alshedivat/al-folio) theme.

It makes use of:
 - [Bootstrap@v4.6.2](https://getbootstrap.com/docs/4.6/getting-started/introduction/)
 - [Fontawesome@v6.7.1](https://fontawesome.com/icons)
 - [Academicons](https://jpswalsh.github.io/academicons/)

## Development Setup

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


## Updating to a newer Version of `al-folio`
(very experimental)
```
git remote add template https://github.com/alshedivat/al-folio.git
git fetch --depth 1 template main
git checkout --no-track -b temp-template-branch template/main
git checkout main
git merge --squash temp-template-branch --allow-unrelated-histories
```
Now resolve any potential merge conflicts and commit with a meaningful message. Ideally, the commit message should contain the git-hash of the commit from the `al-folio` repo, because it is not otherwise reflected in the history.
