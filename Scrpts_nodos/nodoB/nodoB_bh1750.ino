#include <Wire.h>
#include <BH1750.h>

BH1750 lightMeter;

void setup() {
  Serial.begin(115200);
  Wire.begin();
  lightMeter.begin();
}

void loop() {
  float lux = lightMeter.readLightLevel();

  Serial.print("luz:");
  Serial.println(lux);

  delay(2000);
}
