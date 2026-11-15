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

- `index.html`: the page (top bar, chat, device stage, flow rail, handoff dialog)
- `assets/css/app.css`: theme tokens (dark and light) and layout
- `assets/js/app.js`: chat flow, device stage, captures, handoff
- `assets/js/prototype.js`: the three sample prototypes shown inside the device
- `assets/js/device-lockscreens.js`, `assets/css/device-lockscreens.css`,
  `assets/fonts/`: the device frames and lock screens from Selasi Coder

This is a concept build with no backend. Chat replies are scripted, and
captures, download, GitHub push and the Coder handoff show what will happen
without doing it.
