/**************    Varaibles Declarations   ***************/
const tempGauge = document.getElementById('temp');
const tempVal = document.getElementById('temp-val');
let dialog = document.querySelector("#dialog");
let form = document.getElementById("mqtt-form");
let mqttURLInput = document.getElementById("mqtt-txt");
let mqttUsernameInput = document.getElementById("mqtt-usr");
let mqttPasswordInput = document.getElementById("mqtt-pass");
let changeBtn = document.querySelector("#change-btn");
let submitBtn = document.querySelector("#submit");
let cancelBtn = document.querySelector("#cancel");
let toggleModeBtn = document.querySelector(".checkbox");
let plantMoisture = document.querySelector(".device3");
plantMoisture.classList.add("soil-lvl");
let moisture_val = document.querySelector("#Moisture-detect");
let temperature_val = document.querySelector("#temperature-val");
let humidity_val = document.querySelector("#humidity-val");
let motionNoDetect = document.querySelector("#Motion-nodetect-str");
let motionDetect = document.querySelector("#Motion-detect-str");
let soil_val = 0;
let val_of10 = 0;
let val_rounded = 0;
let soundNotfiyFlag = 0;
let client;
// Notifications
let notify = document.querySelector(".notification");
let nav = document.querySelector(".navBar");
let msg = "No messages found"; //Default msg
let msgp = document.getElementById("msgP");
// Check localStorage for saved data
let storedURL = localStorage.getItem("MQTT URL");
let storedUsername = localStorage.getItem("Username");
let storedPassword = localStorage.getItem("Password");
/****************   Set up the gauge    ******************/
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
/**********************************************************/

// Event listener for the Change button
changeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.showModal();
    document.body.style.opacity = 0.3;
    cancelBtn.style.display = "block";
    // Pre-fill the inputs with the stored values
    mqttURLInput.value = storedURL || '';
    mqttUsernameInput.value = storedUsername || '';
    mqttPasswordInput.value = storedPassword || '';
    
    // Change the submit button text to "Change"
});
let url = 'wss://';

// Event listener for form submission
form.onsubmit = (e) => {
    e.preventDefault(); // Prevent the form from submitting traditionally

    document.body.style.opacity = 1;

    // Get the values from the form
    let mqttURL = mqttURLInput.value;
    let mqttUsername = mqttUsernameInput.value;
    let mqttPassword = mqttPasswordInput.value;

    // Store the values in localStorage
    localStorage.setItem("MQTT URL", mqttURL);
    localStorage.setItem("Username", mqttUsername);
    localStorage.setItem("Password", mqttPassword);
  
    // Close the dialog after submission
    if (mqttURL.includes("s1.eu.hivemq.cloud")) {
      storedURL = localStorage.getItem("MQTT URL");
      storedUsername = localStorage.getItem("Username");
      storedPassword = localStorage.getItem("Password");
      if (storedURL) {
        url += storedURL;
      }
        console.log(storedURL);
        console.log(url);
        console.log(client);
        client = mqtt.connect(url, {
            username: mqttUsername, // Use the newly submitted username
            password: mqttPassword, // Use the newly submitted password
        });
        console.log(client);

    } else {
        client = mqtt.connect("wss://...", {
            username: '', // Default username
            password: '', // Default password
        });
    }
    dialog.close();
  location.reload();
};
/*********************************/
// Event listener for the Cancel button
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.close();
    document.body.style.opacity = 1;
});
/**********************************/
if (storedURL) {
  url += storedURL;
  client = mqtt.connect(url, {
    username: storedUsername, // Use the newly submitted username
    password: storedPassword, // Use the newly submitted password
  });
}
else{
  client = mqtt.connect("wss://f316252439c74c82bfcdba8f810b782d.s1.eu.hivemq.cloud:8884/mqtt", {
      username: 'DarrSh', // Default username
      password: 'Ma11637341', // Default password
  });
}

let sound = 0; // Initialize sound with a default value (so the gauge doesn't start with null)

// MQTT event handlers
if (client) {
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
      if (topic === 'sound_pollution/db') {
          sound = parseFloat(message.toString()); // Update the sound variable
          if (!isNaN(sound)) {
              console.log('Valid sound value received:', sound);
          } else {
              console.error('Invalid sound value received:', message.toString());
          }
      }
  });

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
  if (topic === 'sound_message') {
    msg = message.toString(); // Update the sound variable
    if (msg) {
      console.log('Valid MSG from sound LVL received: ', msg);
    } else {
      console.error('Invalid MSG received: ', message.toString());
    }
  }
});
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('temperature', (err) => {
    if (!err) {
      console.log('Subscribed to temperature topic');
    } else {
      console.error('Failed to subscribe:', err);
    }
  });
});

client.on('message', (topic, message) => {
  
  if (topic === 'temperature') {
    let numbers = message.toString().match(/\d+(\.\d+)?/g).map(Number);
    temperature_val.textContent = numbers[0]; // Update the temp value
    humidity_val.textContent = numbers[1];
  }
});
// MQTT connection and subscription
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('soil', (err) => {
    if (!err) {
      console.log('Subscribed to soil topic');
    } else {
      console.error('Failed to subscribe:', err);
    }
  });
});

// Receive and process MQTT message
client.on('message', (topic, message) => {
  if (topic === 'soil') {
    // soil_val = parseFloat(message.toString()); // Update soil_val from sensor data
    // if (soil_val >= 0 && soil_val <= 100) {
    //   val_of10 = soil_val / 10;
    //   val_rounded = Math.round(val_of10);
    //   plantMoisture.setAttribute('data-moisture', val_rounded*10);  // Set attribute to the actual soil value
    // }
    // console.log('Soil moisture value:', val_rounded*10);
    /*******************/
    soil_val = message.toString();
    if(soil_val.includes("wet")||soil_val.includes("WET")||soil_val.includes("Wet")){
      plantMoisture.setAttribute('data-moisture', 100);
      moisture_val.innerHTML = "Soil is WET!!";
      moisture_val.style.color = "red";
    }
    else if(soil_val.includes("dry")||soil_val.includes("DRY")||soil_val.includes("Dry")){
      plantMoisture.setAttribute('data-moisture', 0);
      moisture_val.innerHTML = "Soil is Dry!!";
      moisture_val.style.color = "red";
    }
    else{
      plantMoisture.setAttribute('data-moisture', 50);
      moisture_val.innerHTML = "Soil is Normal";
      moisture_val.style.color = "green";
    }
    console.log('Soil moisture value:', soil_val);
  }
});
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('led', (err) => {
    if (!err) {
      console.log('Subscribed to led topic');
    } else {
      console.error('Failed to subscribe:', err);
    }
  });
});

client.on('message', (topic, message) => {
  if (topic === 'led') {
    if(message.toString().includes("ON")||message.toString().includes("on")||message.toString().includes("On")){
      motionDetect.style.display = "block";
      motionNoDetect.style.display = "none";
    }
    else if(message.toString().includes("OFF")||message.toString().includes("off")||message.toString().includes("Off")){
      motionDetect.style.display = "none";
      motionNoDetect.style.display = "block";
    }
  }
});
client.on('message', (topic, message) => {
  console.log('Received message on topic:', topic, 'with payload:', message.toString());
});
}
/************************** Notifications *******************************/
setInterval(() => {
  gauge.set(sound); // Set the gauge value to 0
  tempVal.textContent = Math.floor(sound).toFixed(2);
  
  if (sound >= 25 && !nav.classList.contains("show-notify") && soundNotfiyFlag==0) {
    nav.classList.add("show-notify");
    soundNotfiyFlag = 1;
  }
  else if (sound < 25 && !nav.classList.contains("show-notify")){
    soundNotfiyFlag = 0;
  }
}, 1000);
notify.addEventListener("click", () => {
  if (msg) {
    nav.classList.toggle("show-msg");
    nav.classList.remove("show-notify");
    msgp.innerText = msg;
    soundNotfiyFlag = 1;
  }
});
/* Dark Mode */
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
  toggleModeBtn.checked = true; 
}
toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});
/***************************************************************************/
