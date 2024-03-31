import { useState, useEffect, useRef, useContext } from 'preact/hooks';
import { UserContext } from '../components/Login';
import { getDocumentsAsync, setDocumentAsync } from '../lib/database';
import { Typography, Select, Input, Button } from 'antd';
import BaseLayout from '../layouts/BaseLayout'

const data = {};
data.exercise_list = {};

// Initialize Firebase
const customInterpolate = (points, interpolator) => {
  const nonNullPoints = points.filter(point => point.value !== null && point.value !== undefined);
  return interpolator(nonNullPoints);
};

const DATA_DIR = "/home/arya/Documents/Org/Tracking/"
const Graph = () => {
  const {user} = useContext(UserContext);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lappers, setLappers] = useState([{name: "demo - one minute", "Time": 10}]);
  const [lapper, setLapper] = useState({});
  const [laps, setLaps] = useState(0);




  const getLappers = () => {
    let data = "";
    setLappers({});
    getDocumentsAsync(user, "settings", "lapper", [setLappers], false)
    }

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(()=> {
    getLappers()
  }, [lapper.length]);

  const handleStartStop = () => {
    setIsRunning(prevIsRunning => !prevIsRunning);
  };

  const handleReset = () => {
    setTime(0);
    setLaps(0);
    setIsRunning(false);
  };
  const handleLappers = (e) => {
    let body = lapper;

    body.Date = new Date();
    body.Laps = laps;
    body.Volume = (body.Time*Math.pow(body.Laps,1/2));
    setDocumentAsync(user, "data", `tracking/mental/willoverpain/${body.Date.getTime().toString()}`, body)
  };
  const handleLapperChange = (value) => {
    setLapper(lappers[value])
  };

  const formatTime = () => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    if (time >= lapper.Time) {
        setTime(0);
        setLaps((prev) => {

            let utterance = new SpeechSynthesisUtterance(prev+1);
            speechSynthesis.speak(utterance);
            const text = `Lap: ${prev+1} for ${lapper.name}`;
            return prev + 1;
        });
    }
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  return (
<BaseLayout>

<Typography>
        <Select style={{display: 'block'}} placeholder="Lapper" value={lapper.name} onChange={handleLapperChange}>
        {lappers.length > 0 && lappers.map((lapper, index) => (
            <Select.Option value={index}>{lapper.name}</Select.Option>
          ))}
        </Select>
    <div style={{margin: '0 auto', width: 'max-content'}}>
      <h3>Time: {formatTime()}</h3>
      <h3>
        <Input type='number' value={laps} onChange={(e) => setLaps(e.target.value)}/>
        </h3>
      <Button onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</Button>
      <Button onClick={handleReset}>Cancel</Button>
      <Button onClick={handleLappers}>Store</Button>
    </div>
</Typography>
    
</BaseLayout>
  );
};

export default Graph;