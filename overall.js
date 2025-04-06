let output = document.getElementById("output");
let clientOut = document.getElementById("clientOut");

function recordStart(stream){
    let recorder = new MediaRecorder(stream);
    let data = [];

    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.start();
    setTimeout(() => {
        recorder.stop();
    }, 5000);
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
            localStorage.setItem("vidOut", URL.createObjectURL(recordedBlob));
            console.log("blobout");
        })
        .catch((error) => {
            if (error.name === "NotFoundError") {
              console.log("Camera or microphone not found. Can't record.");
            } else {
              console.log(error);
            }
          });
}

function startFeed(){
    console.log("starting")
    clientOut.src = localStorage.getItem("vidOut");
}