/* Hestenes–Stiefel (1952), section 19, Example 1. No remote data or persistence. */
(() => {
  "use strict";
  const ko = document.documentElement.lang === "ko";
  const t = (en, kr) => ko ? kr : en;
  const A = [[1, 2, -1, 1], [2, 5, 0, 2], [-1, 0, 6, 0], [1, 2, 0, 3]];
  const b = [0, 2, -1, 1], solution = [-65, 24, -11, 6];
  const dot = (u, v) => u.reduce((sum, value, i) => sum + value * v[i], 0);
  const multiply = v => A.map(row => dot(row, v));
  const add = (u, v, scale) => u.map((value, i) => value + scale * v[i]);
  const norm = v => Math.hypot(...v);
  // The sum-of-squares factorization avoids cancellation when measuring energy.
  const energy = v => Math.hypot(v[0] + 2*v[1] - v[2] + v[3], v[1] + 2*v[2], v[2] + v[3], v[3]);
  const fmt = value => value === 0 ? "0" : Number(value.toPrecision(8)).toString();
  const vector = v => `(${v.map(fmt).join(", ")})`;
  const precondition = (r, method) => method === "pcg" ? r.map((value, i) => value / A[i][i]) : r.slice();
  const NS = "http://www.w3.org/2000/svg";

  function iterate(start, method) {
    let x = [start, 0, 0, 0], r = add(b, multiply(x), -1);
    let z = precondition(r, method), p = z.slice(), rho = dot(r, z);
    const initialResidual = norm(r), initialEnergy = energy(add(x, solution, -1));
    const target = 1e-12 * Math.max(1, initialResidual);
    const records = [];
    let alpha = null, beta = null, reason = t("Iteration limit reached", "반복 횟수 제한에 도달했습니다");
    for (let k = 0; k <= 20; k++) {
      const trueResidual = add(b, multiply(x), -1), residualNorm = norm(trueResidual);
      const energyNorm = energy(add(x, solution, -1));
      records.push({x: x.slice(), residual: trueResidual, residualNorm, energyNorm,
        relativeResidual: residualNorm / initialResidual,
        relativeEnergy: energyNorm / initialEnergy, alpha, beta});
      if (residualNorm <= target) { reason = t("True residual reached the lab tolerance", "실제 잔차가 실험의 허용오차에 도달했습니다"); break; }
      if (k === 20) break;
      if (method === "sd") p = r.slice();
      const q = multiply(p), curvature = dot(p, q);
      if (!(curvature > 0) || !Number.isFinite(curvature) || !(rho > 0)) {
        reason = t("Numerical breakdown; no further iterate computed", "수치 계산이 중단되어 추가 반복값을 계산하지 않았습니다"); break;
      }
      alpha = method === "sd" ? dot(r, r) / curvature : rho / curvature;
      x = add(x, p, alpha);
      // Recompute r in steepest descent; CG uses its standard recurrence.
      r = method === "sd" ? add(b, multiply(x), -1) : add(r, q, -alpha);
      z = precondition(r, method);
      const rhoNew = dot(r, z);
      beta = method === "sd" ? null : rhoNew / rho;
      if (method !== "sd") p = add(z, p, beta);
      rho = rhoNew;
    }
    return {records, reason};
  }

  function element(parent, tag, attributes, text) {
    const el = document.createElementNS(NS, tag);
    for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, value);
    if (text !== undefined) el.textContent = text;
    parent.appendChild(el);
    return el;
  }

  function plot(svg, records, selected, id) {
    svg.replaceChildren();
    const maxX = Math.max(4, records.length - 1);
    const upper = Math.max(0, Math.ceil(Math.log10(Math.max(...records.map(r => r.relativeResidual)))));
    const lower = -14, left = 100, right = 610, top = 35, bottom = 315;
    const x = k => left + k * (right-left) / maxX;
    const y = v => bottom - (Math.log10(Math.max(1e-14, v))-lower) * (bottom-top)/(upper-lower);
    const defs = element(svg, "defs", {}), clip = element(defs, "clipPath", {id});
    element(clip, "rect", {x:left-5, y:top-5, width:right-left+10, height:bottom-top+10});
    const lines = element(svg, "g", {"clip-path":`url(#${id})`});
    for (let power = lower; power <= upper; power += 2) {
      const py = y(10**power);
      element(svg, "line", {x1:left, x2:right, y1:py, y2:py, class:"lab-grid"});
      element(svg, "text", {x:left-10, y:py+5, "text-anchor":"end"}, `10^${power}`);
    }
    if (upper % 2 !== 0) element(svg, "text", {x:left-10, y:top+5, "text-anchor":"end"}, `10^${upper}`);
    for (let k = 0; k <= maxX; k += Math.max(1, Math.ceil(maxX/5))) {
      element(svg, "text", {x:x(k), y:bottom+25, "text-anchor":"middle"}, String(k));
    }
    element(svg, "line", {x1:left, x2:right, y1:bottom, y2:bottom, class:"lab-axis"});
    element(svg, "line", {x1:left, x2:left, y1:top, y2:bottom, class:"lab-axis"});
    element(svg, "text", {x:left, y:20}, t("Relative norm (log scale)", "상대 노름 (로그 척도)"));
    element(svg, "text", {x:(left+right)/2, y:bottom+55, "text-anchor":"middle"}, t("Iteration k", "반복 단계 k"));
    for (const [key, color, dash] of [["relativeResidual", "#2563eb", ""], ["relativeEnergy", "#c65b08", "7 5"]]) {
      element(lines, "polyline", {points:records.map((r,k) => `${x(k)},${y(r[key])}`).join(" "),
        fill:"none", stroke:color, "stroke-width":3, "stroke-dasharray":dash});
      element(lines, "circle", {cx:x(selected), cy:y(records[selected][key]), r:5,
        fill:color, stroke:"currentColor", "stroke-width":1});
    }
    svg.setAttribute("aria-label", t(
      `Relative residual and energy error over ${records.length-1} iterations. Selected iteration ${selected}: residual ${fmt(records[selected].relativeResidual)}, energy error ${fmt(records[selected].relativeEnergy)}. Zero is plotted at 10 to the minus 14.`,
      `${records.length-1}번 반복한 상대 잔차와 에너지 오차. 선택한 단계 ${selected}: 잔차 ${fmt(records[selected].relativeResidual)}, 에너지 오차 ${fmt(records[selected].relativeEnergy)}. 0은 10의 마이너스 14제곱 위치에 표시합니다.`));
  }

  document.querySelectorAll("[data-cg-lab]").forEach((root, index) => {
    const field = name => root.querySelector(`[data-field="${name}"]`);
    const start = field("start"), method = field("method"), step = field("step");
    const next = root.querySelector('[data-action="next"]'), reset = root.querySelector('[data-action="reset"]');
    const output = root.querySelector("[data-matrices]"), status = root.querySelector("[data-status]");
    const svg = root.querySelector("svg"), explanation = root.querySelector("[data-explanation]");

    function render() {
      const value = start.valueAsNumber;
      const valid = Number.isFinite(value) && value >= -100 && value <= 100;
      start.setAttribute("aria-invalid", String(!valid));
      if (!valid) {
        status.textContent = t("Enter a finite starting coordinate between −100 and 100. Zero is allowed.", "−100부터 100 사이의 유한한 초기 좌표를 입력하세요. 0도 가능합니다.");
        output.textContent = ""; svg.replaceChildren();
        explanation.textContent = t("Restore the baseline or enter a valid value to continue.", "기준값을 복원하거나 유효한 값을 입력하면 계속할 수 있습니다.");
        step.disabled = true; next.disabled = true;
        return;
      }
      const {records, reason} = iterate(value, method.value);
      const last = records.length - 1;
      step.max = String(last); step.disabled = last === 0;
      const selected = Math.max(0, Math.min(Number(step.value), last));
      step.value = String(selected);
      root.querySelector("[data-step-label]").textContent = String(selected);
      next.disabled = selected >= last;
      const row = records[selected], baseline = method.value === "cg" && value === 1;
      status.textContent = t(
        `${baseline ? "Original-data baseline" : "Hypothetical experiment"}. Inspecting iteration ${selected} of ${last}. Run ended: ${reason}${last === 20 ? "; the displayed 20 steps may be insufficient." : "."}`,
        `${baseline ? "원문 자료 기준값" : "가상 실험"}. 전체 ${last}단계 중 ${selected}단계 확인 중. 전체 계산 종료 조건: ${reason}.${last === 20 ? " 표시된 20단계로는 충분하지 않을 수 있습니다." : ""}`);
      output.textContent = `x${selected} = ${vector(row.x)}\nb − A*x${selected} = ${vector(row.residual)}\n`+
        `${t("True residual norm", "실제 잔차 노름")} = ${fmt(row.residualNorm)}\n${t("Squared true residual norm", "실제 잔차 노름의 제곱")} = ${fmt(row.residualNorm**2)}\n`+
        `${t("Energy error norm", "에너지 오차 노름")} = ${fmt(row.energyNorm)}\n${t("Squared energy error norm", "에너지 오차 노름의 제곱")} = ${fmt(row.energyNorm**2)}\n`+
        `${t("Relative residual", "상대 잔차")} = ${fmt(row.relativeResidual)}\n${t("Relative energy error", "상대 에너지 오차")} = ${fmt(row.relativeEnergy)}\n`+
        (row.alpha === null ? t("No update yet.", "아직 갱신하지 않았습니다.") : `${t("Previous step α", "직전 보폭 α")} = ${fmt(row.alpha)}${row.beta === null ? "" : `; ${t("direction coefficient β", "방향 계수 β")} = ${fmt(row.beta)}`}`);
      explanation.textContent = method.value === "sd" ?
        t("Steepest descent minimizes along the new residual each time. On this system it makes slow progress in energy error; the graph does not promise convergence within 20 iterations.", "최급강하법은 매번 새 잔차 방향으로 최소화합니다. 이 연립방정식에서는 에너지 오차가 느리게 줄어듭니다. 그래프는 20단계 안의 수렴을 보장하지 않습니다.") :
        method.value === "pcg" ?
        t("Jacobi PCG divides residual coordinates by (1, 5, 6, 3). This modern comparison uses the same fixed system; a preconditioner need not improve every individual step.", "야코비 PCG는 잔차 성분을 (1, 5, 6, 3)으로 나눕니다. 같은 고정 연립방정식에 대한 현대적 비교이며, 전처리가 매 단계마다 개선을 보장하지는 않습니다.") :
        t("The residual can rise while energy error falls. On the original baseline, the exact squared energy errors are 66, 65, 29, 4, 0. Displayed small terminal errors reflect floating-point arithmetic.", "에너지 오차가 줄어도 잔차는 커질 수 있습니다. 원문 기준값에서 정확한 에너지 오차 제곱은 66, 65, 29, 4, 0입니다. 마지막에 표시되는 작은 오차는 부동소수점 산술 때문입니다.");
      plot(svg, records, selected, `cg-plot-${index}`);
    }
    [start, method].forEach(input => input.addEventListener("input", () => {step.value = "0"; render();}));
    step.addEventListener("input", render);
    next.addEventListener("click", () => {step.value = String(Number(step.value)+1); render();});
    reset.addEventListener("click", () => {start.value = "1"; method.value = "cg"; step.value = "0"; render();});
    root.querySelector(".wiki-lab-controls").hidden = false;
    root.querySelector(".wiki-lab-result").hidden = false;
    render();
  });
})();
