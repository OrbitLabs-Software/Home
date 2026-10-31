(function(){
var admin=document.body.dataset.mode==='admin',root=$('inbox'),A=window.OrbitAuth,cur=null,off=[],db,me,list=[];
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function fmt(ts){return new Date(ts).toLocaleString('de-AT',{dateStyle:'short',timeStyle:'short'})}
function info(t,link){root.innerHTML='';var p=el('p','msg',t);root.appendChild(p);if(link){var a=el('a','btn btn-primary',link[0]);a.href=link[1];a.style.marginTop='12px';root.appendChild(a)}}
function seen(t){try{localStorage.setItem('orbit-seen:'+t.id,t.messages.length)}catch(e){}}
function isNew(t){var l=t.messages[t.messages.length-1],s=0;try{s=+localStorage.getItem('orbit-seen:'+t.id)||0}catch(e){}return !admin&&l.from==='admin'&&t.messages.length>s}
function layout(){root.innerHTML='';root.style.display='grid';var w=el('div','thr'),c=el('div','chat');c.id='chat';w.id='thr';root.appendChild(w);root.appendChild(c);
  if(admin){var u=el('p','msg','Deine Benutzer-ID (für die Firestore-Regeln): '+me.uid);u.style.gridColumn='1/-1';u.style.userSelect='all';root.insertBefore(u,w)}}
function drawList(){var w=$('thr');w.innerHTML='';
  if(!list.length){w.appendChild(el('p','msg',admin?'Noch keine Anfragen.':'Du hast noch keine Nachrichten geschrieben.'));if(!admin){var a=el('a','btn btn-primary','Nachricht schreiben');a.href='kontakt.html';w.appendChild(a)}return}
  list.forEach(function(t){var b=el('button','thread'+(cur===t.id?' on':''));b.type='button';
    var l=t.messages[t.messages.length-1];
    b.appendChild(el('b',null,(admin?(t.name||t.email||'?')+' · ':'')+'['+t.art+']'));
    b.appendChild(el('span',null,l.text.slice(0,60)));
    b.appendChild(el('small',null,fmt(t.updatedAt)+(isNew(t)?' · ● Neue Antwort':'')));
    b.onclick=function(){cur=t.id;drawList();drawChat()};w.appendChild(b)})}
function drawChat(){var c=$('chat');c.innerHTML='';var t=list.filter(function(x){return x.id===cur})[0];
  if(!t){c.appendChild(el('p','msg','Wähle links eine Unterhaltung.'));return}
  seen(t);
  if(admin)c.appendChild(el('p','msg',(t.name||'')+' <'+(t.email||'')+'>'));
  var box=el('div','bubs');t.messages.forEach(function(m){var mine=admin?m.from==='admin':m.from==='user';var b=el('div','bub '+(mine?'me':'other'));b.appendChild(el('div',null,m.text));b.appendChild(el('small',null,(m.from==='admin'?'OrbitLabs':(t.name||'Du'))+' · '+fmt(m.ts)));box.appendChild(b)});
  c.appendChild(box);box.scrollTop=box.scrollHeight;
  var ta=el('textarea');ta.rows=3;ta.placeholder='Antwort schreiben …';ta.maxLength=2000;
  var bt=el('button','btn btn-primary','Senden');bt.type='button';var er=el('p','msg');
  bt.onclick=function(){var x=ta.value.trim();if(!x)return;bt.disabled=true;er.textContent='';
    db.collection('threads').doc(t.id).update({messages:firebase.firestore.FieldValue.arrayUnion({from:admin?'admin':'user',text:x,ts:Date.now()}),updatedAt:Date.now()})
      .catch(function(e){er.className='msg err';er.textContent='Senden fehlgeschlagen: '+e.message}).then(function(){bt.disabled=false})};
  c.appendChild(ta);c.appendChild(bt);c.appendChild(er)}
function start(u){me=u;A.db().then(function(d){db=d;layout();
  var q=admin?db.collection('threads').orderBy('updatedAt','desc'):db.collection('threads').where('uid','==',u.uid);
  var got=false,tm=setTimeout(function(){if(!got){var w=$('thr');if(w){w.innerHTML='';w.appendChild(el('p','msg','Firestore antwortet nicht. Wurde die Datenbank unter Firebase → Firestore Database angelegt?'))}}},8000);
  off.push(q.onSnapshot(function(s){got=true;clearTimeout(tm);list=s.docs.map(function(x){var d=x.data();d.id=x.id;return d}).filter(function(t){return t.messages&&t.messages.length});
    list.sort(function(a,b){return b.updatedAt-a.updatedAt});if(!cur&&list.length)cur=list[0].id;drawList();drawChat()},function(e){got=true;clearTimeout(tm);
    info(e.code==='permission-denied'?(admin?'Kein Zugriff. Trage deine Benutzer-ID in die Firestore-Regeln ein.':'Kein Zugriff. Die Firestore-Regeln fehlen noch.'):'Fehler: '+e.message)}))}).catch(function(e){info(e.message)})}
if(!A||A.mode!=='firebase')info('Nachrichten gibt es nur mit echtem Login (Firebase).');
else A.onChange(function(u){off.forEach(function(f){f()});off=[];if(!u)info('Bitte melde dich an, um deine Nachrichten zu sehen.',['Anmelden','login.html?next=pages/'+(admin?'admin':'nachrichten')+'.html']);else start(u)});
})();
