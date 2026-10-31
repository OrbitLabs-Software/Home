(function(){
var area=$('area'),hs={},NAMES={reaktion:'Reaktion',memory:'Memory',mathe:'Kopfrechnen',session:'Pro Session'},tm=[],iv=null;
try{hs=JSON.parse(localStorage.getItem('orbit-pro')||'{}')}catch(e){}
function save(k,v){if(window.OrbitAuth&&OrbitAuth.log)OrbitAuth.log('game',NAMES[k]+': '+v+' Punkte'+(!hs[k]||v>hs[k]?' – neuer Rekord!':''),k);if(!hs[k]||v>hs[k]){hs[k]=v;try{localStorage.setItem('orbit-pro',JSON.stringify(hs))}catch(e){}}renderHs()}
function renderHs(){$('hs').innerHTML=Object.keys(NAMES).map(function(k){return '<span class="chip">'+NAMES[k]+': '+(hs[k]||0)+'</span>'}).join('')}
function clr(){tm.forEach(clearTimeout);tm=[];clearInterval(iv)}
function later(f,ms){tm.push(setTimeout(f,ms))}
function menu(){clr();area.innerHTML='<div class="grid"><article class="card"><div class="ico">⚡</div><h3>Reaktion</h3><p>5 Runden – klicke, sobald das Feld grün wird.</p><button class="btn btn-ghost btn-sm" data-m="reaktion">Starten</button></article><article class="card"><div class="ico">◈</div><h3>Memory</h3><p>Finde alle 8 Paare mit möglichst wenigen Zügen.</p><button class="btn btn-ghost btn-sm" data-m="memory">Starten</button></article><article class="card"><div class="ico">∑</div><h3>Kopfrechnen</h3><p>45 Sekunden – so viele Aufgaben wie möglich.</p><button class="btn btn-ghost btn-sm" data-m="mathe">Starten</button></article></div><div class="center" style="margin-top:30px"><button class="btn btn-primary" data-m="session">▶ Pro Session starten (alle 3 Modi)</button></div>'}
area.addEventListener('click',function(e){var b=e.target.closest('[data-m]');if(b)start(b.dataset.m)});
var G={};
function start(m){
  clr();
  if(m==='session'){var seq=['reaktion','memory','mathe'],tot=0,i=0;(function next(){
    if(i>=3){save('session',tot);area.innerHTML='<div class="panel center"><div class="eyebrow">Session beendet</div><h2>'+tot+' Punkte</h2><p style="margin:12px 0 24px">Rekord: '+hs.session+'</p><button class="btn btn-primary" data-m="session">Nochmal</button> <button class="btn btn-ghost" data-m="menu">Menü</button></div>';return}
    var name=seq[i];area.innerHTML='<p class="center">Modus '+(i+1)+' von 3: <b>'+NAMES[name]+'</b></p><div id="g"></div>';G[name](function(p,info){tot+=p;i++;area.innerHTML='<div class="panel center"><h3>'+NAMES[name]+': '+p+' Punkte</h3><p>'+info+'</p><p style="margin:10px 0 20px">Zwischenstand: '+tot+'</p><button class="btn btn-primary" id="nx">Weiter →</button></div>';$('nx').onclick=next})
  })();return}
  if(m==='menu')return menu();
  area.innerHTML='<div id="g"></div>';
  G[m](function(p,info){save(m,p);area.innerHTML='<div class="panel center"><div class="eyebrow">'+NAMES[m]+'</div><h2>'+p+' Punkte</h2><p style="margin:12px 0 24px">'+info+' · Rekord: '+hs[m]+'</p><button class="btn btn-primary" data-m="'+m+'">Nochmal</button> <button class="btn btn-ghost" data-m="menu">Menü</button></div>'});
}
G.reaktion=function(done){
  var g=$('g'),res=[],t0=0,st='';
  g.innerHTML='<div class="reactbox" id="rb"></div><p class="center" id="ri" style="margin-top:12px"></p>';
  var rb=$('rb');
  function round(){st='wait';rb.style.background='#c2410c';rb.textContent='Warte …';$('ri').textContent='Runde '+(res.length+1)+' von 5';later(function(){st='go';rb.style.background='#059669';rb.textContent='JETZT!';t0=performance.now()},1500+Math.random()*2500)}
  rb.addEventListener('click',function(){
    if(st==='wait'){clr();st='early';rb.style.background='#7c3aed';rb.textContent='Zu früh! Klicke zum Neustart';return}
    if(st==='early'){round();return}
    if(st==='go'){var d=Math.round(performance.now()-t0);res.push(d);st='';rb.style.background='#2563eb';rb.textContent=d+' ms';
      if(res.length>=5){var avg=Math.round(res.reduce(function(a,b){return a+b})/5);later(function(){done(Math.max(0,Math.round(1000-avg*2)),'Ø '+avg+' ms')},900)}else later(round,900)}
  });
  round();
};
G.memory=function(done){
  var e=['🚀','🪐','🌙','⭐','☄️','🛰️','👾','🔭'],c=e.concat(e),i,j,t;
  for(i=c.length-1;i>0;i--){j=Math.floor(Math.random()*(i+1));t=c[i];c[i]=c[j];c[j]=t}
  var open=[],moves=0,found=0,t0=Date.now(),lock=false,g=$('g');
  g.innerHTML='<p class="center" id="mi">Züge: 0</p><div class="mem" id="mm"></div>';
  c.forEach(function(x){var b=document.createElement('button');b.dataset.v=x;b.textContent='?';$('mm').appendChild(b)});
  $('mm').addEventListener('click',function(ev){
    var b=ev.target.closest('button');if(!b||lock||b.disabled||open.indexOf(b)>-1)return;
    b.textContent=b.dataset.v;b.classList.add('flip');open.push(b);
    if(open.length===2){moves++;$('mi').textContent='Züge: '+moves;
      if(open[0].dataset.v===open[1].dataset.v){open.forEach(function(x){x.disabled=true});open=[];found++;
        if(found===8){var s=Math.round((Date.now()-t0)/1000);later(function(){done(Math.max(0,1000-moves*20-s*4),moves+' Züge in '+s+' s')},600)}}
      else{lock=true;later(function(){open.forEach(function(x){x.textContent='?';x.classList.remove('flip')});open=[];lock=false},700)}}
  });
};
G.mathe=function(done){
  var ok=0,bad=0,left=45,a,b,op,ans,g=$('g');
  g.innerHTML='<div class="panel center"><p id="mt">Zeit: 45 s</p><h2 id="mq" style="margin:18px 0"></h2><input type="number" id="ma" autofocus style="max-width:200px;text-align:center"><p id="mr" style="margin-top:12px">Richtig: 0 · Falsch: 0</p></div>';
  function q(){a=1+Math.floor(Math.random()*12);b=1+Math.floor(Math.random()*12);op=['+','−','×'][Math.floor(Math.random()*3)];
    if(op==='−'&&b>a){var t=a;a=b;b=t}ans=op==='+'?a+b:op==='−'?a-b:a*b;$('mq').textContent=a+' '+op+' '+b+' = ?';$('ma').value='';$('ma').focus()}
  $('ma').addEventListener('keydown',function(e){if(e.key!=='Enter'||this.value==='')return;if(+this.value===ans)ok++;else bad++;$('mr').textContent='Richtig: '+ok+' · Falsch: '+bad;q()});
  iv=setInterval(function(){left--;$('mt').textContent='Zeit: '+left+' s';if(left<=0){clearInterval(iv);done(Math.max(0,ok*60-bad*30),ok+' richtig, '+bad+' falsch')}},1000);
  q();
};
renderHs();menu();
})();
