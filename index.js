import Module from './r8.js';

async function loadModule(filename = null, filedata = null) {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.className = 'emscripten';
    canvas.tabIndex = -1;
    canvas.oncontextmenu = (event) => event.preventDefault();
    document.body.appendChild(canvas);
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
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.color = 'white';
    document.body.appendChild(fileInput);
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const byteArray = new Uint8Array(arrayBuffer);
            const filename = '/' + file.name;
            fileInput.remove(); // Remove the file input after file selection
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
