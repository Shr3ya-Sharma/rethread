// Curated plans adapted from the original prototype. Dimensions marked "design value" are choices of the plan, not facts about your garment.
export const seal = k => k ? 'Seal every raw cut edge at once with fray sealant or a tight zig-zag stitch; loosely knitted yarn unravels once cut.' : 'Stretch-pull each raw edge firmly so the jersey rolls into a clean curl.'
const S = (t, d, m, v) => ({ t, d, m, v })
const SAFE = ['Cut on a flat, stable surface and cut away from your body and hands.', 'Never cut a garment while wearing it: mark it on, take it off, then cut.']
export const RECIPES = [
  { id: 'tote', name: 'No-sew fringe tote bag', cat: 'bag', diff: 1, minutes: 45, sew: () => 'none', buy: c => c.loopKnit,
    tools: ['Fabric scissors', 'Tape measure', 'Chalk or fabric marker'], optTools: [], mats: ['Your top'], optMats: ['Fray sealant (advised for loosely knitted tops)'],
    safety: [...SAFE, 'Use fray sealant in a ventilated room.'], checks: ['No gaps in the base larger than a fingertip.', 'Handles are knotted at matching points on both sides.', 'Bag holds a light load without any knot slipping.'],
    need: c => ({ w: 35, l: 45, ...(c.full ? { s: 40 } : {}) }),
    steps: c => [
      S('Measure and mark', `Lay the top flat with the front up. Confirm your flat width (${c.w} cm) and length (${c.l} cm), then chalk a centre line from collar to hem.`, 'Measuring with the fabric stretched.', 'Both numbers match what you entered.'),
      S('Remove the sleeves', c.full ? `Cut each sleeve off just outside the armhole seam, one at a time. Keep both: they become handles and each needs at least 40 cm of length (yours: ${c.s} cm).` : 'Cut each sleeve off just outside the armhole seam, one at a time, leaving the shoulder seams whole. The shoulder bands become the handles.', 'Cutting inside the seam, which narrows the bag.', 'Both shoulder seams are intact.'),
      S('Cut the opening', `Mark a U-shaped opening centred on the collar: ${c.w - 12} cm wide (your width minus a 6 cm shoulder band each side) and 12 cm deep below the shoulder seam (design value). Cut front and back together.`, 'Cutting the opening wider than marked, leaving thin bands.', 'Each shoulder band is at least 6 cm wide.'),
      S('Cut the base fringe', 'Turn the top inside out. Chalk a line 7.5 cm above the hem (design value). Cut slits 2.5 cm apart from the hem up to the line, through both layers.', 'Cutting past the line.', 'Front and back slits line up.'),
      S('Knot the base', 'Tie each front strip to the matching back strip in a double knot. Then tie a second row, pairing neighbouring strips across the first row to close gaps.', 'Leaving gaps between knots.', 'Hold it to the light: no gaps larger than a fingertip.'),
      ...(c.full ? [S('Add sleeve handles', 'Cut each sleeve open along the underarm seam and in half lengthwise. Twist each half into a rope and double-knot it to the opening edge, centred on each shoulder band.', 'Uneven handle lengths.', 'Both handles hang at the same length.')] : []),
      S('Finish the edges', seal(c.loopKnit), 'Leaving raw knit edges unsealed.', 'No loose yarn ends.'),
      S('Load test', 'Add a light load first and increase gradually; re-tie any knot that slips.', 'Starting with heavy items.', 'No knot slips.')] },
  { id: 'scarf', name: 'Infinity loop scarf', cat: 'accessory', diff: 1, minutes: 30, sew: c => c.full ? 'hand' : 'none', buy: () => false,
    tools: ['Fabric scissors', 'Tape measure', 'Chalk or fabric marker'], optTools: ['Needle (needed for the long-sleeve version)'], mats: ['Your top'], optMats: ['Thread (long-sleeve version)', 'Fray sealant'],
    safety: SAFE, checks: ['The loop lies flat with no twist.', 'Edges are sealed or rolled.', 'Seams (long-sleeve version) tug-test without opening.'],
    need: c => ({ w: 40, l: 50, ...(c.full ? { s: 45 } : {}) }),
    steps: c => [
      S('Mark the cut line', `Lay the top flat. Chalk a line straight across the body 2 cm below where the underarm seams meet the side seams (design value). Measure from the hem up to the line at both sides and the centre; the three numbers must match. The ring will be ${c.w * 2} cm around (twice your width).`, 'A line that slopes.', 'All three hem-to-line measurements agree.'),
      S('Cut the body ring', 'Cut along the chalk line through both layers, removing shoulders and sleeves.', 'Cutting at a slant, so the ring is uneven.', 'The cut edge is level all the way around.'),
      ...(c.full ? [
        S('Flatten the sleeves', `Cut each sleeve open along its underarm seam so it lies flat (each is ${c.s} cm long at least).`, 'Cutting off the cuffs.', 'Both sleeves lie flat.'),
        S('Join into one loop', 'Cut the ring open along one side seam. Lay a flat sleeve at each end, overlapping 1 cm (design value), and stitch each join with small backstitches. Then stitch the two free ends together to close the loop.', 'Long stitches that gap.', 'Each join survives a firm tug.')]
        : [S('Optional fringe', 'Make 2.5 cm cuts (design value) spaced 1 cm apart along both open edges.', 'Cuts deeper than planned.', 'Fringe is even.')]),
      S('Finish the edges', seal(c.loopKnit), 'Skipping this on knits.', 'No loose yarn ends.')] },
  { id: 'beanie', name: 'Two-panel beanie', cat: 'wearable', diff: 2, minutes: 60, sew: () => 'hand', buy: () => false,
    tools: ['Fabric scissors', 'Needle', 'Pins', 'Paper and pencil'], optTools: ['Sewing machine'], mats: ['Your top', 'Thread', 'A beanie that fits you, as a template'], optMats: ['Fray sealant'],
    safety: [...SAFE, 'Keep pins in a pin cushion.'], checks: ['Seam survives a gentle stretch over your head.', 'Both panels match in size.'],
    need: () => ({ w: 30, l: 30 }),
    steps: c => [
      S('Trace the template', 'Lay a beanie that fits you flat and trace one side on paper. Add 1.5 cm (design value) seam allowance all round and cut the paper pattern.', 'Forgetting the seam allowance.', 'The paper pattern is larger than the beanie outline on every edge.'),
      S('Place the pattern', `Lay the top flat with the front and back layers aligned. Pin the pattern on the body (${c.w}×${c.l} cm), with the long side following the vertical columns of stitches so the stretch goes around your head. If the pattern does not fit, do not cut.`, 'Placing across the grain, so the hat will not stretch.', 'The whole pattern sits on the body with fabric to spare.'),
      S('Cut two panels', 'Cut around the pattern through both layers at once so the panels match.', 'Layers shifting while cutting.', 'Both panels are the same shape.'),
      S('Stitch the curve', 'Place right sides together. Stitch around the curved edge with small backstitches, 1.5 cm in from the edge, leaving the bottom open.', 'Stitching on the wrong side.', 'No gaps along the curve.'),
      S('Finish the edges', seal(c.loopKnit), 'Leaving raw ends loose.', 'No loose yarn.'),
      S('Turn and fold the brim', 'Turn right side out. Fold up the bottom edge by 4 cm (design value) for the brim.', 'A brim too tight to put on.', 'It stretches over your head.')] },
  { id: 'tank', name: 'Cut-off tank top', cat: 'wearable', diff: 1, minutes: 30, sew: () => 'none', buy: () => false,
    tools: ['Fabric scissors', 'Tape measure', 'Chalk or fabric marker'], optTools: ['A helper for marking'], mats: ['Your top'], optMats: ['Fray sealant'],
    safety: SAFE, checks: ['Both armholes are mirror images.', 'Straps are at least 5 cm wide.'],
    need: () => ({ w: 40, l: 55 }),
    steps: c => [
      S('Mark while wearing', 'Put the top on and chalk the neckline depth and the inside edge of each armhole. Leave a strap at least 5 cm wide (design value). Take it off before cutting.', 'Cutting while still wearing it.', 'Marks are comfortable when you hold the top against you.'),
      S('Mirror the marks', `Fold the top in half along its centre line (width ${c.w} cm) and trace the left-side marks onto the right through both layers.`, 'Different marks on each side.', 'Marks are symmetrical.'),
      S('Cut', 'Cut the sleeves off along the armhole marks and cut the neckline along its mark.', 'Cutting off the straps by accident.', 'Straps are intact.'),
      S('Finish the edges', seal(c.loopKnit), 'Skipping this on knits.', 'Edges are sealed or rolled.'),
      ...(c.full ? [S('Optional sweatbands', 'Cut the cuff end of each sleeve into an 8 cm (design value) wide ring.', 'Too tight a band.', 'It fits your wrist or forehead.')] : [])] },
  { id: 'crop', name: 'Raw-edge crop top', cat: 'wearable', diff: 1, minutes: 20, sew: () => 'none', buy: () => false,
    tools: ['Fabric scissors', 'Tape measure', 'Chalk or fabric marker'], optTools: ['A helper for marking'], mats: ['Your top'], optMats: ['Fray sealant'],
    safety: SAFE, checks: ['The hem line is level.', 'Sleeve lengths match.'],
    need: c => ({ l: 55, ...(c.full ? { s: 45 } : {}) }),
    steps: c => [
      S('Mark the length', 'Put the top on and chalk the new hem at your chosen height. Take it off.', 'Cutting while wearing it.', 'The mark sits where you want it.'),
      S('Level the line', `Lay the top flat. Measure from the old hem up to your mark at the centre and at both sides (it is ${c.l} cm long now) and join the marks with a straight line.`, 'A line that slopes.', 'All three measurements agree.'),
      S('Cut', 'Cut straight along the line through both layers.', 'Uneven scissor strokes.', 'The edge is level.'),
      ...(c.full ? [S('Shape the sleeves', `Put the top on and mark the sleeve length you want. Lay a sleeve flat (${c.s} cm long) and cut across that mark, tilted 45° if you want a longer underside. Copy the first sleeve onto the second.`, 'Sleeves of different lengths.', 'Both sleeves match.')] : []),
      S('Finish the edges', seal(c.loopKnit), 'Skipping this on knits.', 'Edges are sealed or rolled.')] }
]
