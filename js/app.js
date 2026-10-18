import { MAX_BYTES, MIN_DIM } from "./config.js";
import { decide } from "./eligibility.js";
import { classify } from "./classifier.js";
import { evaluate, guideFor } from "./engine.js";
import { FINDINGS, QUOTES, PENDING_COUNT } from "./research.js";
const $ = document.getElementById("app"),
  esc = (s) =>
    String(s ?? "").replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
const NAMES = {
    short_sleeved_top: "short-sleeved top",
    long_sleeved_top: "long-sleeved top",
  },
  SEW = { none: "No sewing", hand: "Hand sewing" };
const fresh = (t) => ({
  token: t,
  url: "",
  phase: "empty",
  msg: "",
  f: { diff: 0, sew: "any", cat: "any", sort: "best" },
});
let S = fresh(0);
const reset = () => {
  const t = S.token + 1;
  if (S.url) URL.revokeObjectURL(S.url);
  S = fresh(t);
};
const $q = (s) => $.querySelector(s),
  on = (s, ev, fn) => $.querySelectorAll(s).forEach((e) => (e["on" + ev] = fn));
const KEY = "rethread:v1:progress";
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};
const save = (o) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(o));
  } catch {
    /* storage unavailable: progress lasts this visit only */
  }
};

function story() {
  const badge = (s) =>
    s === "verified"
      ? "Verified at publisher’s page"
      : "Confirmed via a secondary source";
  $.innerHTML = `<div class="story-hero"><p class="eyebrow">A second life, stitched by you</p><h1>Your old clothes aren’t the end of the <em>story.</em></h1>
  <p class="lede">What happens to a garment when we stop wearing it? Explore the evidence, hear from real people, and discover what one of your own tops could become.</p>
  <div class="hero-actions"><a class="btn" href="#/studio">Make something new</a><span class="hero-note">A little less waste. A lot more possibility.</span></div></div>
  <section aria-labelledby="ev"><h2 id="ev">The evidence</h2><p>Each figure was read at its source on the date shown. These are separate estimates with different scopes, so they are listed side by side rather than combined.</p>
  ${FINDINGS.map(
    (
      f,
    ) => `<article class="box"><h3>${esc(f.label)}</h3><p class="big">${esc(f.value)}</p><p><small>${esc(f.unit)} · ${esc(f.geography)} · period: ${esc(f.period)}<br>${badge(f.status)}</small></p>
  <details><summary>Source, method and limits</summary><p><a href="${esc(f.url)}">${esc(f.title)}</a>, ${esc(f.publisher)}, ${esc(f.published)}.</p><p><strong>Method:</strong> ${esc(f.method)}</p><p><strong>Limits:</strong> ${esc(f.limits)}</p><p><small>Denominator: ${esc(f.denominator)}. Reviewed ${esc(f.reviewed)}.</small></p></details></article>`,
  ).join("")}
  <p><small>${PENDING_COUNT} further claims are withheld until they have been checked against their original sources. The study of upcycled workwear covers a fleece jacket, trousers and a hi-vis jacket, not T-shirts, so its savings should not be assumed for your top.</small></p></section>
  <section aria-labelledby="vo"><h2 id="vo">Voices</h2><p>One short, attributed quotation. It illustrates the human side of the industry and does not show how common any experience is.</p>
  ${QUOTES.map((q) => `<figure class="box"><blockquote>“${esc(q.text)}”</blockquote><figcaption>${esc(q.speaker)}<br><small>${esc(q.note)} <a href="${esc(q.url)}">${esc(q.publisher)}</a>, ${esc(q.date)}. ${esc(q.reuse)}</small></figcaption></figure>`).join("")}</section>
  <section aria-labelledby="co"><h2 id="co">One garment is not the whole answer</h2><p>Textile waste is a systemic problem. Changing one top is a practical personal step, not a solution to it.</p>
  <p><a class="btn" href="#/studio">Transform a garment</a></p></section>`;
}
const back = () =>
  `<p><button class="btn alt" id="again">Use a different photo</button></p>`;
function studio() {
  const head = `<h1>Transform a garment</h1><p>Upload one photo of a <strong>short-sleeved</strong> or <strong>long-sleeved</strong> top.</p>`,
    img = S.url
      ? `<img class="pv" src="${S.url}" alt="Your uploaded photo">`
      : "";
  const again = () => {
    const b = $q("#again");
    if (b)
      b.onclick = () => {
        reset();
        studio();
      };
  };
  if (S.phase === "empty" || S.phase === "error") {
    $.innerHTML =
      head +
      `<div class="drop" id="drop"><p>Drag a photo here, or</p><label class="btn" for="f">Choose or take a photo</label><input id="f" class="sr" type="file" accept="image/*" capture="environment"></div>
    <p class="err" role="alert">${esc(S.msg)}</p><p><small>Privacy: the photo is analysed in your browser and is never uploaded or saved. Your browser downloads the model and TensorFlow.js to do this. Only your checklist progress is saved on this device.</small></p>
    <p><small>How it works: a small image model suggests a category. It has no “not a top” option, so you always confirm. Then you enter measurements and ask for ideas.</small></p>`;
    const f = $q("#f"),
      d = $q("#drop");
    f.onchange = () => f.files[0] && pick(f.files[0]);
    d.ondragover = (e) => {
      e.preventDefault();
      d.classList.add("over");
    };
    d.ondragleave = () => d.classList.remove("over");
    d.ondrop = (e) => {
      e.preventDefault();
      d.classList.remove("over");
      e.dataTransfer.files[0] && pick(e.dataTransfer.files[0]);
    };
    return;
  }
  if (S.phase === "busy") {
    $.innerHTML = head + img + `<p role="status">Analysing…</p>`;
    return;
  }
  if (S.phase === "decided") {
    const d = S.d,
      top = d.ranked
        .slice(0, 3)
        .map((r) => `<li>${esc(r.label)}: ${(r.p * 100).toFixed(0)}%</li>`)
        .join("");
    const ask =
      d.status === "likely"
        ? `<p>The model suggests a <strong>${NAMES[d.suggested]}</strong>. It can’t tell tops from other garments, so please check.</p><button class="btn" data-c="${d.suggested}">Yes, it’s a ${NAMES[d.suggested]}</button> `
        : `<p>I’m not sure: ${d.reasons.map(esc).join(" ")}</p><p>If this is a single top, tell me which:</p><button class="btn" data-c="short_sleeved_top">Short-sleeved</button> <button class="btn" data-c="long_sleeved_top">Long-sleeved</button> `;
    $.innerHTML =
      head + img + `<div class="box"><ol>${top}</ol>${ask}</div>` + back();
    on("[data-c]", "click", (e) => {
      S.cat = e.target.dataset.c;
      S.phase = "configure";
      studio();
    });
    return again();
  }
  if (S.phase === "configure") {
    $.innerHTML =
      head +
      img +
      `<div class="box"><h2>Confirmed: ${NAMES[S.cat]}</h2><p>Photos can’t tell us exact sizes or fabric, so tell us about the garment. Lay it flat and measure in centimetres.</p>
    <p><label><input type="checkbox" id="knit"> Chunky or sweater-style knit (loose stitches that can unravel when cut)</label></p>
    <p><label>Body width, armpit to armpit <input id="w" type="number" min="1" inputmode="decimal"> cm</label></p>
    <p><label>Body length, collar seam to hem <input id="l" type="number" min="1" inputmode="decimal"> cm</label></p>
    ${S.cat === "long_sleeved_top" ? `<p><label>Sleeve length, shoulder seam to cuff <input id="s" type="number" min="1" inputmode="decimal"> cm</label></p>` : ""}
    <h3>Preferences (optional)</h3><p><label>Sewing skill <select id="skill"><option value="1">Beginner</option><option value="2">Intermediate</option><option value="3">Advanced</option></select></label></p>
    <p><label>Maximum time <select id="max"><option value="0">No limit</option><option value="30">30 min</option><option value="60">60 min</option><option value="120">2 hours</option></select></label></p>
    <p><label><input type="checkbox" id="nosew"> No-sew projects only</label></p><p><label><input type="checkbox" id="hand" checked> I can sew by hand</label> <label><input type="checkbox" id="mach"> I have a sewing machine</label></p>
    <button class="btn" id="go">Show recommendations</button></div>` +
      back();
    again();
    $q("#go").onclick = () => {
      const n = (id) => {
        const e = $q("#" + id),
          v = e && parseFloat(e.value);
        return Number.isFinite(v) ? v : undefined;
      };
      S.g = {
        sleeve: S.cat === "long_sleeved_top" ? "full" : "half",
        loopKnit: $q("#knit").checked,
        w: n("w"),
        l: n("l"),
        s: n("s"),
      };
      S.p = {
        skill: +$q("#skill").value,
        maxMinutes: +$q("#max").value,
        noSew: $q("#nosew").checked,
        hand: $q("#hand").checked,
        machine: $q("#mach").checked,
      };
      S.ev = evaluate(S.g, S.p);
      S.phase = "results";
      studio();
    };
    return;
  }
  if (S.phase === "guide") return guide(img);
  results(img);
}
function results(img) {
  const ev = S.ev,
    f = S.f,
    ok = ev.filter((e) => e.status === "ok"),
    miss = [
      ...new Set(
        ev.filter((e) => e.status === "needs").flatMap((e) => e.missing),
      ),
    ];
  const label = { w: "body width", l: "body length", s: "sleeve length" };
  let list = ok.filter(
    (e) =>
      (!f.diff || e.r.diff <= f.diff) &&
      (f.sew === "any" || (f.sew === "none") === (e.sew === "none")) &&
      (f.cat === "any" || e.r.cat === f.cat),
  );
  const by = {
    best: (a, b) => b.score - a.score,
    easy: (a, b) => a.r.diff - b.r.diff || a.r.minutes - b.r.minutes,
    time: (a, b) => a.r.minutes - b.r.minutes,
    cost: (a, b) => +a.r.buy(S.g) - +b.r.buy(S.g) || b.score - a.score,
  };
  list.sort(by[f.sort]);
  const opt = (id, cur, arr) =>
    `<label>${arr[0]} <select id="${id}">${arr[1].map(([v, t]) => `<option value="${v}"${String(v) === String(cur) ? " selected" : ""}>${t}</option>`).join("")}</select></label> `;
  let body;
  if (miss.length)
    body = `<div class="box" role="status"><p>I need your ${miss.map((m) => label[m]).join(" and ")} before I can say what is feasible. Please go back and enter it.</p><button class="btn" id="edit">Edit measurements</button></div>`;
  else if (!ok.length)
    body = `<div class="box" role="status"><h2>No project fits yet</h2><ul>${[...new Set(ev.flatMap((e) => e.reasons))].map((r) => `<li>${esc(r)}</li>`).join("")}</ul><p>Next steps: re-check your measurements, relax a preference, or try a larger top.</p><button class="btn" id="edit">Edit measurements and preferences</button></div>`;
  else
    body = `<div class="box"><strong>Filter</strong><br>${opt("fd", f.diff, [
      "Difficulty",
      [
        [0, "Any"],
        [1, "Easy"],
        [2, "Medium"],
      ],
    ])}${opt("fs", f.sew, [
      "Sewing",
      [
        ["any", "Any"],
        ["none", "No-sew"],
        ["sew", "Needs sewing"],
      ],
    ])}${opt("fc", f.cat, [
      "Type",
      [
        ["any", "Any"],
        ["bag", "Bag"],
        ["accessory", "Accessory"],
        ["wearable", "Wearable"],
      ],
    ])}${opt("so", f.sort, [
      "Sort",
      [
        ["best", "Best match"],
        ["easy", "Easiest"],
        ["time", "Least time"],
        ["cost", "Lowest extra cost"],
      ],
    ])}<button class="btn alt" id="rf">Reset</button></div>
    ${list.length ? list.map((e) => `<article class="box"><h2>${esc(e.r.name)}</h2><p>${esc(e.why)}</p><p><small>Difficulty ${e.r.diff}/3 · about ${e.r.minutes} min (estimate) · ${SEW[e.sew]} · match score ${e.score}/100 (a rough ranking, not a chance of success)</small></p><button class="btn" data-o="${e.r.id}">Open guide</button></article>`).join("") : `<p role="status">No projects match these filters. <button class="btn alt" id="rf2">Reset filters</button></p>`}`;
  $.innerHTML = `<h1>Ideas for your ${NAMES[S.cat]}</h1>${img}${body}<p><button class="btn alt" id="again">Use a different photo</button></p>`;
  const b = $q("#again");
  b.onclick = () => {
    reset();
    studio();
  };
  const ed = $q("#edit");
  if (ed)
    ed.onclick = () => {
      S.phase = "configure";
      studio();
    };
  const set = (id, k, num) => {
    const e = $q("#" + id);
    if (e)
      e.onchange = () => {
        S.f[k] = num ? +e.value : e.value;
        results(img);
      };
  };
  set("fd", "diff", 1);
  set("fs", "sew");
  set("fc", "cat");
  set("so", "sort");
  const rf = () => {
    S.f = fresh(0).f;
    results(img);
  };
  if ($q("#rf")) $q("#rf").onclick = rf;
  if ($q("#rf2")) $q("#rf2").onclick = rf;
  on("[data-o]", "click", (e) => {
    S.gid = e.target.dataset.o;
    S.phase = "guide";
    studio();
  });
}
function guide(img) {
  const e = S.ev.find((x) => x.r.id === S.gid),
    r = e.r,
    { steps, need } = guideFor(r, S.g),
    g = S.g;
  const id = [r.id, g.sleeve, +g.loopKnit, g.w, g.l, g.s || 0].join("|"),
    all = load(),
    st = all[id] || { m: [], s: [] };
  const li = (k, i, txt) =>
    `<li><label><input type="checkbox" data-k="${k}" data-i="${i}"${st[k][i] ? " checked" : ""}> ${txt}</label></li>`;
  $.innerHTML = `<p><button class="btn alt" id="bk">← Back to ideas</button></p><h1>${esc(r.name)}</h1>
  <p>${esc(e.why)} Difficulty ${r.diff}/3 · about ${r.minutes} min (estimate) · ${SEW[e.sew]}.</p>
  <section class="box"><h2>Measurements this plan uses</h2><p>${Object.entries(
    need,
  )
    .map(
      ([k, m]) =>
        `${{ w: "Body width", l: "Body length", s: "Sleeve length" }[k]}: you entered ${g[k]} cm (plan minimum ${m} cm)`,
    )
    .join(
      "; ",
    )}. Values marked “design value” are choices made by the plan, so adjust them to taste. Nothing here is measured from your photo.</p></section>
  <section class="box"><h2>Tools</h2><ul>${r.tools
    .map(esc)
    .map((t) => `<li>${t}</li>`)
    .join(
      "",
    )}${r.optTools.map((t) => `<li>${esc(t)} (optional)</li>`).join("")}</ul><h2>Materials</h2><ul>${[...r.mats, ...r.optMats.map((m) => m + " (optional)")].map((m, i) => li("m", i, esc(m))).join("")}</ul></section>
  <section class="box"><h2>Safety</h2><ul>${r.safety.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></section>
  <section><h2>Steps</h2><ol class="steps">${steps.map((s, i) => `<li><label><input type="checkbox" data-k="s" data-i="${i}"${st.s[i] ? " checked" : ""}> <strong>${esc(s.t)}</strong></label><p>${esc(s.d)}</p><p><small>Common mistake: ${esc(s.m)}<br>Check: ${esc(s.v)}</small></p></li>`).join("")}</ol></section>
  <section class="box"><h2>Final checks</h2><ul>${r.checks.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></section>
  <p><small>Progress is saved on this device only. <button class="btn alt" id="rs">Reset progress</button></small></p>`;
  $q("#bk").onclick = () => {
    S.phase = "results";
    studio();
  };
  on("input[data-k]", "change", (c) => {
    const k = c.target.dataset.k,
      i = +c.target.dataset.i;
    st[k][i] = c.target.checked;
    const a = load();
    a[id] = st;
    save(a);
  });
  $q("#rs").onclick = () => {
    const a = load();
    delete a[id];
    save(a);
    guide(img);
  };
}
async function pick(file) {
  const fail = (m) => {
    S.phase = "error";
    S.msg = m;
    studio();
  };
  if (!file.type.startsWith("image/"))
    return fail("Please choose an image file.");
  if (file.size > MAX_BYTES)
    return fail("That image is over 10 MB. Please choose a smaller one.");
  const token = ++S.token;
  if (S.url) URL.revokeObjectURL(S.url);
  S.url = URL.createObjectURL(file);
  S.phase = "busy";
  studio();
  const img = new Image();
  img.src = S.url;
  try {
    await img.decode();
    if (Math.min(img.naturalWidth, img.naturalHeight) < MIN_DIM)
      throw new Error("That image is too small to analyse.");
    const r = await classify(img);
    if (token !== S.token) return;
    S.d = decide(r.labels, r.probs);
    S.phase = "decided";
    studio();
  } catch (e) {
    if (token !== S.token) return;
    console.error(e.message);
    const u = S.url;
    S.url = "";
    URL.revokeObjectURL(u);
    fail(
      /decode|image/i.test(e.message)
        ? "That file could not be read as an image."
        : "Analysis failed: " + e.message + ". Please try again.",
    );
  }
}
function route() {
  const render = () => {
    const r = location.hash.replace(/^#\/?/, "");
    if (r === "") story();
    else {
      if (r !== "studio") history.replaceState(null, "", "#/studio");
      studio();
    }
    $.focus();
  };
  if (
    document.startViewTransition &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.startViewTransition(render);
  } else render();
}
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }),
  { threshold: 0.08, rootMargin: "0px 0px -35px 0px" },
);
const revealTargets =
  ".story-hero,.story-hero + section,.story-hero + section ~ section,.box,article,section";
new MutationObserver((records) =>
  records.forEach((record) =>
    record.addedNodes.forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const targets = [
        ...(node.matches(revealTargets) ? [node] : []),
        ...node.querySelectorAll(revealTargets),
      ];
      targets.forEach((target) => {
        target.classList.add("reveal");
        revealObserver.observe(target);
      });
    }),
  ),
).observe($, { childList: true, subtree: true });
let scrollQueued = false;
addEventListener(
  "scroll",
  () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      document.getElementById("scroll-progress").style.transform =
        `scaleX(${max > 0 ? scrollY / max : 0})`;
      scrollQueued = false;
    });
  },
  { passive: true },
);
$.addEventListener("pointermove", (event) => {
  const box = event.target.closest(".box");
  if (!box) return;
  const bounds = box.getBoundingClientRect();
  box.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
  box.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
});
addEventListener("hashchange", route);
route();
