import './homepage.css';
import {react, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import MyTextField from '../../components/text_field/text_field';
import StreakCalendar from '../../components/streak_calendar/streak_calendar';


export default function Homepage() {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [saveTrigger, setSaveTrigger] = useState(0)

    // Update Date
    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const day = now.getDate().toString().padStart(2, '0'); // Day of the month (1-31)
            const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
            const year = now.getFullYear(); // Full year (e.g., 2024)
            setDate(`${day}/${month}/${year}`); // Format as DD/MM/YYYY
        };

        updateDate(); // Set the initial value
        const interval = setInterval(updateDate, 60000); // Update every minute (date doesn't change every second)

        return () => clearInterval(interval); // Cleanup interval
    }, []);

    //Update Clock
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            setTime(`${hours}:${minutes}:${seconds}`);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSave = () => {
        setSaveTrigger((prev) => prev + 1); // Increment the save trigger
      };

    return (
        <div className='homepage-main-page'>
            <Navbar />
            <div className='homepage-main-container'>
                <div className='homepage-center'>
                    <h1 className='digital-clock'>{date}&nbsp;&nbsp;{time}</h1>
                    
                    <div className='homepage-text-field'>
                        <MyTextField date={date} ></MyTextField>
                    </div>
                </div>
                <div className='homepage-right'>
                    <StreakCalendar saveTrigger={saveTrigger} />
                </div>

            </div>
        </div>
    );
}