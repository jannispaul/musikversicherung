# Musikversicherung.com

This is a comined repo that handles 2 things:

1. Download website from Webflow staging, modify it, and Upload everything to the SFTP server so its hosted in germany (strato).
2. Handle custom JS implementation, with build step / minifying

## 1. Download Website -> Webflow Scraper

On a push to to the main branch [webflow-scraper/download_site.sh] script runs (on darwin/linux systems only). It does the following:

- downloads the website & open grah image
- Removes jquery & webflow.js
- Adds robots.txt
- Generates sitemap.xml
- Copies custom js from `build` to `dist` folder
- Uploads `build` folder to SFTP server

### Settings:

- Use `discover-urls.txt` to add additional URLs to download
- Use `sitemap-noindex.txt` to hide pages from sitemap

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

## Git conflicts

In case of git conflicts run `git config pull.rebase false` to merge the file changes on server with local changes.
