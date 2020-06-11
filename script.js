var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function load() {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.canvas.style.border = '1px solid #000';

    canvas.addEventListener('click', onCanvasClick, false);
}

function onCanvasClick() {

    playSound();
}

function loop() {
    window.requestAnimationFrame(loop);

    var imagedata = ctx.createImageData(canvas.width, canvas.height);
   // ctx.putImageData(imagedata, 0, 0);


    var highestFreq = 0;

    for(var i in waves) {
        if(waves[i] > highestFreq) highestFreq = waves[i];
    }

    var scaleFactor = Math.ceil(((-0.00083333333)*highestFreq) + 5);

    for (var x = 0; x < canvas.width; x++) {

        for (var y = 0; y < canvas.height; y++) {
            var pixelindex = (y * canvas.width + x) * 4;
            imagedata.data[pixelindex] = 255;
            imagedata.data[pixelindex + 1] = 255;
            imagedata.data[pixelindex + 2] = 255;
            imagedata.data[pixelindex + 3] = 255;
        }

        var yy = 100 + Math.ceil(arr[x * scaleFactor] * 30);
        var pixelindex = (yy * canvas.width + x) * 4;
        imagedata.data[pixelindex] = 0;
        imagedata.data[pixelindex + 1] = 0;
        imagedata.data[pixelindex + 2] = 0;
        imagedata.data[pixelindex + 3] = 255;
    }

    ctx.putImageData(imagedata, 0, 0);
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();

var arr = [];

var waves = [];

function addWave(frequency) {
    waves.push(frequency);
}

function deleteWave(index) {
    waves.splice(index, 1);

    updateWaves();
}

function newWave() {
    addWave($("#frequency").val());

    updateWaves();
}

function updateWaves() {
    clear = true;
    $("#waveBody").html(""); // clear wave body

    for (var i in waves) {
        var wrap = $('<div class="alert alert-info clearfix">');
        $('<a class="alert-link">Freq: ' + waves[i] + ' Hz </a>').appendTo(wrap);
        $('<button type="button" class="btn btn-primary btn-sm float-right" onclick=deleteWave(' + i + ')>Delete</button>').appendTo(wrap);

        wrap.appendTo($("#waveBody"));
    }

    //   <div class="alert alert-info clearfix">
    // <a class="alert-link">Test</a>
    //<button type="button" class="btn btn-primary btn-sm pull-right">Delete</button>
    // </div>
}

function playSound() {

    var volume = 0.2;
    var seconds = 0.5;

    // 24000
    for (var i = 0; i < context.sampleRate * seconds; i++) {
        var val1 = 0;
        var val2 = 0;
        arr[i] = 0;
        for(var j in waves) {
           
            arr[i] += sineWaveAt(i, waves[j]);
        }
        arr[i] *= volume;
    }

    var buf = new Float32Array(arr.length)
    for (var i = 0; i < arr.length; i++) buf[i] = arr[i]
    var buffer = context.createBuffer(1, buf.length, context.sampleRate)
    buffer.copyToChannel(buf, 0)
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
}

function sineWaveAt(sampleNumber, tone) {
    var sampleFreq = context.sampleRate / tone;
    //sample rate is 48000
    //48000 / freq 

    //return (sampleFreq - Math.abs(sampleNumber % (2 * sampleFreq) - sampleFreq)) / (Math.PI * 2);
    return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2))); // so the wavelength will be the frequency
}

window.onload = load;
window.requestAnimationFrame(loop);
