import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import Break from './components/Break';
import Session from './components/Session';
import TimeLeft from './components/TimeLeft';

function App() {
    const audioElement = useRef(null);
    const [currentSessionType, setCurrentSessionType] = useState('Session');
    const[intervalID, setIntervalID] = useState(null);
    const [sessionLength,  setSessionLength] = useState(60 * 25);
    const [breakLength,  setBreakLength] = useState(300); 
    const [timeLeft, setTimeLeft] = useState(sessionLength);
    
    // change our time left whenever sessionLength chages
    useEffect(() => {
        setTimeLeft(sessionLength);
    }, [sessionLength]); 

    const decrementBreakLengthByOneMinute = () => {
        const newBreakLength = breakLength - 60;
        if (newBreakLength < 0) {
            setBreakLength(0);
        } else {
            setBreakLength(newBreakLength);
        }
    };
    const incrementBreakLengthByOneMinute = () => {
        setBreakLength(breakLength + 60);
    };
    const decrementSessionLengthByOneMinute = () => {
        const newSessionLength = sessionLength - 60;
        if (newSessionLength < 0) {
            setSessionLength(0);
        } else {
            setSessionLength(newSessionLength);
        }
    };
    const incrementSessionLengthByOneMinute = () => {
        setSessionLength(sessionLength + 60);
    };
    const isStarted = intervalID != null;
    const handleStartStopClick = () => {
        if (isStarted) {
            // if we are in started mode, 
            // we want to stop the timer
            // clearInterval
            clearInterval(intervalID);
            setIntervalID(null);
        } else {
            // If we are in stopped mode, 
            // decrement timeLeft byOne every second (1000 ms)
            // to achieve this, setInterval will be used
            const newIntervalID = setInterval(() => {
                setTimeLeft(prevTimeLeft => {
                    const newTimeLeft = prevTimeLeft - 1;
                    if (newTimeLeft >= 0) {
                        return prevTimeLeft - 1;
                    }
                    audioElement.current.play();
                    if (currentSessionType == 'Session') {
                        setCurrentSessionType('Break');
                        setTimeLeft(breakLength);
                    } else if (currentSessionType == 'Break') {
                        setCurrentSessionType('Session');
                        setTimeLeft(sessionLength);
                    }
                });
            }, 100);
        setIntervalID(newIntervalID);
        }
        
    };
    const handleResetButtonClick = () => {
      // reset audio 
      audioElement.current.load();
      // clear timeout interval
      clearInterval(intervalID);
      // set intervalID to null
      setIntervalID(null);
      // set the sessionType to 'Session'
      setCurrentSessionType('Session');
      // reset the session length to 25 minutes
      setSessionLength(60 * 25);
      // reset the break length to 5 minutes
      setBreakLength(60 * 5);
      // reset timer to 25 minutes (original length)
      setTimeLeft(60 * 25);
    };
  return (
    <div className="App">
      <Break 
        breakLength = {breakLength}
        decrementBreakLengthByOneMinute = {decrementBreakLengthByOneMinute}
        incrementBreakLengthByOneMinute = {incrementBreakLengthByOneMinute}
      />
      <TimeLeft  
        handleStartStopClick = {handleStartStopClick}
        timerLabel = {currentSessionType}
        startStopButtonLabel = {isStarted ? 'Stop' : 'Start'}
        timeLeft = {timeLeft}        
      />
      <Session 
        sessionLength = {sessionLength}
        decrementSessionLengthByOneMinute = {decrementSessionLengthByOneMinute}
        incrementSessionLengthByOneMinute = {incrementSessionLengthByOneMinute}
      /> 
      <button id = "reset" onClick = {handleResetButtonClick}>Reset</button>
      <audio id = "beep" ref = {audioElement}> 
        <source src = "https://onlineclock.net/audio/options/default.mp3" type = "audio/mpeg"/>
      </audio>
    </div>
  );
}

export default App;
