import { orbitControls } from "./lib/orbit-controls.js";

export class GeocamViewerOrbitControls extends HTMLElement {
  constructor() {
    super();
    this.controls = null;
    // this.yaw = this.getAttribute('yaw') || 0;
    console.log("orbit-controls init");
  }

  connectedCallback() {
    console.log("orbit-controls connected");
    const node = this;
    this.controls = new orbitControls();
    const parent = this.parentNode;
    if (parent.viewer && parent.viewer.plugin) {
      // Call a method on the parent
      parent.viewer.plugin(this.controls);
    } else {
      console.error(
        "GeocamViewerOrbitControls must be a child of GeocamViewer"
      );
    }
  }

  disconnectedCallback() {
    this.controls = null;
    console.log("orbit controls disconnected");
    // Clean up the viewer
  }
}

window.customElements.define(
  "geocam-viewer-orbit-controls",
  GeocamViewerOrbitControls
);
