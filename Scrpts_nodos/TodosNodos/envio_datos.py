#!/usr/bin/env python3
import paho.mqtt.client as mqtt
import serial
import time

### ===== CONFIGURAR ESTAS VARIABLES ===== ###
NODE_ID = "A"                 # Cambiar según nodo: A / B / C / D
BROKER = "10.0.0.10"          # IP del GATEWAY en la malla (bat0)
SERIAL_PORT = "/dev/ttyUSB0"  # Puerto del ESP32
BAUD_RATE = 115200            # Velocidad serial
TOPIC = f"sensores/{NODE_ID}" # Tópico MQTT
### ====================================== ###

print(f"[Nodo {NODE_ID}] Inicializando...")

# Conectar al puerto serial (ESP32)
while True:
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print("[OK] ESP32 detectado")
        break
    except:
        print("Esperando ESP32 en", SERIAL_PORT)
        time.sleep(2)

# Conectar a MQTT
mqtt_client = mqtt.Client()
mqtt_client.connect(BROKER)
mqtt_client.loop_start()
print("[OK] Conectado a MQTT Broker:", BROKER)

print(f"[Nodo {NODE_ID}] Enviando datos...")

while True:
    try:
        line = ser.readline().decode().strip()

        if line:
            print(f"[{NODE_ID}] → {line}")
            mqtt_client.publish(TOPIC, line)

    except Exception as e:
        print("Error:", e)
        time.sleep(1)
