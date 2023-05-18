const P = function(p = {}) {
  let e, a, c, f, u, l = !1, r = 0, m = 0;
  const i = function(n) {
    let o = e.fov();
    n.wheelDeltaY ? o -= n.wheelDeltaY * 0.05 : n.wheelDelta ? o -= n.wheelDelta * 0.05 : n.detail && (o += n.detail * 1), (o < 10 || o > 130) && (o = o < 10 ? 10 : 130), e.fov(o);
  }, s = function(n) {
    l = !1;
  }, v = function(n) {
    if (l) {
      e.facing();
      const o = e.fov(), t = e.wrapper.clientHeight, D = o / t;
      let g = (n.clientX - a) * -D + f, d = (n.clientY - c) * -D + u;
      d = Math.max(-85, Math.min(85, d)), e.facing((360 + g) % 360), e.horizon(d);
    }
  }, E = function(n) {
    n.preventDefault(), a = n.clientX, c = n.clientY, f = e.facing(), u = e.horizon(), l = !0;
  }, w = function() {
    if (r) {
      const o = performance.now() - m;
      let t = e.facing();
      t = t + 50 / 1e3 * o * r, e.facing((360 + t) % 360), m += o, requestAnimationFrame(w);
    }
  }, L = function(n) {
    const o = n.keyCode;
    (o == 37 || o == 39) && (m = performance.now(), r = o == 39 ? 1 : -1, requestAnimationFrame(w));
  }, h = function(n) {
    r = 0;
  };
  this.init = function(n) {
    e = n, e.renderer.domElement.addEventListener(
      "mousewheel",
      i,
      !1
    ), e.renderer.domElement.addEventListener(
      "DOMMouseScroll",
      i,
      !1
    ), e.renderer.domElement.addEventListener(
      "mousedown",
      E,
      !1
    ), e.renderer.domElement.addEventListener(
      "mouseup",
      s,
      !1
    ), e.renderer.domElement.addEventListener(
      "mouseleave",
      s,
      !1
    ), e.renderer.domElement.addEventListener(
      "mousemove",
      v,
      !1
    ), window.addEventListener("keydown", L), window.addEventListener("keyup", h);
  }, this.destroy = function() {
    e.renderer.domElement.removeEventListener(
      "mousewheel",
      i,
      !1
    ), e.renderer.domElement.removeEventListener(
      "DOMMouseScroll",
      i,
      !1
    ), e.renderer.domElement.removeEventListener(
      "mousedown",
      E,
      !1
    ), e.renderer.domElement.removeEventListener(
      "mouseup",
      s,
      !1
    ), e.renderer.domElement.removeEventListener(
      "mouseleave",
      s,
      !1
    ), e.renderer.domElement.removeEventListener(
      "mousemove",
      v,
      !1
    ), window.removeEventListener("keydown", L), window.removeEventListener("keyup", h);
  };
};
export {
  P as orbitControls
};
