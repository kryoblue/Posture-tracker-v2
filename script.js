const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function detectPose() {
  const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
  video.play();

  async function poseFrame() {
    const poses = await detector.estimatePoses(video);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;
      keypoints.forEach(kp => {
        if (kp.score > 0.5) {
          ctx.beginPath();
          ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
        }
      });
    }
    requestAnimationFrame(poseFrame);
  }
  poseFrame();
}

setupCamera().then(detectPose);
