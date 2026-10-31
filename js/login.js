(function(){
var A=window.OrbitAuth,mode='login',form=$('form'),msg=$('msg');
function $(i){return document.getElementById(i)}
function next(){var n=new URLSearchParams(location.search).get('next')||'';return A.base+(/^[\w\-\/]+\.html$/.test(n)?n:'pages/dashboard.html')}
function setMode(m){
  mode=m;document.querySelectorAll('[data-t]').forEach(function(b){b.classList.toggle('on',b.dataset.t===m)});
  $('f-name').hidden=m!=='register';$('go').textContent=m==='register'?'Kostenloses Konto erstellen':'Anmelden';
  $('pw').autocomplete=m==='register'?'new-password':'current-password';msg.textContent='';
}
document.querySelectorAll('[data-t]').forEach(function(b){b.addEventListener('click',function(){setMode(this.dataset.t)})});
form.addEventListener('submit',function(e){
  e.preventDefault();msg.className='msg';msg.textContent='';$('go').disabled=true;
  var p=mode==='register'?A.register($('name').value.trim(),$('email').value,$('pw').value):A.login($('email').value,$('pw').value);
  p.then(function(){location.href=next()}).catch(function(err){msg.className='msg err';msg.textContent=err.message;$('go').disabled=false});
});
$('forgot').addEventListener('click',function(e){e.preventDefault();var em=$('email').value.trim();if(!em){msg.className='msg err';msg.textContent='Bitte zuerst die E-Mail eintragen.';return}
  A.reset(em).then(function(){msg.className='msg ok';msg.textContent='Wir haben dir eine E-Mail zum Zurücksetzen geschickt.'}).catch(function(err){msg.className='msg err';msg.textContent=err.message})});
var PV={google:['Google','#4285F4','G'],apple:['Apple','#555','A'],github:['GitHub','#6e40c9','GH'],twitter:['X (Twitter)','#1d9bf0','X'],yahoo:['Yahoo','#6001d2','Y!'],phone:['Telefon','#16a34a','☎'],anonymous:['Als Gast fortfahren','#64748b','?']};
function say(t,c){msg.className='msg'+(c?' '+c:'');msg.textContent=t}
function go(p){say('');p.then(function(){location.href=next()}).catch(function(err){say(err.message,'err')})}
var list=(window.ORBIT_AUTH&&ORBIT_AUTH.providers)||['google'];
$('provs').innerHTML=list.filter(function(k){return PV[k]}).map(function(k){var v=PV[k];return '<button class="btn btn-ghost" type="button" data-p="'+k+'" style="display:flex;gap:10px;align-items:center;justify-content:center;width:100%;margin-bottom:10px"><span aria-hidden="true" style="min-width:22px;height:22px;border-radius:6px;background:'+v[1]+';color:#fff;font:700 11px/22px sans-serif;text-align:center;padding:0 3px">'+v[2]+'</span>'+(k==='anonymous'||k==='phone'?(k==='phone'?'Mit Handynummer anmelden':v[0]):'Mit '+v[0]+' anmelden')+'</button>'}).join('');
$('provs').addEventListener('click',function(e){var b=e.target.closest('[data-p]');if(!b)return;var k=b.dataset.p;
  if(k==='phone'){$('phonebox').hidden=!$('phonebox').hidden;return}
  go(k==='anonymous'?A.guest():A.provider(k))});
$('tsend').addEventListener('click',function(){say('');A.phoneSend($('tel').value).then(function(){$('codebox').hidden=false;say('SMS-Code gesendet.','ok')}).catch(function(err){say(err.message,'err')})});
$('tok').addEventListener('click',function(){go(A.phoneConfirm($('code').value))});
$('logout').addEventListener('click',function(){A.logout()});
A.ready.then(function(){A.onChange(function(u){
  $('formbox').hidden=!!u;$('userbox').hidden=!u;if(u)$('who').textContent=u.name+' ('+u.email+')';
})});
$('fileWarn').hidden=location.protocol!=='file:';
$('demo').hidden=A.mode!=='local';
$('gbox').hidden=A.mode==='local';
setMode('login');
})();
