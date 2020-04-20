import React from 'react';
import './App.css';
import chanceOfAnyRain from './Weather';

function App() {

  let [alertText, setAlertText] = React.useState(
      {vis: 'invis', text: ''}
  );

  let [userPrefs, setPrefs] = React.useState(0)

  let [locEntries, setEntries] = React.useState( 
    [ {city: '', state: '', from: '', to: ''} ] 
  );

  let [resText, setResText] = React.useState({umbr: "", chan: ""});

  let changePrefs = (pref) => {
    let p = pref
    if (pref > 100)
      p = 100;
    if (pref < 0)
      p = 0
    setPrefs(p);
  }

  let createEntry = () => {
    if (locEntries.length < 4) {
      setEntries([...locEntries, {city: '', state: '', from: '', to: ''}])
    }
  }

  let removeEntry = () => {
    let temp = locEntries
    if (temp.length > 1)
      temp.pop()
    setEntries([...temp]);
  }

  let updateEntry = (index, field, value) => {
    let temp = locEntries;
    temp[index][field] = value;
    setEntries(temp);
  }

  let timesAreCorrect = (entries) => {
    let fromTime;
    let toTime;

    for (let i = 0; i < entries.length; i++) {
      fromTime = parseInt(entries[i].from.slice(0, 2) + entries[i].from.slice(3, 5))
      toTime = parseInt(entries[i].to.slice(0, 2) + entries[i].to.slice(3, 5))

      if (isNaN(fromTime) || isNaN(toTime)) {
        triggerAlert("vis", "The time entries must be completely filled.")
        return false;
      }

      if (fromTime >= toTime) {
        triggerAlert("vis", "The FROM entry must be earlier than the TO entry.")
        return false;
      }
    }
    return true;
  }

  async function genResults() {

    if (timesAreCorrect(locEntries)) {

      let results = await chanceOfAnyRain(locEntries);

      if (results === -1) {
        triggerAlert("vis", "A invalid City/State was inputted.")
      } else if (results === -2) {
        triggerAlert("vis", "The weather server failed to load")
      } else if (results > userPrefs) {
        setResText({
          umbr: "Bring an umbrella!",
          chan: `There is a ${results}% chance it will rain.`
        })
        triggerAlert("invis", "")
      } else {
        setResText({
          umbr: "Do not bring an umbrella!",
          chan: `There is only a ${results}% chance it will rain.`
        })
        triggerAlert("invis", "")
      }
    }
  }

  let triggerAlert = (vis, msg) => {
    setAlertText({vis: `${vis}`, text: `${msg}`});
  }

  return (
    <div className="container-fluid">
      <header>Should I Bring an Umbrella Today?</header>

      <PreferenceBox setPrefs={changePrefs}></PreferenceBox>

      <PlaceBox numPlaces={locEntries.length} onAddClick={createEntry}
        onSubClick={removeEntry} onTextChange={updateEntry}>
      </PlaceBox>

      <Alert text={alertText.text} visibility={alertText.vis}></Alert>

      <ResultBox resText={resText} genResult={genResults}></ResultBox>
    </div>
  );
}

function Alert({text, visibility}) {
  return (
    <div className={"alert alert-danger " + visibility} role="alert">
      {text}
    </div>
  );
}

function PreferenceBox({setPrefs}) {
  return (
    <div className="preferences">
      <div className="instr">Input your preferences:</div>
      <label htmlFor="rain">Highest tolerable %chance of rain: </label>
      <input type="number" onChange={(event) => setPrefs(event.target.value)}
        id="rain" name="rain" min="0" max="100"></input>
    </div>
  );
}

function PlaceBox({numPlaces, onAddClick, onSubClick, onTextChange}) {

  let placeArr = [];
  for (let i = 0; i < numPlaces; i++){
    placeArr.push(<Place onTextChange={onTextChange} num={i} key={'p' + i}></Place>)
  }

  return (
    <div className='places'>
      <div className='instr'>Input when and where you will be outside:</div>

      {placeArr}

      <div className='row'>
        <div className='col-sm'>
          <button className='btn btn-secondary' 
            onClick={(event) => onAddClick()} id='loc'>
            Add New Location
          </button>
        </div>

        <div className='col-sm'>
          <button className='btn btn-secondary' 
            onClick={(event) => onSubClick()} id='loc'>
            Remove Location
          </button>
        </div>
      </div>

    </div>
  );
  
}

function Place({num, onTextChange}) {

  return (
    <div className='place'>
      <CityState onTextChange={onTextChange} num={num}></CityState>
      <FromTo onTextChange={onTextChange} num={num}></FromTo>
    </div>
  );
}

function CityState({num, onTextChange}) {
  return (
    <div className='row'>
      <div className='col-sm'>
        <label htmlFor={'c' + num}>City: </label>
        <input type='text' onChange={(event) => onTextChange(num, 'city', event.target.value)} 
          id={'c' + num} name={'c' + num}></input>
      </div>

      <div className='col-sm'>
        <label htmlFor={'s' + num}>State: </label>
        <input type='text' onChange={(event) => onTextChange(num, 'state', event.target.value)}
          id={'s' + num} name={'s' + num}></input>
      </div>
    </div>
  );
}

function FromTo({num, onTextChange}) {
  return (
    <div className='row'>
      <div className='col-sm'>
        <label htmlFor={'f' + num}>From: </label>
        <input type='time' onChange={(event) => onTextChange(num, 'from', event.target.value)}
          id={'f' + num} name={'f' + num}></input>
      </div>

      <div className='col-sm'>
        <label htmlFor={'t' + num}>To: </label>
        <input type='time' onChange={(event) => onTextChange(num, 'to', event.target.value)}
          id={'t' + num} name={'t' + num}></input>
      </div>
    </div>
  );
}

function ResultBox({resText, genResult}) {

  return (
    <div className='results'>
      <button onClick={genResult} className='btn btn-primary'>Generate Results</button>
      <div id='umbr'>{resText.umbr}</div>
      <div id='chan'>{resText.chan}</div>
    </div>
  );
}

export default App;
