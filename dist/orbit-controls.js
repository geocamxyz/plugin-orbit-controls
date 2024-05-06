const M = function(p = {}) {
  let e, d, m, f, u, l = !1, r = 0, c = 0;
  const s = function(n) {
    let o = e.fov();
    n.wheelDeltaY ? o -= n.wheelDeltaY * 0.05 : n.wheelDelta ? o -= n.wheelDelta * 0.05 : n.detail && (o += n.detail * 1), (o < 10 || o > 130) && (o = o < 10 ? 10 : 130), e.fov(o);
  }, i = function(n) {
    l = !1;
  }, w = function(n) {
    if (l) {
      e.facing();
      const o = e.fov(), t = e.wrapper.clientHeight, g = o / t;
      let D = (n.clientX - d) * -g + f, a = (n.clientY - m) * -g + u;
      a = Math.max(-85, Math.min(85, a)), e.facing((360 + D) % 360), e.horizon(a);
    }
  }, v = function(n) {
    n.preventDefault(), d = n.clientX, m = n.clientY, f = e.facing(), u = e.horizon(), l = !0;
  }, E = function() {
    if (r) {
      const o = performance.now() - c;
      let t = e.facing();
      t = t + 50 / 1e3 * o * r, e.facing((360 + t) % 360), c += o, requestAnimationFrame(E);
    }
  }, h = function(n) {
    const o = n.keyCode;
    (o == 37 || o == 39) && (c = performance.now(), r = o == 39 ? 1 : -1, requestAnimationFrame(E));
  }, L = function(n) {
    r = 0;
  };
  this.init = function(n) {
    e = n, e.renderer.domElement.addEventListener(
      "mousewheel",
      s,
      !1
    ), e.renderer.domElement.addEventListener(
      "DOMMouseScroll",
      s,
      !1
    ), e.renderer.domElement.addEventListener(
      "mousedown",
      v,
      !1
    ), e.renderer.domElement.addEventListener(
      "mouseup",
      i,
      !1
    ), e.renderer.domElement.addEventListener(
      "mouseleave",
      i,
      !1
    ), e.renderer.domElement.addEventListener(
      "mousemove",
      w,
      !1
    ), window.addEventListener("keydown", h), window.addEventListener("keyup", L);
  }, this.destroy = function() {
    e.renderer.domElement.removeEventListener(
      "mousewheel",
      s,
      !1
    ), e.renderer.domElement.removeEventListener(
      "DOMMouseScroll",
      s,
      !1
    ), e.renderer.domElement.removeEventListener(
      "mousedown",
      v,
      !1
    ), e.renderer.domElement.removeEventListener(
      "mouseup",
      i,
      !1
    ), e.renderer.domElement.removeEventListener(
      "mouseleave",
      i,
      !1
    ), e.renderer.domElement.removeEventListener(
      "mousemove",
      w,
      !1
    ), window.removeEventListener("keydown", h), window.removeEventListener("keyup", L);
  };
};
class P extends HTMLElement {
  constructor() {
    super(), this.controls = null, console.log("orbit-controls init");
  }
  connectedCallback() {
    console.log("orbit-controls connected"), this.controls = new M();
    const e = this.parentNode;
    e.viewer && e.viewer.plugin ? e.viewer.plugin(this.controls) : console.error(
      "GeocamViewerOrbitControls must be a child of GeocamViewer"
    );
  }
  disconnectedCallback() {
    this.controls = null, console.log("orbit controls disconnected");
  }
}
window.customElements.define(
  "geocam-viewer-orbit-controls",
  P
);
export {
  P as GeocamViewerOrbitControls
};
