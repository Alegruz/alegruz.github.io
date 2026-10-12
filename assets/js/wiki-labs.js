/* Small, local learning experiments. No network requests or stored user data. */
(() => {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const fmt = (n) => n === 0 ? "0" : Number(n.toPrecision(6)).toString();
  const mat = (name, rows) => `${name} =\n${rows.map(r => `[ ${r.map(fmt).join("   ")} ]`).join("\n")}`;
  const mul = (M, v) => [M[0][0]*v[0]+M[0][1]*v[1], M[1][0]*v[0]+M[1][1]*v[1]];
  const product = (B, C) => [[B[0][0]*C[0][0]+B[0][1]*C[1][0], B[0][0]*C[0][1]+B[0][1]*C[1][1]],
    [B[1][0]*C[0][0]+B[1][1]*C[1][0], B[1][0]*C[0][1]+B[1][1]*C[1][1]]];

  function node(tag, attrs, parent, text) {
    const el = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    if (text !== undefined) el.textContent = text;
    parent.appendChild(el);
    return el;
  }

  function scene(svg, limit, id) {
    svg.replaceChildren();
    const defs = node("defs", {}, svg);
    const clip = node("clipPath", {id}, defs);
    node("rect", {x:140, y:30, width:320, height:320}, clip);
    const area = node("g", {"clip-path":`url(#${id})`}, svg);
    const point = v => [300+v[0]*160/limit, 190-v[1]*160/limit];
    for (let i=-2; i<=2; i++) {
      const value=i*limit/2;
      const [px, py]=point([value,value]);
      node("line", {x1:px,y1:30,x2:px,y2:350,class:"lab-grid"}, area);
      node("line", {x1:140,y1:py,x2:460,y2:py,class:"lab-grid"}, area);
      node("text", {x:px,y:372,"text-anchor":"middle"}, svg, fmt(value));
      if (i!==0) node("text", {x:130,y:py+5,"text-anchor":"end"}, svg, fmt(value));
    }
    node("line", {x1:140,y1:190,x2:460,y2:190,class:"lab-axis"}, area);
    node("line", {x1:300,y1:30,x2:300,y2:350,class:"lab-axis"}, area);
    node("text", {x:468,y:185}, svg, "x₁");
    node("text", {x:308,y:22}, svg, "x₂");
    return {area, point};
  }

  function composition(root, fields, set, id) {
    const s=fields.scale, k=fields.shear, v=[fields.x1, fields.x2];
    const B=[[1,k],[0,1]], C=[[s,0],[0,1]], order=set("order").value;
    const first=order==="BC"?C:B, second=order==="BC"?B:C;
    const M=product(second,first), middle=mul(first,v), final=mul(M,v);
    root.querySelector("[data-status]").textContent=order==="BC"?"C acts first; B acts second.":"B acts first; C acts second.";
    root.querySelector("[data-matrices]").textContent=[mat("B",B),mat("C",C),mat(order,M),`Input x = (${v.map(fmt)})\nAfter first factor = (${middle.map(fmt)})\nFinal output = (${final.map(fmt)})`].join("\n\n");
    const square=[[0,0],[1,0],[1,1],[0,1],[0,0]];
    const shapes=[square,square.map(p=>mul(first,p)),square.map(p=>mul(M,p))];
    const limit=Math.max(2, ...shapes.flat().flat().map(Math.abs), ...v.map(Math.abs), ...middle.map(Math.abs), ...final.map(Math.abs))*1.15;
    const svg=root.querySelector("svg"), {area,point}=scene(svg,limit,id);
    ["lab-input","lab-first","lab-final"].forEach((cls,i)=>{
      node("polyline",{points:shapes[i].map(p=>point(p).join(",")).join(" "),class:cls,"stroke-width":2},area);
      const [x,y]=point([v,middle,final][i]);
      node("circle",{cx:x,cy:y,r:4,fill:["#64748b","#2563eb","#c65b08"][i]},area);
    });
    node("text",{x:60,y:403},svg,"Dashed: input · Blue: first stage · Orange: final");
    svg.setAttribute("aria-label",`Unit square transformed in two stages. Final vector (${final.map(fmt)}). The plot rescales to fit.`);
    root.querySelector("[data-explanation]").textContent="Dots track your vector; polygons track the unit square. The plot rescales to fit. Predict the output, then reverse the order. Try s = 1, k = 0, and s = 0: which settings make the order irrelevant, and which destroy invertibility?";
  }

  function lu(root, f, set, step) {
    const A=[[f.a,f.b],[f.c,f.d]], rhs=[f.rhs1,f.rhs2];
    const swap=set("pivot").checked && Math.abs(f.c)>Math.abs(f.a);
    const PA=swap?[A[1],A[0]]:A, pb=swap?[rhs[1],rhs[0]]:rhs;
    const P=swap?[[0,1],[1,0]]:[[1,0],[0,1]];
    const status=root.querySelector("[data-status]"), output=root.querySelector("[data-matrices]"), note=root.querySelector("[data-explanation]");
    const next=root.querySelector('[data-action="next"]');
    next.disabled=step>=3;
    output.textContent=mat("A",A)+`\nb = (${rhs.map(fmt)})`;
    status.textContent=`Step ${step} of 3. `;
    note.textContent="Predict the first pivot and multiplier before selecting Next step. Changing an input restarts the steps.";
    if (step===0) { status.textContent+="Start with the original equations."; return; }
    output.textContent += "\n\n"+mat("P",P)+"\n\n"+mat("PA",PA)+`\nPb = (${pb.map(fmt)})`;
    if (PA[0][0]===0) {
      status.textContent+="The first pivot is zero; this elimination order cannot continue.";
      note.textContent=PA[1][0]!==0?"Enable partial pivoting and restart: swapping the equations provides a nonzero pivot.":"The first column is zero. This square matrix is singular and cannot have a unique solution for every right-hand side.";
      next.disabled=true; return;
    }
    if (step===1) {status.textContent+=swap?"Swap the two rows and the right-hand side entries.":"Keep the row order."; return;}
    const m=PA[1][0]/PA[0][0], u22=PA[1][1]-m*PA[0][1];
    const L=[[1,0],[m,1]], U=[[PA[0][0],PA[0][1]],[0,u22]];
    output.textContent+="\n\n"+`Multiplier m = ${fmt(m)}\nR₂ ← R₂ − m R₁\n\n`+mat("L",L)+"\n\n"+mat("U",U);
    if (u22===0) {
      status.textContent+="The second pivot is zero. The factors exist here, but U is singular.";
      note.textContent="The last equation cannot determine a unique second unknown. A singular matrix may still have LU factors; a unique solve is a separate requirement.";
      next.disabled=true; return;
    }
    if (step===2) {status.textContent+="Eliminate the lower-left entry and store its multiplier in L.";return;}
    const y=[pb[0],pb[1]-m*pb[0]], x2=y[1]/u22, x1=(y[0]-U[0][1]*x2)/U[0][0];
    const Ax=mul(A,[x1,x2]), residual=[rhs[0]-Ax[0],rhs[1]-Ax[1]];
    output.textContent+=`\n\ny from Ly = Pb: (${y.map(fmt)})\nx from Ux = y: (${[x1,x2].map(fmt)})\nb − Ax: (${residual.map(fmt)})`;
    status.textContent+="Solve forward for y, then backward for x.";
    note.textContent=Math.abs(m)>100?"The large multiplier illustrates why small pivots can magnify rounding effects. Compare this result with partial pivoting enabled. Values use JavaScript floating-point arithmetic; displayed values are rounded.":"The residual checks the original equations. A small residual alone does not establish small forward error for an ill-conditioned matrix. Values use floating-point arithmetic and are rounded for display.";
  }

  function cholesky(root, f, id) {
    const {a,b,c,x1,x2}=f, q=a*x1*x1+2*b*x1*x2+c*x2*x2;
    const remainder=a>0?c-b*b/a:null;
    const valid=a>0 && remainder>0;
    const status=root.querySelector("[data-status]"), output=root.querySelector("[data-matrices]");
    output.textContent=mat("A",[[a,b],[b,c]])+`\nxᵀAx for x = (${fmt(x1)}, ${fmt(x2)}): ${fmt(q)}`;
    let L;
    if(valid){
      const l11=Math.sqrt(a),l21=b/l11,l22=Math.sqrt(remainder);
      L=[[l11,0],[l21,l22]];
      output.textContent+=`\nRemaining squared length c − b²/a = ${fmt(remainder)}\n\n`+mat("L",L)+`\n(det A from L) = ${fmt(a*remainder)}`;
      status.textContent="Positive definite: both square-root pivots are positive.";
      if(remainder<1e-5*Math.max(1,Math.abs(c),b*b/a)) status.textContent+=" The second remainder is small: explore sensitivity near a flat direction.";
    }else if(a<=0){
      status.textContent="No positive-diagonal Cholesky factor: the first square-root pivot is not positive.";
      output.textContent+=`\nDirection (1, 0) has energy ${fmt(a)}.`;
    }else{
      status.textContent=remainder===0?"The second remainder is zero: a flat direction makes this matrix singular.":"The second remainder is negative: this matrix is indefinite.";
      output.textContent+=`\nRemaining squared length c − b²/a = ${fmt(remainder)}\nDirection (${fmt(-b/a)}, 1) has energy ${fmt(remainder)}.`;
    }
    const svg=root.querySelector("svg"), {area,point}=scene(svg,2,id);
    const cells=25, delta=4/cells;
    const samples=[];
    for(let i=0;i<cells;i++)for(let j=0;j<cells;j++){
      const x=-2+(i+.5)*delta,y=-2+(j+.5)*delta;
      samples.push({x,y,value:a*x*x+2*b*x*y+c*y*y});
    }
    const largest=Math.max(1e-20,...samples.map(p=>Math.abs(p.value)));
    for(const p of samples){
      const [x,y]=point([p.x-delta/2,p.y+delta/2]);
      node("rect",{x,y,width:delta*80+.5,height:delta*80+.5,fill:p.value===0?"#64748b":p.value<0?"#c65b08":"#2563eb","fill-opacity":.06+.5*Math.abs(p.value)/largest},area);
    }
    if(valid){
      const contour=[];
      for(let i=0;i<=180;i++){
        const t=2*Math.PI*i/180, y=Math.sin(t)/L[1][1], x=(Math.cos(t)-L[1][0]*y)/L[0][0];
        contour.push(point([x,y]).join(","));
      }
      node("polyline",{points:contour.join(" "),class:"lab-contour"},area);
    }
    const [dx,dy]=point([x1,x2]);
    node("line",{x1:300,y1:190,x2:dx,y2:dy,class:"lab-contour"},area);
    node("circle",{cx:dx,cy:dy,r:4,fill:"currentColor"},area);
    node("text",{x:60,y:403},svg,"Blue: positive energy · Orange: negative energy");
    svg.setAttribute("aria-label",`Quadratic energy on a fixed range from minus two to two. Your direction has energy ${fmt(q)}. ${status.textContent}`);
    root.querySelector("[data-explanation]").textContent="Color shows the sign and relative magnitude at sampled points; darker means larger magnitude. Axes stay fixed at −2 to 2. For SPD input, the curve is xᵀAx = 1 and may extend beyond the view. The black line marks your direction, clipped if outside the view. Predict the remainder before changing b. Try the flat and indefinite presets: find a zero or negative energy direction.";
  }

  function initialize() {
    document.querySelectorAll("[data-wiki-lab]").forEach((root,index)=>{
      const kind=root.dataset.wikiLab, set=key=>root.querySelector(`[data-field="${key}"]`);
      let step=0;
      const presets=kind==="lu"?{
        ordinary:{a:2,b:1,c:4,d:3,rhs1:3,rhs2:7},zero:{a:0,b:1,c:1,d:1,rhs1:1,rhs2:2},
        small:{a:.0001,b:1,c:1,d:1,rhs1:1.0001,rhs2:2},singular:{a:1,b:2,c:2,d:4,rhs1:3,rhs2:6}
      }:{ordinary:{a:4,b:2,c:3},negative:{a:2,b:-1,c:2},flat:{a:4,b:2,c:1},indefinite:{a:4,b:4,c:3},near:{a:1,b:1,c:1.000001}};
      function render(){
        const f={};
        let invalid=false;
        root.querySelectorAll('input[type="number"], input[type="range"]').forEach(input=>{
          const value=input.valueAsNumber;
          const good=Number.isFinite(value)&&Math.abs(value)<=10000 && (value===0 || Math.abs(value)>=1e-12);
          input.setAttribute("aria-invalid",String(!good));
          invalid ||= !good;
          f[input.dataset.field]=value;
          const display=root.querySelector(`[data-value="${input.dataset.field}"]`);
          if(display)display.textContent=good?fmt(value):"—";
        });
        if(invalid){
          root.querySelector("[data-status]").textContent="Enter finite numbers between −10000 and 10000 in every numeric field; nonzero values must have magnitude at least 10⁻¹².";
          root.querySelector("[data-matrices]").textContent="";
          root.querySelector("[data-explanation]").textContent="The result will update when the inputs are valid.";
          root.querySelector("svg")?.replaceChildren();
          const next=root.querySelector('[data-action="next"]');if(next)next.disabled=true;
          return;
        }
        if(kind==="composition")composition(root,f,set,`wiki-lab-clip-${index}`);
        else if(kind==="lu")lu(root,f,set,step);
        else cholesky(root,f,`wiki-lab-clip-${index}`);
      }
      root.querySelectorAll("[data-field]").forEach(input=>input.addEventListener("input",()=>{
        if(input.dataset.field==="preset"){
          for(const [key,value] of Object.entries(presets[input.value]))set(key).value=value;
        }
        step=0;render();
      }));
      root.querySelector('[data-action="next"]')?.addEventListener("click",()=>{step=Math.min(step+1,3);render();});
      root.querySelector('[data-action="reset"]')?.addEventListener("click",()=>{step=0;render();});
      root.querySelector(".wiki-lab-controls").hidden=false;
      root.querySelector(".wiki-lab-result").hidden=false;
      render();
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});
  else initialize();
})();
