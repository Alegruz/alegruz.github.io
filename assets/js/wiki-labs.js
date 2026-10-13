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

  function norms(root, f, set, id, kind) {
    const svg=root.querySelector("svg"), status=root.querySelector("[data-status]");
    const output=root.querySelector("[data-matrices]"), note=root.querySelector("[data-explanation]");
    const circle=Array.from({length:181},(_,i)=>[Math.cos(i*Math.PI/90),Math.sin(i*Math.PI/90)]);
    let shapes, dots, limit;
    if(kind==="vector-norm"){
      const v=[f.x1,f.x2], one=Math.abs(f.x1)+Math.abs(f.x2), two=Math.hypot(...v), inf=Math.max(...v.map(Math.abs));
      const rule=set("norm").value, size=rule==="1"?one:rule==="2"?two:inf;
      const boundary=rule==="1"?[[1,0],[0,1],[-1,0],[0,-1],[1,0]]:
        rule==="2"?circle:[[1,1],[-1,1],[-1,-1],[1,-1],[1,1]];
      const normalized=size===0?null:v.map(value=>value/size);
      status.textContent=size===0?"Zero vector: all norms are zero; normalization is undefined.":`Selected ${rule==="inf"?"infinity":rule}-norm size: ${fmt(size)}.`;
      output.textContent=`x = (${v.map(fmt)})\n1-norm = ${fmt(one)}\n2-norm = ${fmt(two)}\nInfinity norm = ${fmt(inf)}\n`+
        (normalized?`Normalized vector = (${normalized.map(fmt)})`:"Cannot divide the zero vector by its norm.");
      shapes=[boundary];dots=[v,...(normalized?[normalized]:[])];
      limit=Math.max(1.5,...v.map(Math.abs))*1.15;
      note.textContent="Blue boundary: size one in the selected norm. Orange line: input vector. Black dot: normalized vector on the boundary, when nonzero. Axes rescale to include the input, so read the tick labels when comparing plots.";
    }else{
      const A=[[f.a,f.b],[f.c,f.d]], theta=f.angle*Math.PI/180;
      const v=[Math.cos(theta),Math.sin(theta)], y=mul(A,v);
      const one=Math.max(Math.abs(f.a)+Math.abs(f.c),Math.abs(f.b)+Math.abs(f.d));
      const inf=Math.max(Math.abs(f.a)+Math.abs(f.b),Math.abs(f.c)+Math.abs(f.d));
      const fro=Math.hypot(f.a,f.b,f.c,f.d);
      const h=f.a*f.a+f.c*f.c, k=f.b*f.b+f.d*f.d, cross=f.a*f.b+f.c*f.d;
      const spectral=Math.sqrt((h+k+Math.hypot(h-k,2*cross))/2);
      const stretch=Math.hypot(...y);
      status.textContent=`Direction stretch: ${fmt(stretch)}; maximum Euclidean stretch: ${fmt(spectral)}.`;
      output.textContent=mat("A",A)+`\nInduced 1-norm = ${fmt(one)}\nInduced infinity norm = ${fmt(inf)}\nFrobenius norm = ${fmt(fro)}\nSpectral norm = ${fmt(spectral)}\nUnit input = (${v.map(fmt)})\nOutput = (${y.map(fmt)})`;
      shapes=[circle,circle.map(p=>mul(A,p))];dots=[v,y];
      limit=Math.max(1.5,spectral)*1.15;
      note.textContent="Dashed circle: Euclidean unit inputs. Blue curve: their outputs (possibly a segment or a point). Black dot: selected unit input. Orange line and dot: its output. Axes rescale to fit. The spectral norm uses the largest eigenvalue of AᵀA, not sampled angles. Values are rounded for display.";
    }
    const {area,point}=scene(svg,limit,id);
    shapes.forEach((shape,i)=>node("polyline",{points:shape.map(p=>point(p).join(",")).join(" "),class:kind==="matrix-norm"&&i===0?"lab-input":"lab-first","stroke-width":2},area));
    dots.forEach((v,i)=>{
      const [x,y]=point(v), orange=kind==="vector-norm"?i===0:i===1;
      if(orange)node("line",{x1:300,y1:190,x2:x,y2:y,stroke:"#c65b08","stroke-width":2},area);
      node("circle",{cx:x,cy:y,r:4,fill:orange?"#c65b08":"currentColor"},area);
    });
    svg.setAttribute("aria-label",status.textContent+" "+note.textContent);
  }

  function linearProgramming(root, f) {
    const vertices=[[0,0],[2.5,0],[1,3],[0,4]];
    // Normalize before comparing so multiplying all profits by a constant
    // does not change the detected optimal face.
    const scale=Math.max(Math.abs(f.profit1),Math.abs(f.profit2));
    const c=scale===0?[0,0]:[f.profit1/scale,f.profit2/scale];
    const scores=vertices.map(([x,y])=>c[0]*x+c[1]*y);
    const best=Math.max(...scores);
    const winners=vertices.filter((v,i)=>Math.abs(scores[i]-best)<=1e-12);
    const status=root.querySelector("[data-status]");
    status.textContent=scale===0?"Constant objective: every feasible point is optimal.":
      winners.length===1?`Unique optimum at (${winners[0].map(fmt)}).`:
      "Multiple optima: every point on the segment between the listed corners is optimal (within comparison tolerance).";
    status.textContent=(f.profit1===3&&f.profit2===2?"Invented teaching baseline. ":"Hypothetical teaching profits. ")+status.textContent;
    root.querySelector("[data-matrices]").textContent=
      `Maximize ${fmt(f.profit1)} x₁ + ${fmt(f.profit2)} x₂\n`+
      vertices.map(([x,y])=>`(${fmt(x)}, ${fmt(y)}): ${fmt(f.profit1*x+f.profit2*y)}`).join("\n")+
      `\nBest profit = ${fmt(best*scale)}\nOptimal corners: ${winners.map(v=>`(${v.map(fmt)})`).join("; ")}`;
    const svg=root.querySelector("svg");
    svg.replaceChildren();
    const point=([x,y])=>[70+90*x,365-70*y];
    for(let i=0;i<=5;i++){
      const [x,y]=point([i,i]);
      node("line",{x1:x,y1:15,x2:x,y2:365,class:"lab-grid"},svg);
      node("line",{x1:70,y1:y,x2:520,y2:y,class:"lab-grid"},svg);
      node("text",{x,y:389,"text-anchor":"middle"},svg,String(i));
      node("text",{x:55,y:y+5,"text-anchor":"end"},svg,String(i));
    }
    node("line",{x1:70,y1:365,x2:520,y2:365,class:"lab-axis"},svg);
    node("line",{x1:70,y1:15,x2:70,y2:365,class:"lab-axis"},svg);
    node("text",{x:530,y:365},svg,"x₁");
    node("text",{x:70,y:12},svg,"x₂");
    node("polygon",{points:vertices.map(v=>point(v).join(",")).join(" "),fill:"#2563eb","fill-opacity":.15,stroke:"#2563eb","stroke-width":2},svg);
    const drawLine=(ends,attrs)=>{
      const [a,b]=ends.map(point);
      node("line",{x1:a[0],y1:a[1],x2:b[0],y2:b[1],...attrs},svg);
    };
    drawLine([[0,4],[4,0]],{stroke:"#64748b","stroke-dasharray":"4 4"});
    drawLine([[0,5],[2.5,0]],{stroke:"#64748b","stroke-dasharray":"4 4"});
    if(scale!==0){
      // Intersect the optimal objective line with the fixed plotting box.
      const ends=[];
      const add=(x,y)=>{
        if(x>=-1e-10&&x<=5+1e-10&&y>=-1e-10&&y<=5+1e-10 &&
          !ends.some(v=>Math.hypot(v[0]-x,v[1]-y)<1e-10))ends.push([x,y]);
      };
      if(c[1]!==0)for(const x of [0,5])add(x,(best-c[0]*x)/c[1]);
      if(c[0]!==0)for(const y of [0,5])add((best-c[1]*y)/c[0],y);
      if(ends.length>=2)drawLine(ends.slice(0,2),{stroke:"#c65b08","stroke-width":2,"stroke-dasharray":"6 4"});
      if(winners.length===2)drawLine(winners,{stroke:"#c65b08","stroke-width":5});
    }
    for(const v of vertices){
      const [x,y]=point(v);
      node("circle",{cx:x,cy:y,r:winners.includes(v)?6:3,fill:winners.includes(v)?"#c65b08":"#2563eb"},svg);
    }
    root.querySelector("[data-explanation]").textContent="Blue: feasible production. Gray dashed: resource boundaries. Orange dashed: best objective level; orange dots: optimal corners. A thick orange segment marks a tied edge. The constraints and axes stay fixed. Comparisons use normalized coefficients with tolerance 10⁻¹²; displayed values are rounded.";
    svg.setAttribute("aria-label",status.textContent+" "+root.querySelector("[data-explanation]").textContent);
  }

  function kantorovich(root, f, step) {
    const caps=[f.milling,f.turret,f.automatic], balance=20*caps[0]+30*caps[1]+80*caps[2];
    const coefficients=[30,50,110], eps=Math.max(...caps)*1e-10;
    const vertices=[];
    // A plane cuts a three-dimensional box. Every vertex fixes at least
    // two box coordinates, including collapsed boxes when capacity is zero.
    for(let free=0;free<3;free++){
      const fixed=[0,1,2].filter(i=>i!==free);
      for(const b of [0,1])for(const c of [0,1]){
        const q=[0,0,0];q[fixed[0]]=b*caps[fixed[0]];q[fixed[1]]=c*caps[fixed[1]];
        q[free]=(balance-coefficients[fixed[0]]*q[fixed[0]]-coefficients[fixed[1]]*q[fixed[1]])/coefficients[free];
        if(q.every((v,i)=>v>=-eps&&v<=caps[i]+eps)){
          const clipped=q.map((v,i)=>Math.max(0,Math.min(caps[i],v)));
          if(!vertices.some(v=>v.every((x,i)=>Math.abs(x-clipped[i])<=eps)))vertices.push(clipped);
        }
      }
    }
    const output=q=>10*q[0]+20*q[1]+30*q[2];
    const optimum=vertices.reduce((a,b)=>output(b)>output(a)?b:a);
    const best=output(optimum), original=caps[0]===3&&caps[1]===3&&caps[2]===1;
    const stages=[[0,12/5,1],[0,3,8/11],[8/3,3,0]];
    const current=original?stages[Math.min(step,2)]:optimum, achieved=output(current);
    const second=20*(caps[0]-current[0])+30*(caps[1]-current[1])+80*(caps[2]-current[2]);
    const certificates=[0,1,2/3,3/5,8/11].map(lambda=>{
      const prices=[Math.max(10*lambda,20*(1-lambda)),Math.max(20*lambda,30*(1-lambda)),Math.max(30*lambda,80*(1-lambda))];
      return {lambda,prices,bound:prices.reduce((sum,p,i)=>sum+p*caps[i],0)};
    });
    const certificate=certificates.reduce((a,b)=>b.bound<a.bound?b:a);
    const status=root.querySelector('[data-status]');
    status.textContent=original?`Published-capacity baseline. Worked exchange ${Math.min(step,2)} of 2 (modern replay). `+[
      'Start: m = 0, a = 1; solve the part balance for t.',
      'First exchange: automatic time shifts to Part II; turret time for Part I reaches its limit.',
      'Second exchange: milling supplies the balance; automatic Part I time reaches zero. Optimal plan.'
    ][Math.min(step,2)]:'Hypothetical capacity experiment: showing the optimal plan for your capacities. Restore the published baseline to replay the worked exchanges.';
    if(caps.every(v=>v===0))status.textContent='Hypothetical zero-capacity experiment: the only feasible plan produces zero of both parts.';
    root.querySelector('[data-action="next"]').disabled=!original||step>=2;
    const rows=(q)=>['Milling','Turret','Automatic'].map((name,i)=>`${name}: Part I ${fmt(q[i])}; Part II ${fmt(caps[i]-q[i])}`).join('\n');
    root.querySelector('[data-matrices]').textContent=
      `Published-capacity baseline (M, T, A): (3, 3, 1) machine-days\nCurrent capacities: (${caps.map(fmt).join(', ')}) machine-days — ${original?'published baseline':'hypothetical experiment'}\n`+
      `Fixed rates per machine-day (I, II): milling (10, 20), turret (20, 30), automatic (30, 80)\n`+
      `Current allocation (machine-days)\n${rows(current)}\nPart I output = ${fmt(achieved)}\nPart II output = ${fmt(second)}\n`+
      `\nOptimal allocation (machine-days)\n${rows(optimum)}\nOptimal matching output = ${fmt(best)}\n`+
      `Gain available from current plan = ${fmt(Math.max(0,best-achieved))}\n`+
      `\nOne optimal bound certificate\nPart weights = (${fmt(certificate.lambda)}, ${fmt(1-certificate.lambda)})\n`+
      `Capacity values (M, T, A) = (${certificate.prices.map(fmt).join(', ')})\nUpper bound = ${fmt(certificate.bound)}\n`+
      `Bound minus optimal output (rounded) = ${fmt(Math.abs(certificate.bound-best)<=1e-10*Math.max(best,1e-6)?0:Math.abs(certificate.bound-best))}`;
    const svg=root.querySelector('svg');svg.replaceChildren();svg.setAttribute('viewBox','0 0 600 650');
    const tLimit=Math.max(caps[1],1), aLimit=Math.max(caps[2],1);
    const point=q=>[75+q[1]*440/tLimit,295-q[2]*240/aLimit];
    for(let i=0;i<=2;i++){
      const x=75+i*220,y=295-i*120;
      node('line',{x1:x,y1:55,x2:x,y2:295,class:'lab-grid'},svg);
      node('line',{x1:75,y1:y,x2:515,y2:y,class:'lab-grid'},svg);
      node('text',{x,y:320,'text-anchor':'middle'},svg,fmt(tLimit*i/2));
      node('text',{x:62,y:y+5,'text-anchor':'end'},svg,fmt(aLimit*i/2));
    }
    node('text',{x:75,y:24},svg,'a: automatic time for Part I');
    node('text',{x:200,y:348},svg,'t: turret time for Part I');
    node('line',{x1:75,y1:55,x2:75,y2:295,class:'lab-axis'},svg);
    node('line',{x1:75,y1:295,x2:515,y2:295,class:'lab-axis'},svg);
    const center=vertices.reduce((p,q)=>[p[0]+q[1]/vertices.length,p[1]+q[2]/vertices.length],[0,0]);
    const ordered=[...vertices].sort((a,b)=>Math.atan2(a[2]-center[1],a[1]-center[0])-Math.atan2(b[2]-center[1],b[1]-center[0]));
    if(ordered.length>1)node(ordered.length===2?'polyline':'polygon',{points:ordered.map(q=>point(q).join(',')).join(' '),fill:ordered.length===2?'none':'#2563eb','fill-opacity':.12,stroke:'#2563eb','stroke-width':2},svg);
    if(original)node('polyline',{points:stages.map(q=>point(q).join(',')).join(' '),fill:'none',stroke:'#64748b','stroke-dasharray':'5 4','stroke-width':2},svg);
    const [ox,oy]=point(optimum),[cx,cy]=point(current);
    node('circle',{cx:ox,cy:oy,r:8,fill:'none',stroke:'#c65b08','stroke-width':3},svg);
    node('circle',{cx,cy,r:4,fill:'currentColor'},svg);
    node('text',{x:75,y:377},svg,'Blue: feasible · Dot: current · Orange ring: optimum');
    node('text',{x:75,y:405},svg,'Current time shares: blue Part I, orange Part II');
    caps.forEach((cap,i)=>{
      const y=445+i*65, width=cap===0?0:300*current[i]/cap;
      node('text',{x:25,y:y+5},svg,['Milling','Turret','Automatic'][i]);
      node('rect',{x:145,y:y-16,width,height:24,fill:'#2563eb'},svg);
      node('rect',{x:145+width,y:y-16,width:cap===0?0:300-width,height:24,fill:'#c65b08'},svg);
      node('text',{x:455,y:y+5},svg,cap===0?'No time':`${fmt(cap)} days`);
      node('text',{x:145,y:y+29},svg,`I: ${fmt(current[i])} days; II: ${fmt(cap-current[i])} days`);
    });
    root.querySelector('[data-explanation]').textContent=
      'Rates stay fixed at Kantorovich’s published illustrative values. Only (3, 3, 1) is the published-capacity baseline; all other capacities are hypothetical experiments in divisible machine-days. The plot rescales: read its ticks. A collapsed region can be a segment or a point. Bars show fractions of each group’s current time; equal bar widths do not mean equal capacities. '+
      (original?'Next worked exchange follows the two worked exchanges. ':'Capacity changes immediately recompute the optimal allocation. ')+
      'The displayed certificate bounds all plans for these capacities. At a specialization threshold the weights may be nonunique; its capacity values are not a promise for finite capacity changes. Values are rounded and comparisons use floating-point tolerances.';
    svg.setAttribute('aria-label',`${status.textContent} Current output ${fmt(achieved)}; optimal output ${fmt(best)}. ${root.querySelector('[data-explanation]').textContent}`);
  }

  function initialize() {
    document.querySelectorAll("[data-wiki-lab]").forEach((root,index)=>{
      const kind=root.dataset.wikiLab, set=key=>root.querySelector(`[data-field="${key}"]`);
      let step=0;
      const presets=kind==="kantorovich"?{original:{milling:3,turret:3,automatic:1},threshold:{milling:3,turret:3,automatic:1.125},extra:{milling:3,turret:3,automatic:2},zero:{milling:0,turret:0,automatic:0}}:kind==="lu"?{
        ordinary:{a:2,b:1,c:4,d:3,rhs1:3,rhs2:7},zero:{a:0,b:1,c:1,d:1,rhs1:1,rhs2:2},
        small:{a:.0001,b:1,c:1,d:1,rhs1:1.0001,rhs2:2},singular:{a:1,b:2,c:2,d:4,rhs1:3,rhs2:6}
      }:{ordinary:{a:4,b:2,c:3},negative:{a:2,b:-1,c:2},flat:{a:4,b:2,c:1},indefinite:{a:4,b:4,c:3},near:{a:1,b:1,c:1.000001}};
      function render(){
        const f={};
        let invalid=false;
        root.querySelectorAll('input[type="number"], input[type="range"]').forEach(input=>{
          const value=input.valueAsNumber;
          const good=kind==="kantorovich"?Number.isFinite(value)&&value>=0&&value<=10&&(value===0||value>=1e-6):Number.isFinite(value)&&Math.abs(value)<=10000 && (value===0 || Math.abs(value)>=1e-12);
          input.setAttribute("aria-invalid",String(!good));
          invalid ||= !good;
          f[input.dataset.field]=value;
          const display=root.querySelector(`[data-value="${input.dataset.field}"]`);
          if(display)display.textContent=good?fmt(value):"—";
        });
        if(invalid){
          root.querySelector("[data-status]").textContent=kind==="kantorovich"?"Enter machine-day capacities between 0 and 10; nonzero values must be at least 0.000001. Zero capacity is allowed.":"Enter finite numbers between −10000 and 10000 in every numeric field; nonzero values must have magnitude at least 10⁻¹².";
          root.querySelector("[data-matrices]").textContent="";
          root.querySelector("[data-explanation]").textContent="The result will update when the inputs are valid.";
          root.querySelector("svg")?.replaceChildren();
          const next=root.querySelector('[data-action="next"]');if(next)next.disabled=true;
          return;
        }
        if(kind==="kantorovich")kantorovich(root,f,step);
        else if(kind==="composition")composition(root,f,set,`wiki-lab-clip-${index}`);
        else if(kind==="linear-programming")linearProgramming(root,f);
        else if(kind==="lu")lu(root,f,set,step);
        else if(kind==="vector-norm"||kind==="matrix-norm")norms(root,f,set,`wiki-lab-clip-${index}`,kind);
        else cholesky(root,f,`wiki-lab-clip-${index}`);
      }
      root.querySelectorAll("[data-field]").forEach(input=>input.addEventListener("input",()=>{
        if(input.dataset.field==="preset"){
          for(const [key,value] of Object.entries(presets[input.value]))set(key).value=value;
        }
        if(kind==="kantorovich"&&input.dataset.field!=="preset")set("preset").value=Number(set('milling').value)===3&&Number(set('turret').value)===3&&Number(set('automatic').value)===1?'original':'custom';
        step=kind==="kantorovich"&&!(input.dataset.field==="preset"&&input.value==="original")?2:0;render();
      }));
      root.querySelector('[data-action="next"]')?.addEventListener("click",()=>{step=Math.min(step+1,3);render();});
      root.querySelector('[data-action="reset"]')?.addEventListener("click",()=>{if(kind==="kantorovich"){for(const [key,value] of Object.entries(presets.original))set(key).value=value;set('preset').value='original';}if(kind==="linear-programming"){set('profit1').value=3;set('profit2').value=2;}step=0;render();});
      root.querySelector(".wiki-lab-controls").hidden=false;
      root.querySelector(".wiki-lab-result").hidden=false;
      render();
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});
  else initialize();
})();
