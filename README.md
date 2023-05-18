# Orbit Controls
A plugin for the geocam-viewer.
### NPM Installation:
```
npm install 'https://gitpkg.now.sh/geocamxyz/plugin-orbit-controls/src?v1.0.0'
```
or for a particual commit version:
```
npm install 'https://gitpkg.now.sh/geocamxyz/plugin-orbit-controls/src?16d7bda'
```
### Import Map (External Loading):
```
https://cdn.jsdelivr.net/gh/geocamxyz/plugin-orbit-controls@v1.0.0/dist/orbit-controls.js
```
or for a particual commit version:
```
https://cdn.jsdelivr.net/gh/geocamxyz/plugin-orbit-controls@16d7bda/dist/orbit-controls.js
```
### Usage:
The .js file can be imported into your .html file using the below code (This can be ignored if your using the NPM package).
```
<script type="importmap">
      {
        "imports": {
          "orbit-controls": "https://cdn.jsdelivr.net/gh/geocamxyz/plugin-orbit-controls@v1.0.0/dist/orbit-controls.js"
        }
      }
    </script>
```
The plugin can be imported via a module script or using the npm package and using the below import statement.
```
import { orbitControls } from "orbit-controls"
```
### Setup:
The plugin can then be added into the plugins array for the init of the viewer class as seen below
````
const viewer = new geocamViewer(node, {
	plugins: [
        new orbitControls(),
      ],
});
```