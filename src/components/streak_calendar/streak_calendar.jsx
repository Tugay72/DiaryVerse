import React, { useState, useEffect } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './streak_calendar.css';
import moment from 'moment';

const fontSizes = [24, 28, 32, 36, 32, 28, 24]; // Font sizes for each index

export default function StreakContainer({ userId = 1, saveTrigger }) {
  const [diaryStatuses, setDiaryStatuses] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Get and set written diaries data
  useEffect(() => {
    const fetchDiaries = async () => {
      const today = new Date();
      const statuses = [];

      for (let i = -3; i < fontSizes.length - 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        var formattedDate = (`${day}/${month}/${year}`);
        formattedDate = moment(date).format('YYYY-MM-DD');

        try {
          const response = await fetch(
            `http://localhost:5000/get-diaries/${userId}/${formattedDate}`
          );

          if (!response.ok) {
            console.error(`Error fetching diaries for ${formattedDate}`);
            statuses.push(false); // Treat as no entry
            continue;
          }

          const data = await response.json();
          statuses.push(data.length > 0); // True if entries exist, false otherwise
        } catch (error) {
          console.error(`Error fetching diaries for ${formattedDate}:`, error);
          statuses.push(false); // Treat as no entry in case of an error
        }
      }

      setDiaryStatuses(statuses);
    };

    fetchDiaries();
  }, [userId, saveTrigger]);

  useEffect(() => {
    setCurrentStreak(diaryStatuses.filter(value => value === true).length)
  }, [diaryStatuses]);
  

  return (
    <div>
    <h3>🔥 {currentStreak}</h3>
    <div></div>
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
