const takePictureButton =
  document.getElementById('takePictureButton');
const screenshotButton = document.getElementById('takeScreenshot');

const img = document.getElementById('screenshotImage');
const video = document.getElementById('videoPlayer');

const canvas = document.createElement('canvas');

const constraints = {
  video: { facingMode: "environment" } ,
};

takePictureButton.onclick = function() {
  navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
};

video.onclick = function() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);

  // Other browsers will fall back to image/png
  img.src = canvas.toDataURL('image/webp');

  // Stop all video streams
  video.srcObject.getVideoTracks().forEach(track => track.stop());
  video.hidden = true;

  // loading spinner
  document.getElementById('imageLoadingSpinner').className +=' is-active';

  // convert image to Blob and send it to backend api analysis.
  canvas.toBlob(analyseImage, 'image/jpeg', 1);
};

const returnHomeButton = document.getElementById('returnHomeButton');
const closeResultsPageButton = document.getElementById('closeResultsPageButton');

returnHomeButton.onclick = closeResultsPageButton.onclick = function() {
  document.getElementById('resultPanel').className = 'result-panel';
}

function imageAnalysed(result) {
  document.getElementById('imageLoadingSpinner').className = 
    document.getElementById('imageLoadingSpinner').className.replace(' is-active', '');

  document.getElementById('cameraPanel').className = 'camera-panel';
  canvas.remove();
  video.hidden = false;

  document.getElementById('resultIcon').className = `material-icons result-icon ${result}`;
  document.getElementById('resultPanel').className = 'result-panel-active';

}

function handleSuccess(stream) {
  document.getElementById('cameraPanel').className = 'camera-panel-active';

  video.srcObject = stream;
}

function handleError(error) {
  console.log('ops, not working...', error);
}
