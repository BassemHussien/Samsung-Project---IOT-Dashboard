const tempGauge = document.getElementById('temp');
const tempVal = document.getElementById('temp-val');
// Initialize the MQTT client and connect to the HiveMQ Cloud broker using WebSocket (wss://)
const client = mqtt.connect('wss://3bb3497d4e2c468d881b469d323d65ee.s1.eu.hivemq.cloud:8884/mqtt', {
  username: 'mostafa', // Replace with your HiveMQ Cloud username
  password: '12345678Aa', // Replace with your HiveMQ Cloud password
});

// Function to update the gauge
function updateGauge(value) {
  gauge.set(value); // Update gauge with new temperature value
  tempVal.textContent = value;
}

let sound; // Initialize sound with a default value (so the gauge doesn't start with null)

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
setInterval(() => {
    console.log(sound);
}, 5000); // 1 second interval

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
    colorStop: '#62e5ff',    // Experiment with colors
    strokeColor: '#FFFF50',  // Stroke color
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
};


var gauge = new Donut(tempGauge).setOptions(opts);
gauge.maxValue = 50; // Set max gauge value
gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 32; // Set animation speed (32 is default value)
setInterval(() => {
    gauge.set(sound); // Set the gauge value to 0
    tempVal.textContent = Math.floor(sound).toFixed(2);
}, 1000);
