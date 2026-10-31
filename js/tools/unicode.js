(function(){
var BL=[['Basis-Latein',0x20,0x7E],['Latein-1',0xA0,0xFF],['Griechisch',0x370,0x3FF],['Kyrillisch',0x400,0x4FF],['Pfeile',0x2190,0x21FF],['Mathe-Operatoren',0x2200,0x22FF],['Rahmenzeichen',0x2500,0x257F],['Geometrische Formen',0x25A0,0x25FF],['Verschiedene Symbole',0x2600,0x26FF],['Dingbats',0x2700,0x27BF],['Emoticons',0x1F600,0x1F64F],['Piktogramme',0x1F300,0x1F5FF]];
var sel=$('block');
BL.forEach(function(b,i){var o=document.createElement('option');o.value=i;o.textContent=b[0]+' (U+'+b[1].toString(16).toUpperCase()+'–'+b[2].toString(16).toUpperCase()+')';sel.appendChild(o)});
function hex(n,p){var s=n.toString(16).toUpperCase();while(s.length<(p||2))s='0'+s;return s}
function cat(ch){var m=[['Buchstabe',/\p{L}/u],['Zahl',/\p{N}/u],['Satzzeichen',/\p{P}/u],['Symbol',/\p{S}/u],['Kombinationszeichen',/\p{M}/u],['Trennzeichen',/\p{Z}/u],['Steuerzeichen',/\p{C}/u]];for(var i=0;i<m.length;i++)if(m[i][1].test(ch))return m[i][0];return 'Sonstiges'}
function detail(cp){
  var ch=String.fromCodePoint(cp),u8=Array.from(new TextEncoder().encode(ch)).map(function(b){return hex(b)}).join(' '),u16=[];
  for(var i=0;i<ch.length;i++)u16.push(hex(ch.charCodeAt(i),4));
  var rows=[['Codepoint','U+'+hex(cp,4)],['Dezimal',cp],['Kategorie',cat(ch)],['UTF-8',u8],['UTF-16',u16.join(' ')],['HTML','&#x'+hex(cp,1)+';'],['JavaScript','\\u{'+hex(cp,1)+'}']];
  $('big').textContent=ch;
  $('det').innerHTML=rows.map(function(r){return '<tr><td>'+r[0]+'</td><td class="mono">'+String(r[1]).replace(/&/g,'&amp;')+'</td></tr>'}).join('');
  $('copych').onclick=function(){copyText(ch,this)};
}
function grid(cps){
  var g=$('grid');g.innerHTML='';
  cps.forEach(function(cp){
    var ch=String.fromCodePoint(cp);if(/^\p{C}$/u.test(ch))return;
    var b=document.createElement('button');b.textContent=ch;b.title='U+'+hex(cp,4);b.addEventListener('click',function(){detail(cp)});g.appendChild(b);
  });
}
function block(){var b=BL[+sel.value],a=[];for(var c=b[1];c<=b[2];c++)a.push(c);grid(a);detail(b[1]===0x20?0x41:a[0])}
sel.addEventListener('change',function(){$('q').value='';block()});
$('q').addEventListener('input',function(){
  var v=this.value.trim();if(!v){block();return}
  var m=v.match(/^(?:u\+|0x)([0-9a-f]{1,6})$/i);
  if(m){var cp=parseInt(m[1],16);if(cp<=0x10FFFF){grid([cp]);detail(cp)}return}
  var cps=Array.from(v).slice(0,80).map(function(c){return c.codePointAt(0)});grid(cps);detail(cps[0]);
});
block();
})();
