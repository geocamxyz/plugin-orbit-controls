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
    this.plugin = new orbitControls();
    const parent = this.parentNode;
    this.viewer = parent.viewer;
    if ( this.viewer &&  this.viewer.plugin) {
      // Call a method on the parent
        this.viewer.plugin(this.plugin);
    } else {
      console.error(
        "GeocamViewerOrbitControls must be a child of GeocamViewer"
      );
    }
  }

  disconnectedCallback() {
    this.controls = null;
    this.viewer = null;
    console.log("orbit controls disconnected");
    // Clean up the viewer
  }
}

window.customElements.define(
  "geocam-viewer-orbit-controls",
  GeocamViewerOrbitControls
);
