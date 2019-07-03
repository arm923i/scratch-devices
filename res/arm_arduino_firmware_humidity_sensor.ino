const byte CMD_PIN_MODE = 0x75;
const byte CMD_ANALOG_READ = 0x78;


byte analogReadVals[6];
byte pinModes[12];

const int humidityPin = A0;
const int thresholdValue = 500;
 
void setup(){
  pinMode(rainPin, INPUT);
  Serial.begin(9600);
}
 
void loop() {
  int sensorValue = analogRead(humidityPin);
  Serial.print(sensorValue);
  delay(1000);
}
