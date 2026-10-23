const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('docs/app.js','utf8').split('const donorNames=')[0];
const context={document:{getElementById(){}}};vm.createContext(context);vm.runInContext(code+';globalThis.data={couples,calculate};',context);
const {couples,calculate}=context.data;
// Vectors are C, H, O, N, S, charge. NAD cofactors share a conserved backbone.
const atoms={CO2:[1,0,2,0,0,0],H:[0,1,0,0,0,1],e:[0,0,0,0,0,-1],glucose:[6,12,6,0,0,0],water:[0,2,1,0,0,0],H2:[0,2,0,0,0,0],methanol:[1,4,1,0,0,0],NAD:[0,0,0,0,0,1],NADH:[0,1,0,0,0,0],acetate:[2,3,2,0,0,-1],S:[0,0,0,0,1,0],H2S:[0,2,0,0,1,0],SO4:[0,0,4,0,1,-2],pyruvate:[3,3,3,0,0,-1],lactate:[3,5,3,0,0,-1],fumarate:[4,2,4,0,0,-2],succinate:[4,4,4,0,0,-2],NO3:[0,0,3,1,0,-1],NO2:[0,0,2,1,0,-1],N2:[0,0,0,2,0,0],O2:[0,0,2,0,0,0]};
// Carrier backbones are conserved; charges here are relative oxidation states.
Object.assign(atoms,{S4O6:[0,0,6,0,4,-2],S2O3:[0,0,3,0,2,-2],Q:[0,0,0,0,0,0],QH2:[0,2,0,0,0,0],cytbOx:[0,0,0,0,0,1],cytbRed:[0,0,0,0,0,0],cytcOx:[0,0,0,0,0,1],cytcRed:[0,0,0,0,0,0],cytaOx:[0,0,0,0,0,1],cytaRed:[0,0,0,0,0,0]});
for(const vector of Object.values(atoms))vector.push(0);
atoms.Fe3=[0,0,0,0,0,3,1];atoms.Fe2=[0,0,0,0,0,2,1];
function balanced(s,label){for(let i=0;i<7;i++)assert.equal(Object.entries(s).reduce((v,[k,n])=>v+atoms[k][i]*n,0),0,`${label}: vector ${i}`)}
for(const c of couples){balanced(c.s,c.id);assert.equal(-c.s.e,c.n)}
const selectable=couples.filter(c=>!c.referenceOnly);
assert.equal(couples.filter(c=>!c.extra).length,12);assert.equal(couples.filter(c=>c.extra).length,7);assert.equal(selectable.length,17);
for(const d of selectable)for(const a of selectable){const r=calculate(d,a);balanced(r.net,`${d.id}/${a.id}`);assert.equal(r.net.e,0);assert.equal(r.n%d.n,0);assert.equal(r.n%a.n,0);const reverse=calculate(a,d);assert.ok(Math.abs(r.dg+reverse.dg)<1e-9)}
const h=couples.find(c=>c.id==='hydrogen'),o=couples.find(c=>c.id==='oxygen'),s=couples.find(c=>c.id==='sulfate');
assert.equal(calculate(h,o).n,4);assert.ok(Math.abs(calculate(h,o).de-1.24)<1e-12);assert.ok(Math.abs(calculate(h,o).dg+478.5656)<1e-8);assert.equal(calculate(h,s).n,8);assert.ok(calculate(h,o,0,6).de<calculate(h,o).de);assert.ok(calculate(h,o,6,0).de>calculate(h,o).de);
assert.equal(couples.find(c=>c.id==='tetrathionate').e,.024);assert.equal(couples.find(c=>c.id==='cytb').e,.035);assert.ok(couples.filter(c=>c.id.startsWith('iron')).every(c=>c.referenceOnly));
console.log('PASS: 19 balanced formal half-reactions, 289 selectable pairings, 12 base + 7 extra entries, iron condition exclusions, chart precision, energy and Nernst checks.');
