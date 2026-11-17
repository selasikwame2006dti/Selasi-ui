# Selasi-ui

UI concept for Selasi AI (selasi.dev): describe an app idea in chat, render it
on demand inside a Selasi device frame, tap through the flow, then hand it off
to Selasi Coder.

## Run it

Static files, no build step. Serve the folder and open `index.html`:

```
python3 -m http.server 8080
```

## What is here

- `index.html`: the page (nav rail and drawer, chat, device stage, flow, settings, handoff dialog)
- `assets/css/app.css`: theme tokens (dark and light) and layout
- `assets/js/app.js`: chats and projects, device stage, stamina, settings, captures, handoff
- `assets/js/prototype.js`: the sample prototypes (apps fill the screen, sites open in browser chrome)
- `assets/js/settings.js`, `assets/css/settings.css`: the settings page
- `assets/js/stories.js`: the two scroll-story sites (3D delivery truck, exploded headphones)
- `assets/js/art.js`: illustrations drawn in code for the prototype image slots
- `assets/js/device-lockscreens.js`, `assets/css/device-lockscreens.css`,
  `assets/fonts/`: the device frames and lock screens from Selasi Coder

## Photos

The sample prototypes have photo slots. Add an image to `assets/img/` and map
its slot name to the file in `assets/img/photos.js` (the slot names are listed
there). Slots without a photo show an illustration from `assets/js/art.js`.

This is a concept build with no backend. Chat replies are scripted, and
captures, download, GitHub push and the Coder handoff show what will happen
without doing it.

## Blueprint

How the real product works behind this concept (agent, design library,
sandboxed rendering, sessions and memory, handoff to Selasi Coder and GitHub):
see [docs/blueprint](docs/blueprint/README.md).
