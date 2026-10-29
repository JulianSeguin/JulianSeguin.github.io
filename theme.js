(function(){
  var storedTheme=localStorage.getItem("lol-theme");
  if(storedTheme==="dark"||storedTheme==="light"){
    document.documentElement.setAttribute("data-theme",storedTheme);
  }

  document.addEventListener("DOMContentLoaded",function(){
    document.querySelectorAll(".footer-year").forEach(function(year){
      year.textContent=String(new Date().getFullYear());
    });
    var button=document.getElementById("theme-toggle");
    if(!button)return;

    function currentTheme(){
      var selected=document.documentElement.getAttribute("data-theme");
      return selected||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
    }

    function updateButton(){
      var dark=currentTheme()==="dark";
      button.innerHTML=dark
        ?'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg><span>Mode clair</span>'
        :'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z"/></svg><span>Mode sombre</span>';
      button.setAttribute("aria-label",dark?"Activer le mode clair":"Activer le mode sombre");
      button.setAttribute("aria-pressed",String(dark));
    }

    button.addEventListener("click",function(){
      var nextTheme=currentTheme()==="dark"?"light":"dark";
      document.documentElement.setAttribute("data-theme",nextTheme);
      localStorage.setItem("lol-theme",nextTheme);
      updateButton();
    });

    updateButton();
  });
})();
