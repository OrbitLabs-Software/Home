
(function(){
function $(i){return document.getElementById(i)}
var A=window.OrbitAuth,B=A.base;
var PROG=[['Notizbrett','notizbrett','⌗'],['BrettBrowser','brettbrowser','◎'],['Musikbrett','musikbrett','♫'],['Zeichenbrett Pro','zeichenbrett','✎']];
var TOOLS=[['PasswortRandom','tools/passwort-generator','🔑'],['SuperRandom','tools/zufallsstring-generator','⚄'],['Unicode Explorer','tools/unicode-explorer','Ⓤ'],['HTML-Editor','tools/html-editor','✎'],['Brett Lernen','tools/multi-sprachen-editor','</>'],['XAPK-Konverter','tools/apk-konverter','⇄'],['Hurlum','spiele/hurlum','◈'],['Pro Session','spiele/pro-session','★']];
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function get(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}
function fmt(ts){return new Date(ts).toLocaleString('de-DE',{dateStyle:'short',timeStyle:'short'})}
function render(){
  var u=A.user;if(!u)return;
  var acts=get('orbit-act:'+u.email,[]),hs=get('orbit-pro',{}),h=new Date().getHours();
  var html='';try{html=localStorage.getItem('orbit-html')||''}catch(e){}
  $('greet').textContent=(h<11?'Guten Morgen':h<18?'Guten Tag':'Guten Abend')+',';
  $('uname').textContent=u.name;$('av').textContent=u.name.charAt(0).toUpperCase();
  var pv=({'google.com':'Google','apple.com':'Apple','github.com':'GitHub','twitter.com':'X (Twitter)','yahoo.com':'Yahoo','phone':'Telefon','anonymous':'Gast','local':'Demo-Konto (nur dieser Browser)'})[u.provider]||'E-Mail';
  $('usub').textContent='Kostenloses Konto · Anmeldung über '+pv+(u.created?' · Mitglied seit '+new Date(u.created).toLocaleDateString('de-DE'):'');
  var dl=acts.filter(function(a){return a.t==='download'}).length;
  $('stats').innerHTML=[['⇩',dl,'Downloads gestartet'],['★',hs.session||0,'Pro-Session-Rekord'],['⚡',hs.reaktion||0,'Reaktions-Rekord'],['✎',html?html.split('\n').length:0,'Zeilen im HTML-Editor']].map(function(s){return '<div class="stat"><div class="i">'+s[0]+'</div><div class="n">'+s[1]+'</div><div class="l">'+s[2]+'</div></div>'}).join('');
  $('prog').innerHTML=PROG.map(function(p){var last=acts.filter(function(a){return a.k===p[0]})[0];
    return '<li><div class="pi">'+p[2]+'</div><div><b>'+p[0]+'</b><small>'+(last?'Zuletzt geladen: '+fmt(last.ts):'Noch nicht geladen')+'</small></div><a class="btn btn-ghost btn-sm" data-protected data-name="'+esc(p[0])+'" href="'+B+'files/'+p[1]+'.exe" download>⇩ Laden</a></li>'}).join('');
  var rec=acts.slice(0,8);
  $('act').innerHTML=rec.length?rec.map(function(a){return '<li><span>'+(a.t==='download'?'⇩':'◈')+'</span><div>'+esc(a.x)+'<br><small>'+fmt(a.ts)+'</small></div></li>'}).join(''):'<li><small>Noch keine Aktivität. Lade ein Programm oder spiele eine Runde.</small></li>';
  $('rec').innerHTML=[['Reaktion','reaktion'],['Memory','memory'],['Kopfrechnen','mathe'],['Pro Session','session']].map(function(r){return '<tr><td>'+r[0]+'</td><td>'+(hs[r[1]]||'–')+'</td></tr>'}).join('');
  $('quick').innerHTML=TOOLS.map(function(t){return '<a href="'+B+'pages/'+t[1]+'.html"><span>'+t[2]+'</span>'+t[0]+'</a>'}).join('');
  $('acc').innerHTML=[['Name',u.name],['E-Mail',u.email],['Anmeldung',pv],['Mitglied seit',u.created?new Date(u.created).toLocaleDateString('de-DE'):'–']].map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd></div>'}).join('');
  $('pwreset').hidden=!(A.mode==='firebase'&&u.provider==='password');
}
$('prog').addEventListener('click',function(e){if(e.target.closest('[data-protected]'))setTimeout(render,250)});
$('pwreset').addEventListener('click',function(){var m=$('amsg');A.reset(A.user.email).then(function(){m.textContent='E-Mail zum Zurücksetzen wurde gesendet.'}).catch(function(e){m.textContent=e.message})});
$('lout').addEventListener('click',function(){A.logout().then(function(){location.href=B+'index.html'})});
$('wipe').addEventListener('click',function(){if(!confirm('Lokale Daten (Rekorde, Aktivität, gespeicherter HTML-Code) auf diesem Gerät löschen?'))return;
  ['orbit-pro','orbit-html','orbit-rating','orbit-act:'+A.user.email].forEach(function(k){try{localStorage.removeItem(k)}catch(e){}});$('amsg').textContent='Lokale Daten gelöscht.';render()});
A.ready.then(function(){A.onChange(function(u){$('gate').hidden=!!u;$('dash').hidden=!u;if(u)render()})});
})();
