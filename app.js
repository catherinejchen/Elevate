const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');

//const fs = require('fs');
//const JavaScriptObfuscator = require('javascript-obfuscator');

app.use(express.static(__dirname+'/public'));
app.use(fileUpload());

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// Send Style, do not change
app.get('/style.css',function(req,res){
    //Feel free to change the contents of style.css to prettify your Web app
    res.sendFile(path.join(__dirname+'/public/style.css'));
  });
  
  // Send obfuscated JS, do not change

  app.get('/ffmpeg_asm.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/ffmpeg_asm.js'));
  });

  app.get('/index.js',function(req,res){
    res.sendFile(path.join(__dirname+'/public/index.js'));
  });

  app.get('/script.js',function(req,res){
    res.sendFile(path.join(__dirname+'/public/script.js'));
  });

  //Respond to POST requests that upload files to uploads/ directory
app.post('/upload', function(req, res) {
  if(!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  let uploadFile = req.files.uploadFile;
 
  // Use the mv() method to place the file somewhere on your server
  uploadFile.mv('uploads/' + uploadFile.name, function(err) {
    if(err) {
      return res.status(500).send(err);
    }

    res.redirect('/');
  });
});

//Respond to GET requests for files in the uploads/ directory
app.get('/uploads/:name', function(req , res){
  fs.stat('uploads/' + req.params.name, function(err, stat) {
    if(err == null) {
      res.sendFile(path.join(__dirname+'/uploads/' + req.params.name));
    } else {
      console.log('Error in file downloading route: '+err);
      res.send('');
    }
  });
});

app.listen(3000);
console.log('Running at localhost 3000');

  app.get('/transcribe', async function(req, res) {
      console.log('i see you clicked the button');
      // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech');
    const fs = require('fs');
  
    // Creates a client
    var client = new speech.SpeechClient();

    /**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
//const gcsUri = 'gs://elevate-bucket/test.wav';
const filename = 'resources/test.wav';
const encoding = 'LINEAR16';
const model = 'video';
const sampleRateHertz = 44100;
const languageCode = 'en-US';

const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  model: model,
  languageCode: languageCode,
  audioChannelCount: 2,
};
const audio = {
  content: fs.readFileSync(filename).toString('base64'),
};

const request = {
  config: config,
  audio: audio,
};

// Detects speech in the audio file
const [response] = await client.recognize(request);
const transcription = response.results
  .map(result => result.alternatives[0].transcript)
  .join('\n');
console.log(`Transcription: `, transcription);

 
        // Imports the Google Cloud client library
        const language = require('@google-cloud/language');
      
        // Instantiates a client
        client = new language.LanguageServiceClient();
      
        // The text to analyze
        const text = transcription;
      
        const document = {
          content: text,
          type: 'PLAIN_TEXT',
        };

        var r =[];
        var i = 0;
      
        // Detects the sentiment of the text
        const [result] = await client.analyzeSentiment({document: document});
        const sentiment = result.documentSentiment;
      
        //console.log(`Text: ${text}`);
        //console.log(`Sentiment: ${sentiment.sentence}`);
        //console.log(`Sentiment score: ${sentiment.score}`);
        //console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

        const sentences = result.sentences;
        sentences.forEach(sentence => {
        //console.log(`Sentence: ${sentence.text.content}`);
        //console.log(`  Score: ${sentence.sentiment.score}`);
        //console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
        r[i] = {"text": sentence.text.content, "score": sentence.sentiment.score, "magnitude": sentence.sentiment.magnitude};
        console.log(r[i]);
        i++;
        });
      
        res.send({"transcription": transcription, "analysis": r});
});