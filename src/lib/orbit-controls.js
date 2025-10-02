export const orbitControls = function (config = {}) {
  let viewer,
    onPointerDownPointerX,
    onPointerDownPointerY,
    onPointerDownLon,
    onPointerDownLat,
    mousePanning = false,
    touchPanning = false,
    keyPanning = 0,
    lastPanTime = 0,
    initialPinchDistance = 0,
    enabled = true,
    initialFov = 0;

  // Double-tap zoom variables
  let lastTapTime = 0,
    lastTapX = 0,
    lastTapY = 0,
    currentZoomLevel = 0;
  
  // Define zoom levels (FOV values from wide to narrow)
  const zoomLevels = [130, 100, 75, 50, 35, 25, 15, 10];
  const doubleTapThreshold = 300; // milliseconds
  const tapPositionThreshold = 50; // pixels

  const setEnabled = function(value) {
    enabled = value
  }
  this.setEnabled = setEnabled;

  const findClosestZoomLevel = function(currentFov) {
    // Validate input
    if (typeof currentFov !== 'number' || currentFov < 10 || currentFov > 130) {
      console.warn('Invalid FOV value:', currentFov, 'defaulting to zoom level 0');
      return 0; // Default to widest zoom
    }
    
    let closest = 0;
    let minDiff = Math.abs(zoomLevels[0] - currentFov);
    
    for (let i = 1; i < zoomLevels.length; i++) {
      const diff = Math.abs(zoomLevels[i] - currentFov);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    }
    return closest;
  };

  const handleDoubleTap = function(x, y) {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTapTime;
    const xDiff = Math.abs(x - lastTapX);
    const yDiff = Math.abs(y - lastTapY);
    
    if (timeDiff < doubleTapThreshold && 
        xDiff < tapPositionThreshold && 
        yDiff < tapPositionThreshold) {
      
      // Validate viewer and get current FOV
      if (!viewer || typeof viewer.fov !== 'function') {
        console.warn('Invalid viewer state, skipping double-tap');
        lastTapTime = 0;
        return true;
      }
      
      try {
        const currentFov = viewer.fov();
        
        // Re-sync currentZoomLevel with actual FOV to prevent desync issues
        currentZoomLevel = findClosestZoomLevel(currentFov);
        
        // Double tap detected - advance to next zoom level
        currentZoomLevel = (currentZoomLevel + 1) % zoomLevels.length;
        const targetFov = zoomLevels[currentZoomLevel];
        
        // Validate target FOV
        if (targetFov < 10 || targetFov > 130) {
          console.warn('Invalid zoom target:', targetFov, 'resetting to safe value');
          currentZoomLevel = 0; // Reset to widest view
          viewer.fov(zoomLevels[0]);
          lastTapTime = 0;
          return true;
        }
        
        // Set FOV directly instead of animating to avoid animation conflicts
        viewer.fov(targetFov);
        
        console.log(`Zoom level: ${currentZoomLevel}/${zoomLevels.length - 1}, FOV: ${targetFov}`);
        
      } catch (error) {
        console.warn('Double-tap zoom error:', error);
        // Fallback: reset to safe state
        try {
          currentZoomLevel = 0;
          viewer.fov(zoomLevels[0]);
        } catch (fallbackError) {
          console.error('Critical zoom error:', fallbackError);
        }
      }
      
      // Reset tap tracking to prevent triple-tap issues
      lastTapTime = 0;
      return true; // Indicate that double-tap was handled
    } else {
      // Single tap - update tracking
      lastTapTime = currentTime;
      lastTapX = x;
      lastTapY = y;
      return false;
    }
  };

  const onDocumentMouseWheel = function (event) {
    if (!enabled) {
      return
    }
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
    
    // Update current zoom level to match wheel zoom
    currentZoomLevel = findClosestZoomLevel(fov);
  };

  const onDocumentMouseUp = function (event) {
    if (!enabled) {
      return
    }
    mousePanning = false;
  };

  const onDocumentMouseMove = function (event) {
    if (!enabled) {
      return
    }
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
    if (!enabled) {
      return
    }
    event.preventDefault();
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = viewer.facing();
    onPointerDownLat = Math.max(-85, Math.min(85, viewer.horizon()));
    mousePanning = true;
  };

  // Touch event handlers
  const getDistance = function (touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const onDocumentTouchStart = function (event) {
    if (!enabled) {
      return
    }
    event.preventDefault();

    if (event.touches.length === 1) {
      // Single finger - start panning
      const touch = event.touches[0];
      onPointerDownPointerX = touch.clientX;
      onPointerDownPointerY = touch.clientY;
      onPointerDownLon = viewer.facing();
      onPointerDownLat = Math.max(-85, Math.min(85, viewer.horizon()));
      touchPanning = true;
    } else if (event.touches.length === 2) {
      // Two fingers - start pinch zoom
      touchPanning = false;
      initialPinchDistance = getDistance(event.touches[0], event.touches[1]);
      initialFov = viewer.fov();
    }
  };

  const onDocumentTouchMove = function (event) {
    if (!enabled) {
      return
    }
    event.preventDefault();
    
    if (event.touches.length === 1 && touchPanning) {
      // Single finger - pan/rotate
      const touch = event.touches[0];
      const fov = viewer.fov();
      const height = viewer.wrapper.clientHeight;
      const ratio = fov/height;
      let lon =
        (touch.clientX - onPointerDownPointerX) * -ratio +
        onPointerDownLon;

      let lat =
        (touch.clientY - onPointerDownPointerY) * -ratio +
        onPointerDownLat;
      lat = Math.max(-85, Math.min(85, lat));
      viewer.facing((360 + lon) % 360);
      viewer.horizon(lat);
    } else if (event.touches.length === 2) {
      // Two fingers - pinch zoom
      const currentDistance = getDistance(event.touches[0], event.touches[1]);
      const zoomFactor = initialPinchDistance / currentDistance;
      let newFov = initialFov * zoomFactor;
      
      // Clamp fov to reasonable bounds
      newFov = Math.max(10, Math.min(130, newFov));
      viewer.fov(newFov);
      
      // Update current zoom level to match pinch zoom
      currentZoomLevel = findClosestZoomLevel(newFov);
    }
  };

  const onDocumentTouchEnd = function (event) {
    if (!enabled) {
      return
    }
    
    // Check for double-tap on single finger lift
    if (event.touches.length === 0 && touchPanning) {
      const touch = event.changedTouches[0];
      const isDoubleTap = handleDoubleTap(touch.clientX, touch.clientY);
      
      if (!isDoubleTap) {
        // Not a double-tap, so this was just a single tap end
        touchPanning = false;
        initialPinchDistance = 0;
      } else {
        // Double-tap handled, reset panning state
        touchPanning = false;
        initialPinchDistance = 0;
      }
    } else if (event.touches.length === 0) {
      // All fingers lifted
      touchPanning = false;
      initialPinchDistance = 0;
    } else if (event.touches.length === 1) {
      // One finger remaining - restart single touch tracking
      const touch = event.touches[0];
      onPointerDownPointerX = touch.clientX;
      onPointerDownPointerY = touch.clientY;
      onPointerDownLon = viewer.facing();
      onPointerDownLat = Math.max(-85, Math.min(85, viewer.horizon()));
      touchPanning = true;
      initialPinchDistance = 0;
    }
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
    if (!enabled || e.target.closest('input,calcite-input')) return;

    const left  = e.key === 'ArrowLeft' || e.key === 'a';
    const right = e.key === 'ArrowRight' || e.key === 'd';
    if (left|| right) {
      lastPanTime = performance.now();
      keyPanning = right ? 1 : -1;
      requestAnimationFrame(keyPan);
    }
  };

  const stopKey = function (e) {
    if (!enabled) {
      return
    }
    keyPanning = 0;
  };

  this.init = function (geocamViewer) {
    viewer = geocamViewer;
    
    // Initialize current zoom level based on initial FOV with delay to ensure viewer is ready
    setTimeout(() => {
      try {
        if (viewer && typeof viewer.fov === 'function') {
          const initialFov = viewer.fov();
          currentZoomLevel = findClosestZoomLevel(initialFov);
          console.log(`Initialized zoom level: ${currentZoomLevel}, Initial FOV: ${initialFov}`);
        } else {
          console.warn('Viewer not ready during initialization, using default zoom level');
          currentZoomLevel = 0; // Default to widest view
        }
      } catch (error) {
        console.warn('Error during zoom initialization:', error);
        currentZoomLevel = 0; // Safe fallback
      }
    }, 100); // Small delay to ensure viewer is fully initialized
    
    // Mouse events
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
    
    // Touch events
    viewer.renderer.domElement.addEventListener(
      "touchstart",
      onDocumentTouchStart,
      { passive: false }
    );
    viewer.renderer.domElement.addEventListener(
      "touchmove",
      onDocumentTouchMove,
      { passive: false }
    );
    viewer.renderer.domElement.addEventListener(
      "touchend",
      onDocumentTouchEnd,
      { passive: false }
    );
    viewer.renderer.domElement.addEventListener(
      "touchcancel",
      onDocumentTouchEnd,
      { passive: false }
    );
    
    // Keyboard events
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", stopKey);
  };

  this.destroy = function() {
    // Remove mouse events
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
    
    // Remove touch events
    viewer.renderer.domElement.removeEventListener(
      "touchstart",
      onDocumentTouchStart,
      false
    );
    viewer.renderer.domElement.removeEventListener(
      "touchmove",
      onDocumentTouchMove,
      false
    );
    viewer.renderer.domElement.removeEventListener(
      "touchend",
      onDocumentTouchEnd,
      false
    );
    viewer.renderer.domElement.removeEventListener(
      "touchcancel",
      onDocumentTouchEnd,
      false
    );
    
    // Remove keyboard events
    window.removeEventListener("keydown", handleKey);
    window.removeEventListener("keyup", stopKey);
  }
};