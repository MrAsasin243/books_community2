/* Scroll-linked 3D book. Progress is tied to the section scroll distance. */
(function(){
  'use strict';
  var C=window.Chitalnya,section,sticky,book,bar,trigger,hint,raf=0,lastProgress=-1;
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function smooth(a,b,x){var t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)}
  function render(){raf=0;if(!section||!sticky||!book)return;var reduced=C.reduceMotion(),rect=section.getBoundingClientRect(),range=Math.max(1,section.offsetHeight-sticky.offsetHeight),p=reduced?1:clamp(-rect.top/range,0,1);if(Math.abs(p-lastProgress)<.001)return;lastProgress=p;
    var open=reduced?1:smooth(.035,.61,p),spread=smooth(.12,.42,p),content=smooth(.34,.58,p),caption=smooth(.62,.78,p),mobile=window.matchMedia('(max-width:520px)').matches;
    var shift=mobile?0:(-25*(1-open))+'%',scale=mobile?(0.88+open*.12):(0.52+open*.48),tilt=reduced?0:(7*(1-open));
    sticky.style.setProperty('--open',open.toFixed(4));sticky.style.setProperty('--spread',spread.toFixed(4));sticky.style.setProperty('--content',content.toFixed(4));sticky.style.setProperty('--caption',caption.toFixed(4));
    book.style.setProperty('--book-shift',typeof shift==='string'?shift:shift+'%');book.style.setProperty('--book-scale',scale.toFixed(4));book.style.setProperty('--book-tilt',tilt.toFixed(2)+'deg');book.style.setProperty('--cover-angle',(-180*open)+'deg');
    book.setAttribute('data-state',open>.985?'open':open>.01?'opening':'closed');if(bar)bar.style.width=(p*100)+'%';if(hint){hint.textContent=p<.08?'ПРОКРУТИТЕ, ЧТОБЫ ОТКРЫТЬ':p<.62?'КНИГА РАСКРЫВАЕТСЯ':'ВНУТРИ ЧИТАЛЬНИ';}
    if(trigger)trigger.setAttribute('aria-expanded',String(open>.8));
  }
  function request(){if(!raf)raf=requestAnimationFrame(render)}
  function goOpen(){if(!section)return;var range=Math.max(1,section.offsetHeight-sticky.offsetHeight),top=window.scrollY+section.getBoundingClientRect().top+range*.51;window.scrollTo({top:top,behavior:C.reduceMotion()?'auto':'smooth'})}
  function init(){section=document.getElementById('book-section');sticky=document.getElementById('bookScrollSticky');book=document.getElementById('book');bar=document.getElementById('bookProgressBar');trigger=document.getElementById('bookOpenTrigger');hint=document.getElementById('bookHint');if(!section||!book)return;
    window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request,{passive:true});if(trigger)trigger.addEventListener('click',goOpen);request();
  }
  window.ChBook={init:init,open:goOpen};
})();
