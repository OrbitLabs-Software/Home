(function(){
var P={hex:'0123456789abcdef',alnum:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',num:'0123456789',bin:'01',b32:'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'};
function gen(){
  var cs=Array.from(new Set(Array.from($('cs').value)));
  if(!cs.length){$('out').value='Bitte einen Zeichenvorrat eingeben.';return}
  var len=Math.max(1,Math.min(512,+$('len').value||1)),cnt=Math.max(1,Math.min(200,+$('cnt').value||1)),r=[];
  for(var i=0;i<cnt;i++){var s='';for(var j=0;j<len;j++)s+=cs[rint(cs.length)];r.push(s)}
  $('out').value=r.join('\n');
  $('info').textContent=cs.length+' verschiedene Zeichen · ca. '+Math.round(len*Math.log2(Math.max(cs.length,2)))+' Bit pro String';
}
document.querySelectorAll('[data-cs]').forEach(function(b){b.addEventListener('click',function(){$('cs').value=P[this.dataset.cs];gen()})});
['cs','len','cnt'].forEach(function(k){$(k).addEventListener('input',gen)});
$('gen').addEventListener('click',gen);
$('copy').addEventListener('click',function(){copyText($('out').value,this)});
gen();
})();
