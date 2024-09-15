function toggleLED(led) {
    fetch(`/toggle/${led}`)
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        });
}

function updateTemperature() {
    fetch('/temperature')
        .then(response => response.json())
        .then(data => {
            document.getElementById('temp-value').innerText = data.temperature;
        });
}

// Periodically fetch temperature data every 5 seconds
setInterval(updateTemperature, 5000);

// Gauge options (for both temperature and humidity)
var opts = {
    angle: 0.0, // The span of the gauge arc
    lineWidth: 0.3, // The line thickness
    radiusScale: 1.0, // Relative radius
    pointer: {
        length: 0.6, // Relative to gauge radius
        strokeWidth: 0.035, // Thickness
        color: '#000000' // Pointer color
    },
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
};

// Create temperature gauge
var tempTarget = document.getElementById('temperature-gauge'); 
var temperatureGauge = new Gauge(tempTarget).setOptions(opts);
temperatureGauge.maxValue = 50; // Max temperature in Celsius
temperatureGauge.setMinValue(0);  // Min temperature
temperatureGauge.animationSpeed = 32; // Animation speed

// Create humidity gauge
var humidityTarget = document.getElementById('humidity-gauge'); 
var humidityGauge = new Gauge(humidityTarget).setOptions(opts);
humidityGauge.maxValue = 100; // Max humidity in percentage
humidityGauge.setMinValue(0);  // Min humidity
humidityGauge.animationSpeed = 32; // Animation speed

// Function to update gauges with real data
function updateGauges() {
    fetch('/sensor_data')
        .then(response => response.json())
        .then(data => {
            // Update the temperature gauge
            temperatureGauge.set(data.temperature);
            
            // Update the humidity gauge
            humidityGauge.set(data.humidity);
        });
}

// Periodically fetch sensor data every 5 seconds
setInterval(updateGauges, 5000);
