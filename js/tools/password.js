(function(){
var sets={up:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',lo:'abcdefghijklmnopqrstuvwxyz',di:'0123456789',sy:'!@#$%^&*()-_=+[]{};:,.?/'};
function gen(){
  var sim=$('sim').checked,pools=[];
  ['up','lo','di','sy'].forEach(function(k){if($(k).checked){var s=sets[k];if(sim)s=s.replace(/[O0Il1|]/g,'');pools.push(s)}});
  if(!pools.length){$('pw').textContent='Wähle mindestens eine Zeichenart.';return}
  var len=+$('len').value,all=pools.join(''),c=[];
  pools.forEach(function(p){c.push(p[rint(p.length)])});
  while(c.length<len)c.push(all[rint(all.length)]);
  c=c.slice(0,len);
  for(var i=c.length-1;i>0;i--){var j=rint(i+1),t=c[i];c[i]=c[j];c[j]=t}
  $('pw').textContent=c.join('');
  var bits=len*Math.log2(all.length);
  $('bar').style.width=Math.min(100,bits/128*100)+'%';
  $('str').textContent=(bits<40?'Schwach':bits<60?'Mittel':bits<80?'Stark':'Sehr stark')+' · ca. '+Math.round(bits)+' Bit Entropie';
}
$('len').addEventListener('input',function(){$('lenv').textContent=this.value;gen()});
['up','lo','di','sy','sim'].forEach(function(k){$(k).addEventListener('change',gen)});
$('gen').addEventListener('click',gen);
$('copy').addEventListener('click',function(){copyText($('pw').textContent,this)});
gen();
})();
