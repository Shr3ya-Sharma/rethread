import test from 'node:test'; import assert from 'node:assert/strict'
import { evaluate, guideFor } from '../js/engine.js'; import { RECIPES } from '../js/recipes.js'
import { FINDINGS, QUOTES } from '../js/research.js'
const base = { sleeve: 'half', loopKnit: false, w: 50, l: 70 }, okIds = (g, p) => evaluate(g, p).filter(e => e.status === 'ok').map(e => e.r.id)
test('missing measurements ask for info and never recommend', () => {
  const e = evaluate({ sleeve: 'half', loopKnit: false }); assert.ok(e.every(x => x.status === 'needs')); assert.ok(e[0].missing.includes('w'))
})
test('long sleeves also require sleeve length', () => {
  assert.ok(evaluate({ ...base, sleeve: 'full' }).some(e => e.missing.includes('s')))
  assert.ok(okIds({ ...base, sleeve: 'full', s: 60 }).includes('scarf'))
})
test('small garments are rejected with reasons, not a fallback catalog', () => {
  const e = evaluate({ ...base, w: 20, l: 20 }); assert.equal(e.filter(x => x.status === 'ok').length, 0); assert.ok(e.some(x => x.reasons.length))
})
test('no-sew and time preferences are hard constraints', () => {
  assert.ok(!okIds(base, { noSew: true }).includes('beanie')); assert.ok(okIds(base, { noSew: true }).includes('tote'))
  assert.ok(okIds(base, { maxMinutes: 25 }).every(id => RECIPES.find(r => r.id === id).minutes <= 25))
  assert.equal(okIds(base, { noSew: false, hand: false, machine: false }).includes('beanie'), false)
})
test('implausible measurements are rejected', () => assert.equal(okIds({ ...base, w: 5000 }).length, 0))
test('every guide is complete, has no leaked placeholders, and uses only entered numbers', () => {
  for (const sleeve of ['half', 'full']) for (const r of RECIPES) {
    const g = { sleeve, loopKnit: sleeve === 'full', w: 50, l: 70, s: 60 }, { steps } = guideFor(r, g)
    assert.ok(steps.length >= 4 && r.safety.length && r.checks.length && r.tools.length)
    for (const s of steps) { assert.ok(s.t && s.d && s.m && s.v); assert.ok(!/undefined|NaN|\$\{/.test(s.t + s.d + s.m + s.v), r.id + ': ' + s.d) }
  }
})
test('score is bounded and only set for ok results', () => evaluate(base).forEach(e => assert.ok(e.status === 'ok' ? e.score > 0 && e.score <= 100 : e.score === 0)))
test('research records are complete and statuses honest', () => {
  for (const f of [...FINDINGS, ...QUOTES]) { assert.ok(['verified', 'secondary'].includes(f.status)); assert.ok(f.url.startsWith('https://') && f.reviewed && f.limits !== '') }
  for (const q of QUOTES) assert.ok(q.text.split(' ').length < 15)
})
