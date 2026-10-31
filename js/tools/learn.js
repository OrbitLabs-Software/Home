(function(){
var EX={
html:'<!DOCTYPE html>\n<html>\n<body style="font-family:sans-serif;text-align:center">\n<h1>Hallo Welt 👋</h1>\n<button onclick="this.textContent=\'Geklickt!\'">Klick mich</button>\n</body>\n</html>',
js:'const zahlen = [1, 2, 3, 4, 5];\nconsole.log("Quadrate:", zahlen.map(n => n * n));\nconsole.log("Summe:", zahlen.reduce((a, b) => a + b, 0));',
py:'for i in range(1, 6):\n    print(i, "zum Quadrat ist", i * i)',
lua:'for i = 1, 5 do\n  print(i, "zum Quadrat ist", i * i)\nend',
rb:'5.times do |i|\n  puts "#{i + 1} zum Quadrat ist #{(i + 1) ** 2}"\nend'
};
var cur='html',saved={},tabs=document.querySelectorAll('[data-l]'),code=$('code'),out=$('out'),fr=$('frame');
function log(s){out.textContent+=s+'\n'}
function load(l){
  saved[cur]=code.value;cur=l;code.value=saved[l]!==undefined?saved[l]:EX[l];
  tabs.forEach(function(b){b.classList.toggle('on',b.dataset.l===l)});
  out.style.display=l==='html'?'none':'block';fr.style.display=l==='html'?'block':'none';out.textContent='';
}
function script(src){return new Promise(function(ok,no){var s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=function(){no(new Error('Laufzeit konnte nicht geladen werden (Internet nötig).'))};document.head.appendChild(s)})}
var jsf=null;
window.addEventListener('message',function(e){if(e.data&&e.data.m!==undefined)log((e.data.t==='e'?'Fehler: ':'')+e.data.m)});
function runJS(src){
  if(jsf)jsf.remove();jsf=document.createElement('iframe');jsf.sandbox='allow-scripts';jsf.style.display='none';
  jsf.srcdoc='<script>var p=function(t,a){parent.postMessage({t:t,m:Array.prototype.map.call(a,function(x){try{return typeof x==="object"?JSON.stringify(x):String(x)}catch(e){return String(x)}}).join(" ")},"*")};console.log=function(){p("l",arguments)};console.error=function(){p("e",arguments)};window.onerror=function(m){p("e",[m])};<\/script><script>try{'+src+'\n}catch(e){p("e",[e.message])}<\/script>';
  document.body.appendChild(jsf);
}
async function run(){
  var src=code.value;out.textContent='';$('run').disabled=true;
  try{
    if(cur==='html')fr.srcdoc=src;
    else if(cur==='js')runJS(src);
    else if(cur==='py'){
      if(!window.__py){log('Python wird geladen …');await script('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');window.__py=await loadPyodide();out.textContent=''}
      window.__py.setStdout({batched:function(s){log(s)}});window.__py.setStderr({batched:function(s){log(s)}});
      await window.__py.runPythonAsync(src);
    }else if(cur==='lua'){
      if(!window.fengari){log('Lua wird geladen …');await script('https://cdn.jsdelivr.net/npm/fengari-web@0.1.4/dist/fengari-web.js');out.textContent=''}
      window.__lualog=function(s){log(s)};
      var pre='local __j=require("js")\nlocal print=function(...) local t={} for i=1,select("#",...) do t[#t+1]=tostring((select(i,...))) end __j.global.__lualog(table.concat(t,"\\t")) end\n';
      window.fengari.load(pre+src)();
    }else if(cur==='rb'){
      if(!window.__rb){log('Ruby wird geladen (kann etwas dauern) …');await script('https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.7.0/dist/browser.umd.js');var m=await WebAssembly.compileStreaming(await fetch('https://cdn.jsdelivr.net/npm/@ruby/3.3-wasm-wasi@2.7.0/dist/ruby+stdlib.wasm'));var r=await window['ruby-wasm-wasi'].DefaultRubyVM(m);window.__rb=r.vm;out.textContent=''}
      log(window.__rb.eval('require "stringio"\n$stdout=StringIO.new\nbegin\n'+src+'\nrescue Exception=>e\nputs "Fehler: #{e.message}"\nend\n$stdout.string').toString());
    }
  }catch(e){log('Fehler: '+(e&&e.message?e.message:e))}
  $('run').disabled=false;
}
tabs.forEach(function(b){b.addEventListener('click',function(){load(this.dataset.l)})});
$('run').addEventListener('click',run);
$('reset').addEventListener('click',function(){code.value=EX[cur]});
code.addEventListener('keydown',function(e){
  if(e.key==='Tab'){e.preventDefault();var s=code.selectionStart;code.value=code.value.slice(0,s)+'  '+code.value.slice(code.selectionEnd);code.selectionStart=code.selectionEnd=s+2}
  if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run()}
});
load('html');code.value=EX.html;run();
})();
