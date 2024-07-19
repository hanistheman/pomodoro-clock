import React, {useState, useEffect} from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);

const TimeLeft = ({ breakLength, sessionLength }) => {
    const [currentSessionType, setCurrentSessionType] = useState('Session');
    const [timeLeft, setTimeLeft] = useState(sessionLength);
    const[intervalID, setIntervalID] = useState(null);
    // change our time left whenever sessionLength chages
    useEffect(() => {
        setTimeLeft(sessionLength);
    }, [sessionLength]);

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
    

    const formattedTimeLeft = moment.duration(timeLeft, 's').format('mm:ss', {trim: false});
    return <div> 
    {formattedTimeLeft} 
    <p id = 'timer-label'>{currentSessionType}</p>
    <p id = 'time-left' >{formattedTimeLeft}</p>
    <button onClick = {handleStartStopClick}> {isStarted? 'Stop' : 'Start'}</button>
    </div>
};

export default TimeLeft;