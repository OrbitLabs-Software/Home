(function(){
var root=document.querySelector('[data-prog]');if(!root)return;
var k=root.dataset.prog,d=(window.ORBIT_PROGRAMS||{})[k]||{};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var rows=[['Version',d.version||'–'],['Veröffentlicht',d.date||'–'],['System',d.requirements||'Windows'],['Dateigröße',d.size||'–'],['Dateiname',k+'.exe'],['Preis','Kostenlos']];
$('pd').innerHTML=rows.map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd></div>'}).join('');
$('phash').textContent=d.sha256||'–';
$('plog').innerHTML=(d.changelog&&d.changelog.length)?d.changelog.map(function(c){return '<li>'+esc(c)+'</li>'}).join(''):'<li>Noch keine Einträge.</li>';
var sh=d.screenshots&&d.screenshots.length?d.screenshots:[null,null,null];
$('pshots').innerHTML=sh.map(function(s,i){return s?'<img src="../../'+esc(s)+'" alt="Screenshot '+(i+1)+'" loading="lazy">':'<div class="shot-ph">Screenshot folgt</div>'}).join('');
function hum(n){return n>1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB'}
$('pcalc').addEventListener('click',async function(){
  var note=$('pnote');note.textContent='Berechne …';
  try{
    var r=await fetch('../../files/'+k+'.exe');if(!r.ok)throw new Error('Datei nicht gefunden');
    var buf=await r.arrayBuffer(),h=await crypto.subtle.digest('SHA-256',buf);
    var hex=Array.from(new Uint8Array(h)).map(function(b){return b.toString(16).padStart(2,'0')}).join('');
    $('phash').textContent=hex;
    note.textContent='Größe: '+hum(buf.byteLength)+(d.sha256?(d.sha256.toLowerCase()===hex?' · ✓ stimmt mit der veröffentlichten Prüfsumme überein':' · ⚠ weicht von der veröffentlichten Prüfsumme ab!'):'');
  }catch(e){note.textContent='Nicht möglich: '+(location.protocol==='file:'?'Bitte die Seite über einen Webserver öffnen.':e.message)}
});
$('pcopy').addEventListener('click',function(){var t=$('phash').textContent;if(t&&t!=='–')copyText(t,this)});
})();
