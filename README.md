# Redox Fieldlab

An interactive microbial ecology playground inspired by a teaching redox tower. Select electron donors and acceptors, inspect balanced half-reactions and net reactions, and compare reduction potentials and free energy changes.

## Open locally

Open `docs/index.html` in a browser. No installation, build step, API key, account or backend is required. For a local server, run `python3 -m http.server 8000 --directory docs` and visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Commit and push these files to your repository.
2. In the repository, open **Settings → Pages**.
3. Select **Deploy from a branch**, your publishing branch (usually `main`), and **/docs**, then save.
4. GitHub displays the site URL after deployment finishes.

All asset paths are relative, so repository project URLs work without configuration. See [GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

The website has not been published or pushed by this chat. `.openai/hosting.json` records an unused, private Sites registration created before the request to self-publish; GitHub Pages uses only `docs/` and does not need it.

## Explore

- Choose a donor or acceptor role, then click a tower row; or use the two menus.
- Try presets for aerobic hydrogen oxidation, denitrification, sulfate reduction, methanol oxidation and acetate oxidation.
- Click **Show more!** to reveal seven additional entries from the original chart: tetrathionate/thiosulfate, cytochromes b/c/a, ubiquinone, and both iron values. The toggle updates the tower, menus and library. Iron entries are reference-only to avoid mixing incompatible pH/speciation assumptions.
- Open **Couple library** for all reduction half-reactions and ecological context.
- Expand **Explore nonstandard conditions** to adjust reduction activity quotients.
- Enable **Photosystems** to add ground-state and excited-state P680/P700 couples. Excited states are donors only; their single-transfer energy estimates exclude photon input. Reaction-center activity-quotient controls are disabled.
- Open **Light reactions ☀** for an interactive oxygenic Z-scheme: switch PSII/PSI light on or off and step through water oxidation, the connecting chain, and NADPH production.
- Open **Field guide** for interpretation, assumptions and references.
- Choose **Historical chart** (the default) or **Reviewed data** in the visible dataset selector. Reviewed mode changes only tetrathionate to +0.198 ± 0.004 V; all other chart values remain. Switching updates the tower order, menus, library, and calculated result without changing the selected pair or activity quotients.
- The reaction panel labels the five original named presets as **Curated teaching examples** and other combinations as **Chemistry pairings**. It explains what the calculated energy establishes without implying a measured biological pathway, rate, ATP yield, or growth.
- Couple categories separate environmental substrates, intracellular carriers, reaction-center states, and reference-only entries. **Evidence and sources** exposes individual claims, methods, scope, conditions, and limitations. Citation links open the relevant source record in the field guide; keyboard users can press Enter, Tab to the paper link, and Escape to close the guide.

## Evidence and datasets

Historical mode preserves all 23 existing potentials and the original chemistry. Reviewed mode currently provides one sourced alternative: the tetrathionate/thiosulfate formal potential reported by [Kurth, Dahl & Butt (2015)](https://doi.org/10.1021/jacs.5b08291), versus SHE across pH 5–7. Its experimental temperature was not verified in accessible text. Using it with the app's 25 °C teaching equation is approximate; no temperature or activity-coefficient correction is applied. The reported ±0.004 V is displayed as source uncertainty, not propagated into a whole-reaction uncertainty estimate.

Source records distinguish the original chart and inherited educational notes from primary research. Missing authors, dates, strain assignments, and measurement provenance stay explicitly unavailable. Photosystem values remain representative teaching midpoints with their own provenance record. Claim-level evidence distinguishes teaching summaries, model results, a direct potential measurement, and a specific community experiment; the last does not validate arbitrary tower pairings. These records are the foundation for later metabolism-atlas work, not a claim that every existing note has been independently reviewed.

## Model

Potentials are rounded pedagogical E°′ values at pH 7 and 25 °C, following the supplied image. All couples are represented as reductions. Electron transfer is balanced by the least common multiple of the two half-reaction electron counts; shared species cancel in the net reaction.

`ΔE′ = E′acceptor − E′donor`

`ΔG′ = −n × 96.485 × ΔE′` (kJ per mole of displayed net reaction)

`E′ = E°′ − (0.05916 / n) log10 Q′` (25 °C, buffered pH 7)

Q′ means the full reduction half-reaction activity quotient excluding buffered protons, electrons, pure water and solids. Standard potentials are not multiplied when scaling reaction coefficients. H⁺ is retained in formal chemical equations for atom and charge balance. This is a fixed-species teaching model, not an acid–base speciation solver or a prediction of ATP yield, growth or reaction rate. Nitrate/N₂ uses 10 electrons per whole N₂ molecule.

## Files and checks

- `docs/index.html`: layout, field guide, source links
- `docs/style.css`: responsive styling
- `docs/core.js`: DOM-free couple/species data, dataset variants, source and claim records, named teaching examples, role eligibility, stoichiometry and energetics. Exposes `RedoxCore` to classic browser scripts and the same API through Node `require('./docs/core.js')`; no fetch, module server, or build step is needed.
- `docs/app.js`: rendering, dataset/preset controls, evidence/source presentation, and interactions
- `docs/photosystems.js`: interactive light-reaction pathway
- `tests/chemistry.cjs`: chemistry regression checks
- `tests/evidence.cjs`: metadata integrity, dataset isolation, categories, named-pair classification, and browser/CommonJS interface checks

Run checks from the repository root with `node tests/chemistry.cjs`. The checks cover atom and charge conservation, electron cancellation across all 399 allowed donor/acceptor pairings (21 donors, 19 acceptors), all 23 formal half-reactions, base/expanded counts, iron exclusions, precision of chart values, reverse-reaction energy symmetry, known aerobic/sulfate examples and the direction of Nernst corrections.

Also run `node tests/evidence.cjs`. Chemistry checks cover both datasets, every historical potential, the reviewed tetrathionate energy change and ordering, and role restrictions. Both test files use the explicit shared-core interface rather than extracting code from the rendering script. `calculate()` performs formal chemical bookkeeping (including reverse reactions); consumers use `canUse(couple, role)` to enforce UI role eligibility. `getCouples(dataset)` returns independent copies, and source/claim catalogs are immutable.

Google Fonts optionally supplies the interface fonts. System font fallbacks allow the app to work offline.
