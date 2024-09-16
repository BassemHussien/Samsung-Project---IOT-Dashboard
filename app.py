from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

led_states = {
    'led1': False,
    'led2': False
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/sensor_data')
def get_sensor_data():
    # Replace these with actual sensor readings
    temperature = random.uniform(20.0, 30.0)  # Mocked temperature value
    humidity = random.uniform(30.0, 70.0)     # Mocked humidity value
    return jsonify({
        'temperature': round(temperature, 2),
        'humidity': round(humidity, 2)
    })

@app.route('/toggle/<led>')
def toggle_led(led):
    if led in led_states:
        led_states[led] = not led_states[led]
        state = "on" if led_states[led] else "off"
        return jsonify({'message': f'{led} is now {state}'})
    return jsonify({'message': 'Invalid LED'}), 400

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
