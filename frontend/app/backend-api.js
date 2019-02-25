// Backend API
const backendUrl = 'https://servianhack-the-gcp-3.appspot.com/api';

function analyseImage(imageBlob) {
  console.log('analysing image');
  const formData = new FormData();
  formData.append('filetoupload', imageBlob);


  const postOptions = {
    method: 'POST',
    body: formData,
  };

  fetch(backendUrl, postOptions)
  .then(response => {
    if (! response.ok) {
      console.error('image analysed with error', response);
      throw new Error('Error processing image');
    }
    
    return response.json()
      .then(response => {
        console.log('got response back', response, response.bin);
        return imageAnalysed(response.bin);
    });

  })
  .catch(error => console.log('error'));
}
