import { RECIPES } from './recipes.js'
import { WEIGHTS } from './config.js'
export const DEFAULT_PREFS = { skill: 1, maxMinutes: 0, noSew: false, machine: false, hand: true }
const NAME = { w: 'body width', l: 'body length', s: 'sleeve length' }
const ok = v => typeof v === 'number' && Number.isFinite(v)
// g: { sleeve: 'half'|'full', loopKnit: bool, w, l, s } in cm. Never invents a measurement: a missing one gives status 'needs'.
export function evaluate(g, prefs = {}) {
  const p = { ...DEFAULT_PREFS, ...prefs }, c = { ...g, full: g.sleeve === 'full' }
  return RECIPES.map(r => {
    const need = r.need(c), missing = [], reasons = [], sew = r.sew(c)
    for (const k of ['w', 'l', 's']) if (ok(g[k]) && (g[k] <= 0 || g[k] > 300)) reasons.push(`The ${NAME[k]} you entered (${g[k]} cm) is not a plausible size.`)
    for (const [k, min] of Object.entries(need)) {
      if (!ok(g[k])) missing.push(k)
      else if (g[k] > 0 && g[k] <= 300 && g[k] < min) reasons.push(`Your ${NAME[k]} (${g[k]} cm) is under the ${min} cm a plan needs.`)
    }
    if (p.noSew && sew !== 'none') reasons.push('Some plans need stitching, but you chose no-sew.')
    if (sew !== 'none' && !p.hand && !p.machine) reasons.push('Some plans need stitching, but you have no way to sew.')
    if (p.maxMinutes && r.minutes > p.maxMinutes) reasons.push(`Some plans take longer than your ${p.maxMinutes}-minute limit.`)
    const status = reasons.length ? 'no' : missing.length ? 'needs' : 'ok'
    let score = 0, why = ''
    if (status === 'ok') {
      const roomy = Object.entries(need).every(([k, m]) => g[k] >= m * 1.25)
      const t = p.maxMinutes || 180
      score = Math.round(100 * (WEIGHTS.garment * (roomy ? 1 : 0.6) + WEIGHTS.tools * 1 + WEIGHTS.skill * (r.diff <= p.skill ? 1 : 0.5) + WEIGHTS.time * Math.max(0, 1 - r.minutes / (t * 1.5)) + WEIGHTS.budget * (r.buy(c) ? 0.5 : 1)))
      why = `Your ${g.sleeve === 'full' ? 'long' : 'short'}-sleeved top measures ${[g.w && g.w + ' cm wide', g.l && g.l + ' cm long'].filter(Boolean).join(' and ')}, which meets this plan’s minimums (${Object.entries(need).map(([k, m]) => NAME[k] + ' ' + m + ' cm').join(', ')}; design requirements, not tested standards).`
    }
    return { r, sew, status, missing, reasons, score, why }
  })
}
export const guideFor = (r, g) => { const c = { ...g, full: g.sleeve === 'full' }; return { steps: r.steps(c), need: r.need(c) } }
