import paho.mqtt.client as mqtt
import serial
import time
import ssl

# MQTT configuration
sound_broker_url = 'f316252439c74c82bfcdba8f810b782d.s1.eu.hivemq.cloud'
gas_broker_url = 'f316252439c74c82bfcdba8f810b782d.s1.eu.hivemq.cloud'
broker_port = 8883  # Standard MQTT over TLS port

sound_topic = 'sound_pollution/db'  # Topic to publish sound sensor dB values
message_topic = 'sound_message'       # Topic to publish warning message
gas_topic = 'gas_sensor/readings'     # Topic to publish gas sensor values

client_username = 'DarrSh' 
client_password = 'Ma11637341' 

# Initialize UART serial connection to Arduino for both sensors (Adjust port if necessary)
ser = serial.Serial('/dev/serial0', 9600, timeout=1)
time.sleep(2)  # Wait for connection to establish
# Create two MQTT client instances for each sensor
sound_client = mqtt.Client(client_id="Sound_Sensor")
gas_client = mqtt.Client(client_id="Gas_Sensor")
# Sound sensor MQTT setup (connect to broker and set credentials)
sound_client.username_pw_set(client_username, client_password)
sound_client.tls_set(ca_certs=None, certfile=None, keyfile=None, cert_reqs=ssl.CERT_NONE, tls_version=ssl.PROTOCOL_TLSv1_2)
sound_client.connect(sound_broker_url, broker_port)
print("Connected to Sound Broker!")

# Gas sensor MQTT setup (connect to broker and set credentials)
gas_client.username_pw_set(client_username, client_password)
gas_client.tls_set(ca_certs=None, certfile=None, keyfile=None, cert_reqs=ssl.CERT_NONE, tls_version=ssl.PROTOCOL_TLSv1_2)  # Use default certification authorities
gas_client.connect(gas_broker_url, broker_port)
print("Connected to Gas Broker!")

# Start both MQTT loops
try:
    while True:
        # Check if data is available to read from Arduino
        if ser.is_open:
            # Read the raw data from Arduino
            raw_data = ser.readline().decode('utf-8').rstrip()
            # Debugging: print raw data from Arduino to verify
            print(f"Raw data received from Arduino: {raw_data}")
            
            # Parse the incoming data (assuming it's in the format "sound,gassensor")
            if ',' in raw_data:
                try:
                    sound_sensor_value, gas_sensor_value = raw_data.split(',')
                    
                    # Print parsed sensor values for debugging
                    print(f"Sound Sensor: {sound_sensor_value}, Gas Sensor: {gas_sensor_value}")

                    # Publish sound sensor value to MQTT topic
                    sound_client.publish(sound_topic, sound_sensor_value)
                    
                    # Publish gas sensor value to MQTT topic
                    gas_client.publish(gas_topic, gas_sensor_value)

                    # Check sound sensor value to determine if a warning should be published
                    if int(sound_sensor_value) > 25:  # Adjust threshold as necessary
                        sound_client.publish(message_topic, "Warning! This road is very crowded.")

                except ValueError:
                    print("Error: Unable to split data, invalid format.")
            else:
                print("Error: Data received in unexpected format.")
            
        # Wait for a short time before reading again
        time.sleep(2)

except KeyboardInterrupt:
    print("Program interrupted")

finally:
    ser.close()
    sound_client.disconnect()
    gas_client.disconnect()