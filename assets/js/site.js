(function(){
  var THEMES=[
    {id:"violet",name:"Violet",bg:"#140f1c",a:"#b77cff",t:"#ece3f8"},
    {id:"paper",name:"Paper",bg:"#f3efe6",a:"#6a2fb0",t:"#1d1b17"}
  ];
  var root=document.documentElement, KEY="j3utd-theme";
  function setTheme(id){
    root.setAttribute("data-theme",id);
    try{localStorage.setItem(KEY,id)}catch(e){}
    var meta=document.querySelector('meta[name="theme-color"]');
    var th=THEMES.filter(function(x){return x.id===id})[0];
    if(meta&&th)meta.setAttribute("content",th.bg);
  }
  document.getElementById("themeBtn").addEventListener("click",function(){setTheme(root.getAttribute("data-theme")==="paper"?"violet":"paper")});
  var saved=null;try{saved=localStorage.getItem(KEY)}catch(e){}
  setTheme(THEMES.some(function(x){return x.id===saved})?saved:"violet");
  document.addEventListener("keydown",function(e){
    if(e.metaKey||e.ctrlKey||e.altKey)return;
    var tag=(e.target.tagName||"").toLowerCase();
    if(tag==="input"||tag==="textarea"||e.target.isContentEditable)return;
    if(e.key==="t"||e.key==="T"){
      var cur=root.getAttribute("data-theme"),idx=THEMES.findIndex(function(x){return x.id===cur});
      setTheme(THEMES[(idx+(e.shiftKey?-1:1)+THEMES.length)%THEMES.length].id);
    }
  });

  document.querySelectorAll(".copy").forEach(function(btn){
    btn.addEventListener("click",function(){
      var done=function(){btn.textContent="copied";btn.classList.add("done");setTimeout(function(){btn.textContent="copy";btn.classList.remove("done")},1600)};
      if(navigator.clipboard)navigator.clipboard.writeText(btn.dataset.copy).then(done,function(){});
    });
  });

  var nav=document.getElementById("nav"),menuBtn=document.getElementById("menuBtn");
  menuBtn.addEventListener("click",function(){menuBtn.setAttribute("aria-expanded",nav.classList.toggle("open"))});
  nav.querySelectorAll(".nav-links a").forEach(function(a){a.addEventListener("click",function(){nav.classList.remove("open");menuBtn.setAttribute("aria-expanded","false")})});

  var cves=document.getElementById("cves"),tog=document.getElementById("cveToggle");
  tog.addEventListener("click",function(){var o=cves.classList.toggle("open");tog.textContent=o?"Show fewer ↑":"Show more →";tog.setAttribute("aria-expanded",o)});

  // Screenshots: open the full size in a dialog (a plain link to the image without JavaScript)
  var viewer=document.getElementById("viewer"),vImg=document.getElementById("viewerImg"),vCap=document.getElementById("viewerCaption");
  if(viewer.showModal){
    document.querySelectorAll("a.zoom").forEach(function(a){
      a.addEventListener("click",function(e){
        e.preventDefault();
        var img=a.querySelector("img");
        vImg.src=a.getAttribute("href");vImg.alt=img?img.alt:"";vCap.textContent=a.getAttribute("data-caption")||"";
        viewer.showModal();
      });
    });
    document.getElementById("viewerClose").addEventListener("click",function(){viewer.close()});
    viewer.addEventListener("click",function(e){if(e.target===viewer)viewer.close()});
  }

  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var phrases=["We kept going.","We kept it secure.","We kept it current.","We kept it yours."];
  var typed=document.getElementById("typed"),pi=0,ci=phrases[0].length,del=true;
  function tick(){
    if(del){ci--;if(ci<=0){del=false;pi=(pi+1)%phrases.length}}
    else{ci++;if(ci>=phrases[pi].length){del=true;typed.textContent=phrases[pi];return setTimeout(tick,2600)}}
    typed.textContent=phrases[pi].slice(0,Math.max(ci,0))||"​";
    setTimeout(tick,del?35:65);
  }
  if(!reduce)setTimeout(tick,2600);

  // The terminal: a new site from the command line (real output of core:install), or an upgrade in place
  var SCRIPTS=[
    {title:"~/sites/new-site — install",lines:[
      {o:'<span class="cm"># a new site: download and unpack in an empty folder (the installation/ folder stays, the installer needs it)</span>'},
      {c:"wget -q https://github.com/joomlaworks/joomla-3.x/releases/download/rolling/joomla-latest.zip && unzip -q joomla-latest.zip && rm joomla-latest.zip"},
      {o:'<span class="cm"># then open the site in a browser to install it, or install it right here, on SQLite, with a sample data set:</span>'},
      {c:'php cli/joomla.php core:install --site-name="Rookwood Studio" --admin-email=me@example.com --admin-username=admin --sample-data=studio'},
      {o:'<span class="hd">Install Joomla</span>'},
      {o:'Creating the database ...'},
      {o:'Creating the tables and data ...'},
      {o:'Installing the sample data ...'},
      {o:'Writing the configuration and creating the Super User ...'},
      {o:'<span class="ok">[OK]</span> Joomla is installed: "Rookwood Studio", on the SQLite database database/joomla-27f507ef3c75de8c.sqlite.'},
      {o:'Administrator  admin\nPassword       ••••••••••••••••'},
      {o:'<span class="cm"># 1.4 seconds, sample data included, installation/ removed. No database server needed.</span>'},
      {c:"php cli/joomla.php site:health"},
      {o:'<span class="ok">[OK]</span> 12 ok, 5 info, 0 warning(s), 0 error(s).'},
      {c:"claude mcp add joomla -- php $PWD/cli/joomla.php mcp:serve"},
      {o:'<span class="cm"># your AI assistant can now read (and, with --allow-write, change) the site</span>'}
    ]},
    {title:"~/sites/example.com — upgrade",lines:[
      {o:'<span class="cm"># an existing Joomla 3.x site: unpack the new files over it (installation/ isn’t needed there, so it’s removed)</span>'},
      {c:"cd /var/www/example.com"},
      {c:"wget -qO- https://github.com/joomlaworks/joomla-3.x/archive/refs/heads/main.tar.gz | tar -xz --strip-components=1 && rm -rf installation .github .gitignore *.md"},
      {o:'<span class="cm"># the new files are in place, over the existing Joomla 3.x site</span>'},
      {c:"php cli/joomla.php site:info | grep Version"},
      {o:'joomlaVersion    3.17.0\nphpVersion       8.5.11'},
      {o:'<span class="cm"># from now on, one command checks for updates and applies them</span>'},
      {c:"php cli/joomla.php core:update"},
      {o:'<span class="hd">Updating Joomla</span>'},
      {o:'Checking for updates ...'},
      {o:'<span class="ok">[OK]</span> You already have the latest Joomla! version 3.17.0.'}
    ]}
  ];
  var term=document.getElementById("term"),termTitle=document.getElementById("termTitle"),tabs=document.querySelectorAll(".term-tabs button");
  var cur=0,html="",li=0,timer=null,run=0;
  function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;")}
  // As a terminal does, keep the newest line in view, unless the visitor has scrolled up to read
  function render(extra){
    var follow=term.scrollHeight-term.scrollTop-term.clientHeight<40;
    term.innerHTML=html+(extra||"")+'<span class="cursor"></span>';
    if(follow)term.scrollTop=term.scrollHeight;
  }
  function show(n){
    cur=n;html="";li=0;run++;clearTimeout(timer);term.scrollTop=0;
    termTitle.textContent=SCRIPTS[n].title;
    tabs.forEach(function(b){b.setAttribute("aria-pressed",+b.getAttribute("data-script")===n?"true":"false")});
    if(reduce){SCRIPTS[n].lines.forEach(function(l){html+=l.o?l.o+"\n":'<span class="pr">$</span> '+esc(l.c)+"\n"});render();return}
    step(run);
  }
  function step(r){
    if(r!==run)return;
    var lines=SCRIPTS[cur].lines;
    if(li>=lines.length){render('<span class="pr">$</span> ');timer=setTimeout(function(){show((cur+1)%SCRIPTS.length)},18000);return}
    var l=lines[li++];
    if(l.o){html+=l.o+"\n";render();timer=setTimeout(function(){step(r)},300);return}
    var i=0;(function type(){
      if(r!==run)return;
      i+=l.c.length>60?3:1;
      render('<span class="pr">$</span> '+esc(l.c.slice(0,i)));
      if(i<l.c.length)timer=setTimeout(type,20);
      else{html+='<span class="pr">$</span> '+esc(l.c)+"\n";timer=setTimeout(function(){step(r)},450)}
    })();
  }
  tabs.forEach(function(b){b.addEventListener("click",function(){show(+b.getAttribute("data-script"))})});
  show(0);

})();
