(function(t,r){typeof exports=="object"&&typeof module<"u"?r(exports):typeof define=="function"&&define.amd?define(["exports"],r):(t=typeof globalThis<"u"?globalThis:t||self,r(t.OrbitControls={}))})(this,function(t){"use strict";const r=function(P={}){let e,c,u,v,E,m=!1,s=0,a=0;const l=function(n){let o=e.fov();n.wheelDeltaY?o-=n.wheelDeltaY*.05:n.wheelDelta?o-=n.wheelDelta*.05:n.detail&&(o+=n.detail*1),(o<10||o>130)&&(o=o<10?10:130),e.fov(o)},d=function(n){m=!1},w=function(n){if(m){e.facing();const o=e.fov(),i=e.wrapper.clientHeight,g=o/i;let y=(n.clientX-c)*-g+v,f=(n.clientY-u)*-g+E;f=Math.max(-85,Math.min(85,f)),e.facing((360+y)%360),e.horizon(f)}},h=function(n){n.preventDefault(),c=n.clientX,u=n.clientY,v=e.facing(),E=e.horizon(),m=!0},p=function(){if(s){const o=performance.now()-a;let i=e.facing();i=i+50/1e3*o*s,e.facing((360+i)%360),a+=o,requestAnimationFrame(p)}},L=function(n){const o=n.keyCode;(o==37||o==39)&&(a=performance.now(),s=o==39?1:-1,requestAnimationFrame(p))},D=function(n){s=0};this.init=function(n){e=n,e.renderer.domElement.addEventListener("mousewheel",l,!1),e.renderer.domElement.addEventListener("DOMMouseScroll",l,!1),e.renderer.domElement.addEventListener("mousedown",h,!1),e.renderer.domElement.addEventListener("mouseup",d,!1),e.renderer.domElement.addEventListener("mouseleave",d,!1),e.renderer.domElement.addEventListener("mousemove",w,!1),window.addEventListener("keydown",L),window.addEventListener("keyup",D)},this.destroy=function(){e.renderer.domElement.removeEventListener("mousewheel",l,!1),e.renderer.domElement.removeEventListener("DOMMouseScroll",l,!1),e.renderer.domElement.removeEventListener("mousedown",h,!1),e.renderer.domElement.removeEventListener("mouseup",d,!1),e.renderer.domElement.removeEventListener("mouseleave",d,!1),e.renderer.domElement.removeEventListener("mousemove",w,!1),window.removeEventListener("keydown",L),window.removeEventListener("keyup",D)}};t.orbitControls=r,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})});
