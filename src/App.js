import React, { useState, useEffect } from 'react';
import { 
  IonApp,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonText,
  IonRange,
  IonLabel,
  IonGrid,
  IonCol,
  IonButton,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import * as JZZ from 'jzz'; 

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

function App() {
  const parameters = {
    "Breath Gain": {min: 0x00, max: 0x7F, default: 0x40, value: 0x40, transform: (q) => q.toString()},
    "Bite Gain": {min: 0x00, max: 0x7F, default: 0x40, value: 0x40, transform: (q) => q.toString()},
    "Bite AC Gain": {min: 0x00, max: 0x7F, default: 0x40, value: 0x40, transform: (q) => q.toString()},
    "Pitch Bend Gain": {min: 0x00, max: 0x7F, default: 0x40, value: 0x40, transform: (q) => q.toString()},
    "Key Delay": {min: 0x00, max: 0x7F, default: 0x08, value: 0x08, transform: (q) => q.toString()},

    "MIDI Channel": {min: 0x01, max: 0x10, default: 0x01, value: 0x01, transform: (q) => q.toString()},
    "Fingering": {min: 0x00, max: 0x05, default: 0x00, value: 0x00, transform: (q) => {
      switch (q) {
        case 0:
          return 'EWI';
        case 1:
          return 'Saxophone';
        case 2:
          return 'Flute';
        case 3:
          return 'Oboe';
        case 4:
          return 'EVI Valve 1';
        case 5:
          return 'EVI Valve 2';
        default:
          return 'Invalid';

      }
    }},
    "Transpose": {min: 0x22, max: 0x5D, default: 0x40, value: 0x40, transform: (q) => (q - 0x40).toString()},
    "Velocity": {min: 0x00, max: 0x7F, default: 0x20, value: 0x20, transform: (q) => q === 0x00 ? "Dynamic" : q.toString()},
    "Breath CC 1": {min: 0x00, max: 0x7F, default: 0x02, value: 0x02, transform: (q) => q === 0x00 ? "Off" : q.toString()},
    "Breath CC 2": {min: 0x00, max: 0x7F, default: 0x00, value: 0x00, transform: (q) => q === 0x00 ? "Off" : q.toString()},
    "Bite CC 1": {min: 0x00, max: 0x7F, default: 0x7F, value: 0x7F, transform: (q) => q === 0x00 ? "Off" : q.toString()},
    "Bite CC 2": {min: 0x00, max: 0x7F, default: 0x00, value: 0x00, transform: (q) => q === 0x00 ? "Off" : q.toString()},
    "Pitchbend UP": {min: 0x00, max: 0x7F, default: 0x7C, value: 0x7C, transform: (q) => q === 0x00 ? "Off" : q.toString()},
    "Pitchbend DOWN": {min: 0x00, max: 0x7F, default: 0x7D, value: 0x7D, transform: (q) => q === 0x00 ? "Off" : q.toString()},
  }
  const [controls, setControls] = useState(parameters);
  const [engine, setEngine] = useState(null); 
  const [selectMidiIn, setSelectMidiIn] = useState([]);
  const [selectMidiOut, setSelectMidiOut] = useState([]);
  const [midiInDeviceName, setMidiInDeviceName] = useState("");
  const [midiOutDeviceName, setMidiOutDeviceName] = useState("");
  const [midiInDevicePort, setMidiInDevicePort] = useState(null);
  const [midiOutDevicePort, setMidiOutDevicePort] = useState(null);
  const [midiDevicesOpen, setMidiDevicesOpen] = useState(false);

  useEffect(() => {
    async function initJZZ() {
      if (engine === null) {
        // console.log("engine === null")
        setEngine(await JZZ.default({engine: "webmidi", sysex: true}));
      } 
    }
    initJZZ();

    if (engine && selectMidiIn.length === 0) {
      let inputs = ["None"];
      engine.info().inputs.map((input) => {
        return inputs.push(input.name);
      });
      setSelectMidiIn(inputs);
    }

    if (engine && selectMidiOut.length === 0) {
      let outputs = ["None"];
      engine.info().outputs.map((output) => {
        return outputs.push(output.name);
      });
      setSelectMidiOut(outputs);
    }

    // try to set an autodetected default
    if (midiInDeviceName === "" && selectMidiIn.indexOf('EWI-USB') > -1) {
      setMidiInDeviceName('EWI-USB');
    }

    if (midiOutDeviceName === "" && selectMidiOut.indexOf('EWI-USB') > -1) {
      setMidiOutDeviceName('EWI-USB');
    }
  }, [engine, selectMidiIn, selectMidiOut, midiInDeviceName, midiOutDeviceName]);

  const receiveMIDI = (data) => {
    console.log("MIDI IN: " + data.toString());

    if (data[0] !== 0xF0 || data[1] !== 0x47 || data[3] !== 0x6D || data[5] !== 0x00) {
      console.error("ignoring invalid EWI-USB SysEx signature");
      return;
    }

    // clone existing controls so value can be mutated, and React will know to re-draw component(s)
    let newval = Object.assign({}, controls);


    // setup controls
    if (data[4] === 0x00 && data[6] === 0x06) {
      // MIDI IN: (example) f0 47 05 6d 00 00 06 45 40 40 40 08 7f f7
      
      // setup data
      newval["Breath Gain"].value = data[7];
      newval["Bite Gain"].value = data[8];
      newval["Bite AC Gain"].value = data[9];
      newval["Pitch Bend Gain"].value = data[10];
      newval["Key Delay"].value = data[11];
      // newval["Unknown 1"].value = data[12];
    }
  
    // performance controls
    if (data[4] === 0x02 && data[6] === 0x0B) {
      // MIDI IN: (example) f0 47 05 6d 02 00 0b 05 00 40 20 02 00 00 7f 00 7c 7d f7
      
      newval["MIDI Channel"].value = data[7] + 1;
      newval["Fingering"].value = data[8];
      newval["Transpose"].value = data[9];
      newval["Velocity"].value = data[10];
      newval["Breath CC 1"].value = data[11];
      newval["Breath CC 2"].value = data[12];
      //newval["Unknown 2"].value = data[13];
      newval["Bite CC 1"].value = data[14];
      newval["Bite CC 2"].value = data[15];
      newval["Pitchbend UP"].value = data[16];
      newval["Pitchbend DOWN"].value = data[17];
    }

    // update state with mutated values
    setControls(newval);
  }

  const openMidi = async (event) => {
    let _in = false;
    let _out = false;
    await engine.openMidiIn(midiInDeviceName).and(function() { console.log("OK: in"); this.connect(receiveMIDI); setMidiInDevicePort(this); _in = true});
    await engine.openMidiOut(midiOutDeviceName).and(function() { console.log("OK: out"); setMidiOutDevicePort(this); _out = true});
    
    if (_in && _out) {
      console.log("MIDI devices opened.");
      setMidiDevicesOpen(true);
    }
  }

  const updateControls = (event) => {
    //console.log(["updateControls",event]);

    // avoid "Object is possibly 'null'" (thanks, TypeScript!)
    if (event.target === null) return;

    // clone existing controls so value can be mutated, and React will know to re-draw component(s)
    let newval = Object.assign({}, controls);

    // mutate values
    const target = event.target; // make 'target.name' valid by typecasting
    newval[target.name].value = event.detail.value;
    
    // update state with mutated values
    setControls(newval);
  }

  const items = Object.keys(controls).map((control) => {
    // console.dir(control);
    return (
      <IonItem key={control}>
        <IonCol size="2" size-sm={true}>
          <IonText>{control}</IonText>
        </IonCol>
        <IonCol size="8" size-sm={true}>
          <IonRange min={controls[control].min} max={controls[control].max} value={controls[control].value} ticks={true} snaps={true} onIonChange={updateControls} pin={true} name={control}>
            <IonLabel slot="start">{controls[control].min}</IonLabel>
            <IonLabel slot="end">{controls[control].max}</IonLabel>
          </IonRange>
        </IonCol>
        <IonCol size="2" size-sm={true} text-right={true}>
          <IonText>{controls[control].transform(controls[control].value)}</IonText>
        </IonCol>
      </IonItem>
    );
  })

  const changeDevice = (event) => {
    // console.log(['changeDevice', event, event.target.name]);
    if (event.target.name === "midiInSelect") {
      setMidiInDeviceName(event.detail.value);
    }

    if (event.target.name === "midiOutSelect") {
      setMidiOutDeviceName(event.detail.value);
    }
  }

  const inputs = selectMidiIn.map((input) => {
    // console.log(["inputs: (check)", input, midiInDeviceName, input === midiInDeviceName]);
    return <IonSelectOption key={input} value={input}>{input}</IonSelectOption>;
  });

  const outputs = selectMidiOut.map((output) => {
    return <IonSelectOption key={output} value={output}>{output}</IonSelectOption>;
  });

  const compareDevice = (a, b) => {
    return a === b;
  }

  const fetchData = () => {
    console.log("fetchData");
    midiOutDevicePort//.send([0x63, 0x01, 0x62, 0x04, 0x06, 0x20])
    .send([0xF0, 0x47, 0x7F, 0x6D, 0x40, 0x00, 0x00, 0xF7])
    .send([0xF0, 0x47, 0x7F, 0x6D, 0x42, 0x00, 0x00, 0xF7])
    //.send([0x63, 0x01, 0x62, 0x04, 0x06, 0x10]);
  }

  const setDefaults = () => {
    let newval = Object.assign({}, controls);
    Object.keys(newval).map((control) => newval[control].value = newval[control].default);

    // update state with mutated values
    setControls(newval);
  }
  const saveData = () => {
    console.log(["saveData", controls]);
    midiOutDevicePort
    // .send([0x63, 0x01, 0x62, 0x04, 0x06, 0x20])
    .send([
      0xF0, // SysEx Start
      0x47, // EWI-USB
      0x7F, // EWI-USB
      0x6D, // EWI-USB
      0x00, // BANK MSB
      0x00, // BANK LSB
      0x06, // Message Length (bytes)
      controls["Breath Gain"].value,
      controls["Bite Gain"].value,
      controls["Bite AC Gain"].value,
      controls["Pitch Bend Gain"].value,
      controls["Key Delay"].value,
      0x7F, // Unknown 1
      0xF7  // SysEx End
      ])
    // .send([0x63, 0x01, 0x62, 0x04, 0x06, 0x20])
    .send([
      0xF0, // SysEx Start
      0x47, // EWI-USB
      0x7F, // EWI-USB
      0x6D, // EWI-USB
      0x02, // BANK MSB
      0x00, // BANK LSB
      0x0B, // Message Length (bytes)
      controls["MIDI Channel"].value - 1,
      controls["Fingering"].value,
      controls["Transpose"].value,
      controls["Velocity"].value,
      controls["Breath CC 1"].value,
      controls["Breath CC 2"].value,
      0x00, // Unknown 2
      controls["Bite CC 1"].value,
      controls["Bite CC 2"].value,
      controls["Pitchbend UP"].value,
      controls["Pitchbend DOWN"].value,
      0xF7  // SysEx End
    ])
    // .send([0x63, 0x01, 0x62, 0x04, 0x06, 0x10]);

  }

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>EWI-USB Config</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonGrid fixed={true}>
            <IonLabel>MIDI IN</IonLabel>
            <IonSelect name="midiInSelect" compareWith={compareDevice} onIonChange={changeDevice} value={midiInDeviceName === "" ? "EWI-USB" : midiInDeviceName}>
              {inputs}
            </IonSelect>
            <IonLabel>MIDI OUT</IonLabel>
            <IonSelect name="midiOutSelect" compareWith={compareDevice} onIonChange={changeDevice} value={midiOutDeviceName === "" ? "EWI-USB" : midiOutDeviceName}>
              {outputs}
            </IonSelect>
            <IonButton onClick={openMidi}>Open MIDI Devices</IonButton>
            <IonButton onClick={fetchData} disabled={!midiDevicesOpen}>Fetch Data</IonButton>
            <IonButton onClick={saveData} disabled={!midiDevicesOpen}>Save</IonButton>
            <IonButton onClick={setDefaults} disabled={!midiDevicesOpen}>Set to Defaults</IonButton>
            {items}
            <h6>DISCLAIMER: This web site/software is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by <a href="https://akaipro.com/">Akai Professional</a>. All product and company names are the registered trademarks of their original owners. The use of any trade name or trademark is for identification and reference purposes only and does not imply any association with the trademark holder of their product brand. The information/data received and transmitted by this software was provided by independent observations from <a href="https://ewiusb.com/">EWIUSB.com</a> and is believed to be accurate and safe. However, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</h6>
          </IonGrid>
        </IonContent>
      </IonPage>
    </IonApp>
  );
}

export default App;
