UTN Data Systems Lab Website
============================

The website is built using Jekyll with a modified version of the [al-folio](https://github.com/alshedivat/al-folio) theme.

It makes use of:
 - [Bootstrap@v4.6.2](https://getbootstrap.com/docs/4.6/getting-started/introduction/)
 - [Fontawesome@v6.7.1](https://fontawesome.com/icons)
 - [Academicons](https://jpswalsh.github.io/academicons/)

## Running the Site locally

**Lab-Specific**

Our `watzmann` server has everything set up for local development. The repository is located in `/space/websites/utndatasystems.github.io`.

Open the project in VSCode. If it asks you to "reopen the project in a devcontainer", click "No" (this would require Docker being set up on Watzmann, which is not the case).

Open the terminal and run:
```
bundle exec jekyll serve
```
A popup should appear in VSCode asking you to open a forwarded port. Click "Open in Browser". Done.

You can use this setup for local development. When you push the changes to `main`, the website will be re-deployed automatically.


**General Instructions**

Follow the instructions in the `al-folio` repository in [`INSTALL.md`](https://github.com/alshedivat/al-folio/blob/main/INSTALL.md).

**TL;DR:**

```
docker compose pull
docker compose up
```

**Alternative for VSCode:**

Or open the project with VSCode and launch the "dev-container".
If the server is hanging, try the following command inside the dev-container:
```
bundle exec jekyll serve
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
