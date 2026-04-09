import { useState, useEffect} from "react";

type ReturnType = [string, React.Dispatch<React.SetStateAction<number>>, boolean];

/*
takes the interval and the time to countdown from and then returns a string of the current time, the setter for the raw time state and a boolean that tracks if the countdown timer is complete or not

Interval is assumed to be 1000 milliseconds, which is a second
 */
function useCountdownTimer(timeInMilliseconds: number): ReturnType {
  let currentTimerString = "";
  const [isDone, setIsDone] = useState(false);
  const [time, setTime] = useState<number>(timeInMilliseconds);

  useEffect(() => {
    const countDownUntilZero = () => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          setIsDone(true);
          return 0;
        } else return prevTime - 1;
      });
    };

    const timer = setInterval(countDownUntilZero, 1000);
    return () => clearInterval(timer);
  }, [time]);

  const formatSeconds = (time: number) => {
    const seconds = time % 60;

    if (seconds < 10) {
      return `0${seconds}`
    } return seconds;
    
  }
  
  /* Then we format the text properly */
  currentTimerString = `${Math.floor(time / 60)}:${formatSeconds(time)}`;

  return [currentTimerString, setTime, isDone];
};

export default useCountdownTimer;
