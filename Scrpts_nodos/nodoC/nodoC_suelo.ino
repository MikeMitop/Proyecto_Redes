int pinSuelo = 34;

void setup() {
  Serial.begin(115200);
}

void loop() {
  int valor = analogRead(pinSuelo);  // valor ADC entre 0 y ~4095

  Serial.print("suelo:");
  Serial.println(valor);

  delay(2000);
}
