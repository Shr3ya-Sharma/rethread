import { LABEL_MAP, THRESHOLDS } from './config.js'
export const norm = s => String(s).trim().toLowerCase()
export function validateOutput(labels, probs) {
  if (!Array.isArray(labels) || labels.length === 0) throw new Error('No labels')
  if (probs.length !== labels.length) throw new Error(`Model returned ${probs.length} scores for ${labels.length} labels`)
  if (![...probs].every(p => Number.isFinite(p) && p >= 0 && p <= 1.0001)) throw new Error('Model scores are not valid probabilities')
}
// Never returns "approved". The model cannot reject non-tops, so the user must always confirm.
export function decide(labels, probs, t = THRESHOLDS) {
  validateOutput(labels, probs)
  const ranked = labels.map((l, i) => ({ label: l.trim(), p: probs[i] })).sort((a, b) => b.p - a.p)
  const [top, second] = ranked, mapped = LABEL_MAP[norm(top.label)] ?? null
  const reasons = []
  if (mapped === null) reasons.push(`The closest match, "${top.label}", is not a short- or long-sleeved top class this app can map automatically.`)
  if (top.p < t.minTop) reasons.push(`Top score ${(top.p * 100).toFixed(0)}% is below the ${(t.minTop * 100).toFixed(0)}% setting.`)
  if (second && top.p - second.p < t.minMargin) reasons.push(`"${top.label}" and "${second.label}" scored too close together.`)
  return { status: reasons.length ? 'uncertain' : 'likely', suggested: reasons.length ? null : mapped, ranked, reasons }
}
