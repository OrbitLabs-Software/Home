(function(){
  var root=document.documentElement;
  try{var t=localStorage.getItem('orbit-theme');if(t)root.setAttribute('data-theme',t)}catch(e){}
  document.addEventListener('DOMContentLoaded',function(){
    var tb=document.getElementById('theme-toggle');
    if(tb)tb.addEventListener('click',function(){
      var dark=root.getAttribute('data-theme')?root.getAttribute('data-theme')==='dark':!matchMedia('(prefers-color-scheme: light)').matches;
      var n=dark?'light':'dark';root.setAttribute('data-theme',n);
      try{localStorage.setItem('orbit-theme',n)}catch(e){}
    });
    var bg=document.getElementById('burger'),mn=document.getElementById('menu');
    if(bg)bg.addEventListener('click',function(){var o=mn.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
    var els=document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
      els.forEach(function(e){io.observe(e)});
    }else els.forEach(function(e){e.classList.add('in')});
    var st=document.querySelectorAll('.stars button'),tx=document.getElementById('rating-text'),nt=document.getElementById('rating-note');
    function show(n){st.forEach(function(b,i){b.classList.toggle('on',i<n)})}
    var saved=0;try{saved=+localStorage.getItem('orbit-rating')||0}catch(e){}
    if(st.length&&saved){show(saved);tx.textContent='Bewertung: '+saved+(saved===1?' Stern':' Sterne')}
    st.forEach(function(b,i){
      b.addEventListener('mouseenter',function(){show(i+1)});
      b.addEventListener('click',function(){
        saved=i+1;try{localStorage.setItem('orbit-rating',saved)}catch(e){}
        tx.textContent='Bewertung: '+saved+(saved===1?' Stern':' Sterne');nt.textContent='Danke für dein Feedback!';
      });
    });
    var s=document.querySelector('.stars');if(s)s.addEventListener('mouseleave',function(){show(saved)});
  });
})();
