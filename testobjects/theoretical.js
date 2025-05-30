<!DOCTYPE html>
<html>
<body onload="mediaShow()">
    <video id="output" autoplay muted></video>
</body>
<script src="https://apis.google.com/js/api.js"></script>

<script>
function start(){
    gapi.client.init({
        'apiKey' : 'AIzaSyAFmRSsy6cso0Qo9HeLFFOwKlnEcAxZlUk',
        'discoveryDocs' : ['https://people.googleapis.com/$discovery/rest']
    }).then(() => {
        return gapi.client.people.people.get({
            'resourceName':'people/me',
            'requestMask.includeField':'person.names'
        });
    }).then((response) => {
        console.log(response.result);
    }), (reason) => {
        console.log('Error: ' + reason.result.error.message);
    };
};

gapi.load('client', start);


</script>

<script>
    let output = document.getElementById("output");

function recordStop(){
    return new Promise((resolve) => setTimeout(resolve, 1500));
}

function recordStart(stream){
    let recorder = new MediaRecorder(stream);
    let data = [];

    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.start();

    let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = (event) => reject(event.name);
    })

    let recorded = recordStop().then(() => {
        if (recorder.state === "recording") {
            recorder.stop();
        }
    })

    return Promise.all([stopped, recorded]).then(() => data);
}

function mediaShow(){
    navigator.mediaDevices
        .getUserMedia({
            audio: false,
            video: {facingMode: 'environment'},
        })
        .then((stream) => {
            output.srcObject = stream;
            output.captureStream = output.captureStream || output.mozCaptureStream;
            return new Promise((resolve) => (output.onplaying = resolve));
        })
        .then(() => recordStart(output.captureStream()))
        .then((recordedChunks) => {
            let recordedBlob = new Blob(recordedChunks, {type: "video/webm"});
            //google drive api upload goes here
        })
        .catch((error) => {
            if (error.name === "NotFoundError") {
              document.write("Camera or microphone not found. Can't record.");
            } else {
              document.write(error);
            }
          });
}

//-----------------------------------------------------


</script>
</html>
