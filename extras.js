/* Records du tournoi et face-à-face entre deux joueurs (page Stats).
   S'appuie sur PLAYERS et MATCHES de joueurs.js. */

function playerLink(p){
  return '<a href="Joueur.html?joueur='+encodeURIComponent(p.id)+'">'+escHtml(p.name)+'</a>';
}
function gameLink(num){return '<a href="Parties.html#partie-'+num+'">Partie '+num+'</a>'}

/* Garde tous les éléments à égalité sur la meilleure valeur */
function topOf(list,value){
  if(!list.length)return {value:null,items:[]};
  var best=list.reduce(function(m,x){return Math.max(m,value(x))},-Infinity);
  return {value:best,items:list.filter(function(x){return value(x)===best})};
}

function renderRecords(containerId){
  var box=document.getElementById(containerId);
  if(!box)return;
  var rows=[];
  MATCHES.forEach(function(m){rows=rows.concat(m.A,m.B)});
  var byId={};PLAYERS.forEach(function(p){byId[p.id]=p});

  function gameRecord(field){
    var t=topOf(rows,function(r){return r[field]});
    return {value:t.value,who:t.items.map(function(r){
      return playerLink(byId[r.id])+' <span>'+gameLink(r.game)+' · '+r.kills+'/'+r.deaths+'/'+r.assists+'</span>';
    })};
  }
  function playerRecord(value){
    var t=topOf(PLAYERS,value);
    return {value:t.value,who:t.items.map(playerLink)};
  }
  function matchRecord(value,detail){
    var t=topOf(MATCHES,value);
    return {value:t.value,who:t.items.map(function(m){return gameLink(m.num)+' <span>'+detail(m)+'</span>'})};
  }

  var mvpCount={};
  MATCHES.forEach(function(m){if(m.mvp)mvpCount[m.mvp.id]=(mvpCount[m.mvp.id]||0)+1});
  var score=function(m){return m.killsA+' – '+m.killsB+' kills'};

  var cards=[
    {label:"Kills en une partie",icon:"⚔",r:gameRecord("kills")},
    {label:"Assists en une partie",icon:"🤝",r:gameRecord("assists")},
    {label:"Meilleur KDA en une partie",icon:"★",r:gameRecord("kda"),fmt:function(v){return fmt(v)}},
    {label:"Morts en une partie",icon:"☠",r:gameRecord("deaths"),bad:true},
    {label:"Partie la plus sanglante",icon:"🩸",r:matchRecord(function(m){return m.killsA+m.killsB},score),unit:" kills"},
    {label:"Plus gros écart",icon:"📉",r:matchRecord(function(m){return Math.abs(m.killsA-m.killsB)},score),unit:" kills"},
    {label:"Plus longue série de victoires",icon:"🔥",r:playerRecord(function(p){return p.bestWinStreak}),unit:" d’affilée"},
    {label:"Le plus de MVP",icon:"🏅",r:playerRecord(function(p){return mvpCount[p.id]||0}),unit:" fois"}
  ];

  box.innerHTML=cards.map(function(c){
    var v=c.r.value===null?"—":(c.fmt?c.fmt(c.r.value):c.r.value);
    var who=c.r.who.slice(0,3),more=c.r.who.length-who.length;
    return '<article class="record'+(c.bad?' is-bad':'')+'">'+
      '<span class="record-label"><i aria-hidden="true">'+c.icon+'</i>'+c.label+'</span>'+
      '<strong>'+v+(c.unit&&c.r.value!==null?'<small>'+c.unit+'</small>':'')+'</strong>'+
      '<ul>'+who.map(function(w){return '<li>'+w+'</li>'}).join("")+(more>0?'<li class="more">+ '+more+' à égalité</li>':'')+'</ul>'+
    '</article>';
  }).join("");
}

function renderDuel(containerId,fixedId){
  var box=document.getElementById(containerId);
  if(!box||PLAYERS.length<2)return;
  var byId={};PLAYERS.forEach(function(p){byId[p.id]=p});
  var mvpCount={};
  MATCHES.forEach(function(m){if(m.mvp)mvpCount[m.mvp.id]=(mvpCount[m.mvp.id]||0)+1});
  var sorted=PLAYERS.slice().sort(function(a,b){return a.name.localeCompare(b.name,"fr")});

  box.innerHTML=
    '<div class="duel-pick">'+
      '<label><span>Joueur 1</span><select id="duel-a"></select></label>'+
      '<span class="duel-vs" aria-hidden="true">VS</span>'+
      '<label><span>Joueur 2</span><select id="duel-b"></select></label>'+
    '</div><div id="duel-body"></div>';
  var selA=document.getElementById("duel-a"),selB=document.getElementById("duel-b");
  [selA,selB].forEach(function(sel){
    sorted.forEach(function(p){
      var o=document.createElement("option");o.value=p.id;o.textContent=p.name;sel.appendChild(o);
    });
  });
  if(fixedId&&byId[fixedId]){
    // Fiche joueur : le joueur 1 est celui de la fiche, non modifiable
    selA.value=fixedId;selA.disabled=true;
    var rival=PLAYERS.find(function(p){return p.id!==fixedId});
    selB.value=rival.id;
    selB.querySelector('option[value="'+fixedId+'"]').remove();
  }else{selA.value=PLAYERS[0].id;selB.value=PLAYERS[1].id}

  function per(p,f){return p.games?p[f]/p.games:0}
  var lines=[
    {label:"Points",get:function(p){return p.points}},
    {label:"Rang",get:function(p){return p.rank},low:true,show:function(v){return "#"+v}},
    {label:"Parties",get:function(p){return p.games},neutral:true},
    {label:"Winrate",get:function(p){return p.winRate},show:function(v){return fmt(v*100,1)+" %"}},
    {label:"Kills / partie",get:function(p){return per(p,"kills")},show:function(v){return fmt(v,1)}},
    {label:"Morts / partie",get:function(p){return per(p,"deaths")},low:true,show:function(v){return fmt(v,1)}},
    {label:"Assists / partie",get:function(p){return per(p,"assists")},show:function(v){return fmt(v,1)}},
    {label:"KDA",get:function(p){return p.kda},show:function(v){return fmt(v)}},
    {label:"MVP",get:function(p){return mvpCount[p.id]||0}},
    {label:"Série record",get:function(p){return p.bestWinStreak}}
  ];

  function draw(){
    var a=byId[selA.value],b=byId[selB.value],body=document.getElementById("duel-body");
    if(a===b){body.innerHTML='<p class="duel-empty">Choisis deux joueurs différents.</p>';return}
    var rowsHtml=lines.map(function(l){
      var va=l.get(a),vb=l.get(b),show=l.show||String;
      var wa=!l.neutral&&(l.low?va<vb:va>vb),wb=!l.neutral&&(l.low?vb<va:vb>va);
      var total=Math.abs(va)+Math.abs(vb),pa=total?Math.round(Math.abs(va)/total*100):50;
      if(l.low&&total)pa=100-pa;
      return '<tr><td class="duel-v'+(wa?' is-best':'')+'">'+show(va)+'</td>'+
        '<th scope="row">'+l.label+'<span class="duel-bar"><i style="width:'+pa+'%"></i></span></th>'+
        '<td class="duel-v'+(wb?' is-best':'')+'">'+show(vb)+'</td></tr>';
    }).join("");

    // Parties en commun
    var together={w:0,l:0},against={a:0,b:0},games=[];
    MATCHES.forEach(function(m){
      var all=m.A.concat(m.B),ra=all.find(function(r){return r.id===a.id}),rb=all.find(function(r){return r.id===b.id});
      if(!ra||!rb)return;
      if(ra.team===rb.team){ra.win?together.w++:together.l++}
      else{ra.win?against.a++:against.b++}
      games.push(m.num);
    });
    var common=games.length
      ?'<div class="duel-common">'+
          '<div><span>Ensemble</span><strong>'+together.w+' V – '+together.l+' D</strong></div>'+
          '<div><span>L’un contre l’autre</span><strong>'+escHtml(a.name)+' '+against.a+' – '+against.b+' '+escHtml(b.name)+'</strong></div>'+
        '</div><p class="duel-games">Parties en commun : '+games.map(gameLink).join(", ")+'</p>'
      :'<p class="duel-games">Ces deux joueurs n’ont encore jamais joué la même partie.</p>';

    body.innerHTML=
      '<table class="duel-table"><thead><tr><th scope="col">'+playerLink(a)+'</th><th scope="col"><span class="sr-only">Statistique</span></th><th scope="col">'+playerLink(b)+'</th></tr></thead>'+
      '<tbody>'+rowsHtml+'</tbody></table>'+common;
  }
  selA.addEventListener("change",draw);
  selB.addEventListener("change",draw);
  draw();
}
