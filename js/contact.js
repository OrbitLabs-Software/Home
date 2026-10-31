(function(){
var S=window.ORBIT_SITE||{email:'OrbitLabs.Software@outlook.com',formEndpoint:''},m=$('cmsg');
function show(t,c){m.className='msg '+(c||'');m.textContent=t}
try{if(window.OrbitAuth)OrbitAuth.ready.then(function(){OrbitAuth.onChange(function(u){if(u){if(!$('cname').value)$('cname').value=u.name;if(!$('cmail').value&&/@/.test(u.email))$('cmail').value=u.email}})}).catch(function(){})}catch(x){}
var fb=!!(window.OrbitAuth&&OrbitAuth.mode==='firebase');
function gate(u){if(!fb)return;$('cform').style.display=u?'':'none';$('cgate').hidden=!!u}
if(fb){gate(null);OrbitAuth.onChange(gate);OrbitAuth.ready.catch(function(){gate(null)})}
function saveThread(f){var A=window.OrbitAuth;if(!A||A.mode!=='firebase'||!A.user)return Promise.resolve(false);
  return A.db().then(function(db){var n=Date.now();return db.collection('threads').add({uid:A.user.uid,name:f.name,email:f.email,art:f.art,createdAt:n,updatedAt:n,messages:[{from:'user',text:f.message,ts:n}]})}).then(function(){return true},function(){return false})}
function openSent(saved){$('sent-p').textContent=saved?'Danke! Unsere Antwort findest du in deinem Dashboard unter „Nachrichten“.':'Danke für deine Nachricht! Wir melden uns so schnell wie möglich bei dir.';var d=$('sent');d.hidden=false;$('sent-ok').focus()}
function closeSent(){$('sent').hidden=true}
$('sent-ok').addEventListener('click',closeSent);
$('sent').addEventListener('click',function(e){if(e.target===this)closeSent()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSent()});
$('cform').addEventListener('submit',function(e){
  e.preventDefault();
  var f={art:$('cart').value,name:$('cname').value.trim(),email:$('cmail').value.trim(),message:$('ctext').value.trim()};
  if(!f.name||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)||f.message.length<10)return show('Bitte Name, gültige E-Mail und eine Nachricht (mind. 10 Zeichen) eingeben.','err');
  if(!$('cpriv').checked)return show('Bitte bestätige die Datenschutzerklärung.','err');
  if(fb&&!(window.OrbitAuth.user))return show('Bitte melde dich zuerst an.','err');
  if(S.formEndpoint||fb){
    var btn=$('cform').querySelector('button[type=submit]');btn.disabled=true;show('Sende …');var sp=saveThread(f),fm='';
    var fp=S.formEndpoint?fetch(S.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(f)}).then(function(r){return r.json().catch(function(){return {}}).then(function(d){
      if(!r.ok)throw new Error((d.errors&&d.errors.map(function(x){return x.message}).join(' '))||d.error||('Fehler '+r.status));return true})}).catch(function(err){fm=err.message==='Failed to fetch'?'keine Verbindung zu Formspree':err.message;return false}):Promise.resolve(false);
    Promise.all([sp,fp]).then(function(r){
      if(r[0]||r[1]){show('Nachricht wurde gesendet.','ok');$('cform').reset();openSent(r[0])}
      else show('Senden fehlgeschlagen ('+(fm||'Nachricht konnte nicht gespeichert werden')+'). Bitte schreibe direkt an '+S.email,'err')}).then(function(){btn.disabled=false});
  }else{
    var body='Name: '+f.name+'\nE-Mail: '+f.email+'\n\n'+f.message;
    location.href='mailto:'+S.email+'?subject='+encodeURIComponent('['+f.art+'] Anfrage über orbitlabs')+'&body='+encodeURIComponent(body);
    show('Dein E-Mail-Programm wurde geöffnet. Sende die Nachricht dort ab.','ok');
  }
});
})();
