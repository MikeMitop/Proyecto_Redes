int pinLluvia = 35;

void setup() {
  Serial.begin(115200);
}

void loop() {
  int valor = analogRead(pinLluvia);

  Serial.print("lluvia:");
  Serial.println(valor);

  delay(2000);
}
