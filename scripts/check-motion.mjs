import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function load(relative) {
  const source = await readFile(new URL(relative, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { stepStar } = await load('../src/experience/particles.ts');
const { FlowField } = await load('../src/experience/flow-field.ts');
const { heightAt } = await load('../src/experience/terrain.ts');
const star = () => ({x:300,y:300,vx:4,vy:1,driftX:4,driftY:1,size:1,phase:0});
const away = {x:-1000,y:-1000,active:false};
const travel = star();
for(let i=0;i<3600;i++) stepStar(travel,away,1/60,i/60,4000,4000);
assert.ok(travel.x > 490, 'Undisturbed stars travel continuously over one minute');
const pushed = star(), reference = star();
for(let i=0;i<60;i++) {
  stepStar(pushed,{x:270,y:300,active:true},1/60,i/60,4000,4000);
  stepStar(reference,away,1/60,i/60,4000,4000);
}
const displacement = pushed.x-reference.x;
assert.ok(displacement>20, 'Nearby cursor pushes stars outward');
for(let i=60;i<360;i++) {
  stepStar(pushed,away,1/60,i/60,4000,4000);
  stepStar(reference,away,1/60,i/60,4000,4000);
}
assert.ok(pushed.x-reference.x>displacement*.9, 'Displaced stars never spring back home');
assert.ok(Math.abs(pushed.vx-reference.vx)<2, 'Stars settle back to a slow travelling speed');
const edge={...star(),x:1011.99,vx:10};
stepStar(edge,away,1/60,0,1000,1000);
assert.ok(edge.x<0&&edge.x>-12,'Stars cross the edge and continue on the other side');
const atRate=(rate)=>{
 const s=star(); for(let i=0;i<rate*3;i++) stepStar(s,{x:270,y:300,active:true},1/rate,i/rate,4000,4000); return s;
};
assert.ok(Math.abs(atRate(30).x-atRate(60).x)<4,'Star response is consistent at 30 and 60 Hz');
const field=new FlowField();
field.addStroke({fromX:.3,fromY:.5,toX:.7,toY:.5,seconds:.4},1.5);
const horizontal=field.sampleVelocity(.5,.5);
assert.ok(horizontal[0]>.02&&Math.abs(horizontal[1])<.000001,'Horizontal gesture produces horizontal flow');
for(const y of [.47,.53]){
 const velocity=field.sampleVelocity(.5,y);
 assert.ok(velocity[0]>0&&Math.abs(velocity[1])<.000001,'Flow beside a stroke stays directional, without cursor-centred rotation');
}
const initial=field.energy();
for(let i=0;i<180;i++)field.advance(1/30);
assert.ok(field.energy()<initial*.00001,'Current dissipates after input stops');
const vertical=new FlowField();
vertical.addStroke({fromX:.5,fromY:.3,toX:.5,toY:.7,seconds:.4},1.5);
const up=vertical.sampleVelocity(.5,.5);
assert.ok(Math.abs(up[0])<.000001&&up[1]>.02,'Vertical gesture preserves its direction');
const idle=new FlowField();
idle.addStroke({fromX:.5,fromY:.5,toX:.5,toY:.5,seconds:.1},1);
for(let i=0;i<60;i++)idle.advance(1/60);
assert.equal(idle.energy(),0,'Stationary cursor does not generate a permanent disturbance');
const layout={natureTop:3000,coastY:6000};
const row=(y)=>{const h=[];for(let x=0;x<1600;x+=8)h.push(heightAt(x,y,layout));return h;};
const mean=(h)=>h.reduce((a,b)=>a+b)/h.length;
const means=[3000,3800,4600,5400,6400,7400].map((y)=>mean(row(y)));
assert.ok(means.every((m,i)=>i===0||m<means[i-1]),'The land descends steadily from the Alps to the sea');
assert.ok(Math.min(...row(3000),...row(4600))>0,'No sea-level lakes appear among the mountains');
assert.ok(Math.max(...row(6600))<0,'Past the coastline everything is under water');
console.log('Motion checks passed: continuous drift, repulsion, no return anchor, wrapping, frame rates, directional strokes, dissipation, idle stability, terrain descent.');
