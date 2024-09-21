const tempGauge = document.getElementById('temp');
const tempVal = document.getElementById('temp-val');
// Initialize the MQTT client and connect to the HiveMQ Cloud broker using WebSocket (wss://)
const client = mqtt.connect('wss://3bb3497d4e2c468d881b469d323d65ee.s1.eu.hivemq.cloud:8884/mqtt', {
  username: 'mostafa', // Replace with your HiveMQ Cloud username
  password: '12345678Aa', // Replace with your HiveMQ Cloud password
});

let sound = 0; // Initialize sound with a default value (so the gauge doesn't start with null)

// MQTT event handlers
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('sound_pollution/db', (err) => {
    if (!err) {
      console.log('Subscribed to sound_pollution/db topic');
    } else {
      console.error('Failed to subscribe:', err);
    }
  });
});

// Receive messages from the MQTT broker and update the sound value
client.on('message', (topic, message) => {
  console.log('Received message on topic:', topic, 'with payload:', message.toString());

  if (topic === 'sound_pollution/db') {
    sound = parseFloat(message.toString()); // Update the sound variable
    if (!isNaN(sound)) {
      console.log('Valid sound value received:', sound);
    } else {
      console.error('Invalid sound value received:', message.toString());
    }
  }
});

// Set an interval to update the gauge every 1 second with the latest sound value
// setInterval(() => {
    // ++sound;
    // console.log(sound);
// }, 1500); // 1 second interval

// Set up the gauge (using the code you provided)
var opts = {
    angle: 0.35, // The span of the gauge arc
    lineWidth: 0.1, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
      length: 0.6, // Relative to gauge radius
      strokeWidth: 0.035, // The thickness
      color: '#62eAff' // Fill color (Yellow)
    },
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    colorStart: '#6F6EA0',   // Colors
    colorStop: '#a354bb',    // Experiment with colors
    strokeColor: '#FFFF50',  // Stroke color
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
};

var gauge = new Donut(tempGauge).setOptions(opts);
gauge.maxValue = 50; // Set max gauge value
gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 32; // Set animation speed (32 is default value)

/* Notifications */
let notify = document.querySelector(".notification");
let nav = document.querySelector(".navBar");
let msg = "No messages found"; //Default msg
let msgp = document.getElementById("msgP");

// MQTT event handlers
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('sound_message', (err) => {
    if (!err) {
      console.log('Subscribed to sound_message topic');
    } else {
      console.error('Failed to subscribe:', err);
    }
  });
});

// Receive messages from the MQTT broker and update the sound value
client.on('message', (topic, message) => {
  console.log('Received message on topic:', topic, 'with payload:', message.toString());

  if (topic === 'sound_message') {
    msg = message.toString(); // Update the sound variable
    if (msg) {
      console.log('Valid MSG from sound LVL received: ', msg);
    } else {
      console.error('Invalid MSG received: ', message.toString());
    }
  }
});
/* Water Level */
import { FluidMeter } from "/Fluids.js";
var fm3 = new FluidMeter();
fm3.init({
  targetContainer: document.getElementById("fluid-meter-3"),
  fillPercentage: 45,
  options: {
    fontSize: "30px",
    drawPercentageSign: true,
    drawBubbles: true,
    size: 200,
    borderWidth: 5,
    backgroundColor: "#195F99",
    foregroundColor: "#192F99",
    foregroundFluidLayer: {
      fillStyle: "#16E1FF",
      angularSpeed: 30,
      maxAmplitude: 5,
      frequency: 30,
      horizontalSpeed: -20
    },
    backgroundFluidLayer: {
      fillStyle: "#4F8FC6",
      angularSpeed: 100,
      maxAmplitude: 3,
      frequency: 22,
      horizontalSpeed: 20
    }
  }
});
//Action do here
fm3.setPercentage(55); 

setInterval(() => {
  gauge.set(sound); // Set the gauge value to 0
  tempVal.textContent = Math.floor(sound).toFixed(2);
  if (sound >= 25) {
    nav.classList.add("show-notify");
  }
  else{
    
  }
}, 1000);
notify.addEventListener("click", () => {
  if (msg) {
    nav.classList.toggle("show-msg");
    nav.classList.remove("show-notify");
    msgp.innerText = msg;
  }
});
/* Dark Mode */
let toggleModeBtn = document.querySelector(".checkbox");

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
  toggleModeBtn.checked = true; 
}

toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});
/*****************/
