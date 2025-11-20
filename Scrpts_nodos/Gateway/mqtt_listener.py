#!/usr/bin/env python3
import paho.mqtt.client as mqtt
import requests
import time
import json

### ===== CONFIGURAR ===== ###
BACKEND_URL = "https://TU_BACKEND.onrender.com/api/recibir"
MQTT_BROKER = "10.0.0.10"      # IP del gateway
TOPIC = "sensores/#"
### ======================= ###

def enviar_backend(data):
    try:
        r = requests.post(BACKEND_URL, json=data, timeout=3)
        print("[-> Backend] Respuesta:", r.status_code)
    except Exception as e:
        print("[X] Error enviando al backend:", e)

def on_message(client, userdata, msg):
    payload = msg.payload.decode().strip()
    topic = msg.topic

    # topic = sensores/A
    nodo = topic.split("/")[-1]

    # payload = clave:valor
    try:
        clave, valor = payload.split(":")
    except:
        print("[X] Formato inválido:", payload)
        return

    data = {
        "nodo": nodo,
        "clave": clave,
        "valor": valor,
        "timestamp": int(time.time())
    }

    print(f"[{nodo}] {clave}:{valor}")

    enviar_backend(data)

def main():
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(MQTT_BROKER)
    client.subscribe(TOPIC)
    
    print("[OK] Escuchando MQTT en", MQTT_BROKER)
    client.loop_forever()

if __name__ == "__main__":
    main()
