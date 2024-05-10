# Orbit Controls
A web component plugin for the [geocamxyz/geocam-viewer](https://github.com/geocamxyz/geocam-viewer) to add keyboard and mouse panorama navigation for FOV, facing and tilt to the viewer
### NPM Installation:
```
npm install 'https://gitpkg.now.sh/geocamxyz/plugin-orbit-controls/src?v2.0.3'
```
or for a particual commit version:
```
npm install 'https://gitpkg.now.sh/geocamxyz/plugin-orbit-controls/src?16d7bda'
```
### Import Map (External Loading):
```
https://cdn.jsdelivr.net/gh/geocamxyz/plugin-orbit-controls@v2.0.3/dist/orbit-controls.js
```
or for a particual commit version:
```
https://cdn.jsdelivr.net/gh/geocamxyz/plugin-orbit-controls@16d7bda/dist/orbit-controls.js
```
### Usage:
The .js file can be imported into your .html file using the below code (This can be ignored if your using the NPM package).
```
 <script type="module" src="https://cdn.jsdelivr.net/gh/geocamxyz/plugin-orbit-controls@v2.0.3/dist/orbit-controls.js"></script>
 ```

 Or with an importmap
 ```
<script type="importmap">
  {
    "imports": {
      "orbit-controls": "https://cdn.jsdelivr.net/gh/geocamxyz/plugin-orbit-controls@v2.0.3/dist/orbit-controls.js"
    }
  }
</script>
```
The plugin can then be imported via a module script or using the npm package and using the below import statement.
```
import "orbit-controls"
```
### Setup:
The plugin can then be added to the viewer by making the custom element a child of the viewer parent element.  

```
<geocam-viewer>
  <geocam-viewer-orbit-controls></geocam-viewer-orbit-controls>
</geocam-viewer>
```

There are no attribute settings.

The plugin adds the following mouse controls:
- click and drag left or right to pan (facing)
- click and drag up and down to tilt (tilt/horizon)
- scrollwheel to zoom in and out (FOV)

The plugin adds the following keyboard controls:
- left arrow/a: pan left
- right arrow/d: pan right

NB: forward and back arrows, w and s keys are reserved for [geocamxyz/plugin-prev-next-controls](https://github.com/geocamxyz/plugin-prev-next-controls)