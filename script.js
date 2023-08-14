const tileCanvas = document.getElementById("tile-canvas");
const tileContext = tileCanvas.getContext("2d");
const editorCanvas = document.getElementById("editor-canvas");
const editorContext = editorCanvas.getContext("2d");
const previewEl = document.getElementById("preview");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");


function setupHighDpiCanvas(canvas) {
  var ctx = canvas.getContext("2d");
  var devicePixelRatio = window.devicePixelRatio || 1;

  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;

  canvas.width = canvasWidth * devicePixelRatio;
  canvas.height = canvasHeight * devicePixelRatio;

  ctx.scale(devicePixelRatio, devicePixelRatio);
}

let currentTileIndex = 0;
const patternTiles = [
  // Add your 8x8 pattern tiles (black and white) here as arrays of 0s and 1s.
  [1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1],
  [0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
  [1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1],
  [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
  [1,0,1,1,0,0,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,1,1,1,1,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
  [1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
  [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,1,1,1,0,0,1,0,1,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,0,0,0,0,1,1,1,0,1,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,0,1,0,1,1,1,0,0,1,0,0,0,1,0,0,1,1,1,0,0,0,1],
  [0,1,0,1,0,1,0,1,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0],
  [0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0],
  [1,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0,0,0,0,1,0,1,1,0,0,0,0,1,0,1,1,0,0,0,0,1,0,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0],
  [1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
  [0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0],
  [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0],
  [1,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0],
  [0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,1,1,1,0,0,0,1,1],
  [0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0],
  [0,1,1,1,0,1,1,1,1,0,0,0,1,0,0,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,0,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1],
];

const tileSize = 8;
const tileScale = 2;
const editorScale = tileScale * 4;
const editorSpacing = 2;
const previewWidth = 54;
const previewHeight = 33;

function updateElementSize(element, width, height) {
  element.width = width;
  element.height = width;
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
}

updateElementSize(tileCanvas, tileSize*tileScale, tileSize*tileScale)
updateElementSize(editorCanvas, (tileSize*editorScale)+editorSpacing*tileSize-editorSpacing, (tileSize*editorScale)+editorSpacing*tileSize-editorSpacing)
updateElementSize(previewEl, previewWidth*tileScale, previewHeight*tileScale)

setupHighDpiCanvas(tileCanvas);
setupHighDpiCanvas(editorCanvas);

function drawTile(ctx, tile, scale, offset = {x: 0, y: 0}) {
  for (let y = 0; y < tileSize; y++) {
    for (let x = 0; x < tileSize; x++) {
      ctx.fillStyle = tile[y * tileSize + x] ? "#000" : "#fff";
      ctx.fillRect(x * scale + (x*offset.x), y * scale + (y*offset.y), scale, scale);
    }
  }
}

// Adding click and drag functionality to the interactive area
let drawing = false;
let color = 0;

function drawAtPosition(clientX, clientY, setColor = false) {
  const tile = patternTiles[currentTileIndex];
  const index = getCursorIndex(clientX, clientY);
  // console.log(clientX, clientY, index)
  if (setColor)
    color = tile[index] === 0 ? 1 : 0;
  tile[index] = color;
}

function getCursorIndex(clientX, clientY) {
  const rect = editorCanvas.getBoundingClientRect();
  const effectiveTileSize = tileSize + editorSpacing;
  const x = Math.floor((clientX - rect.left)/ effectiveTileSize);
  const y = Math.floor((clientY - rect.top)/ effectiveTileSize);

  const index = y * tileSize + x;
  return index
}

function updateTile() {
  const tile = patternTiles[currentTileIndex];
  drawTile(tileContext, tile, tileScale);
  updateEditor();
  updatePreview();
}

function updateEditor() {
  const tile = patternTiles[currentTileIndex];
  drawTile(editorContext, tile, editorScale, {x: editorSpacing, y: editorSpacing});
}

function updatePreview() {
  updateBackground(previewEl, {x: 2, y: 10});
}

function updateBackground(element, offset={x: 0, y: 0}) {
  element.style.backgroundImage = `url(${tileCanvas.toDataURL()})`;
  element.style.backgroundSize = `${tileSize * tileScale}px ${tileSize * tileScale}px`;
  element.style.backgroundPosition = `${offset.x}px ${offset.y}px`;
}


prevBtn.addEventListener("click", () => {
  currentTileIndex = (currentTileIndex - 1 + patternTiles.length) % patternTiles.length;
  updateTile();
});

nextBtn.addEventListener("click", () => {
  currentTileIndex = (currentTileIndex + 1) % patternTiles.length;
  updateTile();
});

previewEl.addEventListener("click", () => {
  updateBackground(document.body);
});

editorCanvas.addEventListener("mousedown", (event) => {
  drawing = true;
  drawAtPosition(event.clientX, event.clientY, true);
  updateTile();
});

// capture the release anywhere on the page
document.addEventListener("mouseup", () => {
  drawing = false;
});

editorCanvas.addEventListener("mousemove", (event) => {
  if (!drawing) return;
  drawAtPosition(event.clientX, event.clientY);
  updateTile();
});

updateTile();
updateBackground(document.body);
