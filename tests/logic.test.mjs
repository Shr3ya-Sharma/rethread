import test from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs'
import { decide } from '../js/eligibility.js'
const M = new URL('../model/', import.meta.url), rd = f => JSON.parse(fs.readFileSync(new URL(f, M)))
const meta = rd('metadata.json'), model = rd('model.json'), L = meta.labels
test('model artifacts agree with each other', () => {
  const w = model.weightsManifest[0].weights, bytes = w.reduce((a, x) => a + 4 * x.shape.reduce((p, q) => p * q, 1), 0)
  assert.equal(bytes, fs.statSync(new URL('weights.bin', M)).size)
  assert.deepEqual(model.weightsManifest[0].paths, ['weights.bin'])
  const head = model.modelTopology.config.layers.filter(l => l.class_name === 'Sequential').map(l => l.config.layers.at(-1)).find(l => l.class_name === 'Dense')
  assert.equal(head.config.units, L.length)
  assert.equal(L.length, 3); assert.equal(meta.imageSize, 224)
})
test('confident T-Shirt / Full Sleeve map to categories', () => {
  assert.equal(decide(L, [0.95, 0.03, 0.02]).suggested, 'short_sleeved_top')
  assert.equal(decide(L, [0.02, 0.96, 0.02]).suggested, 'long_sleeved_top')
})
test('Knitted Sweater never auto-maps, even when confident', () => {
  const d = decide(L, [0.02, 0.03, 0.95]); assert.equal(d.status, 'uncertain'); assert.equal(d.suggested, null)
})
test('low confidence and near-ties need clarification', () => {
  assert.equal(decide(L, [0.5, 0.3, 0.2]).status, 'uncertain')
  assert.equal(decide(L, [0.45, 0.44, 0.11]).status, 'uncertain')
})
test('malformed model output is rejected', () => {
  assert.throws(() => decide(L, [0.5, 0.5])); assert.throws(() => decide(L, [NaN, 0.5, 0.5])); assert.throws(() => decide([], []))
})
