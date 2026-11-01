const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const core = require('../docs/core.js');
const {getCouples, sources, claims, categories, evidenceTypes, datasets, metabolisms, findMetabolism, canUse} = core;

for (const [id, source] of Object.entries(sources)) {
  assert.equal(id, source.id);
  for (const key of ['title','type','access','location','note']) assert.ok(source[key], id+'/'+key);
  if (source.url) assert.equal(new URL(source.url).protocol, 'https:');
}
for (const [id, claim] of Object.entries(claims)) {
  assert.equal(id, claim.id);
  assert.ok(evidenceTypes[claim.evidenceType]);
  assert.ok(claim.sourceIds.length);
  for (const sourceId of claim.sourceIds) assert.ok(sources[sourceId], id+'/'+sourceId);
  for (const key of ['text','method','conditions','limitations']) assert.ok(claim[key], id+'/'+key);
  assert.ok(Object.hasOwn(claim,'organism'));assert.ok(Object.hasOwn(claim,'strain'));
}
for (const dataset of Object.keys(datasets)) {
  for (const c of getCouples(dataset)) {
    assert.ok(categories[c.category]);assert.equal(c.datasetId,dataset);
    assert.ok(evidenceTypes[c.potentialEvidenceType]);assert.ok(c.referenceConditions);
    c.claimIds.forEach(id=>assert.ok(claims[id]));
    c.potentialSourceIds.forEach(id=>assert.ok(sources[id]));
    assert.equal(c.referenceOnly || false, c.category === 'reference-only');
    if(c.photo)assert.equal(c.category,'reaction-center-state');
  }
}
for (const m of metabolisms) {
  const all=getCouples();
  assert.ok(canUse(all.find(c=>c.id===m.donor),'donor'));
  assert.ok(canUse(all.find(c=>c.id===m.acceptor),'acceptor'));
  assert.equal(findMetabolism(m.donor,m.acceptor),m);
  m.claimIds.forEach(id=>assert.equal(claims[id].evidenceType,'teaching-summary'));
}
assert.equal(findMetabolism('glucose','nitrite'),null);
assert.equal(findMetabolism('oxygen','hydrogen'),null);
assert.throws(()=>getCouples('unknown'),RangeError);
const edited=getCouples('reviewed');
edited[0].e=999;edited[0].s.e=999;edited[0].claimIds.push('invalid');
assert.notEqual(getCouples('reviewed')[0].e,999);
assert.notEqual(getCouples('reviewed')[0].s.e,999);
assert.ok(!getCouples('reviewed')[0].claimIds.includes('invalid'));
assert.equal(getCouples().find(c=>c.id==='tetrathionate').e,.024);
// The browser entry point loads with no DOM, network, or module loader.
const sandbox={};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(require.resolve('../docs/core.js'),'utf8'),sandbox);
assert.equal(sandbox.RedoxCore.getCouples('reviewed').find(c=>c.id==='tetrathionate').e,.198);
assert.equal(sandbox.RedoxCore.calculate(sandbox.RedoxCore.getCouples().find(c=>c.id==='hydrogen'),sandbox.RedoxCore.getCouples().find(c=>c.id==='oxygen')).dg,-478.5656);
console.log('PASS: claim/source integrity, categories, curated-pair classification, dataset isolation, and DOM-free browser/CommonJS interfaces.');
