# TYPECRYPT — Typing Speed Game

A retro-terminal themed typing speed game. No frameworks, no build tools. Pure HTML, CSS, and vanilla JavaScript.

## 🌐 Play Online

Play the game live at: [https://reddi-karunya.github.io/typespeed-game/](https://reddi-karunya.github.io/typespeed-game/)

---
## Screenshots

<img width="1916" height="971" alt="image" src="https://github.com/user-attachments/assets/d374696c-cb99-4558-acd3-14c6d15741c2" />

## 📁 Project Structure

```
typecrypt/
├── index.html              ← Main entry point
├── README.md               ← This file
│
├── css/
│   ├── reset.css           ← CSS reset / normalize
│   ├── variables.css       ← Design tokens (colors, fonts, spacing)
│   ├── layout.css          ← Page structure, container, grid, header
│   ├── components.css      ← All UI component styles
│   ├── animations.css      ← Keyframe animations & transitions
│   └── responsive.css      ← Mobile / tablet breakpoints
│
└── js/
    ├── words.js            ← Word lists (normal, punctuation, numbers)
    ├── game.js             ← Game state & logic (TypingGame class)
    ├── ui.js               ← DOM rendering & effects (TypingUI class)
    └── main.js             ← Entry point — wires everything together
```

---

## 🚀 How to Run

Just open `index.html` in any modern browser:

```
# Option 1 — double-click index.html

# Option 2 — serve locally (recommended)
npx serve .
# or
python3 -m http.server 8080
```

No npm install, no build step needed.

---

## 🎮 Controls

| Key / Action        | Effect                     |
|---------------------|----------------------------|
| Any key             | Start typing / focus input |
| `Space`             | Submit current word        |
| `Tab`               | Restart instantly          |
| Restart button      | New test (same words)      |
| New Words button    | New test (new words)       |

---

## ⚙️ Modes

### Time
- **15s** — Sprint
- **30s** — Short
- **60s** — Standard
- **120s** — Endurance

### Word Set
- **Normal** — Common English words
- **Punctuation** — Programming/JS keywords and concepts
- **Numbers** — Number words and math terms

---

## 🏆 Rank System

| WPM         | Rank          |
|-------------|---------------|
| 120+        | ⚡ LEGENDARY  |
| 90 – 119    | 🔥 EXPERT     |
| 70 – 89     | ▲ ADVANCED    |
| 50 – 69     | ◆ INTERMEDIATE|
| 30 – 49     | ● BEGINNER    |
| 0 – 29      | ○ NOVICE      |

---

## 🎨 Design

- **Aesthetic:** Retro terminal / cyberpunk dark
- **Fonts:** Bebas Neue (display), IBM Plex Mono (body), Space Mono (stats)
- **Effects:** Scanlines, grid background, vignette, particle bursts, glitch flash

---

## 🔧 Customisation

- **Add words:** Edit `js/words.js` — add entries to any `WORD_LISTS` array
- **Change colours:** Edit `css/variables.css` — all tokens are CSS custom properties
- **Add a time mode:** Add a `<button data-time="N">` in `index.html` toolbar
- **Change word count:** Adjust the `count` param in `getWordList()` inside `js/main.js`
