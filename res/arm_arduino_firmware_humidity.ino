const byte CMD_ANALOG_WRITE = 0x74;
const byte CMD_PIN_MODE = 0x75;
const byte CMD_ANALOG_READ = 0x78;


byte analogReadVals[6];
byte digitalReadVals[12];
byte pinModes[12];

const int humidityPin = A0;
const int thresholdValue = 500;
 
void setup(){

  pinMode(rainPin, INPUT);

  memset(analogReadVals, 0, sizeof(analogReadVals));
  memset(pinModes, 0, sizeof(pinModes));

  Serial.begin(9600);
}
 
void loop() {
  byte i, val;
  
  int sensorValue = analogRead(humidityPin);

  for (i=0; i<=5; i++) {
    analogReadVals[i] = map(analogRead(i), 0, 1023, 0, 255);
  }

  Serial.write(CMD_ANALOG_READ);
  Serial.write(analogReadVals, 6);
  
  delay(1000);

}
