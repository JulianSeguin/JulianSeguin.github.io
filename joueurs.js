var PLAYERS=[
  {id:"sacha",name:"Sacha",games:7,wins:7,losses:0,points:21,kills:37,deaths:18,assists:65},
  {id:"charles",name:"Charles",games:7,wins:5,losses:2,points:15,kills:51,deaths:21,assists:51},
  {id:"martin",name:"Martin",games:6,wins:4,losses:2,points:12,kills:29,deaths:36,assists:30},
  {id:"paul",name:"Paul",games:5,wins:3,losses:2,points:9,kills:26,deaths:22,assists:27},
  {id:"eliot",name:"Eliot",games:3,wins:3,losses:0,points:9,kills:12,deaths:17,assists:50},
  {id:"clement",name:"Clement",games:3,wins:2,losses:1,points:6,kills:25,deaths:21,assists:22},
  {id:"killian",name:"Killian",games:4,wins:2,losses:2,points:6,kills:9,deaths:35,assists:22},
  {id:"alex",name:"Alex",games:4,wins:2,losses:2,points:6,kills:17,deaths:14,assists:22},
  {id:"alexis",name:"Alexis",games:2,wins:1,losses:1,points:3,kills:8,deaths:4,assists:8},
  {id:"maxime",name:"Maxime",games:2,wins:1,losses:1,points:3,kills:14,deaths:11,assists:7},
  {id:"jeanne",name:"Jeanne",games:2,wins:1,losses:1,points:3,kills:4,deaths:10,assists:13},
  {id:"adam",name:"Adam",games:2,wins:1,losses:1,points:3,kills:5,deaths:5,assists:13},
  {id:"rodrigue",name:"Rodrigue",games:3,wins:1,losses:2,points:3,kills:33,deaths:16,assists:14},
  {id:"kody",name:"Kody",games:3,wins:1,losses:2,points:3,kills:7,deaths:22,assists:38},
  {id:"cyrille",name:"Cyrille",games:5,wins:1,losses:4,points:3,kills:25,deaths:35,assists:37},
  {id:"mathias",name:"Mathias",games:2,wins:0,losses:2,points:0,kills:3,deaths:10,assists:6},
  {id:"smolder",name:"Smolder",games:3,wins:0,losses:3,points:0,kills:18,deaths:15,assists:21},
  {id:"ethan",name:"Ethan",games:7,wins:0,losses:7,points:0,kills:28,deaths:41,assists:42}
];
var KILL_ORDER=["charles","sacha","rodrigue","martin","ethan","paul","cyrille","clement","smolder","alex","maxime","eliot","killian","alexis","kody","adam","jeanne","mathias"];
var DEATH_ORDER=["ethan","martin","killian","cyrille","paul","kody","clement","charles","sacha","eliot","rodrigue","smolder","alex","maxime","jeanne","mathias","adam","alexis"];
var ASSIST_ORDER=["sacha","charles","eliot","ethan","kody","cyrille","martin","paul","alex","killian","clement","smolder","rodrigue","jeanne","adam","alexis","maxime","mathias"];

function setupPlayerSearch(formId,inputId,resultsId,onSearch){
  var form=document.getElementById(formId);
  var input=document.getElementById(inputId);
  var results=document.getElementById(resultsId);
  function normalize(value){
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
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
