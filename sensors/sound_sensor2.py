import serial
import time
import ssl
import random
import paho.mqtt.client as mqtt

# MQTT configuration
broker_URL ='3bb3497d4e2c468d881b469d323d65ee.s1.eu.hivemq.cloud'  # Only the hostname
broker_port = 8883  # Port number for MQTT
MQTT_TOPIC = 'sound_pollution/db'  # Topic to publish dB values

# Initialize UART serial connection to Arduino (Adjust the port if necessary)
ser = serial.Serial('/dev/serial0', 9600, timeout=1)
time.sleep(2)  # Wait for connection to establish

# Create an MQTT client instance
client = mqtt.Client(client_id="DHT Sensor")

# Connect to the broker
client.username_pw_set("mostafa","12345678Aa") # User Credentials for Broker 
client.tls_set(ca_certs=None, certfile=None, keyfile=None, cert_reqs=ssl.CERT_NONE, tls_version=ssl.PROTOCOL_TLSv1_2)
client.connect(broker_URL, broker_port)    
print("Connected on Broker !")


def calculate_db(sensor_value):
    # Convert the sensor value to voltage (0-1023 maps to 0-5V)
    voltage = sensor_value * (5.0 / 1023.0)
    # Placeholder conversion formula for dB (adjust based on your sensor)
    db_value = 20 * (voltage / 3.3)  # Example conversion, adjust if necessary
    return db_value

while True:
    # Generate a random sensor value (simulate noise sensor data)
    sensor_value = random.randint(0, 1023)  # Simulate sensor reading range 0-1023
    
    # Calculate the dB value from the sensor value
    db_value = calculate_db(sensor_value)
    
    # Publish the dB value to MQTT broker
    client.publish(MQTT_TOPIC, db_value)
    print(f"Published: {db_value:.2f} dB to topic: {MQTT_TOPIC}")
    
    # Wait for a while before the next reading
    time.sleep(2)  # 2-second delay between readings



# Stop the MQTT client loop and disconnect
client.loop_stop()
client.disconnect()
ser.close()