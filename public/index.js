$(document).ready(function() {
    var video = document.querySelector("#videoElement");
/*if(navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}*/

$(".custom-file-input").on("change", function() {
  const fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

$('#tester').click(function(e){
  e.preventDefault();
  console.log('Button clicked');
  $.ajax({
      type: 'get',            //Request type
      dataType: 'json',       //Data type - we will use JSON for almost everything 
      url: '/transcribe',   //The server endpoint we are connecting to
      
      success: function (data) {
          console.log(data);
          $('#transcript').append(data.transcription);
          for(var i = 0; i < data.analysis.length; i++){
           $('#nlp-text').append("Sentence " + i+1 + ": " + data.analysis[i]["text"]);
          $('#nlp-score').append("Score: " + data.analysis[i]["score"]);
          $('#nlp-mag').append("Magnitude: " + data.analysis[i]["magnitude"]);
        }
      },
      fail: function(error) {
          // Non-200 return, do something with error
          console.log(error); 
      }
    });
  });
});