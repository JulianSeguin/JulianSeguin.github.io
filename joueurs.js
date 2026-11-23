/* ==========================================================
   Données du tournoi
   Source : Google Sheet « Tournoi LOL »
     - onglet « Saisie Matchs » : une ligne par joueur et par partie
     - onglet « Feuille 1 », colonnes F:G : pseudo → joueur
   Le site lit le Sheet en direct. S'il est inaccessible (pas partagé,
   hors ligne…), il utilise la copie locale ci-dessous.
   ========================================================== */
var SHEET_ID="1oRZSJe3ZjoIbx8F6Jyj7NFkMbU7n-CLJvWAiduGZBbE";
var SHEET_MATCHES="Saisie Matchs";
var SHEET_PSEUDOS="Feuille 1";

/* Copie locale (synchro du 23/11/2026, 12 parties)
   partie | joueur | équipe | V/D | kills | morts | assists */
var LOCAL_MATCHES="\
1|Ethan|A|D|7|7|6;1|Alexis|A|D|3|4|1;1|Alex|A|D|3|5|7;1|Martin|A|D|2|9|4;1|Charles|A|D|8|5|4;\
1|Sacha|B|V|10|4|11;1|Maxime|B|V|6|3|7;1|Paul|B|V|7|5|5;1|Killian|B|V|4|6|12;1|Jeanne|B|V|3|5|5;\
2|Alex|A|V|6|4|4;2|Alexis|A|V|5|0|7;2|Sacha|A|V|3|4|6;2|Martin|A|V|12|3|2;2|Charles|A|V|7|3|9;\
2|Paul|B|D|2|6|7;2|Ethan|B|D|2|0|7;2|Maxime|B|D|8|8|0;2|Jeanne|B|D|1|5|8;2|Killian|B|D|1|14|1;\
3|Alex|A|D|5|2|10;3|Killian|A|D|3|6|6;3|Mathias|A|D|0|7|6;3|Ethan|A|D|3|3|5;3|Paul|A|D|2|7|4;\
3|Charles|B|V|3|2|4;3|Cyrille|B|V|7|6|2;3|Martin|B|V|4|5|7;3|Sacha|B|V|2|2|8;3|Adam|B|V|4|4|2;\
4|Killian|A|V|1|9|3;4|Paul|A|V|8|2|4;4|Martin|A|V|2|2|7;4|Alex|A|V|3|3|1;4|Sacha|A|V|10|2|7;\
4|Cyrille|B|D|8|7|8;4|Charles|B|D|8|1|12;4|Ethan|B|D|4|7|4;4|Mathias|B|D|3|3|0;4|Adam|B|D|1|1|11;\
5|Sacha|A|V|1|1|13;5|Charles|A|V|9|4|5;5|Eliot|A|V|7|7|9;5|Clement|A|V|11|3|4;5|Martin|A|V|1|7|4;\
5|Rodrigue|B|D|7|5|5;5|Ethan|B|D|6|5|6;5|Cyrille|B|D|3|7|3;5|Kody|B|D|2|6|10;5|Smolder|B|D|3|6|7;\
6|Clement|A|V|10|8|13;6|Kody|A|V|2|7|20;6|Charles|A|V|8|4|9;6|Eliot|A|V|3|7|19;6|Sacha|A|V|9|2|12;\
6|Ethan|B|D|6|10|12;6|Martin|B|D|8|10|6;6|Rodrigue|B|D|8|6|5;6|Smolder|B|D|13|6|8;6|Cyrille|B|D|2|9|17;\
7|Ethan|A|D|0|9|2;7|Cyrille|A|D|5|6|7;7|Smolder|A|D|2|3|6;7|Kody|A|D|3|9|8;7|Clement|A|D|4|10|5;\
7|Paul|B|V|7|2|7;7|Rodrigue|B|V|18|5|4;7|Eliot|B|V|2|3|22;7|Sacha|B|V|2|3|8;7|Charles|B|V|8|2|8;\
8|Charles|A|V|9|1|4;8|Lilian|A|V|6|3|9;8|Clement|A|V|7|4|3;8|Sacha|A|V|6|2|7;8|Eliot|A|V|3|2|9;\
8|Smolder|B|D|1|5|1;8|Kody|B|D|2|8|1;8|Ethan|B|D|1|7|5;8|Rodrigue|B|D|7|4|1;8|Cyrille|B|D|1|7|2;\
9|Charles|A|D|3|7|1;9|Cyrille|A|D|3|8|4;9|Clement|A|D|2|10|6;9|Smolder|A|D|5|5|1;9|Eliot|A|D|0|5|5;\
9|Sacha|B|V|2|4|6;9|Lilian|B|V|15|2|7;9|Rodrigue|B|V|14|4|8;9|Kody|B|V|4|2|8;9|Ethan|B|V|0|1|21;\
10|Charles|A|D|4|7|7;10|Iyad|A|D|2|2|4;10|Cyrille|A|D|5|5|2;10|Ethan|A|D|4|6|5;10|Rodrigue|A|D|3|9|6;\
10|Eliot|B|V|6|4|6;10|Sacha|B|V|7|1|5;10|Kody|B|V|3|5|10;10|Clement|B|V|11|5|11;10|Lilian|B|V|2|3|20;\
11|Charles|A|V|4|1|3;11|Sacha|A|V|5|1|7;11|Rodrigue|A|V|12|2|5;11|Kody|A|V|2|1|9;11|Eliot|A|V|6|1|8;\
11|Ethan|B|D|2|3|0;11|Cyrille|B|D|2|7|2;11|Smolder|B|D|1|7|1;11|Clement|B|D|1|7|0;11|Lilian|B|D|0|5|3;\
12|Charles|A|V|13|4|5;12|Ethan|A|V|5|3|6;12|Eliot|A|V|5|2|7;12|Rodrigue|A|V|9|6|6;12|Nanaaane|A|V|0|1|16;\
12|Sacha|B|D|4|6|2;12|Cyrille|B|D|3|6|5;12|Lilian|B|D|4|6|3;12|Clement|B|D|2|9|4;12|Martin|B|D|3|5|5";
var LOCAL_PSEUDOS={Ethan:"TSM RacloLugubre",Alexis:"Firecrowz59",Alex:"xXLilia92IXx67",Martin:"behindyou",Charles:"SelrahC",Paul:"Do u know CPES",Sacha:"Baro",Maxime:"maxdon",Killian:"kEyzix",Jeanne:"Danette",Mathias:"MathZz05",Cyrille:"제오크스",Adam:"Mercredi1659",Eliot:"culottedepopo",Rodrigue:"EvolvedArts",Clement:"Clemouunito",Smolder:"StolDer",Kody:"Magu",Lilian:"Ack4ck",Iyad:"tonton sahur",Nanaaane:"Nanaaane"};

var PLAYERS=[],MATCHES=[],TOTAL_GAMES=0,DATA_SOURCE="local";

/* ---------- Utilitaires ---------- */
function slug(name){return String(name).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-")}
function gameKda(r){return (r.kills+r.assists)/Math.max(r.deaths,1)}
function fmt(n,d){return n.toFixed(d==null?2:d).replace(".",",")}
function escHtml(v){return String(v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}

function parseCsv(text){
  var rows=[],row=[],cell="",q=false;
  for(var i=0;i<text.length;i++){
    var c=text[i];
    if(q){
      if(c==='"'){if(text[i+1]==='"'){cell+='"';i++}else q=false}
      else cell+=c;
    }else if(c==='"')q=true;
    else if(c===","){row.push(cell);cell=""}
    else if(c==="\n"||c==="\r"){
      if(c==="\r"&&text[i+1]==="\n")i++;
      row.push(cell);rows.push(row);row=[];cell="";
    }else cell+=c;
  }
  if(cell||row.length){row.push(cell);rows.push(row)}
  return rows;
}

/* Lignes brutes → {game,name,team,win,kills,deaths,assists} */
function rowsFromLocal(){
  return LOCAL_MATCHES.split(";").map(function(line){
    var p=line.split("|");
    return {game:+p[0],name:p[1],team:p[2],win:p[3]==="V",kills:+p[4],deaths:+p[5],assists:+p[6]};
  });
}
function rowsFromCsv(text){
  var out=[];
  parseCsv(text).forEach(function(c){
    if(c.length<7)return;
    var game=parseInt(String(c[0]).replace(/\D+/g,""),10),name=String(c[1]).trim();
    var res=String(c[3]).trim().toLowerCase();
    if(!game||!name||(res.indexOf("victoire")!==0&&res.indexOf("d")!==0))return;
    var k=parseInt(c[4],10),d=parseInt(c[5],10),a=parseInt(c[6],10);
    if(isNaN(k)||isNaN(d)||isNaN(a))return;
    out.push({game:game,name:name,team:/b\s*$/i.test(String(c[2]).trim())?"B":"A",win:res.indexOf("victoire")===0,kills:k,deaths:d,assists:a});
  });
  return out;
}
function pseudosFromCsv(text){
  var map={};
  parseCsv(text).forEach(function(c){
    var pseudo=String(c[0]||"").trim(),name=String(c[1]||"").trim();
    if(pseudo&&name&&pseudo!=="Pseudo")map[name]=pseudo;
  });
  return map;
}

/* ---------- Calcul du classement à partir des parties ---------- */
function buildTournament(rows,pseudos){
  var byId={},games={};
  rows.forEach(function(r){
    var id=slug(r.name);
    var p=byId[id]||(byId[id]={id:id,name:r.name,pseudo:pseudos[r.name]||"",games:0,wins:0,losses:0,kills:0,deaths:0,assists:0,history:[]});
    p.games++;r.win?p.wins++:p.losses++;
    p.kills+=r.kills;p.deaths+=r.deaths;p.assists+=r.assists;
    r.id=id;r.kda=gameKda(r);
    p.history.push(r);
    (games[r.game]||(games[r.game]=[])).push(r);
  });
  var players=Object.keys(byId).map(function(id){
    var p=byId[id];
    p.points=p.wins*3;
    p.kda=(p.kills+p.assists)/Math.max(p.deaths,1);
    p.winRate=p.games?p.wins/p.games:0;
    p.history.sort(function(a,b){return a.game-b.game});
    var cur=0,best=0,run=0;
    p.history.forEach(function(g){run=g.win?run+1:0;if(run>best)best=run});
    for(var i=p.history.length-1;i>=0;i--){if(p.history[i].win===p.history[p.history.length-1].win)cur++;else break}
    p.streak={type:p.history.length&&p.history[p.history.length-1].win?"V":"D",count:cur};
    p.bestWinStreak=best;
    p.bestGame=p.history.slice().sort(function(a,b){return b.kda-a.kda||b.kills-a.kills})[0]||null;
    return p;
  });
  // Tri : points, puis winrate, puis KDA
  players.sort(function(a,b){return b.points-a.points||b.winRate-a.winRate||b.kda-a.kda||a.name.localeCompare(b.name,"fr")});
  players.forEach(function(p,i){p.rank=(i>0&&players[i-1].points===p.points)?players[i-1].rank:i+1});

  var matches=Object.keys(games).map(Number).sort(function(a,b){return a-b}).map(function(n){
    var list=games[n],A=list.filter(function(r){return r.team==="A"}),B=list.filter(function(r){return r.team==="B"});
    var winner=(A[0]&&A[0].win)?"A":"B";
    var mvp=list.filter(function(r){return r.win}).sort(function(a,b){return b.kda-a.kda||b.kills-a.kills})[0]||null;
    function tot(t,f){return t.reduce(function(s,r){return s+r[f]},0)}
    return {num:n,winner:winner,A:A,B:B,mvp:mvp,killsA:tot(A,"kills"),killsB:tot(B,"kills")};
  });
  matches.forEach(function(m){[m.A,m.B].forEach(function(t){t.forEach(function(r){r.isMvp=m.mvp===r})})});
  return {players:players,matches:matches};
}

/* Points cumulés après chaque partie (index 0 = avant la partie 1) */
function pointsTimeline(player){
  var pts=0,line=[0],byGame={};
  player.history.forEach(function(g){byGame[g.game]=g});
  MATCHES.forEach(function(m){if(byGame[m.num]&&byGame[m.num].win)pts+=3;line.push(pts)});
  return line;
}

/* Classement d'une statistique (tri décroissant, rang partagé en cas d'égalité) */
function statRanking(field){
  var list=PLAYERS.slice().sort(function(a,b){return b[field]-a[field]||a.rank-b.rank});
  var out=[];
  list.forEach(function(p,i){
    var rank=(i>0&&list[i-1][field]===p[field])?out[i-1].rank:i+1;
    out.push({player:p,rank:rank});
  });
  return out;
}
function statRank(field,id){
  var r=statRanking(field).find(function(e){return e.player.id===id});
  return r?r.rank:0;
}

/* ---------- Chargement ---------- */
function sheetCsvUrl(sheet,range){
  return "https://docs.google.com/spreadsheets/d/"+SHEET_ID+"/gviz/tq?tqx=out:csv&headers=0&sheet="+encodeURIComponent(sheet)+(range?"&range="+range:"");
}
function fetchText(url,ms){
  var ctrl=typeof AbortController!=="undefined"?new AbortController():null;
  var timer=setTimeout(function(){if(ctrl)ctrl.abort()},ms);
  return fetch(url,{signal:ctrl?ctrl.signal:undefined,cache:"no-store"}).then(function(r){
    clearTimeout(timer);
    if(!r.ok)throw new Error("HTTP "+r.status);
    return r.text();
  });
}
function applyTournament(t,source){
  PLAYERS=t.players;MATCHES=t.matches;TOTAL_GAMES=t.matches.length;DATA_SOURCE=source;
  return {players:PLAYERS,matches:MATCHES,source:source};
}
var _tournamentPromise=null;
function loadTournament(){
  if(_tournamentPromise)return _tournamentPromise;
  var local=function(){return applyTournament(buildTournament(rowsFromLocal(),LOCAL_PSEUDOS),"local")};
  if(typeof fetch==="undefined"||location.protocol==="file:"){_tournamentPromise=Promise.resolve(local());return _tournamentPromise}
  _tournamentPromise=Promise.all([
    fetchText(sheetCsvUrl(SHEET_MATCHES,"A1:G2000"),5000),
    fetchText(sheetCsvUrl(SHEET_PSEUDOS,"F1:G200"),5000).catch(function(){return ""})
  ]).then(function(res){
    var rows=rowsFromCsv(res[0]);
    if(rows.length<10)throw new Error("Sheet vide ou illisible");
    var pseudos=res[1]?pseudosFromCsv(res[1]):{};
    Object.keys(LOCAL_PSEUDOS).forEach(function(n){if(!pseudos[n])pseudos[n]=LOCAL_PSEUDOS[n]});
    return applyTournament(buildTournament(rows,pseudos),"live");
  }).catch(function(err){
    if(window.console)console.info("Google Sheet indisponible, données locales utilisées :",err&&err.message);
    return local();
  });
  return _tournamentPromise;
}
/* Affiche l'origine des données dans les éléments .data-source */
function showDataSource(){
  document.querySelectorAll(".data-source").forEach(function(el){
    el.textContent=DATA_SOURCE==="live"
      ?"Données en direct du Google Sheet · "+TOTAL_GAMES+" parties"
      :"Données locales · "+TOTAL_GAMES+" parties";
    el.setAttribute("data-live",DATA_SOURCE==="live"?"true":"false");
  });
}

/* ---------- Recherche ---------- */
function setupPlayerSearch(formId,inputId,resultsId,onSearch){
  var form=document.getElementById(formId);
  var input=document.getElementById(inputId);
  var results=document.getElementById(resultsId);
  function normalize(value){
    return value.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim();
  }
  function search(){
    results.textContent="";
    var query=normalize(input.value);
    if(onSearch){
      onSearch(query);
      return;
    }
    var matches=query?PLAYERS.filter(function(player){return normalize(player.name).indexOf(query)!==-1}):[];
    var message=document.createElement("p");
    message.className="search-message";
    message.setAttribute("role","status");
    if(!query){
      message.textContent="Saisis le nom d’un joueur.";
      results.appendChild(message);
      return;
    }
    if(!matches.length){
      message.textContent="Aucun joueur trouvé.";
      results.appendChild(message);
      return;
    }
    message.textContent=matches.length===1?"Joueur trouvé :":"Joueurs trouvés :";
    results.appendChild(message);
    var list=document.createElement("ul");
    list.className="search-results-list";
    matches.forEach(function(player){
      var item=document.createElement("li");
      var link=document.createElement("a");
      link.href="Joueur.html?joueur="+encodeURIComponent(player.id);
      link.textContent=player.name;
      item.appendChild(link);
      list.appendChild(item);
    });
    results.appendChild(list);
  }
  form.addEventListener("submit",function(event){event.preventDefault();search()});
  input.addEventListener("input",search);
}
