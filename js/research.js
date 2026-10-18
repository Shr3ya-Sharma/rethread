// Every entry was read at the cited page on 2026-10-18. status: 'verified' = claim read on the publisher's own page;
// 'secondary' = confirmed only via an abstract or another site quoting it (original not opened).
// Claims not yet checked are withheld from the public site (see PENDING_COUNT).
const R = '2026-10-18'
export const FINDINGS = [
  { id: 'unep-60-half', label: 'Clothes bought vs. time worn', value: '60% more clothes bought, worn for half as long', unit: 'estimate', period: 'Not stated', geography: 'Global (as phrased by UNEP)', denominator: 'Not stated',
    title: 'The environmental costs of fast fashion', publisher: 'UNEP', url: 'https://www.unep.org/en/news-and-stories/story/environmental-costs-fast-fashion', published: '2022-11-24',
    method: 'Reported by UNEP as an estimate; the page does not name the underlying study.', limits: 'No baseline year or comparison group is given, so do not compare it with other figures.', status: 'verified', reviewed: R },
  { id: 'unep-truck', label: 'Textiles landfilled or burned', value: 'About one truckload every second', unit: 'estimate', period: 'Not stated', geography: 'Global', denominator: 'Not stated',
    title: 'The environmental costs of fast fashion', publisher: 'UNEP (citing the Ellen MacArthur Foundation)', url: 'https://www.unep.org/en/news-and-stories/story/environmental-costs-fast-fashion', published: '2022-11-24',
    method: 'UNEP attributes this estimate to the Ellen MacArthur Foundation.', limits: 'We read UNEP’s statement, not the original Foundation analysis. The truck size and year are not given.', status: 'verified', reviewed: R },
  { id: 'unep-ghg', label: 'Textile industry share of greenhouse gas emissions', value: '2–8%', unit: 'share of global emissions (range)', period: 'Not stated', geography: 'Global', denominator: 'Global greenhouse gas emissions',
    title: 'Minimizing fashion’s environmental footprint', publisher: 'UNEP Annual Report 2025', url: 'https://www.unep.org/annualreport/2025/stories/minimizing-fashions-environmental-footprint', published: '2026',
    method: 'Estimate range given by UNEP; underlying studies not named on the page.', limits: 'It describes the whole textile industry, not fast fashion alone, and the wide range reflects uncertainty.', status: 'verified', reviewed: R },
  { id: 'unep-water', label: 'Textile industry water use', value: '86 million Olympic-sized swimming pools a year', unit: 'volume, as an analogy', period: 'Per year', geography: 'Global', denominator: 'None',
    title: 'Minimizing fashion’s environmental footprint', publisher: 'UNEP Annual Report 2025', url: 'https://www.unep.org/annualreport/2025/stories/minimizing-fashions-environmental-footprint', published: '2026',
    method: 'Estimate stated by UNEP.', limits: 'Whole textile industry; no litre figure or water-source detail on the page.', status: 'verified', reviewed: R },
  { id: 'review-reuse', label: 'Reuse compared with recycling', value: 'Impacts of reuse were lower than those of recycling', unit: 'finding of a literature review', period: 'Studies reviewed up to 2024', geography: 'Mixed', denominator: '45 publications',
    title: 'Life cycle assessment applications to reuse, recycling and circular practices for textiles: A review', publisher: 'Waste Management (Abagnato, Rigamonti, Grosso, 2024)', url: 'https://re.public.polimi.it/handle/11311/1270090', published: '2024',
    method: 'Review of 45 publications that applied life cycle assessment.', limits: 'It is about reuse and recycling generally, not upcycling specifically. Results depend on the variables the review lists (use phase, what reuse replaces, transport).', status: 'verified', reviewed: R },
  { id: 'lca-upcycle', label: 'Upcycled workwear accessories vs. new products', value: '73%, 93% and 96% lower impact (three products)', unit: 'reduction across the study’s impact indicators', period: 'Study published 2026', geography: 'Luxembourg', denominator: 'Per product, vs. brand-new equivalents',
    title: 'The environmental performance of upcycling: A comparative life cycle assessment in the apparel industry', publisher: 'Next Sustainability, vol. 7 (2026)', url: 'https://researchportal.list.lu/publications/detail/the-environmental-performance-of-upcycling-a-comparative-life-cycle-assessment-in-the-apparel-industry', published: '2026',
    method: 'Life cycle assessment of three upcycled accessories. Percentages come from a summary page by the Luxembourg Upcycling Initiative; the abstract confirms the study design. The mean of the three (about 87%) is our arithmetic.', limits: 'Made from a fleece jacket, trousers and a hi-vis jacket, not T-shirts or similar tops. Electricity use and transport matter a lot, and the laptop sleeve falls below new-product performance if its life is cut by 80%.', status: 'secondary', reviewed: R },
  { id: 'hrw-sample', label: 'Garment worker interviews, Bangladesh', value: 'More than 160 workers in 44 factories', unit: 'interviews (sample size, not a prevalence)', period: 'Report published 2015', geography: 'Bangladesh', denominator: 'Not a representative sample',
    title: 'Whoever Raises Their Head Suffers the Most', publisher: 'Human Rights Watch', url: 'https://www.hrw.org/de/news/2015/04/22/bangladesch-arbeiter-zwei-jahre-nach-rana-plaza-ohne-rechte', published: '2015-04-22',
    method: 'Qualitative interviews. This link is HRW’s German press release; the report itself is linked in the sources note.', limits: 'Historical (2015) and not a measure of conditions in every factory today.', status: 'verified', reviewed: R }
]
export const QUOTES = [
  { id: 'hrw-q1', text: 'I was beaten with metal curtain rods in February when I was pregnant', speaker: 'A garment worker interviewed by Human Rights Watch (anonymous, as published)', kind: 'direct quotation',
    title: 'Bangladesh: government fails to keep workers safe (reprint of the HRW release)', publisher: 'Solidarity Center, reporting Human Rights Watch', url: 'https://solidaritycenter.org/hrw-bangladesh-government-fails-to-keep-workers-safe', date: '2015', geography: 'Bangladesh', theme: 'Working conditions',
    reuse: 'Short quotation with attribution. Checked against a reprint, not the HRW report itself.', note: 'Content note: describes violence.', status: 'secondary', reviewed: R }
]
export const PENDING_COUNT = 5 // not yet checked at source: Ellen MacArthur Foundation figures, UNIDO employment figures, Pakistan example, circular-economy value estimate, named-studio case studies
