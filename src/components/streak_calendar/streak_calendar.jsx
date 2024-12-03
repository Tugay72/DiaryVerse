import React, { useState, useEffect } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './streak_calendar.css';

const fontSizes = [24, 28, 32, 36, 32, 28, 24]; // Font sizes for each index

export default function StreakContainer({ userId }) {
  const [diaryStatuses, setDiaryStatuses] = useState([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      const today = new Date();
      const statuses = [];

      for (let i = 0; i < fontSizes.length; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i); // Calculate the date
        const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD

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
  }, [userId]);

  return (
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
  );
}
