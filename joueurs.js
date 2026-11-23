// Données issues du Google Sheet « Tournoi LOL » (onglet « Classement & Statistiques »)
// Mise à jour : 11 parties enregistrées. Ordre = ordre du classement du tableur.
var TOTAL_GAMES=11;
var PLAYERS=[
  {id:"sacha",name:"Sacha",pseudo:"Baro",games:11,wins:11,losses:0,kills:57,deaths:26,assists:90},
  {id:"charles",name:"Charles",pseudo:"Croqeur2Nichon",games:11,wins:7,losses:4,kills:71,deaths:37,assists:66},
  {id:"eliot",name:"Eliot",pseudo:"culottedepopo",games:7,wins:6,losses:1,kills:27,deaths:29,assists:78},
  {id:"clement",name:"Clement",pseudo:"Clemouunito",games:7,wins:4,losses:3,kills:46,deaths:47,assists:42},
  {id:"martin",name:"Martin",pseudo:"behindyou",games:6,wins:4,losses:2,kills:29,deaths:36,assists:30},
  {id:"kody",name:"Kody",pseudo:"Magu",games:7,wins:4,losses:3,kills:18,deaths:38,assists:66},
  {id:"rodrigue",name:"Rodrigue",pseudo:"EvolvedArts",games:7,wins:3,losses:4,kills:69,deaths:35,assists:34},
  {id:"paul",name:"Paul",pseudo:"Do u know CPES",games:5,wins:3,losses:2,kills:26,deaths:22,assists:27},
  {id:"lilian",name:"Lilian",pseudo:"Ack4ck",games:4,wins:3,losses:1,kills:23,deaths:13,assists:39},
  {id:"alex",name:"Alex",pseudo:"xXLilia92IXx67",games:4,wins:2,losses:2,kills:17,deaths:14,assists:22},
  {id:"killian",name:"Killian",pseudo:"kEyzix",games:4,wins:2,losses:2,kills:9,deaths:35,assists:22},
  {id:"cyrille",name:"Cyrille",pseudo:"(Coréen)",games:9,wins:1,losses:8,kills:36,deaths:62,assists:47},
  {id:"ethan",name:"Ethan",pseudo:"KC Raclo Lugubre",games:11,wins:1,losses:10,kills:35,deaths:58,assists:73},
  {id:"maxime",name:"Maxime",pseudo:"maxdon",games:2,wins:1,losses:1,kills:14,deaths:11,assists:7},
  {id:"alexis",name:"Alexis",pseudo:"Firecrowz59",games:2,wins:1,losses:1,kills:8,deaths:4,assists:8},
  {id:"adam",name:"Adam",pseudo:"Mercredi1659",games:2,wins:1,losses:1,kills:5,deaths:5,assists:13},
  {id:"jeanne",name:"Jeanne",pseudo:"Danette",games:2,wins:1,losses:1,kills:4,deaths:10,assists:13},
  {id:"smolder",name:"Smolder",pseudo:"StolDer",games:6,wins:0,losses:6,kills:25,deaths:32,assists:24},
  {id:"mathias",name:"Mathias",pseudo:"MathZz05",games:2,wins:0,losses:2,kills:3,deaths:10,assists:6},
  {id:"iyad",name:"Iyad",pseudo:"tonton sahur",games:1,wins:0,losses:1,kills:2,deaths:2,assists:4}
];
// Points : 3 par victoire. KDA : (kills + assists) / morts.
PLAYERS.forEach(function(p){
  p.points=p.wins*3;
  p.kda=(p.kills+p.assists)/Math.max(p.deaths,1);
});
// Rang avec ex-aequo (1, 2, 3, 4, 4, 4, 7…) selon les points.
PLAYERS.forEach(function(p,i){
  p.rank=(i>0&&PLAYERS[i-1].points===p.points)?PLAYERS[i-1].rank:i+1;
});
// Classement d'une statistique (tri décroissant, rang partagé en cas d'égalité).
function statRanking(field){
  var list=PLAYERS.slice().sort(function(a,b){return b[field]-a[field]});
  return list.map(function(p,i){
    var rank=i+1;
    for(var j=i;j>0&&list[j-1][field]===p[field];j--)rank=j;
    return {player:p,rank:rank};
  });
}
function statRank(field,id){
  var r=statRanking(field).find(function(e){return e.player.id===id});
  return r?r.rank:0;
}

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
