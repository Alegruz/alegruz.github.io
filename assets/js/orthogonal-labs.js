/* Fixed, dimensionless teaching models for orthogonalization and QR. */
(() => {
  "use strict";
  const NS="http://www.w3.org/2000/svg";
  const fmt=n=>n===0?"0":Number(n.toPrecision(6)).toString();
  const vector=v=>`(${v.map(fmt).join(", ")})`;
  const baselines={"gram-schmidt":{a1:0,a2:1,a3:2},qr:{b1:1,b2:2,b3:2}};
  function node(tag,attrs,parent,text){
    const el=document.createElementNS(NS,tag);
    for(const [key,value] of Object.entries(attrs))el.setAttribute(key,value);
    if(text!==undefined)el.textContent=text;
    parent.appendChild(el);
    return el;
  }
  // Plot components against sample positions, not a 3D vector projection.
  function plot(root,series,residuals){
    const svg=root.querySelector("svg");svg.replaceChildren();
    const limit=Math.max(1e-12,...series.flatMap(s=>s.values.map(Math.abs)))*1.15;
    const px=i=>80+200*i,py=value=>210-150*value/limit;
    node("line",{x1:60,y1:210,x2:500,y2:210,class:"lab-axis"},svg);
    node("line",{x1:60,y1:55,x2:60,y2:365,class:"lab-axis"},svg);
    for(const value of [-limit,0,limit])node("text",{x:65,y:py(value)-5},svg,fmt(value));
    for(let i=0;i<3;i++){
      node("line",{x1:px(i),y1:55,x2:px(i),y2:365,class:"lab-grid"},svg);
      node("text",{x:px(i),y:390,"text-anchor":"middle"},svg,String(i));
    }
    node("text",{x:280,y:420,"text-anchor":"middle"},svg,"Sample position (dimensionless)");
    if(residuals)for(let i=0;i<3;i++)node("line",{
      x1:px(i),y1:py(residuals[0][i]),x2:px(i),y2:py(residuals[1][i]),
      stroke:"currentColor","stroke-width":3,"stroke-dasharray":"3 3"
    },svg);
    series.forEach((s,k)=>{
      node("text",{x:20+k*195,y:25},svg,s.label);
      const style={stroke:s.color,"stroke-width":2,...(s.dashed?{"stroke-dasharray":"6 4"}:{})};
      node("line",{x1:20+k*195,y1:36,x2:175+k*195,y2:36,...style},svg);
      if(s.connect!==false)node("polyline",{
        points:s.values.map((value,i)=>`${px(i)},${py(value)}`).join(" "),fill:"none",...style
      },svg);
      for(let i=0;i<3;i++)node("circle",{cx:px(i),cy:py(s.values[i]),r:4,fill:s.color},svg);
    });
    svg.setAttribute("aria-label",series.map(s=>`${s.label}: ${vector(s.values)}`).join(". ")+". Horizontal coordinates are sample positions; vertical coordinates are component values. The vertical scale adapts to the values.");
  }
  function calculate(root,f,kind){
    const status=root.querySelector("[data-status]"),output=root.querySelector("[data-matrices]");
    const note=root.querySelector("[data-explanation]");
    const baseline=Object.entries(baselines[kind]).every(([key,value])=>f[key]===value);
    const prefix=baseline?"Invented teaching baseline. ":"Hypothetical experiment. ";
    if(kind==="gram-schmidt"){
      const a=[f.a1,f.a2,f.a3],mean=a.reduce((sum,value)=>sum+value,0)/3;
      const u=a.map(value=>value-mean),length=Math.hypot(...u),scale=Math.hypot(...a);
      // An illustrative resolution policy, not a general rank test.
      const unresolved=length>0&&length<=64*Number.EPSILON*scale;
      output.textContent=`Fixed a₁ = (1, 1, 1)\na₂ = ${vector(a)}\nq₁ = (1, 1, 1) / √3\nr₁₂ = q₁ᵀa₂ = ${fmt(Math.sqrt(3)*mean)}\nConstant projection = ${vector([mean,mean,mean])}\nu₂ = ${vector(u)}\nr₂₂ = ‖u₂‖₂ = ${fmt(length)}`;
      if(length===0||unresolved){
        status.textContent=prefix+(length===0?"No resolved new direction: the computed remainder is zero.":"The remainder is below this lab's relative resolution threshold; normalization is withheld.");
        output.textContent+="\nq₂ is not computed.";
      }else{
        const q=u.map(value=>value/length),dot=q.reduce((sum,value)=>sum+value,0)/Math.sqrt(3);
        output.textContent+=`\nq₂ = ${vector(q)}\nq₁ᵀq₂ (rounding check) = ${fmt(dot)}`;
        status.textContent=prefix+"A nonzero remainder supplies the second direction.";
      }
      plot(root,[{label:"Input a₂",values:a,color:"#64748b",dashed:true},
        {label:"Projection",values:[mean,mean,mean],color:"#c65b08"},
        {label:"Remainder u₂",values:u,color:"#2563eb"}]);
      note.textContent="The second column is its constant projection plus its mean-zero remainder. The plot shows components at three sample positions, not three-dimensional vector angles. The vertical scale adapts to the inputs. Values use JavaScript floating-point arithmetic and rounded display. Normalization is withheld below 64 × machine epsilon × ‖a₂‖₂; this is a teaching guard, not a proof of numerical rank.";
    }else{
      const b=[f.b1,f.b2,f.b3],mean=b.reduce((sum,value)=>sum+value,0)/3;
      const coords=[Math.sqrt(3)*mean,(b[2]-b[0])/Math.sqrt(2)];
      // Back substitution with the fixed R from the article.
      const slope=coords[1]/Math.sqrt(2),intercept=coords[0]/Math.sqrt(3)-slope;
      const fit=[intercept,intercept+slope,intercept+2*slope],r=b.map((value,i)=>value-fit[i]);
      const normal=[r[0]+r[1]+r[2],r[1]+2*r[2]],residualNorm=Math.hypot(...r);
      output.textContent="Fixed A =\n[ 1  0 ]\n[ 1  1 ]\n[ 1  2 ]\nQ columns: (1,1,1)/√3 and (−1,0,1)/√2\nR = [[√3, √3], [0, √2]]\n"+
        `b = ${vector(b)}\nQᵀb = ${vector(coords)}\nx = (intercept, slope) = ${vector([intercept,slope])}\nAx = ${vector(fit)}\nb − Ax = ${vector(r)}\nResidual norm = ${fmt(residualNorm)}\nSum of squared residuals = ${fmt(residualNorm*residualNorm)}\nAᵀr (rounding check) = ${vector(normal)}`;
      status.textContent=prefix+"The triangular solve gives the least-squares line.";
      plot(root,[{label:"Observations b",values:b,color:"#64748b",connect:false,dashed:true},
        {label:"Predictions Ax",values:fit,color:"#2563eb"}],[b,fit]);
      note.textContent="The blue line passes through predictions; dotted vertical segments show observation minus prediction. The vertical scale adapts to the inputs. Q and R stay fixed because sample positions and equal weights stay fixed. Aᵀr checks perpendicularity to both model columns. Values are rounded floating-point calculations; tiny residuals and dot products are not exact-arithmetic certificates.";
    }
  }
  function initialize(){
    document.querySelectorAll("[data-orthogonal-lab]").forEach(root=>{
      const kind=root.dataset.orthogonalLab;
      function render(){
        const fields={};let invalid=false;
        root.querySelectorAll("[data-field]").forEach(input=>{
          const value=input.valueAsNumber;
          const valid=Number.isFinite(value)&&Math.abs(value)<=10000&&(value===0||Math.abs(value)>=1e-12);
          input.setAttribute("aria-invalid",String(!valid));invalid ||= !valid;
          fields[input.dataset.field]=value;
        });
        if(invalid){
          root.querySelector("[data-status]").textContent="Enter finite numbers between −10000 and 10000 in every field; nonzero magnitudes must be at least 10⁻¹².";
          root.querySelector("[data-matrices]").textContent="";
          root.querySelector("[data-explanation]").textContent="The calculation resumes when every input is valid.";
          root.querySelector("svg").replaceChildren();return;
        }
        calculate(root,fields,kind);
      }
      root.querySelectorAll("[data-field]").forEach(input=>input.addEventListener("input",render));
      root.querySelector('[data-action="reset"]').addEventListener("click",()=>{
        for(const [key,value] of Object.entries(baselines[kind]))root.querySelector(`[data-field="${key}"]`).value=value;
        render();
      });
      root.querySelector(".wiki-lab-controls").hidden=false;
      root.querySelector(".wiki-lab-result").hidden=false;
      render();
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});
  else initialize();
})();
