img = "";
status = "";
objects = [];
function preload() {
    alarm = loadSound(".alarm.mp3");
    lullaby = loadSound("lullaby_tone.mp3")
}
function setup() {
    canvas = createCanvas(380, 380);
    canvas.center();
    video = createCapture(VIDEO);
    video.hide();
    object_detector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detecting Object";
}
function draw() {
    image(video, 0, 0, 380, 380);
    if (status != "") {
        object_detector.detect(video,  gotResult);
        r = random(255);
        g = random(255);
        b = random(255);
        for (i = 0; i < objects.length; i++) {
            document.getElementById("status").innerHTML = "Status: Object Detected";
            document.getElementById("number_of_objects").innerHTML = "Number Of Objects Detected:" + objects.length;
            fill(r, g, b);
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "% ", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke(r, g, b);
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            if (objects[i].label != "person") {
                document.getElementById("status").innerHTML = "Baby Not Found";
                lullaby.stop();
                alarm.play();
            }
            else {
                document.getElementById("status").innerHTML = "Baby Found";
                alarm.stop();
                lullaby.play();
            }
        }
        if (objects.length == 0) {
            document.getElementById("status").innerHTML = "Baby Not Found";
            lullaby.stop();
            alarm.play();
        }
    }
}
function modelLoaded() {
    console.log("Model Loaded Successfully");
    status = true;
    object_detector.detect(video, gotResult);
}
function gotResult(error, results) {
    if (error) {
        console.error(error);
    }
    else {
        console.log(results);
        objects = results;
    }
}
function speak1(){
    speechAPI = window.speechSynthesis;
    textData = "Baby Not Found";
    utterThis = new SpeechSynthesisUtterance(textData);
    speechAPI.speak(utterThis);
}
function speak2(){
    speechAPI = window.speechSynthesis;
    textData = "Baby Found";
    utterThis = new SpeechSynthesisUtterance(textData);
    speechAPI.speak(utterThis);
}