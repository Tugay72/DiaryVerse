import React, { useState, useEffect, useContext } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './streak_calendar.css';
import moment from 'moment';
import { UserContext } from '../../context/userContext';

const fontSizes = [24, 28, 32, 36, 32, 28, 24]; // Font sizes for each index

export default function StreakContainer({ saveTrigger }) {
    const {userData, setUserData} = useContext(UserContext);
    const [diaryStatuses, setDiaryStatuses] = useState([]);
    const [currentStreak, setCurrentStreak] = useState(0);

    // Get and set written diaries data
    useEffect(() => {
        const fetchDiaries = async () => {
            const today = new Date();
            const statuses = [];

            // Fetch data for the last 7 days
            for (let i = 0; i < fontSizes.length; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - (3 - i)); // Days from -3 to +3 from today

                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                const formattedDate = moment(date).format('YYYY-MM-DD');

                try {
                    const response = await fetch(
                        `http://localhost:5000/get-diaries/${userData.user_id}/${formattedDate}`
                    );

                    if (!response.ok) {
                        console.error(`Error fetching diaries for ${formattedDate}`);
                        statuses.push(false); // No diary entry
                        continue;
                    }

                    const data = await response.json();
                    statuses.push(data.length > 0); // True if entry exists
                } catch (error) {
                    console.error(`Error fetching diaries for ${formattedDate}:`, error);
                    statuses.push(false); // No diary entry due to error
                }
            }

            setDiaryStatuses(statuses);
        };

        fetchDiaries();
    }, [userData.userId, saveTrigger]);

    // Calculate the current streak
    useEffect(() => {
        const streak = diaryStatuses.reduce((acc, curr, index) => {
            // Check consecutive days with diary entries
            if (curr) {
                // If this is the first streak or consecutive, increment streak
                if (index === 0 || diaryStatuses[index - 1]) {
                    acc++;
                }
            }
            return acc;
        }, 0);

        setCurrentStreak(streak);
    }, [diaryStatuses]);

    return (
        <div>
            <h3 style={{ color: 'whitesmoke' }}>🔥 {currentStreak}</h3>
            <div className="streak-container">
                {fontSizes.map((size, index) => (
                    <span
                        key={index}
                        className="cell"
                        style={{
                            fontSize: `${size}px`,
                            width: `${size + 2}px`,
                            height: `${size + 2}px`,
                        }}
                    >
                        {diaryStatuses[index] ? <CheckOutlined /> : <CloseOutlined />}
                    </span>
                ))}
            </div>
        </div>
    );
}
