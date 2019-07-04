const byte CMD_DIGITAL_WRITE = 0x73;
const byte CMD_PIN_MODE = 0x75;
const byte CMD_DIGITAL_READ = 0x79;

const int Trig = 8; 
const int Echo = 9; 

unsigned int time_us = 0;
unsigned int distance_sm = 0;

byte digitalReadVals[12];
byte pinModes[12];

const int humidityPin = A0;
const int thresholdValue = 500;
 
void setup(){

  pinMode(Trig, OUTPUT); 
  pinMode(Echo, INPUT); 
  
  memset(digitalReadVals, 0, sizeof(digitalReadVals));
  memset(pinModes, 0, sizeof(pinModes));

  Serial.begin(9600);
}
 
void loop() {
	  byte i, val;
	  
  digitalWrite(Trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(Trig, LOW);
  time_us = pulseIn(Echo, HIGH);
  distance_sm = time_us/58;
  
  for (i=0; i<=12; i++) {
    if (pinModes[i] == INPUT) {
      val = digitalRead(i+2);
      if (digitalReadVals[i] != val) {
        digitalReadVals[i] = val;
      }
    }
  }
  Serial.write(CMD_DIGITAL_READ);
  Serial.write(digitalReadVals, 12);
  
  delay(500); 


}