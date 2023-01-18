# Minimal Webflow Developement Starter

Uses [vite](https://vitejs.dev/) to run dev server and to minify output.

`pnpm run dev`: http://localhost:5173`
`pnpm run build`

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
