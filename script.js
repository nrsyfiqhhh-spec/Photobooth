const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startBtn = document.getElementById("startBtn");
const captureBtn = document.getElementById("captureBtn");
const downloadBtn = document.getElementById("downloadBtn");
const photoStrip = document.getElementById("photoStrip");

let capturedPhotos = [];

startBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    video.srcObject = stream;
  } catch (error) {
    alert("Camera cannot be accessed. Please allow camera permission.");
  }
});

captureBtn.addEventListener("click", () => {
  if (capturedPhotos.length >= 4) {
    alert("Maximum 4 photos only.");
    return;
  }

  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/png");
  capturedPhotos.push(imageData);

  const img = document.createElement("img");
  img.src = imageData;
  photoStrip.appendChild(img);
});

downloadBtn.addEventListener("click", () => {
  if (capturedPhotos.length === 0) {
    alert("Please capture at least one photo first.");
    return;
  }

  const link = document.createElement("a");
  link.download = "photobooth-photo.png";
  link.href = capturedPhotos[capturedPhotos.length - 1];
  link.click();
});
