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

## Run Locally

The site uses native JavaScript modules and fetches model files, so open it through HTTP or HTTPS rather than double-clicking `index.html`.

1. From the project directory, start a static server:

   ```powershell
   python -m http.server 8000
   ```

2. Open [http://localhost:8000](http://localhost:8000).

The model and TensorFlow.js are loaded when image analysis is used, so that feature requires a network connection.

## Tests

The logic tests use Node.js 20 or newer and the built-in test runner:

```powershell
node --test tests/engine.test.mjs tests/logic.test.mjs
```

The suite covers recommendation eligibility, required measurements, preference constraints, guide completeness, and image-classification decision rules.

## Deploy To GitHub Pages

There is no build step. Push the project files to the repository, then configure GitHub Pages:

1. Open **Settings > Pages**.
2. Choose **Deploy from a branch**.
3. Select the `main` branch and the `/(root)` folder.

The model path is relative to the app, so it works under a GitHub Pages project URL as well as at the site root.

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
