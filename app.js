const video = document.getElementById('video');

// Get access to the camera
navigator.mediaDevices.getUserMedia({
    video: true
}).then(stream => {
    video.srcObject = stream;
}).catch(err => {
    console.error("Error accessing webcam: ", err);
});

let model;

async function loadModel() {
    model = await tf.loadGraphModel('path/to/yolov7/model.json'); 
}

loadModel();

async function detectObjects() {
    const imgTensor = tf.browser.fromPixels(video);
    const resizedImg = tf.image.resizeBilinear(imgTensor, [640, 640]);
    const normalizedImg = resizedImg.div(255.0).expandDims(0);

    const predictions = await model.predict(normalizedImg).array();
    
    drawPredictions(predictions);
    requestAnimationFrame(detectObjects);
}

function drawPredictions(predictions) {
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

  
    predictions.forEach(prediction => {
        const [x, y, width, height, score, classId] = prediction;
        if (score > 0.5) { 
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = 'red';
            ctx.fillText(`Class: ${classId}, Score: ${score}`, x, y > 10 ? y - 5 : 10);
        }
    });
}


video.addEventListener('loadeddata', (event) => {
    detectObjects();
});
