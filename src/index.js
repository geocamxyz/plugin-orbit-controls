import { orbitControls } from "./lib/orbit-controls.js";

export class GeocamViewerOrbitControls extends HTMLElement {
  constructor() {
    super();
    this.controls = null;
    this.viewer = null;
    this.plugin = null;
    // this.yaw = this.getAttribute('yaw') || 0;
    console.log("orbit-controls init");
  }

  connectedCallback() {
    console.log("orbit-controls connected");
    const host = this.closest("geocam-viewer");
    if (!host) {
      console.error(
        "GeocamViewerOrbitControls must be a child of GeocamViewer"
      );
      return;
    }

    const attach = () => {
      const viewer = host.viewer;
      if (viewer && typeof viewer.plugin === "function") {
        if (this.plugin) return;
        this.viewer = viewer;
        this.plugin = new orbitControls();
        this.viewer.plugin(this.plugin);
      } else {
        setTimeout(attach, 50);
      }
    };

    attach();
  }

  disconnectedCallback() {
    if (this.plugin && typeof this.plugin.destroy === "function") {
      this.plugin.destroy();
    }
    this.plugin = null;
    this.viewer = null;
    console.log("orbit controls disconnected");
    // Clean up the viewer
  }
}

window.customElements.define(
  "geocam-viewer-orbit-controls",
  GeocamViewerOrbitControls
);
