function $(i){return document.getElementById(i)}
function rint(n){var a=new Uint32Array(1),lim=Math.floor(4294967296/n)*n,x;do{crypto.getRandomValues(a);x=a[0]}while(x>=lim);return x%n}
function copyText(t,btn){
  var done=function(){if(btn){var o=btn.textContent;btn.textContent='Kopiert ✓';setTimeout(function(){btn.textContent=o},1200)}};
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(done,function(){});
  else{var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();done()}
}
