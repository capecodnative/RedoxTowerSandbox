/* Rendering and interaction only. Chemistry and evidence live in core.js. */
'use strict';
const { getCouples, canUse, findMetabolism, calculate, equation, scaled,
  categories, evidenceTypes, sources, claims, datasets, metabolisms } = RedoxCore;
const $ = id => document.getElementById(id);
const signed = (v, d = 2) => (v < 0 ? '−' : '+') + Math.abs(v).toFixed(d);
const potential = c => signed(c.e, Math.abs(c.e * 100 - Math.round(c.e * 100)) > 1e-8 ? 3 : 2);
let dataset = 'historical';
let couples = getCouples(dataset);
let mode = 'donor';
let expanded = false;
let photosEnabled = false;

function element(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
function openGuide(sourceId) {
  if (!$('guide').open) $('guide').showModal();
  if (sourceId) {
    const target = $('source-' + sourceId);
    target.focus();
    target.scrollIntoView({ block: 'nearest' });
  }
}
function sourceLink(id) {
  const source = sources[id];
  const link = element('a', 'source-link', source.authors ? `${source.authors} (${source.year})` : source.title);
  link.href = '#source-' + id;
  link.onclick = event => { event.preventDefault(); openGuide(id); };
  return link;
}
function claimView(id) {
  const claim = claims[id];
  const article = element('article', 'claim');
  article.append(element('span', 'evidence-badge', evidenceTypes[claim.evidenceType]));
  article.append(element('p', '', claim.text));
  article.append(element('p', 'claim-meta', `${claim.method} · ${claim.conditions}`));
  if (claim.organism) article.append(element('p', 'claim-meta', `Scope: ${claim.organism}${claim.strain ? ' · ' + claim.strain : ''}`));
  article.append(element('p', 'claim-meta', claim.limitations));
  const citations = element('div', 'source-links');
  claim.sourceIds.forEach(id => citations.append(sourceLink(id)));
  article.append(citations);
  return article;
}
function potentialView(c) {
  const article = element('article', 'potential-evidence');
  article.append(element('strong', '', `${c.name} · ${categories[c.category]}`));
  article.append(element('p', '', `${potential(c)}${c.uncertainty === null ? '' : ' ± ' + c.uncertainty.toFixed(3)} V · ${evidenceTypes[c.potentialEvidenceType]}`));
  article.append(element('p', 'claim-meta', c.referenceConditions));
  const citations = element('div', 'source-links');
  c.potentialSourceIds.forEach(id => citations.append(sourceLink(id)));
  article.append(citations);
  return article;
}
function buildSourceCatalog() {
  for (const source of Object.values(sources)) {
    const article = element('article', 'source-record');
    article.id = 'source-' + source.id;
    article.tabIndex = -1;
    article.append(element('h4', '', source.title));
    article.append(element('p', '', `${source.authors || 'Author unavailable'} · ${source.year || 'Date unavailable'} · ${source.type.replaceAll('-', ' ')}`));
    article.append(element('p', '', `${source.location}. Access: ${source.access.replaceAll('-', ' ')}. ${source.verifiedOn ? 'Checked ' + source.verifiedOn + '.' : 'Primary provenance not verified.'}`));
    article.append(element('p', '', source.note));
    if (source.url) {
      const link = element('a', '', `Read source${source.doi ? ' · DOI ' + source.doi : ''} ↗`);
      link.href = source.url; link.target = '_blank'; link.rel = 'noopener';
      article.append(link);
    }
    if (source.openUrl) {
      const link = element('a', '', 'Author repository and supporting files ↗');
      link.href = source.openUrl; link.target = '_blank'; link.rel = 'noopener';
      const line = element('p'); line.append(link); article.append(line);
    }
    $('sourceCatalog').append(article);
  }
}
function buildCoupleViews() {
  $('tower').replaceChildren();
  $('libraryCards').replaceChildren();
  for (const c of couples) {
    const row = element('button', 'tower-row');
    row.id = 'row-' + c.id;
    const t = (c.e + .43) / 1.25;
    row.style.setProperty('--row', t < .4 ? '#b9ba83' : t < .7 ? '#9ebda0' : '#90b5b6');
    row.style.setProperty('--wash', t < .4 ? '#f3f3e8' : t < .7 ? '#eef4ea' : '#ecf4f2');
    row.onclick = () => {
      if (c.referenceOnly) { openGuide(); return; }
      if (!canUse(c, mode)) setMode('donor');
      if ($(mode).value === c.id) return;
      $(mode).value = c.id; render();
      setMode(mode === 'donor' ? 'acceptor' : 'donor');
    };
    $('tower').append(row);
    const card = element('article', 'library-card');
    card.id = 'card-' + c.id;
    card.append(element('h3', '', `${c.ox} / ${c.red}`));
    card.append(element('span', 'category-label', categories[c.category]));
    card.append(element('p', 'potential', `${potential(c)} V · ${c.n} e⁻${c.condition ? ' · ' + c.condition : ''}`));
    const origin = element('div', 'source-links');
    origin.append(element('span', 'dataset-label', datasets[dataset].label + ' · ' + evidenceTypes[c.potentialEvidenceType]));
    c.potentialSourceIds.forEach(id => origin.append(sourceLink(id)));
    card.append(origin);
    card.append(element('div', 'equation', equation(c.s)));
    card.append(element('p', '', c.note));
    const evidence = element('details', 'evidence-details');
    evidence.append(element('summary', '', 'Evidence and sources'));
    evidence.append(potentialView(c));
    c.claimIds.forEach(id => evidence.append(claimView(id)));
    card.append(evidence);
    if (c.referenceOnly) card.append(element('span', 'reference-note', 'Reference only · excluded from calculations'));
    for (const role of ['donor', 'acceptor']) {
      if (!canUse(c, role)) continue;
      const button = element('button', '', `Use as ${role} ↗`);
      button.onclick = () => { $(role).value = c.id; showTab('explore'); render(); };
      card.append(button);
    }
    $('libraryCards').append(card);
  }
}
function renderInterpretation(d, a, r, same) {
  const metabolism = !same && findMetabolism(d.id, a.id);
  $('preset').value = metabolism ? metabolism.id : 'custom';
  $('pairingKind').textContent = metabolism ? 'Curated teaching example' : 'Chemistry pairing';
  $('pairingDescription').textContent = metabolism
    ? `${metabolism.name}. This named example does not assign an organism or demonstrate growth.`
    : 'An arbitrary pairing of half-reactions. A favorable result alone does not establish a microbial metabolism.';
  $('interpretation').textContent = same ? 'Choose distinct couples to compare an energy change.'
    : d.photo || a.photo ? 'This estimates a single electron transfer between representative reaction-center states and their partners. Photon input and regeneration are excluded; it is not a whole-cell energy budget.'
    : r.de > 0 ? 'The displayed reaction releases free energy under these model conditions. This does not predict a biological pathway, growth, rate, or ATP yield.'
    : r.de < 0 ? 'The displayed direction requires energy under these model conditions. This does not rule out other conditions or coupling to an energy source.'
    : 'The modeled reaction has no net free-energy drive at these conditions. This does not describe a growth rate.';
  $('resultDataset').textContent = datasets[dataset].label + ' · pH 7 / 25 °C teaching model';
  $('resultProvenance').replaceChildren();
  const sourceIds = [...new Set([...d.potentialSourceIds, ...a.potentialSourceIds])];
  sourceIds.forEach(id => $('resultProvenance').append(sourceLink(id)));
  $('selectedEvidence').replaceChildren(potentialView(d), potentialView(a), claimView('energy'));
  if (metabolism) metabolism.claimIds.forEach(id => $('selectedEvidence').append(claimView(id)));
  if (d.id === 'tetrathionate' || a.id === 'tetrathionate') {
    $('selectedEvidence').append(claimView(dataset === 'reviewed' ? 'tetrathionate-reviewed' : 'tetrathionate-potential'));
  }
}
function render() {
  const d = couples.find(c => c.id === $('donor').value);
  const a = couples.find(c => c.id === $('acceptor').value);
  if (!canUse(d, 'donor') || !canUse(a, 'acceptor')) throw new Error('Unsupported donor or acceptor');
  for (const [role, c] of [['donor', d], ['acceptor', a]]) {
    const input = $(role + 'Q');
    input.disabled = !!c.photo;
    if (c.photo) input.value = 0;
    $(role + 'Category').textContent = categories[c.category];
  }
  const dq = +$('donorQ').value, aq = +$('acceptorQ').value;
  const r = calculate(d, a, dq, aq);
  $('donorDetail').textContent = `${d.red} → ${d.ox} · ${d.photo ? 'Eₘ' : 'E′'} ${signed(d.e - .05916 / d.n * dq, 3)} V`;
  $('acceptorDetail').textContent = `${a.ox} → ${a.red} · ${a.photo ? 'Eₘ' : 'E′'} ${signed(a.e - .05916 / a.n * aq, 3)} V`;
  $('oxidation').textContent = equation(scaled(d.s, -r.df));
  $('reduction').textContent = equation(scaled(a.s, r.af));
  const same = d.id === a.id;
  $('net').textContent = same ? 'Same couple selected — choose two different couples.' : equation(r.net);
  $('balanceNote').textContent = same ? 'No distinct donor–acceptor reaction.' : `${r.n} electrons cancel · balanced for atoms and charge`;
  $('deltaE').textContent = same ? '—' : signed(r.de, 3);
  $('deltaG').textContent = same ? '—' : signed(r.dg, 1);
  $('electronCount').textContent = same ? '' : `${r.n} e⁻ transferred`;
  $('energyStatus').textContent = same ? 'Choose a different partner' : r.de > 0 ? '↘ Energetically favorable' : r.de < 0 ? '↗ Energy input required' : '↔ At equilibrium';
  document.querySelector('.energy-card').classList.toggle('unfavorable', r.de <= 0 || same);
  $('energyText').textContent = same ? 'Each couple needs a distinct partner to build a net reaction.'
    : `${d.photo || a.photo ? 'ΔG ≈ −nFΔE' : `ΔG${dq || aq ? '′' : '°′'} = −nFΔE${dq || aq ? '′' : '°′'}`} · ${d.photo || a.photo ? 'Representative midpoint comparison · excitation energy excluded' : dq || aq ? 'Adjusted activity quotients' : 'Standard transformed conditions'} · per mole of net reaction as written`;
  $('ecology').textContent = d.photo || a.photo ? `${d.photo ? d.note : a.note} ${d.donorOnly ? 'Sustained flow requires light and donor regeneration.' : ''}`
    : same ? d.note : r.de <= 0 ? 'This direction is not thermodynamically favorable under the selected conditions. Changing activities or coupling to an energy source would be needed.'
    : `${a.note} ${[d, a].some(c => c.category === 'intracellular-carrier') ? 'This includes an intracellular carrier, so it illustrates electron transfer rather than a complete ecological metabolism.' : ''}`;
  for (const c of couples) {
    const row = $('row-' + c.id);
    const isD = c.id === d.id, isA = c.id === a.id;
    row.classList.toggle('selected-donor', isD);
    row.classList.toggle('selected-acceptor', isA);
    row.setAttribute('aria-label', `${c.ox} / ${c.red}, ${potential(c)} volts, ${categories[c.category]}${isD ? ', selected donor' : ''}${isA ? ', selected acceptor' : ''}${c.referenceOnly ? '. Open condition notes.' : `. Set as ${c.donorOnly ? 'donor' : mode}.`}`);
    const name = element('span');
    name.append(element('span', 'couple-name', `${c.ox} / ${c.red}`), element('span', 'tower-sub', `${c.n} e⁻`));
    if (c.condition) name.append(element('span', 'condition-tag', c.condition));
    if (isD) name.append(element('span', 'tag', 'DONOR'));
    if (isA) name.append(element('span', 'tag a', 'ACCEPTOR'));
    row.replaceChildren(name, element('span', 'potential', potential(c)));
  }
  $('donorQValue').textContent = dq.toFixed(1);
  $('acceptorQValue').textContent = aq.toFixed(1);
  renderInterpretation(d, a, r, same);
}
function setMode(next) {
  mode = next;
  for (const role of ['donor', 'acceptor']) {
    $(role + 'Mode').classList.toggle('active', role === mode);
    $(role + 'Mode').setAttribute('aria-pressed', role === mode);
  }
  render();
}
function preset() {
  const selected = metabolisms.find(m => m.id === $('preset').value);
  if (!selected) { render(); return; }
  $('donor').value = selected.donor;
  $('acceptor').value = selected.acceptor;
  $('donorQ').value = 0;
  $('acceptorQ').value = 0;
  render();
}
function updateVisibility() {
  const previous = { donor: $('donor').value, acceptor: $('acceptor').value };
  const visible = couples.filter(c => c.photo ? photosEnabled : expanded || !c.extra);
  for (const role of ['donor', 'acceptor']) {
    $(role).replaceChildren();
    for (const c of visible.filter(c => canUse(c, role))) $(role).add(new Option(role === 'donor' ? c.dname : c.aname, c.id));
    $(role).value = visible.some(c => c.id === previous[role] && canUse(c, role)) ? previous[role] : role === 'donor' ? 'hydrogen' : 'oxygen';
  }
  for (const c of couples) {
    const hidden = c.photo ? !photosEnabled : !expanded && !!c.extra;
    $('row-' + c.id).hidden = hidden;
    $('card-' + c.id).hidden = hidden;
  }
  $('coupleCount').textContent = visible.length;
  $('moreBtn').textContent = expanded ? 'Show less' : 'Show more! +7 chart entries';
  $('moreBtn').setAttribute('aria-expanded', expanded);
  $('extraNotes').hidden = !expanded;
  $('extraNotes').textContent = `Expanded entries include representative carriers and reference-only iron. Tetrathionate: ${dataset === 'historical' ? '+0.024 V · historical chart' : '+0.198 ± 0.004 V · reviewed measurement'}. See evidence and sources for conditions.`;
}
function showTab(tab) {
  $('explorer').hidden = tab !== 'explore';
  $('library').hidden = tab !== 'library';
  $('photosystems').hidden = tab !== 'photo';
  for (const name of ['explore', 'library', 'photo']) $(name + 'Tab').setAttribute('aria-selected', name === tab);
}
$('dataset').onchange = () => {
  dataset = $('dataset').value;
  couples = getCouples(dataset);
  $('datasetDescription').textContent = datasets[dataset].description;
  $('libraryDataset').textContent = datasets[dataset].label;
  buildCoupleViews(); updateVisibility(); render();
};
$('photosToggle').onchange = () => { photosEnabled = $('photosToggle').checked; updateVisibility(); render(); };
$('photoTab').onclick = () => {
  photosEnabled = true; $('photosToggle').checked = true;
  updateVisibility(); render(); showTab('photo');
};
$('moreBtn').onclick = () => { expanded = !expanded; updateVisibility(); render(); };
$('preset').replaceChildren(new Option('Custom chemistry pairing', 'custom'));
metabolisms.forEach(m => $('preset').add(new Option(m.name, m.id)));
$('preset').value = 'aerobic';
$('preset').onchange = preset;
for (const id of ['donor', 'acceptor']) $(id).onchange = render;
for (const id of ['donorQ', 'acceptorQ']) $(id).oninput = render;
$('donorMode').onclick = () => setMode('donor');
$('acceptorMode').onclick = () => setMode('acceptor');
$('reset').onclick = () => { $('preset').value = 'aerobic'; preset(); setMode('donor'); };
$('exploreTab').onclick = () => showTab('explore');
$('libraryTab').onclick = () => showTab('library');
for (const id of ['guideBtn', 'notesBtn']) $(id).onclick = () => openGuide();
$('ecologyEvidence').append(claimView('overlap'));
$('closeGuide').onclick = () => $('guide').close();
$('guide').onclick = event => {
  if (event.target !== $('guide')) return;
  const rect = $('guide').getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) $('guide').close();
};
buildSourceCatalog();
buildCoupleViews();
$('dataset').value = dataset;
$('datasetDescription').textContent = datasets[dataset].description;
$('libraryDataset').textContent = datasets[dataset].label;
updateVisibility(); preset(); setMode('donor');
