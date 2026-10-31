(function(){
var S;
function has(i){return S.inv.indexOf(i)>-1}
function add(i){if(!has(i))S.inv.push(i)}
function press(x){S.seq.push(x);if(S.seq.length<3)return;
  var ok=S.seq.join()==='sonne,mond,stern';S.seq=[];
  if(ok){add('Sonnenrune');S.msg='Die drei Statuen leuchten auf. Mit einem tiefen Klick öffnet sich eine Nische – darin liegt die Sonnenrune! (+ Sonnenrune)'}
  else S.msg='Die Statuen rasten knirschend zurück. Die Reihenfolge war falsch.'}
var SC={
strand:function(){return{t:'Du erwachst am Strand der Insel Hurlum. Von deinem Schiff ist nur ein Wrack übrig. Landeinwärts liegen dichter Dschungel, eine dunkle Höhle und uralte Ruinen. Über allem thront ein Tempel – sein Tor zeigt drei Vertiefungen: Sonne, Mond und Stern.',c:[['Das Wrack durchsuchen','wrack'],['In den Dschungel','dschungel'],['Zur Höhle','hoehle'],['Zu den Ruinen','ruinen'],['Zum Tempel','tempel']]}},
wrack:function(){var n=!has('Fackel');add('Fackel');return{t:n?'Zwischen den Planken liegt eine Fackel mit Feuerzeug. Sie funktioniert noch! (+ Fackel)':'Hier ist nichts Nützliches mehr.',c:[['Zurück zum Strand','strand']]}},
dschungel:function(){
  if(has('Sternrune'))return{t:'Der Dschungel ist still. Die Steintafel ist jetzt leer – du hast die Sternrune bereits.',c:[['Zurück zum Strand','strand']]};
  return{t:'Zwischen Lianen steht eine Steintafel mit einer Inschrift: „Ich habe Städte ohne Häuser, Berge ohne Steine und Wasser ohne Fische. Was bin ich?“',c:[['Ein Traum','dschungel_f'],['Eine Landkarte','dschungel_ok'],['Ein Spiegel','dschungel_f'],['Zurück zum Strand','strand']]}},
dschungel_f:function(){return{t:'Die Tafel bleibt stumm. Denk nochmal nach: Wo findest du Städte, Berge und Wasser – aber nichts davon wirklich?',c:[['Nochmal versuchen','dschungel'],['Zurück zum Strand','strand']]}},
dschungel_ok:function(){add('Sternrune');return{t:'Die Tafel glimmt, und aus dem Stein löst sich eine funkelnde Rune. (+ Sternrune)',c:[['Zurück zum Strand','strand']]}},
hoehle:function(){
  if(!has('Fackel'))return{t:'Die Höhle ist pechschwarz. Ohne Licht wagst du dich nicht hinein. Vielleicht hilft das Wrack am Strand weiter.',c:[['Zurück zum Strand','strand']]};
  var n=!has('Mondrune');add('Mondrune');
  return{t:n?'Im Fackelschein siehst du kristalline Wände. Auf einem Sockel liegt eine silbrig schimmernde Rune. (+ Mondrune)':'Die Höhle ist ruhig. Der Sockel ist leer.',c:[['Zurück zum Strand','strand']]}},
ruinen:function(){
  var h='Alte Wandzeichen verraten: „Erst das Licht, dann die Nacht, zuletzt das Leuchten in der Ferne.“ Davor stehen drei Statuen.';
  if(has('Sonnenrune'))return{t:'Die Ruinen sind ruhig. Die Nische ist leer – die Sonnenrune hast du schon. ',c:[['Zurück zum Strand','strand']]};
  return{t:h+(S.seq.length?'\nBisher gedrückt: '+S.seq.join(' → '):''),c:[['Sonnen-Statue drehen','ruinen',function(){press('sonne')}],['Mond-Statue drehen','ruinen',function(){press('mond')}],['Stern-Statue drehen','ruinen',function(){press('stern')}],['Zurück zum Strand','strand']]}},
tempel:function(){
  var r=['Sonnenrune','Mondrune','Sternrune'].filter(has);
  if(r.length<3)return{t:'Das Tempeltor hat drei Vertiefungen. Du besitzt erst '+r.length+' von 3 Runen. Fehlende Runen warten irgendwo auf Hurlum.',c:[['Zurück zum Strand','strand']]};
  return{t:'Du setzt Sonne, Mond und Stern ein. Das Tor schwingt auf, und warmes Licht strömt dir entgegen. Im Inneren ruht der Schatz von Hurlum – das Rätsel ist gelöst!',c:[['Neues Abenteuer','strand',function(){S={sc:'strand',inv:[],seq:[],msg:''}}]]}}
};
function show(){
  var d=SC[S.sc](),msg=S.msg;S.msg='';
  $('story').textContent=(msg?msg+'\n\n':'')+d.t;
  var c=$('choices');c.innerHTML='';
  d.c.forEach(function(x){var b=document.createElement('button');b.className='btn btn-ghost';b.textContent=x[0];b.addEventListener('click',function(){if(x[2])x[2]();S.sc=x[1];show()});c.appendChild(b)});
  $('inv').innerHTML=S.inv.length?S.inv.map(function(i){return '<span class="chip">'+i+'</span>'}).join(''):'<span class="chip">leer</span>';
  var runes=['Sonnenrune','Mondrune','Sternrune'].filter(has).length;$('runes').textContent=runes+' / 3 Runen';
}
$('restart').addEventListener('click',function(){S={sc:'strand',inv:[],seq:[],msg:''};show()});
S={sc:'strand',inv:[],seq:[],msg:''};show();
})();
