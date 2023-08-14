// This script needs to be ran from a real server, not a file:// URL.
// For a simple built-in server on macOS, cd to this folder and run the following:
//    python3 -m http.server

// Function to process a set of square images and sample at regular points
// to determine whether each point is black or white.
async function processImages(imageUrls) {
  const samplePoints = 8; // Assuming 8x8 grid of tiles

  const results = [];

  for (const imageUrl of imageUrls) {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = imageUrl;

    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    const sampledPoints = [];

    for (let row = 0; row < samplePoints; row++) {
      for (let col = 0; col < samplePoints; col++) {
        const x = Math.floor((col / (samplePoints - 1)) * (image.width - 1));
        const y = Math.floor((row / (samplePoints - 1)) * (image.height - 1));

        const pixelData = ctx.getImageData(x, y, 2, 2).data;
        const isBlack = pixelData[0] === 0 && pixelData[1] === 0 && pixelData[2] === 0;
        // console.log('image.width: ', image.width, 'x: ', x, 'y: ', y, 'pixelData: ', pixelData, 'isBlack: ', isBlack);

        sampledPoints.push(isBlack ? 1 : 0);
      }
    }

    results.push(sampledPoints);
  }

  return results;
}

const imageUrls = [
  'pattern-images/01.png',
  'pattern-images/02.png',
  'pattern-images/03.png',
  'pattern-images/04.png',
  'pattern-images/05.png',
  'pattern-images/06.png',
  'pattern-images/07.png',
  'pattern-images/08.png',
  'pattern-images/09.png',
  'pattern-images/10.png',
  'pattern-images/11.png',
  'pattern-images/12.png',
  'pattern-images/13.png',
  'pattern-images/14.png',
  'pattern-images/15.png',
  'pattern-images/16.png',
  'pattern-images/17.png',
  'pattern-images/18.png',
  'pattern-images/19.png',
  'pattern-images/20.png',
  'pattern-images/21.png',
  'pattern-images/22.png',
  'pattern-images/23.png',
  'pattern-images/24.png',
  'pattern-images/25.png',
  'pattern-images/26.png',
  'pattern-images/27.png',
  'pattern-images/28.png',
  'pattern-images/29.png',
  'pattern-images/30.png',
  'pattern-images/31.png',
  'pattern-images/32.png',
  'pattern-images/33.png',
  'pattern-images/34.png',
  'pattern-images/35.png',
  'pattern-images/36.png',
  'pattern-images/37.png',
  'pattern-images/38.png',
];

processImages(imageUrls)
  .then(processedResults => {
    document.getElementById('log').value += `All Done! Processed ${processedResults.length} patterns out of ${imageUrls.length} images.\n`;
    processedResults.map((result) => {
      const output = `[${result.toString()}],`;
      console.log(output);
      document.getElementById('output').value += `${output}\n`;
    })
  })
  .catch(error => {
    document.getElementById('log').value += `${error}\n`;
    console.error(error);
  });
