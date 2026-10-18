# ReThread (static site for GitHub Pages)
No server, no build step. Everything is plain files: `index.html`, `js/`, `model/`.
Deploy: push to a public GitHub repo, then Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
Test logic locally: `node --test tests/*.mjs` (Node 20+). Open the site only through https/http (GitHub Pages), not by double-clicking index.html.
Not tested in a browser yet: real model inference, layout on phones.
