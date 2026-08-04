import Module from './r8.js';

async function loadModule(filename = null, filedata = null) {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.className = 'emscripten';
    canvas.tabIndex = -1;
    canvas.oncontextmenu = (event) => event.preventDefault();
    document.body.appendChild(canvas);
    fileInput.style.display = 'none';
    await Module({
        arguments: filename ? [filename] : [],
        canvas: (function() {
            var canvas = document.getElementById('canvas');
            return canvas;
        })(),
        preRun: (mod) => {
            if (filename && filedata) {
                mod.FS.writeFile(filename, filedata);
            }
        }
    });
}

function isMobileDevice() {
  // 1. Check the modern Client Hints API (Chrome, Edge, Opera)
  if (navigator.userAgentData) {
    return navigator.userAgentData.mobile;
  }

  // 2. Fallback to classic User Agent regex parsing (Safari, Firefox, legacy browsers)
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

if (isMobileDevice()) {
    fileInput.style.display = 'block';
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const byteArray = new Uint8Array(arrayBuffer);
            // put into the emscripten FS
            const filename = '/' + file.name;
            await loadModule(filename, byteArray);
        }
    });
} else {
    await loadModule();
}

// let mod = await Module({
//     // arguments: ['/box.rom'],
//     canvas: (function() {
//         var canvas = document.getElementById('canvas');
//         return canvas;
//     })(),
// });
