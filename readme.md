# Musikversicherung.com

This is a comined repo that handles 3 things:

1. Download Website and all assets from Webflow servers. (Not fully implemented yet)
2. Handle custom JS implementation, with minifying
3. Upload everything to the SFTP server so its hosted in germany (strato).

## 1. Download Website

[download_site.sh] script runs on darwin/linux systems and

- downloads the website, open grah image and sitemap.xml
- Removes jquery, webflow.js

**TODOs:**

- [ ] Fix Lottie download & implementation
- [ ] Fix Sitemap links / Create own sitemap -> Better generate your own sitemap:
  - [ ] https://github.com/mcmilk/sitemap-generator
  - [ ] https://www.plop.at/en/xml-sitemap.html

## 2. Custom JS

Uses [vite](https://vitejs.dev/) to run dev server and to minify output.

### Setup

- Clone
- Open: `code .`
- `pnpm install`
- `git init`
- Push

### Usage

Run `pnpm run dev`: http://localhost:5173`

Local dev script can be added in Weblfow: `<script src="http://localhost:5173/script.js"></script>`

Run `pnpm run build` to minifiy to build folder dist/assets

## 3. Automatic Upload

Contents of build folder /dist/assets are automatically pushed to ftp server with github action.

**TODOs**

- [x] Create Github Action to run bash script
- [x] Make sure files dont get overwritten
  - [ ]both folders are name dist
  - [ ] reviews.json, new-reviews.json,
- [x] robots.txt
- [ ] Create file with list of pages that wget doesnt find
- [ ] Update lottie dependency on submit animation

## Git conflicts

In case of git conflicts run `git config pull.rebase false` to merge the file changes on server with local changes.
