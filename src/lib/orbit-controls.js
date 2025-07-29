export const orbitControls = function (config = {}) {
  let viewer,
    onPointerDownPointerX,
    onPointerDownPointerY,
    onPointerDownLon,
    onPointerDownLat,
    mousePanning = false,
    keyPanning = 0,
    lastPanTime = 0;

  const onDocumentMouseWheel = function (event) {
    // WebKit
    let fov = viewer.fov();

    if (event.wheelDeltaY) {
      fov -= event.wheelDeltaY * 0.05;
      // Opera / Explorer 9
    } else if (event.wheelDelta) {
      fov -= event.wheelDelta * 0.05;
      // Firefox
    } else if (event.detail) {
      fov += event.detail * 1.0;
    }
    if (fov < 10 || fov > 130) {
      fov = fov < 10 ? 10 : 130;
    }
    viewer.fov(fov);
  };

  const onDocumentMouseUp = function (event) {
    mousePanning = false;
  };

  const onDocumentMouseMove = function (event) {
    if (mousePanning) {
      const prevLon = viewer.facing();
      const fov = viewer.fov();
      const height = viewer.wrapper.clientHeight;
      const ratio = fov/height;
      let lon =
        (event.clientX - onPointerDownPointerX) * -ratio +
        onPointerDownLon; // -0.175

      let lat =
        (event.clientY - onPointerDownPointerY) * -ratio +
        onPointerDownLat; //  -0.175
      lat = Math.max(-85, Math.min(85, lat));
      viewer.facing((360 + lon) % 360);
      viewer.horizon(lat);
    }
  };

  const onDocumentMouseDown = function (event) {
    event.preventDefault();
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = viewer.facing();
    onPointerDownLat = viewer.horizon();
    mousePanning = true;
  };

  const keyPan = function () {
    if (keyPanning) {
      const degreesPerSec = 50;
      const delta = performance.now() - lastPanTime;
      let lon = viewer.facing();
      lon = lon + (degreesPerSec / 1000) * delta * keyPanning;
      viewer.facing((360 + lon) % 360);
      lastPanTime += delta;
      requestAnimationFrame(keyPan);
    }
  };

  const handleKey = function (e) {
        if (e.target.closest('input')) return;
    const left  = e.key === 'ArrowLeft' || e.key === 'a';
    const right = e.key === 'ArrowRight' || e.key === 'd';
    if (left|| right) {
      lastPanTime = performance.now();
      keyPanning = right ? 1 : -1;
      requestAnimationFrame(keyPan);
    }
  };

  const stopKey = function (e) {
    keyPanning = 0;
  };

  this.init = function (geocamViewer) {
    viewer = geocamViewer;
    viewer.renderer.domElement.addEventListener(
      "mousewheel",
      onDocumentMouseWheel,
      false
    );
    viewer.renderer.domElement.addEventListener(
      "DOMMouseScroll",
      onDocumentMouseWheel,
      false
    );
    viewer.renderer.domElement.addEventListener(
      "mousedown",
      onDocumentMouseDown,
      false
    );
    viewer.renderer.domElement.addEventListener(
      "mouseup",
      onDocumentMouseUp,
      false
    );
    viewer.renderer.domElement.addEventListener(
      "mouseleave",
      onDocumentMouseUp,
      false
    );
    viewer.renderer.domElement.addEventListener(
      "mousemove",
      onDocumentMouseMove,
      false
    );
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", stopKey);
  };

  this.destroy = function() {
    viewer.renderer.domElement.removeEventListener(
      "mousewheel",
      onDocumentMouseWheel,
      false
    );
    viewer.renderer.domElement.removeEventListener(
      "DOMMouseScroll",
      onDocumentMouseWheel,
      false
    );
    viewer.renderer.domElement.removeEventListener(
      "mousedown",
      onDocumentMouseDown,
      false
    );
    viewer.renderer.domElement.removeEventListener(
      "mouseup",
      onDocumentMouseUp,
      false
    );
    viewer.renderer.domElement.removeEventListener(
      "mouseleave",
      onDocumentMouseUp,
      false
    );
    viewer.renderer.domElement.removeEventListener(
      "mousemove",
      onDocumentMouseMove,
      false
    );
    window.removeEventListener("keydown", handleKey);
    window.removeEventListener("keyup", stopKey);
  }
};