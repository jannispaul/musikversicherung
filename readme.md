# Musikversicherung.com Readme

Uses [vite](https://vitejs.dev/) to run dev server and to minify output.

## Setup

- Clone
- Rename
- Open: `code .`
- `pnpm install`
- `git init`
- Push

## Usage

### Run locally

`pnpm run dev`: http://localhost:5173`

Local dev script can be added in Weblfow:

```
<script src="http://localhost:5173/script.js"></script>
```

Or in Chrome browser console:

```
var ele = document.createElement("script");
var scriptPath = "http://localhost:5173/script.js" //verify the script path
ele.setAttribute("src",scriptPath);
document.head.appendChild(ele)

```

### Minify and copy to webflow

`pnpm run build`

Build folder dist/assets is automatically pushed to ftp server with github action.
