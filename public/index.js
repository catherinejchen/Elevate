$(document).ready(function() {
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
           if(data.analysis[i]["score"] >= 0.8 && data.analysis[i]["magnitude"] >= 0.3)
           {
            $('#nlp-score').append("Comment: This is a great sentence and you seem very confident. You should keep this in!");
           } else if(data.analysis[i]["score"] <= -0.6 && data.analysis[i]["magnitude"] >= 0.3)
           {
            $('#nlp-score').append("Comment: You seem a bit distracted here and a tad negative, and generally not as confident in this statement. Try refining it to better reflect you");
           } else if(data.analysis[i]["score"] >= 0.1 && data.analysis[i]["magnitude"] >= 0.0)
           {
            $('#nlp-score').append("Comment: This seems to be an okay part of your speech. I can't really tell. Maybe refine it a bit more to have some heart if needed");
           } else if(data.analysis[i]["score"] >= 0.0 && data.analysis[i]["magnitude"] >= 0.4)
           {
            $('#nlp-score').append("Comment: You seem to have mixed emotions about what you're saying here. Is that what you're trying to convey?");
           }

          //$('#nlp-score').append("Score: " + data.analysis[i]["score"]);
          //$('#nlp-mag').append("Magnitude: " + data.analysis[i]["magnitude"]);
        }
      },
      fail: function(error) {
          // Non-200 return, do something with error
          console.log(error); 
      }
    });
  });
});
