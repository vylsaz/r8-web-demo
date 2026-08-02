import Module from './r8.js';

let mod = await Module({
    canvas: (function() {
        var canvas = document.getElementById('canvas');
        return canvas;
    })(),
});
