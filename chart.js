/* Graphique « Évolution des points » – SVG sans librairie.
   Couleurs : palette catégorielle validée (clair / sombre), attribuée
   au joueur au moment où on le sélectionne et conservée ensuite. */
function renderPointsChart(containerId){
  var root=document.getElementById(containerId);
  if(!root)return;
  var MAX=5,SVGNS="http://www.w3.org/2000/svg";
  var selected=PLAYERS.slice(0,MAX).map(function(p){return p.id});
  var slotOf={};selected.forEach(function(id,i){slotOf[id]=i+1});
  var lines={};PLAYERS.forEach(function(p){lines[p.id]=pointsTimeline(p)});

  root.innerHTML=
    '<div class="chart-chips" role="group" aria-label="Joueurs affichés"></div>'+
    '<div class="chart-plot"><svg class="chart-svg" role="img" aria-labelledby="chart-title"></svg><div class="chart-tip" hidden></div></div>'+
    '<details class="chart-table"><summary>Voir les données sous forme de tableau</summary><div class="chart-table-wrap"></div></details>';
  var chips=root.querySelector(".chart-chips"),svg=root.querySelector("svg"),tip=root.querySelector(".chart-tip"),plot=root.querySelector(".chart-plot");

  function el(name,attrs,parent){
    var n=document.createElementNS(SVGNS,name);
    for(var k in attrs)n.setAttribute(k,attrs[k]);
    if(parent)parent.appendChild(n);
    return n;
  }
  function freeSlot(){for(var s=1;s<=MAX;s++){var used=false;for(var id in slotOf)if(slotOf[id]===s&&selected.indexOf(id)!==-1)used=true;if(!used)return s}return 1}

  function renderChips(){
    var full=selected.length>=MAX;
    chips.innerHTML=PLAYERS.map(function(p){
      var on=selected.indexOf(p.id)!==-1;
      return '<button type="button" class="chip'+(on?' is-on':'')+'" data-id="'+p.id+'" aria-pressed="'+on+'"'+(!on&&full?' disabled title="5 joueurs maximum"':'')+
        (on?' style="--c:var(--series-'+slotOf[p.id]+')"':'')+'><span class="sw" aria-hidden="true"></span>'+escHtml(p.name)+'</button>';
    }).join("");
  }
  chips.addEventListener("click",function(e){
    var b=e.target.closest(".chip");if(!b||b.disabled)return;
    var id=b.getAttribute("data-id"),i=selected.indexOf(id);
    if(i!==-1){if(selected.length===1)return;selected.splice(i,1)}
    else{slotOf[id]=freeSlot();selected.push(id)}
    renderChips();draw();
  });

  var geo=null;
  function draw(){
    var W=Math.max(plot.clientWidth,300),H=W<520?260:320;
    var m={l:34,r:W<520?74:96,t:14,b:30},iw=W-m.l-m.r,ih=H-m.t-m.b;
    var n=TOTAL_GAMES,series=selected.map(function(id){return PLAYERS.find(function(p){return p.id===id})});
    var maxPts=Math.max(3,Math.max.apply(null,series.map(function(p){return lines[p.id][n]})));
    var step=maxPts>18?6:3,yMax=Math.ceil(maxPts/step)*step;
    function x(i){return m.l+iw*i/n}
    function y(v){return m.t+ih-ih*v/yMax}
    svg.setAttribute("viewBox","0 0 "+W+" "+H);
    svg.setAttribute("height",H);
    svg.innerHTML="";
    var desc=el("desc",{},svg);desc.textContent="Points cumulés : "+series.map(function(p){return p.name+" "+lines[p.id][n]+" pts"}).join(", ");
    var grid=el("g",{"class":"grid"},svg);
    for(var v=0;v<=yMax;v+=step){
      el("line",{x1:m.l,x2:m.l+iw,y1:y(v),y2:y(v),"class":v===0?"baseline":""},grid);
      var t=el("text",{x:m.l-8,y:y(v),"text-anchor":"end","dominant-baseline":"middle","class":"tick"},grid);t.textContent=v;
    }
    var every=W<520?2:1;
    for(var i=0;i<=n;i++){
      if(i%every)continue;
      var tx=el("text",{x:x(i),y:H-8,"text-anchor":"middle","class":"tick"},grid);tx.textContent=i===0?"0":"P"+i;
    }
    // Lignes
    var lg=el("g",{},svg),labels=[];
    series.forEach(function(p){
      var c="var(--series-"+slotOf[p.id]+")",pts=lines[p.id];
      el("polyline",{points:pts.map(function(v,i){return x(i)+","+y(v)}).join(" "),fill:"none",stroke:c,"stroke-width":2,"stroke-linejoin":"round","stroke-linecap":"round"},lg);
      pts.forEach(function(v,i){if(i>0)el("circle",{cx:x(i),cy:y(v),r:4,fill:c,stroke:"var(--card)","stroke-width":2},lg)});
      labels.push({p:p,c:c,y:y(pts[n])});
    });
    // Étiquettes directes à droite, écartées pour ne pas se chevaucher
    labels.sort(function(a,b){return a.y-b.y});
    for(var k=1;k<labels.length;k++)if(labels[k].y-labels[k-1].y<15)labels[k].y=labels[k-1].y+15;
    var over=labels.length?labels[labels.length-1].y-(m.t+ih):0;
    if(over>0)labels.forEach(function(l){l.y-=over});
    labels.forEach(function(l){
      var t=el("text",{x:x(n)+10,y:l.y,"dominant-baseline":"middle","class":"end-label"},svg);
      t.textContent=l.p.name+" "+lines[l.p.id][n];
    });
    // Couche de survol
    var cross=el("line",{"class":"crosshair",y1:m.t,y2:m.t+ih,x1:-10,x2:-10},svg);
    var hit=el("rect",{x:m.l,y:m.t,width:iw,height:ih,fill:"transparent","class":"hit"},svg);
    geo={x:x,n:n,m:m,iw:iw,series:series,cross:cross,W:W};
    hit.addEventListener("pointermove",onMove);
    hit.addEventListener("pointerleave",function(){tip.hidden=true;cross.setAttribute("x1",-10);cross.setAttribute("x2",-10)});
    renderTable(series);
  }
  function onMove(e){
    var r=svg.getBoundingClientRect(),scale=geo.W/r.width;
    var px=(e.clientX-r.left)*scale,i=Math.round((px-geo.m.l)/geo.iw*geo.n);
    i=Math.max(0,Math.min(geo.n,i));
    var cx=geo.x(i);
    geo.cross.setAttribute("x1",cx);geo.cross.setAttribute("x2",cx);
    var rows=geo.series.map(function(p){return {p:p,v:lines[p.id][i]}}).sort(function(a,b){return b.v-a.v});
    tip.innerHTML='<strong>'+(i===0?'Départ':'Après la partie '+i)+'</strong>'+rows.map(function(o){
      return '<span class="tip-row"><i style="background:var(--series-'+slotOf[o.p.id]+')"></i>'+escHtml(o.p.name)+'<b>'+o.v+' pts</b></span>';
    }).join("");
    tip.hidden=false;
    var tw=tip.offsetWidth,left=cx/scale+12;
    if(left+tw>r.width)left=cx/scale-tw-12;
    tip.style.left=Math.max(0,left)+"px";
  }
  function renderTable(series){
    var head='<tr><th scope="col">Joueur</th>'+MATCHES.map(function(mm){return '<th scope="col">P'+mm.num+'</th>'}).join("")+'</tr>';
    var body=series.map(function(p){return '<tr><th scope="row">'+escHtml(p.name)+'</th>'+lines[p.id].slice(1).map(function(v){return '<td>'+v+'</td>'}).join("")+'</tr>'}).join("");
    root.querySelector(".chart-table-wrap").innerHTML='<table><thead>'+head+'</thead><tbody>'+body+'</tbody></table>';
  }
  renderChips();draw();
  var rt;window.addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(draw,120)});
}
