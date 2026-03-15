const H = function($ = {}) {
  let t, a, l, g, w, b = !1, u = !1, p = 0, T = 0, v = 0, s = !0, z = 0, E = 0, P = 0, k = 0, r = 0;
  const f = [130, 100, 75, 50, 35, 25, 15, 10], A = 300, Y = 50, q = function(e) {
    s = e;
  };
  this.setEnabled = q;
  const D = function(e) {
    if (typeof e != "number" || e < 10 || e > 130)
      return console.warn("Invalid FOV value:", e, "defaulting to zoom level 0"), 0;
    let n = 0, o = Math.abs(f[0] - e);
    for (let i = 1; i < f.length; i++) {
      const c = Math.abs(f[i] - e);
      c < o && (o = c, n = i);
    }
    return n;
  }, G = function(e, n) {
    const o = Date.now(), i = o - E, c = Math.abs(e - P), m = Math.abs(n - k);
    if (i < A && c < Y && m < Y) {
      if (!t || typeof t.fov != "function")
        return console.warn("Invalid viewer state, skipping double-tap"), E = 0, !0;
      try {
        const d = t.fov();
        r = D(d), r = (r + 1) % f.length;
        const h = f[r];
        if (h < 10 || h > 130)
          return console.warn("Invalid zoom target:", h, "resetting to safe value"), r = 0, t.fov(f[0]), E = 0, !0;
        t.fov(h), console.log(`Zoom level: ${r}/${f.length - 1}, FOV: ${h}`);
      } catch (d) {
        console.warn("Double-tap zoom error:", d);
        try {
          r = 0, t.fov(f[0]);
        } catch (h) {
          console.error("Critical zoom error:", h);
        }
      }
      return E = 0, !0;
    } else
      return E = o, P = e, k = n, !1;
  }, L = function(e) {
    if (!s)
      return;
    let n = t.fov();
    e.wheelDeltaY ? n -= e.wheelDeltaY * 0.05 : e.wheelDelta ? n -= e.wheelDelta * 0.05 : e.detail && (n += e.detail * 1), (n < 10 || n > 130) && (n = n < 10 ? 10 : 130), t.fov(n), r = D(n);
  }, M = function(e) {
    s && (b = !1);
  }, X = function(e) {
    if (s && b) {
      t.facing();
      const n = t.fov(), o = t.wrapper.clientHeight, i = n / o;
      let c = (e.clientX - a) * -i + g, m = (e.clientY - l) * -i + w;
      m = Math.max(-85, Math.min(85, m)), t.facing((360 + c) % 360), t.horizon(m);
    }
  }, x = function(e) {
    s && (e.preventDefault(), a = e.clientX, l = e.clientY, g = t.facing(), w = Math.max(-85, Math.min(85, t.horizon())), b = !0);
  }, C = function(e, n) {
    const o = e.clientX - n.clientX, i = e.clientY - n.clientY;
    return Math.sqrt(o * o + i * i);
  }, O = function(e) {
    if (s)
      if (e.preventDefault(), e.touches.length === 1) {
        const n = e.touches[0];
        a = n.clientX, l = n.clientY, g = t.facing(), w = Math.max(-85, Math.min(85, t.horizon())), u = !0;
      } else e.touches.length === 2 && (u = !1, v = C(e.touches[0], e.touches[1]), z = t.fov());
  }, V = function(e) {
    if (s) {
      if (e.preventDefault(), e.touches.length === 1 && u) {
        const n = e.touches[0], o = t.fov(), i = t.wrapper.clientHeight, c = o / i;
        let m = (n.clientX - a) * -c + g, d = (n.clientY - l) * -c + w;
        d = Math.max(-85, Math.min(85, d)), t.facing((360 + m) % 360), t.horizon(d);
      } else if (e.touches.length === 2) {
        const n = C(e.touches[0], e.touches[1]), o = v / n;
        let i = z * o;
        i = Math.max(10, Math.min(130, i)), t.fov(i), r = D(i);
      }
    }
  }, y = function(e) {
    if (s) {
      if (e.touches.length === 0 && u) {
        const n = e.changedTouches[0], o = G(n.clientX, n.clientY);
        u = !1, v = 0;
      } else if (e.touches.length === 0)
        u = !1, v = 0;
      else if (e.touches.length === 1) {
        const n = e.touches[0];
        a = n.clientX, l = n.clientY, g = t.facing(), w = Math.max(-85, Math.min(85, t.horizon())), u = !0, v = 0;
      }
    }
  }, F = function() {
    if (p) {
      const n = performance.now() - T;
      let o = t.facing();
      o = o + 50 / 1e3 * n * p, t.facing((360 + o) % 360), T += n, requestAnimationFrame(F);
    }
  }, I = function(e) {
    if (!s || e.target.closest("input,calcite-input")) return;
    const n = e.key === "ArrowLeft" || e.key === "a", o = e.key === "ArrowRight" || e.key === "d";
    (n || o) && (T = performance.now(), p = o ? 1 : -1, requestAnimationFrame(F));
  }, S = function(e) {
    s && (p = 0);
  };
  this.init = function(e) {
    t = e, setTimeout(() => {
      try {
        if (t && typeof t.fov == "function") {
          const n = t.fov();
          r = D(n), console.log(`Initialized zoom level: ${r}, Initial FOV: ${n}`);
        } else
          console.warn("Viewer not ready during initialization, using default zoom level"), r = 0;
      } catch (n) {
        console.warn("Error during zoom initialization:", n), r = 0;
      }
    }, 100), t.renderer.domElement.addEventListener(
      "mousewheel",
      L,
      !1
    ), t.renderer.domElement.addEventListener(
      "DOMMouseScroll",
      L,
      !1
    ), t.renderer.domElement.addEventListener(
      "mousedown",
      x,
      !1
    ), t.renderer.domElement.addEventListener(
      "mouseup",
      M,
      !1
    ), t.renderer.domElement.addEventListener(
      "mouseleave",
      M,
      !1
    ), t.renderer.domElement.addEventListener(
      "mousemove",
      X,
      !1
    ), t.renderer.domElement.addEventListener(
      "touchstart",
      O,
      { passive: !1 }
    ), t.renderer.domElement.addEventListener(
      "touchmove",
      V,
      { passive: !1 }
    ), t.renderer.domElement.addEventListener(
      "touchend",
      y,
      { passive: !1 }
    ), t.renderer.domElement.addEventListener(
      "touchcancel",
      y,
      { passive: !1 }
    ), window.addEventListener("keydown", I), window.addEventListener("keyup", S);
  }, this.destroy = function() {
    t.renderer.domElement.removeEventListener(
      "mousewheel",
      L,
      !1
    ), t.renderer.domElement.removeEventListener(
      "DOMMouseScroll",
      L,
      !1
    ), t.renderer.domElement.removeEventListener(
      "mousedown",
      x,
      !1
    ), t.renderer.domElement.removeEventListener(
      "mouseup",
      M,
      !1
    ), t.renderer.domElement.removeEventListener(
      "mouseleave",
      M,
      !1
    ), t.renderer.domElement.removeEventListener(
      "mousemove",
      X,
      !1
    ), t.renderer.domElement.removeEventListener(
      "touchstart",
      O,
      !1
    ), t.renderer.domElement.removeEventListener(
      "touchmove",
      V,
      !1
    ), t.renderer.domElement.removeEventListener(
      "touchend",
      y,
      !1
    ), t.renderer.domElement.removeEventListener(
      "touchcancel",
      y,
      !1
    ), window.removeEventListener("keydown", I), window.removeEventListener("keyup", S);
  };
};
class Z extends HTMLElement {
  constructor() {
    super(), this.controls = null, this.viewer = null, this.plugin = null, console.log("orbit-controls init");
  }
  connectedCallback() {
    console.log("orbit-controls connected");
    const t = this.closest("geocam-viewer");
    if (!t) {
      console.error(
        "GeocamViewerOrbitControls must be a child of GeocamViewer"
      );
      return;
    }
    const a = () => {
      const l = t.viewer;
      if (l && typeof l.plugin == "function") {
        if (this.plugin) return;
        this.viewer = l, this.plugin = new H(), this.viewer.plugin(this.plugin);
      } else
        setTimeout(a, 50);
    };
    a();
  }
  disconnectedCallback() {
    this.plugin && typeof this.plugin.destroy == "function" && this.plugin.destroy(), this.plugin = null, this.viewer = null, console.log("orbit controls disconnected");
  }
}
window.customElements.define(
  "geocam-viewer-orbit-controls",
  Z
);
export {
  Z as GeocamViewerOrbitControls
};
