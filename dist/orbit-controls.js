const H = function($ = {}) {
  let n, h, v, w, g, y = !1, c = !1, p = 0, z = 0, d = 0, s = !0, T = 0, E = 0, P = 0, k = 0, i = 0;
  const a = [130, 100, 75, 50, 35, 25, 15, 10], A = 300, Y = 50, q = function(e) {
    s = e;
  };
  this.setEnabled = q;
  const D = function(e) {
    if (typeof e != "number" || e < 10 || e > 130)
      return console.warn("Invalid FOV value:", e, "defaulting to zoom level 0"), 0;
    let t = 0, o = Math.abs(a[0] - e);
    for (let r = 1; r < a.length; r++) {
      const l = Math.abs(a[r] - e);
      l < o && (o = l, t = r);
    }
    return t;
  }, G = function(e, t) {
    const o = Date.now(), r = o - E, l = Math.abs(e - P), f = Math.abs(t - k);
    if (r < A && l < Y && f < Y) {
      if (!n || typeof n.fov != "function")
        return console.warn("Invalid viewer state, skipping double-tap"), E = 0, !0;
      try {
        const u = n.fov();
        i = D(u), i = (i + 1) % a.length;
        const m = a[i];
        if (m < 10 || m > 130)
          return console.warn("Invalid zoom target:", m, "resetting to safe value"), i = 0, n.fov(a[0]), E = 0, !0;
        n.fov(m), console.log(`Zoom level: ${i}/${a.length - 1}, FOV: ${m}`);
      } catch (u) {
        console.warn("Double-tap zoom error:", u);
        try {
          i = 0, n.fov(a[0]);
        } catch (m) {
          console.error("Critical zoom error:", m);
        }
      }
      return E = 0, !0;
    } else
      return E = o, P = e, k = t, !1;
  }, L = function(e) {
    if (!s)
      return;
    let t = n.fov();
    e.wheelDeltaY ? t -= e.wheelDeltaY * 0.05 : e.wheelDelta ? t -= e.wheelDelta * 0.05 : e.detail && (t += e.detail * 1), (t < 10 || t > 130) && (t = t < 10 ? 10 : 130), n.fov(t), i = D(t);
  }, M = function(e) {
    s && (y = !1);
  }, X = function(e) {
    if (s && y) {
      n.facing();
      const t = n.fov(), o = n.wrapper.clientHeight, r = t / o;
      let l = (e.clientX - h) * -r + w, f = (e.clientY - v) * -r + g;
      f = Math.max(-85, Math.min(85, f)), n.facing((360 + l) % 360), n.horizon(f);
    }
  }, x = function(e) {
    s && (e.preventDefault(), h = e.clientX, v = e.clientY, w = n.facing(), g = Math.max(-85, Math.min(85, n.horizon())), y = !0);
  }, C = function(e, t) {
    const o = e.clientX - t.clientX, r = e.clientY - t.clientY;
    return Math.sqrt(o * o + r * r);
  }, O = function(e) {
    if (s)
      if (e.preventDefault(), e.touches.length === 1) {
        const t = e.touches[0];
        h = t.clientX, v = t.clientY, w = n.facing(), g = Math.max(-85, Math.min(85, n.horizon())), c = !0;
      } else
        e.touches.length === 2 && (c = !1, d = C(e.touches[0], e.touches[1]), T = n.fov());
  }, V = function(e) {
    if (s) {
      if (e.preventDefault(), e.touches.length === 1 && c) {
        const t = e.touches[0], o = n.fov(), r = n.wrapper.clientHeight, l = o / r;
        let f = (t.clientX - h) * -l + w, u = (t.clientY - v) * -l + g;
        u = Math.max(-85, Math.min(85, u)), n.facing((360 + f) % 360), n.horizon(u);
      } else if (e.touches.length === 2) {
        const t = C(e.touches[0], e.touches[1]), o = d / t;
        let r = T * o;
        r = Math.max(10, Math.min(130, r)), n.fov(r), i = D(r);
      }
    }
  }, b = function(e) {
    if (s) {
      if (e.touches.length === 0 && c) {
        const t = e.changedTouches[0], o = G(t.clientX, t.clientY);
        c = !1, d = 0;
      } else if (e.touches.length === 0)
        c = !1, d = 0;
      else if (e.touches.length === 1) {
        const t = e.touches[0];
        h = t.clientX, v = t.clientY, w = n.facing(), g = Math.max(-85, Math.min(85, n.horizon())), c = !0, d = 0;
      }
    }
  }, F = function() {
    if (p) {
      const t = performance.now() - z;
      let o = n.facing();
      o = o + 50 / 1e3 * t * p, n.facing((360 + o) % 360), z += t, requestAnimationFrame(F);
    }
  }, I = function(e) {
    if (!s || e.target.closest("input,calcite-input"))
      return;
    const t = e.key === "ArrowLeft" || e.key === "a", o = e.key === "ArrowRight" || e.key === "d";
    (t || o) && (z = performance.now(), p = o ? 1 : -1, requestAnimationFrame(F));
  }, S = function(e) {
    s && (p = 0);
  };
  this.init = function(e) {
    n = e, setTimeout(() => {
      try {
        if (n && typeof n.fov == "function") {
          const t = n.fov();
          i = D(t), console.log(`Initialized zoom level: ${i}, Initial FOV: ${t}`);
        } else
          console.warn("Viewer not ready during initialization, using default zoom level"), i = 0;
      } catch (t) {
        console.warn("Error during zoom initialization:", t), i = 0;
      }
    }, 100), n.renderer.domElement.addEventListener(
      "mousewheel",
      L,
      !1
    ), n.renderer.domElement.addEventListener(
      "DOMMouseScroll",
      L,
      !1
    ), n.renderer.domElement.addEventListener(
      "mousedown",
      x,
      !1
    ), n.renderer.domElement.addEventListener(
      "mouseup",
      M,
      !1
    ), n.renderer.domElement.addEventListener(
      "mouseleave",
      M,
      !1
    ), n.renderer.domElement.addEventListener(
      "mousemove",
      X,
      !1
    ), n.renderer.domElement.addEventListener(
      "touchstart",
      O,
      { passive: !1 }
    ), n.renderer.domElement.addEventListener(
      "touchmove",
      V,
      { passive: !1 }
    ), n.renderer.domElement.addEventListener(
      "touchend",
      b,
      { passive: !1 }
    ), n.renderer.domElement.addEventListener(
      "touchcancel",
      b,
      { passive: !1 }
    ), window.addEventListener("keydown", I), window.addEventListener("keyup", S);
  }, this.destroy = function() {
    n.renderer.domElement.removeEventListener(
      "mousewheel",
      L,
      !1
    ), n.renderer.domElement.removeEventListener(
      "DOMMouseScroll",
      L,
      !1
    ), n.renderer.domElement.removeEventListener(
      "mousedown",
      x,
      !1
    ), n.renderer.domElement.removeEventListener(
      "mouseup",
      M,
      !1
    ), n.renderer.domElement.removeEventListener(
      "mouseleave",
      M,
      !1
    ), n.renderer.domElement.removeEventListener(
      "mousemove",
      X,
      !1
    ), n.renderer.domElement.removeEventListener(
      "touchstart",
      O,
      !1
    ), n.renderer.domElement.removeEventListener(
      "touchmove",
      V,
      !1
    ), n.renderer.domElement.removeEventListener(
      "touchend",
      b,
      !1
    ), n.renderer.domElement.removeEventListener(
      "touchcancel",
      b,
      !1
    ), window.removeEventListener("keydown", I), window.removeEventListener("keyup", S);
  };
};
class Z extends HTMLElement {
  constructor() {
    super(), this.controls = null, console.log("orbit-controls init");
  }
  connectedCallback() {
    console.log("orbit-controls connected"), this.plugin = new H();
    const n = this.parentNode;
    this.viewer = n.viewer, this.viewer && this.viewer.plugin ? this.viewer.plugin(this.plugin) : console.error(
      "GeocamViewerOrbitControls must be a child of GeocamViewer"
    );
  }
  disconnectedCallback() {
    this.controls = null, this.viewer = null, console.log("orbit controls disconnected");
  }
}
window.customElements.define(
  "geocam-viewer-orbit-controls",
  Z
);
export {
  Z as GeocamViewerOrbitControls
};
