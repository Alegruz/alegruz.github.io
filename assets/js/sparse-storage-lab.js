/* NIST's published format illustration, with zero-based coordinates. */
(() => {
  'use strict';
  const t = window.wikiLabText;
  const published=[[0,0,1],[1,1,10.5],[2,2,.015],[0,3,6],[3,1,250.5],[3,3,-280],[3,4,33.32],[4,4,12]];
  const fmt=n=>n===0?'0':Number(n.toPrecision(6)).toString();
  function node(tag,attrs,parent,text){
    const el=document.createElementNS('http://www.w3.org/2000/svg',tag);
    for(const [key,value] of Object.entries(attrs))el.setAttribute(key,value);
    if(text!==undefined)el.textContent=text;
    parent.appendChild(el);return el;
  }
  function initialize(){
    document.querySelectorAll('[data-sparse-storage-lab]').forEach(root=>{
      const field=key=>root.querySelector(`[data-field="${key}"]`);
      function render(){
        const scenario=field('scenario').value, format=field('format').value, group=Number(field('group').value);
        const entries=published.filter(([i,j])=>scenario==='baseline'||(scenario==='row'&&i!==3)||(scenario==='column'&&j!==1));
        if(format!=='coo')entries.sort((a,b)=>format==='csr'?a[0]-b[0]||a[1]-b[1]:a[1]-b[1]||a[0]-b[0]);
        const column=format==='csc', axis=column?1:0, counts=Array(5).fill(0), ptr=[0];
        entries.forEach(e=>counts[e[axis]]++);
        counts.forEach(c=>ptr.push(ptr[ptr.length-1]+c));
        const array=(name,values)=>`${name} = [${values.map(fmt).join(', ')}]`;
        const lines=[t('shape = (5, 5)'),array('data',entries.map(e=>e[2]))];
        if(format==='coo')lines.push(array('row',entries.map(e=>e[0])),array('col',entries.map(e=>e[1])));
        else lines.push(array('indices',entries.map(e=>e[column?0:1])),array('indptr',ptr));
        const selected=entries.map((e,k)=>({e,k})).filter(({e})=>e[axis]===group);
        const slice=format==='coo'?t`COO scans the row array; matching slots: [${selected.map(s=>s.k).join(', ')}].`:
          t`${column?t('Column'):t('Row')} ${group}: slots [${ptr[group]}, ${ptr[group+1]}) — end excluded.`;
        lines.push(slice,selected.length?selected.map(({e,k})=>`k=${k}: A[${e[0]}, ${e[1]}] = ${fmt(e[2])}`).join('\n'):t('Empty selection: no stored coefficients.'));
        const sums=Array(5).fill(0);entries.forEach(([i,j,v])=>{sums[i]+=v;});
        lines.push(array('A × [1, 1, 1, 1, 1]',sums));
        root.querySelector('[data-matrices]').textContent=lines.join('\n');
        const status=t`${scenario==='baseline'?t('Published baseline'):t('Hypothetical experiment')}: ${entries.length} stored entries. ${slice}`;
        root.querySelector('[data-status]').textContent=status;
        root.querySelector('[data-explanation]').textContent=t('Rows increase downward; columns increase rightward. Each k label gives the coefficient’s slot in data. Orange outlines select the traced row or column; dots label stored entries. Blank cells are implicit zeros. The shape remains 5×5 in every scenario. The all-ones product is a modern calculation; displayed values are rounded.');
        const svg=root.querySelector('svg');svg.replaceChildren();
        node('text',{x:70,y:25},svg,`${format.toUpperCase()} — ${column?t('column'):t('row')} ${group}`);
        for(let i=0;i<5;i++){
          node('text',{x:120+i*78,y:56,'text-anchor':'middle'},svg,String(i));
          node('text',{x:63,y:98+i*66,'text-anchor':'middle'},svg,String(i));
          for(let j=0;j<5;j++){
            const active=(column?j:i)===group;
            node('rect',{x:81+j*78,y:69+i*66,width:78,height:66,fill:'none',stroke:active?'#c65b08':'currentColor','stroke-opacity':active?1:.2,'stroke-width':active?2:1},svg);
          }
        }
        entries.forEach(([i,j,v],k)=>{
          node('text',{x:120+j*78,y:98+i*66,'text-anchor':'middle'},svg,fmt(v));
          node('text',{x:120+j*78,y:118+i*66,'text-anchor':'middle'},svg,`• k=${k}`);
        });
        node('text',{x:70,y:425},svg,t('Blank = implicit zero · k = array slot'));
        svg.setAttribute('aria-label',t`${status} The full arrays and selected coordinates are listed above the plot.`);
      }
      root.querySelectorAll('[data-field]').forEach(input=>input.addEventListener('input',render));
      root.querySelector('[data-action="reset"]').addEventListener('click',()=>{
        field('scenario').value='baseline';field('format').value='csr';field('group').value='3';render();
      });
      root.querySelector('.wiki-lab-controls').hidden=false;
      root.querySelector('.wiki-lab-result').hidden=false;
      render();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});
  else initialize();
})();
