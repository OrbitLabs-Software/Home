(function(){
var cfg=window.ORBIT_AUTH||{firebase:{}};
var BASE=new URL('../',document.currentScript.src).href;
var fbOn=!!(cfg.firebase&&cfg.firebase.apiKey);
var user=null,ready=false,subs=[],A={mode:fbOn?'firebase':'local',base:BASE};
Object.defineProperty(A,'user',{get:function(){return user}});
function ui(){
  var b=document.getElementById('auth-btn'),o=document.getElementById('auth-out');
  if(b){b.textContent=user?'👤 '+user.name.slice(0,14):'Anmelden';b.href=BASE+(user?'pages/dashboard.html':'pages/login.html')}
  if(o)o.hidden=!user;
  var l=document.getElementById('msg-btn');
  if(b&&user&&fbOn&&!l){l=document.createElement('a');l.id='msg-btn';l.className='btn btn-ghost btn-sm';l.href=BASE+'pages/nachrichten.html';l.textContent='✉ Nachrichten';b.parentNode.insertBefore(l,b)}
  if(l)l.hidden=!user;
  document.querySelectorAll('.dl-hint').forEach(function(h){h.textContent=user?'✓ Angemeldet als '+user.email:'🔒 Zum Herunterladen bitte kostenlos anmelden.'});
}
function emit(){ready=true;ui();subs.forEach(function(f){f(user)})}
A.log=function(type,text,key){if(!user)return;var k='orbit-act:'+user.email;try{var l=JSON.parse(localStorage.getItem(k)||'[]');l.unshift({t:type,x:text,k:key||'',ts:Date.now()});localStorage.setItem(k,JSON.stringify(l.slice(0,50)))}catch(e){}};
A.onChange=function(f){subs.push(f);if(ready)f(user)};
A.logout=function(){return Promise.resolve(fbOn?firebase.auth().signOut():localStorage.removeItem('orbit-session')).then(function(){if(!fbOn){user=null;emit()}})};
function checkInput(email,pw){
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))throw new Error('Bitte eine gültige E-Mail-Adresse eingeben.');
  if(!pw||pw.length<8)throw new Error('Das Passwort muss mindestens 8 Zeichen haben.');
}
if(fbOn){
  var msg={'auth/email-already-in-use':'Diese E-Mail ist bereits registriert.','auth/invalid-credential':'E-Mail oder Passwort ist falsch.','auth/wrong-password':'E-Mail oder Passwort ist falsch.','auth/user-not-found':'E-Mail oder Passwort ist falsch.','auth/weak-password':'Das Passwort ist zu schwach.','auth/invalid-email':'Ungültige E-Mail-Adresse.','auth/too-many-requests':'Zu viele Versuche. Bitte später erneut probieren.','auth/popup-closed-by-user':'Das Google-Fenster wurde geschlossen.','auth/cancelled-popup-request':'Das Google-Fenster wurde geschlossen.','auth/account-exists-with-different-credential':'Zu dieser E-Mail gibt es schon ein Konto mit einer anderen Anmeldeart (z. B. Google oder Passwort). Bitte melde dich damit an.','auth/popup-blocked':'Das Pop-up wurde blockiert. Bitte Pop-ups für diese Seite erlauben.','auth/unauthorized-domain':'Diese Domain ist in Firebase noch nicht autorisiert.','auth/operation-not-allowed':'Diese Anmeldeart ist in Firebase noch nicht aktiviert.','auth/invalid-phone-number':'Bitte die Nummer mit Ländervorwahl eingeben, z. B. +43 660 1234567.','auth/invalid-verification-code':'Der SMS-Code ist falsch.','auth/code-expired':'Der SMS-Code ist abgelaufen. Bitte neu anfordern.','auth/quota-exceeded':'Das SMS-Kontingent ist aufgebraucht. Bitte später erneut probieren.','auth/captcha-check-failed':'Die Sicherheitsprüfung ist fehlgeschlagen. Bitte Seite neu laden.','auth/operation-not-supported-in-this-environment':'Die Seite wurde direkt aus dem Ordner geöffnet. Bitte über start-lokal.bat oder von der Webseite (https) öffnen.','auth/network-request-failed':'Keine Verbindung. Bitte Internet prüfen.'};
  var fe=function(e){throw new Error(msg[e.code]||'Fehler: '+(e.message||e.code))};
  var load=function(s){return new Promise(function(ok,no){var t=document.createElement('script');t.src=s;t.onload=ok;t.onerror=function(){no(new Error('Firebase konnte nicht geladen werden.'))};document.head.appendChild(t)})};
  A.ready=load('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js').then(function(){return load('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js')}).then(function(){
    firebase.initializeApp(cfg.firebase);
    return new Promise(function(res){firebase.auth().onAuthStateChanged(function(u){user=u?{uid:u.uid,email:u.email||u.phoneNumber||(u.isAnonymous?'Gast-'+u.uid.slice(0,6):u.uid),name:u.displayName||(u.email?u.email.split('@')[0]:u.phoneNumber||'Gast'),created:u.metadata&&u.metadata.creationTime,provider:u.isAnonymous?'anonymous':((u.providerData[0]||{}).providerId||'password')}:null;emit();res()})});
  });
  A.register=function(name,email,pw){checkInput(email,pw);return firebase.auth().createUserWithEmailAndPassword(email,pw).then(function(c){return c.user.updateProfile({displayName:name||email.split('@')[0]})}).catch(fe)};
  A.login=function(email,pw){checkInput(email,pw);return firebase.auth().signInWithEmailAndPassword(email,pw).catch(fe)};
  A.reset=function(email){return firebase.auth().sendPasswordResetEmail(email).catch(fe)};
  var PR={google:function(){return new firebase.auth.GoogleAuthProvider()},github:function(){return new firebase.auth.GithubAuthProvider()},twitter:function(){return new firebase.auth.TwitterAuthProvider()},apple:function(){var p=new firebase.auth.OAuthProvider('apple.com');p.addScope('email');p.addScope('name');return p},yahoo:function(){return new firebase.auth.OAuthProvider('yahoo.com')}};
  A.provider=function(id){if(!PR[id])return Promise.reject(new Error('Unbekannte Anmeldeart.'));return firebase.auth().signInWithPopup(PR[id]()).catch(fe)};
  A.google=function(){return A.provider('google')};
  var cr=null,rv=null;
  A.phoneSend=function(nr){nr=nr.replace(/[\s()\/-]/g,'');if(!/^\+\d{8,15}$/.test(nr))return Promise.reject(new Error(msg['auth/invalid-phone-number']));
    if(!rv)rv=new firebase.auth.RecaptchaVerifier('rc',{size:'invisible'});
    return firebase.auth().signInWithPhoneNumber(nr,rv).then(function(c){cr=c}).catch(function(e){try{rv.clear()}catch(x){}rv=null;fe(e)})};
  A.phoneConfirm=function(code){if(!cr)return Promise.reject(new Error('Bitte zuerst einen Code anfordern.'));return cr.confirm(code.trim()).catch(fe)};
  A.guest=function(){return firebase.auth().signInAnonymously().catch(fe)};
  A.db=function(){return A.ready.then(function(){return typeof firebase.firestore==='function'?null:load('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js')}).then(function(){return firebase.firestore()})};
}else{
  var enc=new TextEncoder();
  var b64=function(buf){return btoa(String.fromCharCode.apply(null,new Uint8Array(buf)))};
  var hash=async function(pw,salt){if(!window.crypto||!crypto.subtle)throw new Error('Dieser Browser unterstützt die sichere Verschlüsselung nicht.');var k=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);return b64(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:enc.encode(salt),iterations:100000},k,256))};
  var users=function(){try{return JSON.parse(localStorage.getItem('orbit-users')||'{}')}catch(e){return{}}};
  var session=function(email,u){localStorage.setItem('orbit-session',email);user={email:email,name:u.name,created:u.created,provider:'local'};emit()};
  var email0=null;try{email0=localStorage.getItem('orbit-session')}catch(e){}
  var u0=email0&&users()[email0];if(u0)user={email:email0,name:u0.name,created:u0.created,provider:'local'};
  A.ready=Promise.resolve();setTimeout(emit,0);
  A.register=async function(name,email,pw){
    email=email.trim().toLowerCase();checkInput(email,pw);
    var all=users();if(all[email])throw new Error('Diese E-Mail ist bereits registriert.');
    var salt=b64(crypto.getRandomValues(new Uint8Array(16)));
    all[email]={name:name||email.split('@')[0],created:new Date().toISOString(),salt:salt,hash:await hash(pw,salt)};
    localStorage.setItem('orbit-users',JSON.stringify(all));session(email,all[email]);
  };
  A.login=async function(email,pw){
    email=email.trim().toLowerCase();checkInput(email,pw);
    var u=users()[email];if(!u||await hash(pw,u.salt)!==u.hash)throw new Error('E-Mail oder Passwort ist falsch.');
    session(email,u);
  };
  A.reset=function(){return Promise.reject(new Error('Passwort zurücksetzen gibt es erst mit echtem Login (Firebase).'))};
  A.google=function(){return Promise.reject(new Error('Google-Anmeldung gibt es nur mit echtem Login (Firebase).'))};
  A.db=function(){return Promise.reject(new Error('Nachrichten gibt es nur mit echtem Login (Firebase).'))};
  A.provider=A.phoneSend=A.phoneConfirm=A.guest=function(){return Promise.reject(new Error('Diese Anmeldeart gibt es nur mit echtem Login (Firebase).'))};
}
document.addEventListener('click',function(e){
  var a=e.target.closest('[data-protected]');if(!a)return;
  if(!ready){e.preventDefault();A.ready.then(function(){a.click()});return}
  if(user&&a.dataset.name)A.log('download','Download gestartet: '+a.dataset.name,a.dataset.name);
  if(!user){e.preventDefault();var nx=location.href.indexOf(BASE)===0?location.href.slice(BASE.length):'';location.href=BASE+'pages/login.html?next='+encodeURIComponent(nx)}
});
var out=document.getElementById('auth-out');if(out)out.addEventListener('click',function(){A.logout()});
window.OrbitAuth=A;
ui();
})();
