#include <DHT.h>

#define DHTPIN 4       // Pin donde está el DHT22
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  if (!isnan(temp)) {
    Serial.print("temperatura:");
    Serial.println(temp);
  }

  if (!isnan(hum)) {
    Serial.print("humedad:");
    Serial.println(hum);
  }

  delay(2000); // lee cada 2 segundos
}
