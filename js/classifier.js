import { MODEL_BASE, TFJS_URL } from './config.js'
let loading = null
const loadScript = src => new Promise((res, rej) => { if (window.tf) return res(); const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load TensorFlow.js')); document.head.append(s) })
export function loadModel() { // loaded once; a failed load is retried next time
  return loading ??= (async () => {
    await loadScript(TFJS_URL)
    const [meta, model] = await Promise.all([fetch(MODEL_BASE + 'metadata.json').then(r => { if (!r.ok) throw new Error('metadata.json ' + r.status); return r.json() }), tf.loadLayersModel(MODEL_BASE + 'model.json')])
    const n = model.outputs[0].shape[1]
    if (n !== meta.labels.length) throw new Error(`Model has ${n} outputs but metadata lists ${meta.labels.length} labels`)
    return { model, labels: meta.labels, size: meta.imageSize || 224 }
  })().catch(e => { loading = null; throw e })
}
// Same preprocessing as Teachable Machine image models: centre-crop square, resize, scale to [-1, 1].
export async function classify(img) {
  const { model, labels, size } = await loadModel()
  const probs = tf.tidy(() => {
    const x = tf.browser.fromPixels(img), [h, w] = x.shape, s = Math.min(h, w)
    const c = x.slice([Math.floor((h - s) / 2), Math.floor((w - s) / 2), 0], [s, s, 3])
    return model.predict(tf.image.resizeBilinear(c.toFloat(), [size, size]).div(127).sub(1).expandDims(0))
  })
  try { return { labels, probs: Array.from(await probs.data()) } } finally { probs.dispose() }
}
