/* CohusDex Website — JS */
(function(){"use strict";
var nav=document.getElementById("nav"),navToggle=document.getElementById("navToggle"),navMenu=document.getElementById("navMenu");
window.addEventListener("scroll",function(){nav.classList.toggle("scrolled",window.scrollY>40)},{passive:true});
navToggle.addEventListener("click",function(){var o=navMenu.classList.toggle("open");navToggle.classList.toggle("active",o);navToggle.setAttribute("aria-expanded",o)});
navMenu.querySelectorAll("a").forEach(function(l){l.addEventListener("click",function(){navMenu.classList.remove("open");navToggle.classList.remove("active");navToggle.setAttribute("aria-expanded","false")})});
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener("click",function(e){var t=document.querySelector(this.getAttribute("href"));if(t){e.preventDefault();var o=nav.offsetHeight+16,top=t.getBoundingClientRect().top+window.scrollY-o;window.scrollTo({top:top,behavior:"smooth"})}})});
// scroll reveal
var reveals=document.querySelectorAll(".reveal");
if("IntersectionObserver"in window){var ro=new IntersectionObserver(function(e){e.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("visible");ro.unobserve(entry.target)}})},{threshold:0.1,rootMargin:"0px 0px -40px 0px"});reveals.forEach(function(el){ro.observe(el)})}else{reveals.forEach(function(el){el.classList.add("visible")})}
// worker counter
var workerEl=document.getElementById("workerCount"),workerTarget=0,workerDone=false;
function animateCounter(el,target,duration){if(target===0){el.textContent="0";return}var start=0,startTime=null;function step(ts){if(!startTime)startTime=ts;var p=Math.min((ts-startTime)/duration,1),eased=1-Math.pow(1-p,3);el.textContent=Math.floor(eased*target).toLocaleString();if(p<1)requestAnimationFrame(step);else el.textContent=target.toLocaleString()}requestAnimationFrame(step)}
fetch("https://api.cohusdex.com/api/v1/dashboard").then(function(r){return r.json()}).then(function(d){if(d&&typeof d.workers==="number"&&d.workers>=0)workerTarget=d.workers}).catch(function(){});
if(workerEl&&"IntersectionObserver"in window){var co=new IntersectionObserver(function(e){e.forEach(function(entry){if(entry.isIntersecting&&!workerDone){workerDone=true;animateCounter(workerEl,workerTarget,2000);co.unobserve(entry.target)}})},{threshold:0.3});co.observe(workerEl)}
// close nav on outside click
document.addEventListener("click",function(e){if(!nav.contains(e.target)&&navMenu.classList.contains("open")){navMenu.classList.remove("open");navToggle.classList.remove("active");navToggle.setAttribute("aria-expanded","false")}});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&navMenu.classList.contains("open")){navMenu.classList.remove("open");navToggle.classList.remove("active");navToggle.setAttribute("aria-expanded","false");navToggle.focus()}});
// PWA
if("serviceWorker"in navigator){navigator.serviceWorker.register("/sw.js")}
})();
