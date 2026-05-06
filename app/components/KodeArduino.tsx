'use client';
import { useState } from 'react';
import SectionHeader from './SectionHeader';

const codeShort = `#define BLYNK_TEMPLATE_ID "YOUR ID"
#define BLYNK_TEMPLATE_NAME "LIE DETECTOR"
#define BLYNK_AUTH_TOKEN "YOUR TOKEN"

#include <WiFi.h>
#include <BlynkSimpleEsp32.h>`;

const codeFull = `
char ssid[] = "YOUR SSID";
char pass[] = "YOUR PASSWORD";

const int PulseSensorPin = 34;
int sensorValue = 0, BPM = 0, lastSensorValue = 0;
unsigned long lastBeat = 0, lastSendTime = 0;
BlynkTimer timer;

void sendData() {
  sensorValue = analogRead(PulseSensorPin);
  if(sensorValue>600 && lastSensorValue<=600){
    unsigned long now = millis();
    if(now - lastBeat > 600){ BPM = 60000/(now-lastBeat); lastBeat = now; }
  }
  if(millis()-lastBeat>9000) BPM=0;
  lastSensorValue = sensorValue;
  if(millis()-lastSendTime>=1000){
    Blynk.virtualWrite(V0,sensorValue);
    Blynk.virtualWrite(V1,BPM);
    if(BPM==0) Blynk.virtualWrite(V2,"Menunggu...");
    else if(BPM<90) Blynk.virtualWrite(V2,"Tenang");
    else if(BPM<=120) Blynk.virtualWrite(V2,"Tegang");
    else Blynk.virtualWrite(V2,"Bohong");
    lastSendTime = millis();
  }
}

void setup(){
  Serial.begin(115200);
  Blynk.begin(BLYNK_AUTH_TOKEN,ssid,pass);
  timer.setInterval(50L,sendData);
}

void loop(){ Blynk.run(); timer.run(); }`;

export default function KodeArduino() {
  const [open, setOpen] = useState(false);

  return (
    <section id="code" className="py-12 sm:py-20">
      <SectionHeader title="Kode Arduino" />
      <pre className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 sm:p-6 text-xs sm:text-sm text-green-400 overflow-x-auto">
        <code>{codeShort}{open ? codeFull : '\n...'}</code>
      </pre>
      <button onClick={() => setOpen(o => !o)} className="mt-3 text-cyan-400 hover:text-cyan-300 font-medium transition text-sm">
        {open ? 'Tutup' : 'Baca selengkapnya'}
      </button>
      <a href="https://github.com/Neuron-XIPPLGB/Lie-Detector" target="_blank" rel="noreferrer" className="block mt-6 text-blue-400 hover:underline text-sm">
        Kunjungi Repositori GitHub →
      </a>
    </section>
  );
}
