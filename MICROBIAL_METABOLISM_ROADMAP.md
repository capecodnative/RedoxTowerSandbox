# Redox Fieldlab: microbial metabolism research and Codex roadmap

Prepared 2026-10-24. Research-informed recommendations, with implementation prompts.

## Recommendation

Keep the reaction explorer as the foundation. Extend it into an explanation of how organisms combine energy acquisition, electron transfer, carbon acquisition, and ecological interactions. The most valuable addition inspired by Alexandra (Alex) Z. Worden is a **Microbial lifestyles** view linking the existing chemistry to phototrophy, predation, mixotrophy, and carbon fate.

Build in this order: evidence and interpretation → curated metabolisms → Worden case studies → community interactions → environmental scenarios. Treat a full ecosystem simulator as a later project requiring additional data and validation.

These priorities are product-design judgments informed by the papers below; they are not recommendations made by those authors for this website.

## Repository baseline

Reviewed `C:\Users\DCO\Documents\MATLAB\RedoxTowerSandbox`, commit `128127a36a2aa041888aff2ba41ab9cb5235aaae`.

- Static HTML/CSS/JavaScript, served from `docs/`; no build system or backend needed.
- `docs/app.js` contains 12 base couples, seven expanded entries, and four photosystem states. It combines half-reactions, cancels electrons, and computes potential differences and reaction free energy.
- Nonstandard conditions already use independent reduction-half-reaction log10 Q′ sliders at buffered pH 7 and 25 °C. The tower remains a standard-potential reference.
- `docs/photosystems.js` already provides a qualitative oxygenic Z-scheme with PSII/PSI light switches and NADPH production. Do not rebuild this feature.
- Iron entries are deliberately reference-only; excited photosystem states are donor-only. Both restrictions should remain.
- The field guide already explains important limits, including speciation, rates, growth, and photon input. Bring selected explanations into the main workflow rather than duplicating a large disclaimer.
- `node tests/chemistry.cjs` passed during this review: 23 formal half-reactions and 399 allowed UI donor/acceptor pairings, plus existing energetics checks.
- The README specifies GitHub Pages publication from `docs/`. The Sites registration is unused. This roadmap does not change hosting or publish anything.

No browser-based visual audit was performed. Recommendations about interaction design below are based on source inspection, not observed rendering defects.

## Research findings and their implications

### 1. Energy source, electron source, and carbon source are separate questions

Worden et al. describe diverse protistan behaviors and interactions that complicate a simple producer/consumer split. They also explain why genome inventories alone cannot resolve physiological behavior. [S1]

**Design implication:** show separate fields for light versus chemical energy, inorganic versus organic electron donors, and inorganic versus organic carbon acquisition. Add feeding and symbiosis as ecological traits. Do not assign an organism's carbon source solely from the reaction selected in the tower.

Terminology to teach explicitly: phototrophy/chemotrophy concerns energy; lithotrophy/organotrophy concerns electron sources; autotrophy/heterotrophy concerns biomass carbon. Define the particular meaning of “mixotrophy” on each page: photosynthesis plus prey ingestion in the protist cases, versus mixed carbon/substrate use in some prokaryotic literature.

### 2. Mixotrophy includes distinct physiological strategies

Wilken, Choi, and Worden experimentally compared two closely related marine Ochromonas strains and found contrasting responses to prey and light, with different ecological niches and carbon-cycle implications. A single generic mixotroph would conceal this variability. [S2]

**Design implication:** make the flagship Worden module a side-by-side comparison of the studied strains, CCMP1393 and CCMP2951. Start with sourced qualitative observations. Extract the actual response curves, units, and experimental conditions from the full paper before adding numerical growth predictions.

Complementary modeling by Moeller et al. examines allocation among photosynthetic structures, feeding structures, and growth machinery under changing resources. Its results support a resource-tradeoff teaching exercise, but transition thresholds require taxon-specific calibration. This is related work, not a Worden-authored paper. [S3]

### 3. Measured activity and inferred capability need different labels

Wilken et al., including Worden, discuss pitfalls in identifying predatory mixotrophs; attached prey and coincident fluorescence can be confused with ingestion. [S4] A separate, non-Worden study found no evidence of phago-mixotrophy in the tested Micromonas polaris strains under its experimental conditions. [S5]

**Design implication:** attach evidence to individual claims, taxa/strains, methods, and conditions. Use labels such as “observed in experiment,” “inferred from genes,” “model result,” and “unresolved.” Do not promote Micromonas to a default bacterivore, or interpret absence of evidence as proof across every strain and environment.

### 4. Light harvesting is broader than the oxygenic Z-scheme

Strauss et al., including Worden, demonstrated a plastid-localized, light-driven xanthorhodopsin proton pump from a diatom and growth benefits in a gain-of-function strain under iron limitation. [S6]

**Design implication:** extend the existing Light reactions view with a conceptual comparison of oxygenic photosynthesis, anoxygenic phototrophy, and rhodopsin proton pumping. A proton pump is not automatically a carbon-fixation pathway or an oxygen-producing process. Keep membrane proton movement separate from chemical electron-transfer stoichiometry.

### 5. Carbon flows through predators as well as respiratory reactions

Wilken et al., including Worden, used labeled Prochlorococcus and RNA stable-isotope probing to identify active consumers, including choanoflagellates. Conventional amplicon abundance did not adequately highlight these consumers. [S7]

**Design implication:** add a food-web view with an evidence-backed Prochlorococcus → protist link. Label predation as biomass transfer, not as a redox half-reaction. A “follow the carbon” activity should distinguish fixation, ingestion, respiration, dissolved release, and export; numerical fractions require separate evidence.

### 6. Dark-ocean primary producers also participate in nutrient dependencies

Bergauer et al., including Worden, measured elevated thiamine-related compounds in sampled oxygen minimum zones. Paired molecular analyses implicated several chemoautotrophic groups in vitamin B1 production. The exact trafficking and net source/sink relationships remain open questions. [S8]

**Design implication:** offer a dark-ocean vignette connecting chemical energy, inorganic carbon fixation, and potential vitamin dependencies. Mark inferred producers and proposed exchanges separately from directly measured compounds. Low oxygen is not equivalent to complete anoxia.

### 7. A redox tower is not a universal ecological sequence

Chen et al. observed simultaneous aerobic and anaerobic activity in a laboratory community exposed to oxygen gradients, supported by multiple molecular and isotope methods. This directly challenges an obligatory, neatly sorted succession of metabolisms. [S9]

Jin and Kirk's reaction modeling shows that pH affects available energy through both proton participation and chemical speciation. [S10]

**Design implication:** distinguish thermodynamic favorability, substrate availability, biological capability, and measured activity. Start environmental presets at the app's supported pH 7/25 °C. Do not add a pH slider by inserting H+ into the existing transformed quotient; that requires a consistent thermodynamic and speciation model.

### 8. Communities can change the energetic feasibility of a reaction

Huang et al. experimentally demonstrated methanol-mediated syntrophy: methanol accumulation inhibited a formate-converting bacterium, while a methanol-consuming methanogen relieved the limitation. [S11]

**Design implication:** add a small syntrophy exercise in which users change an intermediate's activity and inspect individual and combined reaction energies. Do not label every exchange as obligate syntrophy. The methanol case is an advanced, thermophilic case study, not an ambient seawater preset.

### 9. Nitrogen pathways need distinct identities

van Kessel et al. demonstrated complete ammonia oxidation to nitrate by individual Nitrospira organisms. [S12] Lawson et al. used isotope tracing and metabolic flux analysis to resolve anammox carbon metabolism, including mismatches between genomic expectations and measured fluxes. [S13]

**Design implication:** distinguish ammonia oxidation, nitrite oxidation, comammox, denitrification, DNRA, and anammox. Nitrogen fixation is a separate, energy-consuming biosynthetic process. Add only pathways with reviewed reactions and compatible thermodynamic data to numerical calculations.

## Priority and scope

Effort is relative to this small static site: S = a focused change, M = several connected changes, L = substantial modeling/data work. These are not delivery-time estimates.

| Order | Improvement | Value | Effort | Depends on |
|---|---|---|---|---|
| P0 / 1 | Evidence records, couple types, interpretation beside results | Prevents equating a favorable pairing with a demonstrated metabolism | M | Existing chemistry |
| P1 / 2 | Curated metabolism cards and comparable energy units | Connects reactions to organisms and improves comparisons | M | 1 |
| P1 / 3 | Worden-based lifestyles and two-strain mixotrophy lesson | Adds the central biological insight missing from the current explorer | M | 1–2 |
| P2 / 4 | Broader phototrophy comparison | Builds directly on the Z-scheme | M | 1, 3 |
| P2 / 5 | Small community graph and syntrophy lesson | Links electron flow, biomass transfer, and dependencies | L | 1–3 |
| P2 / 6 | Environmental scenarios with explicit assumptions | Gives users purposeful experiments | M | 2–5 |
| P3 / 7 | Guided challenges, reproducible links, export, accessibility review | Makes the additions usable for teaching and sharing | M | Available modules |
| Later | Calibrated pH/speciation, spatial gradients, dynamic populations | Requires additional thermodynamic and ecological validation | L | Separate model design |

**First release:** phases 1–3. A sourced, qualitative mixotrophy comparison is useful without waiting for a numerical ecosystem model.

## Scientific and implementation contracts

1. Preserve buildless operation, relative paths for GitHub Pages, and the existing visual language. Prefer small plain-JavaScript modules; do not migrate frameworks just to add content.
2. Retain all original chart values as a named historical dataset. Offer reviewed alternatives with their source and conditions. In particular, the current +0.024 V tetrathionate value is historical; the direct measurement reported +0.198 ± 0.004 V. Keep dataset choice visible and do not silently overwrite the chart. [S14]
3. Keep environmental substrates, intracellular carriers, reaction-center states, and reference-only records distinguishable. “Chemistry pairing” should be the label for an arbitrary combination; reserve named metabolism claims for curated records.
4. Keep ΔE = Eacceptor − Edonor and ΔG = −nFΔE, without scaling potentials by stoichiometric multipliers. Show energy per displayed net reaction and optionally per mole of electrons; per mole of substrate requires an explicit selected substrate coefficient.
5. Never turn ΔG directly into ATP yield, growth, abundance, or rate without a separately stated, justified model. A favorable reaction alone does not demonstrate an organism can perform it.
6. Keep buffered pH 7, 25 °C and the current Q′ convention for existing calculations. Distinguish E°′ reference ordering from E′ under adjusted conditions. Do not combine incompatible pH, species, phases, or reference states.
7. A future species-activity model must share activities for shared species. Independent half-reaction Q′ sliders can describe combinations that do not correspond to one consistent environment; do not reuse them as a calibrated ecosystem model.
8. Represent unavailable numerical data as unavailable, not zero or guessed precision. Do not fabricate potentials, growth curves, transfer efficiencies, or universal limitation thresholds.
9. A literature-based observation, a numerical model prediction, and an illustrative teaching rule must carry different labels. Qualitative preset behavior should explain its assumptions locally.
10. Preserve iron exclusions and donor-only excited states. Compare pre-excited-state transfers without implying photon energy is free. Keep organism behavior outside the generic reaction calculator.

### Suggested data relationships

Adapt these concepts to the code; exact filenames are suggestions:

- `sources`: stable ID, authors/year/title/DOI/URL, source type, access level (abstract/full text), supporting figure/table/section, verification date.
- `couples`: existing chemistry plus category, potential kind, reference conditions, dataset membership, uncertainty when reported, source IDs, existing role restrictions.
- `metabolisms`: curated pathway ID, donor/acceptor references, carbon source, energy source, products, representative taxon/strain, compatible conditions, linked claims.
- `claims`: precise text, evidence type, organism/strain, method, experimental conditions, source IDs, limitations. A paper-level evidence badge alone is too coarse.
- `scenarios`: input state, environment assumptions, selected pathways, linked claims, model mode (qualitative or numerical), expected learning outcome.
- `interactions`: donor/recipient organism or pool, transferred material, edge type (electron transfer, biomass ingestion, metabolite exchange, proposed dependency), evidence, units where quantitative.

Extract chemistry/data from DOM rendering before adding numerical modules. The current tests read the prefix of app.js by splitting at `const donorNames=`; update that harness to consume an explicit exported/shared core rather than preserving a fragile source-text boundary.

## Sequential Codex prompts

Use one prompt per implementation task. All prompts assume this file is in the repository root. Respect repository instructions and preserve unrelated edits. Each task should report changes, checks, and remaining scientific limits. Implement locally; do not push or publish as part of these prompts.

### Prompt 1 — Evidence and interpretation foundation

```text
Read MICROBIAL_METABOLISM_ROADMAP.md and inspect the current Redox Fieldlab source. Implement phase 1 while keeping the site static and buildless. Separate chemistry/data from rendering into a small reusable core and update tests to use an explicit interface instead of splitting app.js text. Preserve existing numerical results and role restrictions.

Add source records and claim-level evidence metadata, and classify couples as environmental substrates, intracellular carriers, reaction-center states, or reference-only. In the reaction panel, distinguish arbitrary chemistry pairings from curated metabolisms and show a short explanation of what the energy result establishes. Keep the existing guide for detail. Add a visible historical-chart versus reviewed-data choice; preserve the chart values and document any alternative value with conditions and provenance, starting with tetrathionate. Never invent missing values.

Acceptance: all existing chemistry regressions pass; historical mode reproduces the existing results; reviewed values show their source and dataset label; sources are usable with keyboard navigation; original iron and photosystem restrictions remain. Update README and the roadmap checklist. Do not push or publish.
```

### Prompt 2 — Curated metabolism atlas

```text
Read MICROBIAL_METABOLISM_ROADMAP.md and implement phase 2 on the completed evidence/core foundation. Turn the five existing presets into data-driven metabolism cards with energy source, electron donor/acceptor, carbon source (unknown where not established), products, habitat, representative organisms, and sourced claims. Add filters and a link that loads compatible chemistry into the current explorer.

Add sourced coverage for hydrogenotrophic methanogenesis, aerobic methane oxidation, ammonia oxidation, nitrite oxidation, comammox, anammox, DNRA, and anoxygenic sulfur phototrophy. First audit the required chemistry and compatible thermodynamic data. Add reviewed, balanced half-reactions only where supported; otherwise provide a clearly qualitative pathway card without a fabricated energy result. Distinguish fermentation and nitrogen fixation from respiratory donor/acceptor pairings. Do not infer taxonomy or carbon fixation from ΔG.

Add optional kJ/mol-electron alongside kJ/mol-displayed-reaction. Acceptance: new numerical reactions conserve atoms/charge and cancel electrons; unit conversions are independently checked; unsupported calculations remain unavailable; existing presets still work; revised pair counts are derived from actual role eligibility. Update README and checklist. Do not push or publish.
```

### Prompt 3 — Worden-based microbial lifestyles

```text
Read MICROBIAL_METABOLISM_ROADMAP.md and implement the phase 3 Microbial lifestyles view. Use Worden et al. 2015, Wilken/Choi/Worden 2020, and Wilken et al. 2019 as its scientific foundation. Explain energy source, electron source, biomass carbon source, and prey ingestion separately, with links to compatible atlas cards and existing chemistry.

Build a side-by-side lesson using the studied Ochromonas strains CCMP1393 and CCMP2951. Verify strain-specific behavior against the full 2020 paper before writing the comparison. Let users compare published light/prey treatment observations; do not invent continuous growth curves. Add inorganic nutrient supply as a separately labeled conceptual tradeoff informed by Moeller et al. 2024, not an experimental result of the two-strain paper. If full-text verification is unavailable, keep those unverified details out and record the gap.

Give every response explanation a source and evidence label. Include a short evidence-detective example on why fluorescence/association alone does not prove feeding; accurately scope the Micromonas polaris counterexample and do not attribute that non-Worden paper to Worden. Acceptance: traits are not mutually exclusive; low light/low nutrients do not force all taxa to become bacterivores; observations remain distinct from teaching rules. Check navigation and small-screen layout. Update checklist. Do not push or publish.
```

### Prompt 4 — Extend the existing light-reactions lesson

```text
Read MICROBIAL_METABOLISM_ROADMAP.md and implement phase 4 as an extension of docs/photosystems.js. Preserve the existing oxygenic Z-scheme and PSII/PSI controls. Add a comparison of oxygenic electron flow, anoxygenic phototrophy, and light-driven rhodopsin proton pumping, using Strauss et al. 2023 for the Worden-associated case.

For each, show energy input, electron source where applicable, proton movement, products, and what is and is not implied about carbon fixation and oxygen production. Explain that chlorophyll-based carbon fixation and a rhodopsin pump can coexist in one cell. Do not place proton pumping into the tower as a fabricated reduction couple or assign a universal ATP/photon yield. Treat iron limitation as a sourced case-study context, not a generic multiplicative growth bonus.

Acceptance: old light controls retain their behavior; pump illustrations conserve the distinction between proton and electron flow; claims stay within organism/experimental scope; diagrams have text equivalents. Update guide and checklist. Do not push or publish.
```

### Prompt 5 — Community exchanges and syntrophy

```text
Read MICROBIAL_METABOLISM_ROADMAP.md and implement phase 5 as a small, inspectable community view. Begin with two examples: Prochlorococcus biomass entering protistan predators (Wilken et al. 2023), and product removal enabling a coupled metabolism. Use distinct labeled edges for biomass ingestion, metabolite exchange, and electron transfer. Add an equivalent table for accessibility. Do not draw a predation edge as a chemical half-reaction.

For the numerical syntrophy exercise, select a published, fully specified pair of reactions with compatible standard states and conditions. Let users vary one shared intermediate activity and compare each partner's ΔG and the summed reaction. Show how the intermediate cancels in the net reaction. Provide an organism-removal comparison without simulating population trajectories. Huang et al. 2025 may be a separate advanced thermophilic methanol case; do not transplant its conditions to ambient seawater. If the needed data cannot be verified, ship the sourced qualitative exercise and document the numerical gap.

Acceptance: coupled reactions conserve atoms/charge; canceled intermediates have no residual effect on total ΔG; individual values use a consistent environment; cross-feeding and obligate syntrophy are distinguished; no invented growth rate or exchange fraction. Update checklist. Do not push or publish.
```

### Prompt 6 — Environmental scenarios

```text
Read MICROBIAL_METABOLISM_ROADMAP.md and implement phase 6 using the completed modules. Add four resettable learning scenarios: an illuminated surface community; a low-oxygen water parcel; an anoxic sediment community; and an organic particle with an oxygenated exterior and potentially oxygen-poor interior. Treat the particle's spatial structure as a conceptual diagram unless a separate transport model is implemented and verified.

Reuse current Q′ controls for compatible reaction comparisons, keeping pH 7/25 °C. Environmental labels should explain supported substrates and limitations without claiming measured field conditions. Add a Worden-associated dark-ocean B1 vignette (Bergauer et al. 2025), distinguishing measured compounds from inferred producers and unverified trafficking. Show overlapping possible metabolisms rather than a mandatory sequence sorted by tower height, using Chen et al. 2017 as the evidence example.

Acceptance: low oxygen does not automatically mean anoxia; chemically favorable, biologically supported, resource-limited, and observed are separate concepts; scenario changes cannot combine incompatible datasets/states; reset restores every scenario input. Avoid uncalibrated rate/abundance predictions and a pH slider. Update checklist. Do not push or publish.
```

### Prompt 7 — Teaching, sharing, and final integration

```text
Read MICROBIAL_METABOLISM_ROADMAP.md and implement phase 7 for the modules actually present. Add short guided challenges: compare favorable chemistry with a documented metabolism; identify a mixotroph's energy/carbon/nutrient sources; explain product removal in syntrophy; and distinguish measured feeding from genomic potential. Provide explanatory answers linked to the relevant source claims.

Add reproducible URL state for selected view, dataset, donor/acceptor, logQ values, light controls, and scenario where applicable. Export a small JSON/CSV record containing inputs, units, model assumptions/version, and source IDs; never export illustrative outputs as observations. Validate imported/URL state against known IDs and ranges, and fall back safely for malformed state. Preserve relative asset paths and offline operation apart from external fonts/links.

Review keyboard operation, tab semantics, focus, dialogs, screen-reader descriptions, and mobile layout. Run chemistry checks and focused checks for the new calculations and state round trips; visually inspect the integrated website when browser tools are available. Report verification limits. Update README and checklist. Do not push or publish.
```

## Completion checklist

- [x] Inspect repository and record baseline chemistry check result.
- [x] Research Worden and complementary microbial metabolism literature.
- [x] Deliver prioritized roadmap and sequential prompts.
- [x] Phase 1: evidence/core/interpretation and dataset selection (2026-10-24). Added DOM-free `docs/core.js`, explicit browser/CommonJS API, source and claim catalogs, couple categories, curated-example versus chemistry-pairing labels, result interpretation, and a visible historical/reviewed dataset selector. Historical values and role restrictions are preserved; reviewed mode changes only tetrathionate. Missing measurement provenance remains explicit. Chemistry and evidence checks pass; browser checks covered switching, source access by keyboard, iron exclusions, and photosystem restrictions. No push or publication.
- [ ] Phase 2: curated metabolism atlas and normalized energy display.
- [ ] Phase 3: microbial lifestyles and verified two-strain lesson.
- [ ] Phase 4: broader phototrophy comparison.
- [ ] Phase 5: community view and supported syntrophy exercise.
- [ ] Phase 6: environmental scenarios.
- [ ] Phase 7: guided challenges, sharing/export, accessibility and integration.

## Sources

Access notes distinguish full article text from abstracts/metadata. Before extracting numerical parameters, consult methods, figures, tables, and supplementary data. Publication years below refer to journal issues unless otherwise noted. This is a focused literature review, not an exhaustive systematic review.

- **S1 — Worden et al. (2015).** *Rethinking the marine carbon cycle: Factoring in the multifarious lifestyles of microbes.* Science 347, 1257594. [Paper/abstract](https://pubmed.ncbi.nlm.nih.gov/25678667/), DOI 10.1126/science.1257594. Review; abstract verified. Framework for behavior, protists, and carbon cycling.
- **S2 — Wilken, Choi & Worden (2020; online 2019).** *Contrasting Mixotrophic Lifestyles Reveal Different Ecological Niches in Two Closely Related Marine Protists.* Journal of Phycology 56, 52–67. [Open article](https://pmc.ncbi.nlm.nih.gov/articles/PMC7065223/), [publisher](https://doi.org/10.1111/jpy.12920). Original experiments; indexed article excerpts and publisher text checked. Recheck full experimental detail before numerical implementation.
- **S3 — Moeller et al. (2024).** *Predicting optimal mixotrophic metabolic strategies in the global ocean.* Science Advances 10, eadr0664. [Open article](https://pmc.ncbi.nlm.nih.gov/articles/PMC11641107/), DOI 10.1126/sciadv.adr0664. Original modeling; indexed results and model description inspected. Not Worden-authored.
- **S4 — Wilken et al. (2019).** *The need to account for cell biology in characterizing predatory mixotrophs in aquatic environments.* Philosophical Transactions B 374, 20190090. [Open article](https://pmc.ncbi.nlm.nih.gov/articles/PMC6792458/), DOI 10.1098/rstb.2019.0090. Review with methodological discussion; relevant article text inspected. Worden is a coauthor.
- **S5 — Jimenez et al. (2021).** *No evidence of Phago-mixotropy in Micromonas polaris (Mamiellophyceae), the Dominant Picophytoplankton Species in the Arctic.* Journal of Phycology 57, 435–446. [Abstract](https://pubmed.ncbi.nlm.nih.gov/33394518/), DOI 10.1111/jpy.13125. Original experiments; abstract verified. Worden is not a coauthor.
- **S6 — Strauss et al. (2023).** *Plastid-localized xanthorhodopsin increases diatom biomass and ecosystem productivity in iron-limited surface oceans.* Nature Microbiology 8, 2050–2066. [Article](https://www.nature.com/articles/s41564-023-01498-5). Original experiments; abstract and article text available. Worden is a coauthor.
- **S7 — Wilken et al. (2023).** *Choanoflagellates alongside diverse uncultured predatory protists consume the abundant open-ocean cyanobacterium Prochlorococcus.* PNAS 120, e2302388120. [Article](https://www.pnas.org/doi/10.1073/pnas.2302388120). Original field/experimental study; abstract, results, and methods inspected. Worden is a coauthor.
- **S8 — Bergauer et al. (2025).** *Dark ocean archaeal and bacterial chemoautotrophs drive vitamin B1 production in oxygen minimum zones.* ISME Communications 5, ycaf077. [Article](https://academic.oup.com/ismecommun/article/5/1/ycaf077/8154413), DOI 10.1093/ismeco/ycaf077. Original chemical/molecular study; abstract and introduction inspected. Worden is a coauthor.
- **S9 — Chen et al. (2017).** *Impacts of chemical gradients on microbial community structure.* The ISME Journal 11, 920–931. [Article](https://www.nature.com/articles/ismej2016175). Original community experiment; abstract and introduction inspected. Evidence against obligatory redox sorting.
- **S10 — Jin & Kirk (2018).** *pH as a Primary Control in Environmental Microbiology: 1. Thermodynamic Perspective.* Frontiers in Environmental Science 6, 21. [Article](https://www.frontiersin.org/journals/environmental-science/articles/10.3389/fenvs.2018.00021/full). Original reaction modeling; abstract, introduction, and methods inspected.
- **S11 — Huang et al. (2025).** *Methanol transfer supports metabolic syntrophy between bacteria and archaea.* Nature 639, 190–195. [Article](https://www.nature.com/articles/s41586-024-08491-w), [abstract](https://pubmed.ncbi.nlm.nih.gov/39880954/). Original experiments; abstract and figure descriptions checked. Supplementary thermodynamic data require separate extraction.
- **S12 — van Kessel et al. (2015).** *Complete nitrification by a single microorganism.* Nature 528, 555–559. [Abstract](https://pubmed.ncbi.nlm.nih.gov/26610025/), DOI 10.1038/nature16459. Original enrichment/physiology study; abstract and indexed article excerpts verified.
- **S13 — Lawson et al. (2021; online 2020).** *Autotrophic and mixotrophic metabolism of an anammox bacterium revealed by in vivo 13C and 2H metabolic network mapping.* The ISME Journal 15, 673–687. [Article](https://www.nature.com/articles/s41396-020-00805-w). Original isotope/flux study; abstract and indexed results inspected.
- **S14 — Kurth, Dahl & Butt (2015).** *Catalytic Protein Film Electrochemistry Provides a Direct Measure of the Tetrathionate/Thiosulfate Reduction Potential.* JACS 137, 13232–13235. [Record](https://pubmed.ncbi.nlm.nih.gov/26437022/), [paper](https://doi.org/10.1021/jacs.5b08291). Original electrochemistry; bibliographic record checked; numerical result is also documented in the existing app and subsequent original work: [Kurth et al. (2016)](https://eprints.whiterose.ac.uk/id/eprint/108639/1/e00422.full.pdf). Verify measurement conditions when implementing the reviewed dataset.

Worden attribution was cross-checked against the [Worden Lab publication list](https://www.wordenlab.org/pubs). Source-linked proposed features are interpretations for this project and do not imply endorsement by the researchers.
