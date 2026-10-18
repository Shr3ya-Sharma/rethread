# ReThread

**A second life, stitched by you.** ReThread helps people explore what a garment's next life could be. It pairs source-linked textile research with a practical tool that turns a photo and real measurements into feasible upcycling ideas.

ReThread is a static, browser-based project hosted on GitHub Pages. It has no backend, build step, or account system.

## What You Can Do

- Explore textile-industry findings with links to their sources, methods, and limitations.
- Upload a photo of a short- or long-sleeved top. An image model suggests a category; you always confirm it.
- Enter garment measurements and preferences for sewing skill, available time, and sewing tools.
- Compare suitable projects by match, difficulty, time, cost, and project type.
- Follow step-by-step guides with materials, safety notes, checkpoints, and a saved checklist.

The curated guides include a no-sew fringe tote, infinity scarf, two-panel beanie, cut-off tank, and raw-edge crop top.

## How Recommendations Work

ReThread does not infer measurements or fabric properties from a photo. You provide the garment dimensions, and the planner checks those against each project's stated minimums. Missing measurements prompt you to add them; projects that do not fit the entered dimensions or preferences are excluded.

The match score is a rough ranking to help sort eligible projects. It is not a probability of success, and the guide's design values are suggestions rather than tested textile standards. Check the garment, materials, and instructions before cutting.

The image model has three classes: T-shirt, full-sleeve shirt, and knitted sweater. It has no "not a top" class and is not a garment verifier. When its suggestion is uncertain or unmapped, you choose the sleeve category yourself. Treat the result as a prompt, not proof.

## Evidence And Sources

Research claims are presented individually because they have different scopes and denominators. Each finding includes its geography, period, source, method, and known limitations where available. Claims that have not been checked sufficiently are withheld rather than presented as established facts. A quotation is attributed and should be read as an individual account, not a measure of how common an experience is.

## Privacy And Network Use

- Selected photos are processed in your browser and are not uploaded to a ReThread server or saved by the app.
- The TensorFlow.js library is loaded from jsDelivr, and the model files are fetched from this site's `model/` directory for analysis.
- Guide checklist progress is stored in this browser's local storage on this device. It is not synced between devices.

## Tech Stack

- **Web app:** HTML, CSS, and native JavaScript modules, hosted as a static site on GitHub Pages.
- **Image classifier:** Created and trained as a neural network in Google Teachable Machine, then exported and run in the browser with TensorFlow.js.
- **Design:** Figma for the first design draft.
- **Development environment:** Visual Studio Code.
- **AI-assisted development:** Claude, GitHub Copilot, and ChatGPT supported project planning and development. These are development tools, not runtime dependencies of the site.

## Live Site

ReThread is published at [https://shr3ya-sharma.github.io/rethread/](https://shr3ya-sharma.github.io/rethread/) using GitHub Pages. The site is served directly from the repository; it does not require a separate application server or build step. Image analysis requires a network connection to load TensorFlow.js and the model files.

## Project Structure

```text
index.html          Page shell and styles
js/app.js           Story, studio, and guide interactions
js/classifier.js    TensorFlow.js model loading and image inference
js/eligibility.js   Model-output validation and user confirmation flow
js/engine.js        Measurement checks and project ranking
js/recipes.js       Curated project plans and safety guidance
js/research.js      Findings, quotations, and source notes
model/              Model files and label metadata
tests/              Node.js logic tests
```
