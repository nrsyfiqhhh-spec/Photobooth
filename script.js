const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startBtn = document.getElementById("startBtn");
const captureBtn = document.getElementById("captureBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const photoStrip = document.getElementById("photoStrip");
const templateSelect = document.getElementById("templateSelect");

let capturedPhotos = [];

// Change template
templateSelect.addEventListener("change", () => {
  document.body.className = "template-" + templateSelect.value;
});

// Start camera
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

// Capture photo
captureBtn.addEventListener("click", () => {
  if (capturedPhotos.length >= 4) {
    alert("Maximum 4 photos only. Click restart to take again.");
    return;
  }

  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  if (canvas.width === 0 || canvas.height === 0) {
    alert("Please start the camera first.");
    return;
  }

  context.save();
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  context.restore();

  const imageData = canvas.toDataURL("image/png");
  capturedPhotos.push(imageData);

  const img = document.createElement("img");
  img.src = imageData;
  photoStrip.appendChild(img);
});

// Restart button
resetBtn.addEventListener("click", () => {
  capturedPhotos = [];
  photoStrip.innerHTML = "";
});

// Download photo strip
downloadBtn.addEventListener("click", async () => {
  if (capturedPhotos.length === 0) {
    alert("Please capture at least one photo first.");
    return;
  }

  const template = templateSelect.value;

  const designs = {
    classic: {
      background: "#ffffff",
      text: "#3b2f2f",
      border: "#f7efe5",
      title: "Classic Cream"
    },
    pink: {
      background: "#fff5f8",
      text: "#5c2636",
      border: "#ffd1df",
      title: "Soft Pink"
    },
    vintage: {
      background: "#f3dfbd",
      text: "#3f2a1d",
      border: "#b98b5b",
      title: "Vintage Brown"
    },
    black: {
      background: "#f5f5f5",
      text: "#111111",
      border: "#111111",
      title: "Black & White"
    }
  };

  const design = designs[template];

  const stripCanvas = document.createElement("canvas");
  const ctx = stripCanvas.getContext("2d");

  const photoWidth = 500;
  const photoHeight = 360;
  const padding = 35;
  const gap = 25;
  const titleHeight = 70;
  const footerHeight = 55;

  stripCanvas.width = photoWidth + padding * 2;
  stripCanvas.height =
    titleHeight +
    capturedPhotos.length * photoHeight +
    (capturedPhotos.length - 1) * gap +
    footerHeight +
    padding;

  ctx.fillStyle = design.background;
  ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

  ctx.strokeStyle = design.border;
  ctx.lineWidth = 12;
  ctx.strokeRect(10, 10, stripCanvas.width - 20, stripCanvas.height - 20);

  ctx.fillStyle = design.text;
  ctx.font = "bold 34px Arial";
  ctx.textAlign = "center";
  ctx.fillText("PHOTOBOOTH", stripCanvas.width / 2, 50);

  let y = titleHeight;

  for (let i = 0; i < capturedPhotos.length; i++) {
    const img = await loadImage(capturedPhotos[i]);

    if (template === "black") {
      ctx.filter = "grayscale(100%) contrast(110%)";
    } else if (template === "vintage") {
      ctx.filter = "sepia(50%) contrast(110%) brightness(95%)";
    } else {
      ctx.filter = "sepia(25%) contrast(105%) brightness(105%)";
    }

    ctx.drawImage(img, padding, y, photoWidth, photoHeight);
    ctx.filter = "none";

    y += photoHeight + gap;
  }

  ctx.fillStyle = design.text;
  ctx.font = "20px Arial";
  ctx.fillText(design.title, stripCanvas.width / 2, stripCanvas.height - 35);

  const link = document.createElement("a");
  link.download = "photobooth-strip.png";
  link.href = stripCanvas.toDataURL("image/png");
  link.click();
});

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}
