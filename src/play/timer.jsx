import React from 'react';

export function useTimer() {
    const [time, setTime] = React.useState(0); // Sets the time at zero and the function to change that as setTime()
    const timerRef = React.useRef(null); // This is a reference to the running timer. It allows us to start and stop the timer
    const startedRef = React.useRef(false); // This makes it so only the first guess starts the timer
    const timestamp = React.useRef(null); // Stores the current system time

    // Starts the timer once the user makes the first guess
    const startTimer = () => {
        if (!startedRef.current) { // If the timer isn't already going (stops the timer from starting over every time they guess)
            startedRef.current = true; // Set the flag so we don't run the timer again
            timestamp.current = Date.now(); // Sets the timestamp to the current time

            timerRef.current = setInterval(() => {
            setTime(Date.now() - timestamp.current); // Updates time to the elapsed time
            }, 16); // Visually updates the timer ~60 times/second
        } // Now timerRef is a reference to the timer currently running so we can stop it later
    };

    const stopTimer = () => {
        clearInterval(timerRef.current);
    };

    // Resets the interval (timer) when they leave the page
    React.useEffect(() => () => clearInterval(timerRef.current), []);

    return { time, startTimer, stopTimer };
}
