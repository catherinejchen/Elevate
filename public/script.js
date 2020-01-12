var video = document.querySelector('video');

function captureCamera(callback) {
   navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
   }).then(function (camera) {
      callback(camera);
   }).catch(function (error) {
      alert('Unable to capture your camera. Please check console logs.');
      console.error(error);
   });
}

function stopRecordingCallback() {
   video.src = video.srcObject = null;
   video.muted = false;
   video.volume = 1;
   video.src = URL.createObjectURL(recorder.getBlob());
   recorder.camera.stop();
   invokeSaveAsDialog(recorder.getBlob());
   recorder.destroy();
   recorder = null;
}

var recorder; // globally accessible

document.getElementById('btn-start-recording').onclick = function () {
   this.disabled = true;
   this.style.background = "#f0f0f0";
   this.style.color = "#666";
   document.querySelector('#btn-stop-recording').style.background = "#e74c3c";
   document.querySelector('#btn-stop-recording').style.color = "#fff";
   captureCamera(function (camera) {
      video.muted = true;
      video.volume = 0;
      video.srcObject = camera;

      recorder = RecordRTC(camera, {
         type: 'video'
      });

      recorder.startRecording();

      // release camera on stopRecording
      recorder.camera = camera;

      document.getElementById('btn-stop-recording').disabled = false;
   });
};

document.getElementById('btn-stop-recording').onclick = function () {
   this.disabled = true;
   this.style.background = "#f0f0f0";
   this.style.color = "#666";
   document.querySelector('#btn-start-recording').style.background = "#2ecc71";
   document.querySelector('#btn-start-recording').style.color = "#fff";
   document.querySelector('#btn-start-recording').disabled = false;
   recorder.stopRecording(stopRecordingCallback);
};