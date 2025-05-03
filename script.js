
let audioContext, analyser, sourceNode, dataArray, animationId;

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("waveform");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 200;

  const playButton = document.getElementById("playButton");
  const audio = document.getElementById("radioAudio");

  playButton.addEventListener("click", () => {
    audio.play();
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      sourceNode = audioContext.createMediaElementSource(audio);
      analyser = audioContext.createAnalyser();

      sourceNode.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      function draw() {
        animationId = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i];
          ctx.fillStyle = '#5A8785';
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      }

      draw();
    }
  });
});
