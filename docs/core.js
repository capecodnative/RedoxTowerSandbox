/* Shared, DOM-free data and chemistry. Works with classic scripts and Node require. */
(function (root, factory) {
  const core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  else root.RedoxCore = core;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
const couples = [
{id:'glucose',name:'Glucose',ox:'CO₂',red:'C₆H₁₂O₆',e:-.43,n:24,s:{CO2:-6,H:-24,e:-24,glucose:1,water:6},note:'Organic carbon fuels diverse heterotrophic communities.'},
{id:'hydrogen',name:'Hydrogen',ox:'H⁺',red:'H₂',e:-.42,n:2,s:{H:-2,e:-2,H2:1},note:'Hydrogen links fermenters with hydrogen-oxidizing microbes in sediments, soils and biofilms.'},
{id:'methanol',name:'Methanol',ox:'CO₂',red:'CH₃OH',e:-.38,n:6,s:{CO2:-1,H:-6,e:-6,methanol:1,water:1},note:'Methylotrophs use one-carbon compounds such as methanol as electron donors.'},
{id:'nad',name:'NADH',ox:'NAD⁺',red:'NADH',e:-.32,n:2,s:{NAD:-1,H:-1,e:-2,NADH:1},note:'NADH is an intracellular electron carrier, rather than a typical external respiratory substrate.'},
{id:'acetate',name:'Acetate',ox:'CO₂',red:'CH₃COO⁻',e:-.28,n:8,s:{CO2:-2,H:-7,e:-8,acetate:1,water:2},note:'Acetate is a key fermentation product and electron donor in anoxic food webs.'},
{id:'sulfur',name:'Elemental sulfur',ox:'S⁰',red:'H₂S',e:-.28,n:2,s:{S:-1,H:-2,e:-2,H2S:1},note:'Sulfur cycling connects sulfide oxidizers with sulfur-reducing microorganisms.'},
{id:'sulfate',name:'Sulfate',ox:'SO₄²⁻',red:'H₂S',e:-.22,n:8,s:{SO4:-1,H:-10,e:-8,H2S:1,water:4},note:'Sulfate-reducing microorganisms thrive in many anoxic marine sediments and produce sulfide.'},
{id:'lactate',name:'Lactate',ox:'Pyruvate',red:'Lactate',e:-.19,n:2,s:{pyruvate:-1,H:-2,e:-2,lactate:1},note:'Lactate oxidation can supply electrons to anaerobic respiration; this couple represents only oxidation to pyruvate.'},
{id:'fumarate',name:'Fumarate',ox:'Fumarate',red:'Succinate',e:.03,n:2,s:{fumarate:-1,H:-2,e:-2,succinate:1},note:'Some facultative anaerobes respire fumarate, reducing it to succinate when oxygen is unavailable.'},
{id:'nitrite',name:'Nitrate → nitrite',ox:'NO₃⁻',red:'NO₂⁻',e:.42,n:2,s:{NO3:-1,H:-2,e:-2,NO2:1,water:1},note:'Nitrate reduction to nitrite is the entry step to several distinct microbial nitrogen pathways.'},
{id:'nitrogen',name:'Nitrate → nitrogen',ox:'NO₃⁻',red:'N₂',e:.74,n:10,s:{NO3:-2,H:-12,e:-10,N2:1,water:6},note:'Denitrifying communities can reduce nitrate through multiple intermediates to N₂, returning nitrogen to the atmosphere.'},
{id:'oxygen',name:'Oxygen',ox:'O₂',red:'H₂O',e:.82,n:4,s:{O2:-1,H:-4,e:-4,water:2},note:'Aerobic respiration uses oxygen as a terminal electron acceptor. Its high reduction potential allows a large energy drop with many donors.'}
];
// Extra chart entries are opt-in. Iron entries remain references because their
// condition-dependent shorthand is not a compatible fixed-species pH-7 model.
couples.push(
{id:'tetrathionate',name:'Tetrathionate',ox:'S₄O₆²⁻',red:'S₂O₃²⁻',e:.024,n:2,s:{S4O6:-1,e:-2,S2O3:2},extra:true,dname:'Thiosulfate',aname:'Tetrathionate',note:'Tetrathionate can serve as an electron acceptor and thiosulfate as a donor. Potential evidence identifies the value and provenance used by the selected dataset.'},
{id:'cytb',name:'Cytochrome b',ox:'Cyt b (ox)',red:'Cyt b (red)',e:.035,n:1,s:{cytbOx:-1,e:-1,cytbRed:1},extra:true,dname:'Cytochrome b (red)',aname:'Cytochrome b (ox)',note:'An intracellular one-electron heme carrier. +0.035 V is the chart’s representative value; actual midpoint potentials depend on the protein and its environment.'},
{id:'quinone',name:'Ubiquinone',ox:'Q',red:'QH₂',e:.11,n:2,s:{Q:-1,H:-2,e:-2,QH2:1},extra:true,dname:'Ubiquinol',aname:'Ubiquinone',note:'Ubiquinone accepts two electrons and two protons to form ubiquinol, a mobile membrane electron carrier. The chart gives +0.11 V.'},
{id:'iron7',name:'Iron (pH 7)',ox:'Fe³⁺',red:'Fe²⁺',e:.2,n:1,s:{Fe3:-1,e:-1,Fe2:1},extra:true,referenceOnly:true,condition:'pH 7 · reference',note:'The original chart gives +0.20 V at pH 7. Near neutral pH, iron potentials depend on mineral phases, ligands and speciation; free Fe³⁺/Fe²⁺ is only shorthand. Shown as a reference, excluded from reaction calculations.'},
{id:'cytc',name:'Cytochrome c',ox:'Cyt c (ox)',red:'Cyt c (red)',e:.25,n:1,s:{cytcOx:-1,e:-1,cytcRed:1},extra:true,dname:'Cytochrome c (red)',aname:'Cytochrome c (ox)',note:'An intracellular one-electron carrier connecting respiratory complexes. +0.25 V is a representative chart value, not a universal potential for every cytochrome c.'},
{id:'cyta',name:'Cytochrome a',ox:'Cyt a (ox)',red:'Cyt a (red)',e:.39,n:1,s:{cytaOx:-1,e:-1,cytaRed:1},extra:true,dname:'Cytochrome a (red)',aname:'Cytochrome a (ox)',note:'A heme center associated with terminal oxidases. +0.39 V is the original chart’s representative value; these carrier pairings illustrate electron transfer rather than whole-organism metabolisms.'},
{id:'iron2',name:'Iron (pH 2)',ox:'Fe³⁺',red:'Fe²⁺',e:.76,n:1,s:{Fe3:-1,e:-1,Fe2:1},extra:true,referenceOnly:true,condition:'pH 2 · reference',note:'The original chart gives +0.76 V under acidic conditions (pH 2). This value is displayed for comparison only and is excluded from the pH-7 reaction builder.'}
);
// Representative reaction-center midpoint potentials; excited-state entries
// describe a pre-excited donor, not a complete light-driven metabolism.
couples.push(
{id:'p680',name:'Photosystem II · P680',ox:'P680⁺',red:'P680',e:1.2,n:1,s:{P680plus:-1,e:-1,P680:1},photo:true,dname:'P680 (PSII)',aname:'P680⁺ (PSII)',condition:'PSII · ground state',note:'P680⁺ is a strong oxidant. Through redox-active tyrosine and the oxygen-evolving complex it can withdraw electrons from water. +1.20 V is a representative midpoint potential.'},
{id:'p680star',name:'Photosystem II · P680*',ox:'P680⁺',red:'P680*',e:-.6,n:1,s:{P680plus:-1,e:-1,P680star:1},photo:true,donorOnly:true,dname:'P680* (light-excited PSII)',condition:'PSII · light-excited',note:'P680* is produced by light absorption and donates an electron to the PSII acceptor chain. The approximate −0.60 V value describes an already excited state; the comparison excludes the photon energy needed to create it.'},
{id:'p700',name:'Photosystem I · P700',ox:'P700⁺',red:'P700',e:.5,n:1,s:{P700plus:-1,e:-1,P700:1},photo:true,dname:'P700 (PSI)',aname:'P700⁺ (PSI)',condition:'PSI · ground state',note:'P700⁺ is replenished by plastocyanin or cytochrome c₆ in oxygenic photosynthesis. +0.50 V is a representative midpoint potential; PSI alone does not provide the oxidation power needed to split water.'},
{id:'p700star',name:'Photosystem I · P700*',ox:'P700⁺',red:'P700*',e:-1.2,n:1,s:{P700plus:-1,e:-1,P700star:1},photo:true,donorOnly:true,dname:'P700* (light-excited PSI)',condition:'PSI · light-excited',note:'Light-excited P700* donates an electron through PSI acceptors toward ferredoxin. The approximate −1.20 V value describes an already excited state and excludes the energy of the absorbed photon.'}
);
const species={CO2:'CO₂',H:'H⁺',e:'e⁻',glucose:'C₆H₁₂O₆',water:'H₂O',H2:'H₂',methanol:'CH₃OH',NAD:'NAD⁺',NADH:'NADH',acetate:'CH₃COO⁻',S:'S⁰',H2S:'H₂S',SO4:'SO₄²⁻',pyruvate:'C₃H₃O₃⁻',lactate:'C₃H₅O₃⁻',fumarate:'C₄H₂O₄²⁻',succinate:'C₄H₄O₄²⁻',NO3:'NO₃⁻',NO2:'NO₂⁻',N2:'N₂',O2:'O₂',S4O6:'S₄O₆²⁻',S2O3:'S₂O₃²⁻',cytbOx:'Cyt b (ox)',cytbRed:'Cyt b (red)',cytcOx:'Cyt c (ox)',cytcRed:'Cyt c (red)',cytaOx:'Cyt a (ox)',cytaRed:'Cyt a (red)',Q:'Q',QH2:'QH₂',Fe3:'Fe³⁺',Fe2:'Fe²⁺',P680plus:'P680⁺',P680:'P680',P680star:'P680*',P700plus:'P700⁺',P700:'P700',P700star:'P700*'};

function equation(s){const side=sign=>Object.entries(s).filter(([,v])=>v*sign>0).map(([k,v])=>(Math.abs(v)===1?'':Math.abs(v)+' ')+species[k]).join(' + ');return side(-1)+' → '+side(1)}
function scaled(s,f){return Object.fromEntries(Object.entries(s).map(([k,v])=>[k,v*f]))}
function gcd(a,b){return b?gcd(b,a%b):a}
function calculate(d,a,dq=0,aq=0){const n=d.n*a.n/gcd(d.n,a.n),de=a.e-.05916/a.n*aq-(d.e-.05916/d.n*dq);const net=scaled(d.s,-n/d.n);for(const [k,v]of Object.entries(a.s))net[k]=(net[k]||0)+v*n/a.n;return{n,de,dg:-n*96.485*de,net,df:n/d.n,af:n/a.n}}

const donorNames=['Glucose','Hydrogen','Methanol','NADH','Acetate','Sulfide (S⁰ couple)','Sulfide (SO₄²⁻ couple)','Lactate','Succinate','Nitrite','Nitrogen gas','Water'];
const acceptorNames=['CO₂ (glucose couple)','Protons','CO₂ (methanol couple)','NAD⁺','CO₂ (acetate couple)','Elemental sulfur','Sulfate','Pyruvate','Fumarate','Nitrate → nitrite','Nitrate → nitrogen','Oxygen'];
couples.forEach((c,i)=>{c.dname=c.dname||donorNames[i];c.aname=c.aname||acceptorNames[i]});

// Evidence records and dataset definitions follow the original chart data.
const categories = {
  'environmental-substrate': 'Environmental substrate',
  'intracellular-carrier': 'Intracellular carrier',
  'reaction-center-state': 'Reaction-center state',
  'reference-only': 'Reference only'
};
const evidenceTypes = {
  'historical-chart': 'Historical chart',
  'teaching-summary': 'Teaching summary',
  'direct-measurement': 'Direct measurement',
  'observed-experiment': 'Observed in experiment',
  'model-result': 'Model result',
  'representative-value': 'Representative value'
};
const sources = {
  reactionCenters: {
    id: 'reactionCenters', title: 'Representative photosystem values in the existing field guide', authors: null, year: null,
    doi: null, url: null, type: 'local-teaching-notes', access: 'repository',
    location: 'Field guide · Photosystems and light', verifiedOn: null,
    note: 'Retained illustrative midpoint values. The guide links background papers by Ishikita et al. and Kato et al.; exact per-state measurement provenance is not established here.'
  },
  chart: {
    id: 'chart', title: 'Original teaching redox chart', authors: null, year: null,
    doi: null, url: null, type: 'teaching-chart', access: 'inherited-transcription',
    location: 'Original chart values transcribed in the existing site', verifiedOn: null,
    note: 'Original author, date, and primary measurement provenance are unavailable. Preserved for historical reproducibility.'
  },
  context: {
    id: 'context', title: 'Redox Fieldlab teaching notes', authors: null, year: null,
    doi: null, url: null, type: 'local-teaching-notes', access: 'repository',
    location: 'Couple library and five original presets', verifiedOn: null,
    note: 'Inherited educational context; not a strain-specific observation or independently verified primary evidence.'
  },
  model: {
    id: 'model', title: 'Redox Fieldlab calculation assumptions', authors: null, year: null,
    doi: null, url: null, type: 'local-model', access: 'repository',
    location: 'Field guide · Read the energy / Data & assumptions', verifiedOn: '2026-10-24',
    note: 'Balanced half-reactions; ΔG = −nFΔE; buffered pH 7 and a 25 °C Nernst coefficient. No growth, rate, or ATP-yield model.'
  },
  kurth2015: {
    id: 'kurth2015', authors: 'Kurth, Dahl & Butt', year: 2015,
    title: 'Catalytic Protein Film Electrochemistry Provides a Direct Measure of the Tetrathionate/Thiosulfate Reduction Potential',
    doi: '10.1021/jacs.5b08291', url: 'https://doi.org/10.1021/jacs.5b08291',
    openUrl: 'https://research-portal.uea.ac.uk/en/publications/catalytic-protein-film-electrochemistry-provides-a-direct-measure/',
    type: 'original-research', access: 'indexed-article-text-and-author-abstract',
    location: 'Figure 2 and accompanying pH-dependence discussion', verifiedOn: '2026-10-24',
    note: 'Formal potential versus SHE; pH 5–7; concentration-based Nernst analysis. Experimental temperature was not verified from the accessible text.'
  },
  chen2017: {
    id: 'chen2017', authors: 'Chen et al.', year: 2017,
    title: 'Impacts of chemical gradients on microbial community structure',
    doi: '10.1038/ismej.2016.175', url: 'https://www.nature.com/articles/ismej2016175',
    type: 'original-research', access: 'abstract-and-introduction',
    location: 'Abstract · coastal-sediment chemostat experiment', verifiedOn: '2026-10-24',
    note: 'Evidence concerns the studied laboratory community; it does not establish activity for every favorable tower pairing.'
  }
};
const claims = {
  energy: {
    id: 'energy', text: 'The sign of ΔG describes the direction of an energy change for the displayed reaction under the selected model conditions.',
    evidenceType: 'model-result', sourceIds: ['model'], organism: null, strain: null,
    method: 'Balanced electron transfer and ΔG = −nFΔE', conditions: 'Buffered pH 7; 25 °C teaching model',
    limitations: 'Does not establish a biological pathway, ATP yield, reaction rate, or growth.'
  },
  overlap: {
    id: 'overlap', text: 'Aerobic and anaerobic activity occurred together in a laboratory community exposed to oxygen gradients.',
    evidenceType: 'observed-experiment', sourceIds: ['chen2017'], organism: 'Coastal marine sediment community', strain: null,
    method: 'Chemostat experiment; molecular analyses and isotope incubations', conditions: '100 days of tidal cycling',
    limitations: 'A redox ranking is not a universal prediction of community succession.'
  },
  'tetrathionate-reviewed': {
    id: 'tetrathionate-reviewed', text: 'The measured tetrathionate/thiosulfate formal potential is +0.198 ± 0.004 V versus SHE.',
    evidenceType: 'direct-measurement', sourceIds: ['kurth2015'], organism: 'Purified TsdA enzymes', strain: null,
    method: 'Protein-film electrochemistry', conditions: 'pH 5–7; temperature not verified',
    limitations: 'Used here as an approximate reference with the 25 °C teaching equation; no temperature or activity-coefficient correction is applied.'
  }
};
for (const c of couples) {
  c.category = c.referenceOnly ? 'reference-only' : c.photo ? 'reaction-center-state'
    : ['nad', 'cytb', 'cytc', 'cyta', 'quinone'].includes(c.id) ? 'intracellular-carrier' : 'environmental-substrate';
  c.potentialKind = c.photo || c.category === 'intracellular-carrier' ? 'Representative midpoint' : 'Chart reduction potential';
  c.referenceConditions = c.referenceOnly ? c.condition : c.photo ? 'Representative reaction-center state; excitation input excluded' : 'Buffered pH 7; 25 °C teaching reference';
  c.potentialEvidenceType = c.photo ? 'representative-value' : 'historical-chart';
  c.potentialSourceIds = c.photo ? ['reactionCenters'] : ['chart'];
  c.uncertainty = null;
  c.claimIds = [c.id + '-potential', c.id + '-context'];
  claims[c.id + '-potential'] = {
    id: c.id + '-potential', text: c.name + ': ' + c.e + (c.photo ? ' V in the existing representative teaching entry.' : ' V in the original teaching chart.'),
    evidenceType: c.potentialEvidenceType, sourceIds: [...c.potentialSourceIds], organism: null, strain: null,
    method: c.photo ? 'Inherited representative midpoint' : 'Inherited chart transcription', conditions: c.referenceConditions,
    limitations: c.referenceOnly ? 'Reference only; excluded from calculations.' : c.photo ? 'Approximate midpoint; not a universal standard potential.' : 'Rounded teaching value; primary measurement provenance not established.'
  };
  claims[c.id + '-context'] = {
    id: c.id + '-context', text: c.note, evidenceType: 'teaching-summary',
    sourceIds: ['context'], organism: null, strain: null, method: 'Inherited educational summary',
    conditions: 'General context; no strain-specific experiment specified',
    limitations: 'Does not demonstrate that an arbitrary pairing is a biological metabolism.'
  };
}
const metabolisms = [
  { id: 'aerobic', name: 'Aerobic hydrogen oxidation', donor: 'hydrogen', acceptor: 'oxygen' },
  { id: 'denitrification', name: 'Hydrogen-driven denitrification', donor: 'hydrogen', acceptor: 'nitrogen' },
  { id: 'sulfate', name: 'Hydrogen-driven sulfate reduction', donor: 'hydrogen', acceptor: 'sulfate' },
  { id: 'methanol', name: 'Aerobic methanol oxidation', donor: 'methanol', acceptor: 'oxygen' },
  { id: 'acetate', name: 'Aerobic acetate oxidation', donor: 'acetate', acceptor: 'oxygen' }
];
for (const m of metabolisms) {
  const id = m.id + '-preset';
  m.claimIds = [id];
  claims[id] = {
    id, text: m.name + ' is a curated teaching example using the selected donor and acceptor.',
    evidenceType: 'teaching-summary', sourceIds: ['context', 'model'], organism: null, strain: null,
    method: 'Selected reaction pair, not a biological assay', conditions: 'Buffered pH 7; 25 °C teaching model',
    limitations: 'No organism, strain, carbon-assimilation pathway, or measured rate is assigned.'
  };
}
const datasets = {
  historical: {
    id: 'historical', label: 'Historical chart',
    description: 'Original chart values, including tetrathionate at +0.024 V. Preserves the original calculations.'
  },
  reviewed: {
    id: 'reviewed', label: 'Reviewed data',
    description: 'Tetrathionate uses +0.198 ± 0.004 V from Kurth et al. (2015). Other chart values are retained; this is not a review of every potential.'
  }
};

function getCouples(dataset = 'historical') {
  if (!datasets[dataset]) throw new RangeError('Unknown dataset: ' + dataset);
  return couples.map(c => {
    const copy = { ...c, s: { ...c.s }, claimIds: [...c.claimIds], potentialSourceIds: [...c.potentialSourceIds], datasetId: dataset };
    if (dataset === 'reviewed' && c.id === 'tetrathionate') {
      Object.assign(copy, {
        e: .198, uncertainty: .004, potentialKind: 'Measured formal potential',
        potentialEvidenceType: 'direct-measurement', potentialSourceIds: ['kurth2015'],
        referenceConditions: 'Versus SHE; pH 5–7; experimental temperature not verified. Approximate use in the 25 °C teaching model; no temperature correction.',
        claimIds: ['tetrathionate-reviewed', c.id + '-context']
      });
    }
    return copy;
  }).sort((a, b) => a.e - b.e);
}
function canUse(couple, role) {
  return !!couple && ['donor', 'acceptor'].includes(role) && !couple.referenceOnly && !(role === 'acceptor' && couple.donorOnly);
}
function findMetabolism(donorId, acceptorId) {
  return metabolisms.find(m => m.donor === donorId && m.acceptor === acceptorId) || null;
}
function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}
// calculate() is formal chemical bookkeeping and permits reverse calculations.
// Consumers enforce biological/UI eligibility with canUse(), not with ΔG.
return deepFreeze({
  species, categories, evidenceTypes, sources, claims, datasets, metabolisms,
  getCouples, canUse, findMetabolism, calculate, equation, scaled
});
});
