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
- Open **Field guide** for interpretation, assumptions and references.

## Model

Potentials are rounded pedagogical E°′ values at pH 7 and 25 °C, following the supplied image. All couples are represented as reductions. Electron transfer is balanced by the least common multiple of the two half-reaction electron counts; shared species cancel in the net reaction.

`ΔE′ = E′acceptor − E′donor`

`ΔG′ = −n × 96.485 × ΔE′` (kJ per mole of displayed net reaction)

`E′ = E°′ − (0.05916 / n) log10 Q′` (25 °C, buffered pH 7)

Q′ means the full reduction half-reaction activity quotient excluding buffered protons, electrons, pure water and solids. Standard potentials are not multiplied when scaling reaction coefficients. H⁺ is retained in formal chemical equations for atom and charge balance. This is a fixed-species teaching model, not an acid–base speciation solver or a prediction of ATP yield, growth or reaction rate. Nitrate/N₂ uses 10 electrons per whole N₂ molecule.

## Files and checks

- `docs/index.html`: layout, field guide, source links
- `docs/style.css`: responsive styling
- `docs/app.js`: couple data, stoichiometry, energetics, interactions
- `tests/chemistry.cjs`: chemistry regression checks

Run checks from the repository root with `node tests/chemistry.cjs`. The checks cover atom and charge conservation, electron cancellation across all 289 selectable pairings (17 couples), all 19 formal half-reactions, base/expanded counts, iron exclusions, precision of chart values, reverse-reaction energy symmetry, known aerobic/sulfate examples and the direction of Nernst corrections.

Google Fonts optionally supplies the interface fonts. System font fallbacks allow the app to work offline.
