// Single source of truth for model location and decision settings.
// Relative URL so it resolves under any GitHub Pages project subpath.
export const MODEL_BASE = new URL('../model/', import.meta.url).href
export const TFJS_URL = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.7.4/dist/tf.min.js' // version from metadata.json
export const INPUT_SIZE = 224 // overwritten from metadata.json at load time
// Maps normalized model labels to garment categories. null = no direct mapping, user must choose.
// The model has NO "other/unsupported" class, so nothing here can reject trousers etc.
export const LABEL_MAP = { 't-shirt': 'short_sleeved_top', 'full sleeve shirt': 'long_sleeved_top', 'knitted sweater': null }
// Unvalidated starting values. Evaluate on your own labelled photos before relying on them.
export const THRESHOLDS = { minTop: 0.8, minMargin: 0.3 }
export const MAX_BYTES = 10 * 1024 * 1024, MIN_DIM = 64
// Ranking weights (from the original prototype); a match score, NOT a probability of success.
export const WEIGHTS = { garment: 0.3, tools: 0.25, skill: 0.2, time: 0.15, budget: 0.1 }
