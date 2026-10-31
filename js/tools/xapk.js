(function(){
var dz=$('drop'),inp=$('file'),res=$('res');
function sz(n){return n>1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB'}
function load(src){return new Promise(function(ok,no){if(window.JSZip)return ok();var s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=function(){no(new Error('JSZip konnte nicht geladen werden (Internet nötig).'))};document.head.appendChild(s)})}
async function handle(f){
  if(!f)return;res.innerHTML='<p>Lese '+f.name+' …</p>';
  try{
    await load('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    var z=await JSZip.loadAsync(f),names=Object.keys(z.files).filter(function(n){return !z.files[n].dir}),man=null;
    if(z.files['manifest.json'])try{man=JSON.parse(await z.files['manifest.json'].async('string'))}catch(e){}
    var apks=names.filter(function(n){return /\.apk$/i.test(n)});
    if(!apks.length){res.innerHTML='<p>Keine APK-Datei in dieser Datei gefunden. Ist es wirklich eine XAPK?</p>';return}
    var h='';
    if(man)h+='<div class="panel" style="margin-bottom:18px"><h3>'+(man.name||'App')+'</h3><p>Paket: <span class="mono">'+(man.package_name||'–')+'</span> · Version: '+(man.version_name||'–')+'</p></div>';
    h+='<div class="panel"><h3 style="margin-bottom:14px">Inhalt ('+names.length+' Dateien)</h3><ul class="files">';
    names.forEach(function(n,i){h+='<li><span class="mono">'+n+'</span><span>'+sz(z.files[n]._data?z.files[n]._data.uncompressedSize:0)+'</span>'+(/\.(apk|obb)$/i.test(n)?'<button class="btn btn-ghost btn-sm" data-n="'+i+'">Herunterladen</button>':'<span></span>')+'</li>'});
    h+='</ul><p style="margin-top:16px;font-size:14px">Hinweis: Bei Split-APKs (mehrere .apk) müssen alle zusammen installiert werden, z. B. mit einem Split-Installer. OBB-Dateien gehören nach <span class="mono">Android/obb/&lt;Paketname&gt;/</span>.</p></div>';
    res.innerHTML=h;
    res.querySelectorAll('[data-n]').forEach(function(b){b.addEventListener('click',async function(){
      var n=names[+this.dataset.n],blob=await z.files[n].async('blob'),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=n.split('/').pop();a.click()})});
  }catch(e){res.innerHTML='<p>Fehler: '+e.message+'</p>'}
}
dz.addEventListener('click',function(){inp.click()});
inp.addEventListener('change',function(){handle(inp.files[0])});
['dragenter','dragover'].forEach(function(ev){dz.addEventListener(ev,function(e){e.preventDefault();dz.classList.add('over')})});
['dragleave','drop'].forEach(function(ev){dz.addEventListener(ev,function(e){e.preventDefault();dz.classList.remove('over')})});
dz.addEventListener('drop',function(e){handle(e.dataTransfer.files[0])});
})();
