const y = function(L = {}) {
  let e, d, m, u, f, l = !1, r = 0, c = 0;
  const i = function(n) {
    let o = e.fov();
    n.wheelDeltaY ? o -= n.wheelDeltaY * 0.05 : n.wheelDelta ? o -= n.wheelDelta * 0.05 : n.detail && (o += n.detail * 1), (o < 10 || o > 130) && (o = o < 10 ? 10 : 130), e.fov(o);
  }, s = function(n) {
    l = !1;
  }, w = function(n) {
    if (l) {
      e.facing();
      const o = e.fov(), t = e.wrapper.clientHeight, p = o / t;
      let D = (n.clientX - d) * -p + u, a = (n.clientY - m) * -p + f;
      a = Math.max(-85, Math.min(85, a)), e.facing((360 + D) % 360), e.horizon(a);
    }
  }, v = function(n) {
    n.preventDefault(), d = n.clientX, m = n.clientY, u = e.facing(), f = e.horizon(), l = !0;
  }, h = function() {
    if (r) {
      const o = performance.now() - c;
      let t = e.facing();
      t = t + 50 / 1e3 * o * r, e.facing((360 + t) % 360), c += o, requestAnimationFrame(h);
    }
  }, E = function(n) {
    if (n.target.closest("input"))
      return;
    const o = n.key === "ArrowLeft" || n.key === "a", t = n.key === "ArrowRight" || n.key === "d";
    (o || t) && (c = performance.now(), r = t ? 1 : -1, requestAnimationFrame(h));
  }, g = function(n) {
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
      v,
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
      w,
      !1
    ), window.addEventListener("keydown", E), window.addEventListener("keyup", g);
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
      v,
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
      w,
      !1
    ), window.removeEventListener("keydown", E), window.removeEventListener("keyup", g);
  };
};
class k extends HTMLElement {
  constructor() {
    super(), this.controls = null, console.log("orbit-controls init");
  }
  connectedCallback() {
    console.log("orbit-controls connected"), this.plugin = new y();
    const e = this.parentNode;
    this.viewer = e.viewer, this.viewer && this.viewer.plugin ? this.viewer.plugin(this.plugin) : console.error(
      "GeocamViewerOrbitControls must be a child of GeocamViewer"
    );
  }
  disconnectedCallback() {
    this.controls = null, this.viewer = null, console.log("orbit controls disconnected");
  }
}
window.customElements.define(
  "geocam-viewer-orbit-controls",
  k
);
export {
  k as GeocamViewerOrbitControls
};
