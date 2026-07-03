# Bilge Günay İçözü — Portfolio

Portfolio website of Bilge Günay İçözü — creative technologist, new media artist and cultural producer based in Valencia, Spain.

**Live site:** [bilgegunayicozu.xyz](https://bilgegunayicozu.xyz)

## Stack

Static site — plain HTML/CSS/JS, no build step.

- [Three.js](https://threejs.org/) — laser-line hero field
- [GSAP + ScrollTrigger](https://gsap.com/) — scroll reveals & animations
- [Lenis](https://lenis.darkroom.engineering/) — smooth scrolling
- Dark/light theme with localStorage persistence

## Structure

```
index.html          Home — hero + selected work
about.html          About & contact
work/               Individual project pages
css/style.css       Design system
js/main.js          Interactivity
js/scene.js         Three.js hero background
assets/             Images & video
```

## Local development

Serve the folder with any static server, e.g.:

```
npx http-server -p 5173
```
