(function(){
var A=window.OrbitAuth,p=$('mpanel'),ul=$('mlist');
if(!A||A.mode!=='firebase'||!p)return;
p.hidden=false;var off=null;
function seenN(id){try{return +localStorage.getItem('orbit-seen:'+id)||0}catch(e){return 0}}
A.onChange(function(u){if(off){off();off=null}if(!u)return;
  A.db().then(function(db){off=db.collection('threads').where('uid','==',u.uid).onSnapshot(function(s){
    var l=s.docs.map(function(x){var d=x.data();d.id=x.id;return d}).filter(function(t){return t.messages&&t.messages.length}).sort(function(a,b){return b.updatedAt-a.updatedAt});
    ul.innerHTML='';
    if(!l.length){var e=document.createElement('li');e.textContent='Noch keine Nachrichten.';ul.appendChild(e);return}
    l.slice(0,3).forEach(function(t){var m=t.messages[t.messages.length-1],li=document.createElement('li'),neu=m.from==='admin'&&t.messages.length>seenN(t.id);
      li.textContent=(neu?'● Neue Antwort · ':'')+'['+t.art+'] '+m.text.slice(0,50);ul.appendChild(li)})},function(){ul.innerHTML='<li>Nachrichten sind noch nicht eingerichtet.</li>'})}).catch(function(){ul.innerHTML='<li>Nachrichten nicht verfügbar.</li>'})});
})();
