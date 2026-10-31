(function(){
var T={
leer:'<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<title>Meine Seite</title>\n<style>\n  body{font-family:system-ui,sans-serif;margin:0;display:grid;place-items:center;min-height:100vh;background:#0b0d22;color:#fff}\n  h1{background:linear-gradient(120deg,#7c7cff,#38d0f5);-webkit-background-clip:text;color:transparent}\n</style>\n</head>\n<body>\n  <h1>Hallo Welt!</h1>\n</body>\n</html>',
karte:'<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><style>\nbody{font-family:system-ui;background:#eef0ff;display:grid;place-items:center;min-height:100vh;margin:0}\n.card{background:#fff;padding:32px;border-radius:20px;box-shadow:0 20px 50px #0002;max-width:320px;text-align:center}\nbutton{padding:10px 22px;border:0;border-radius:99px;background:#5b5bf0;color:#fff;cursor:pointer}\n</style></head>\n<body><div class="card"><h2>Zähler</h2><p id="n">0</p><button onclick="n.textContent=+n.textContent+1">+1</button></div></body>\n</html>'
};
var ed=$('ed'),fr=$('prev'),t;
try{var s=localStorage.getItem('orbit-html');ed.value=s||T.leer}catch(e){ed.value=T.leer}
function run(){fr.srcdoc=ed.value;try{localStorage.setItem('orbit-html',ed.value)}catch(e){}$('cnt').textContent=ed.value.split('\n').length+' Zeilen · '+ed.value.length+' Zeichen'}
ed.addEventListener('input',function(){clearTimeout(t);t=setTimeout(run,300)});
ed.addEventListener('keydown',function(e){if(e.key==='Tab'){e.preventDefault();var s=ed.selectionStart;ed.value=ed.value.slice(0,s)+'  '+ed.value.slice(ed.selectionEnd);ed.selectionStart=ed.selectionEnd=s+2}});
$('tpl').addEventListener('change',function(){if(this.value&&confirm('Aktuellen Code durch die Vorlage ersetzen?')){ed.value=T[this.value];run()}this.value=''});
$('copy').addEventListener('click',function(){copyText(ed.value,this)});
$('dl').addEventListener('click',function(){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ed.value],{type:'text/html'}));a.download='seite.html';a.click()});
document.querySelectorAll('[data-w]').forEach(function(b){b.addEventListener('click',function(){fr.style.width=this.dataset.w;fr.style.margin='0 auto';fr.style.display='block'})});
run();
})();
