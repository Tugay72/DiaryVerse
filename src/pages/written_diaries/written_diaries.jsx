import './written_diaries.css';
import { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import { DatePicker } from 'antd';
import moment from 'moment';  // ES6 import syntax

export default function WrittenDiaries() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [diary, setDiary] = useState(null);

  const onDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    console.log(dateString);
  };

  const getDiary = async (userId, date) => {
    // Convert the selected date to 'DD/MM/YYYY' format
    const formattedDate = moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    
    try {
      const response = await fetch(`http://localhost:5000/get-diaries/${userId}/${formattedDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch diary');
      }
      const data = await response.json();
      console.log('Diary:', data);  // Log the diary entry
      setDiary(data);  // Set the diary state with the fetched data
    } catch (error) {
      console.error('Error fetching diary:', error);
    }
  };
  

  // Fetch the diary when the date is selected
  useEffect(() => {
    if (selectedDate) {
      const userId = 1;  // This should be dynamic based on the logged-in user
      getDiary(userId, selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className='written-diaries-main-page'>
      <Navbar />
      <div className='written-diaries-main-container'>
        <div className='notebook'>
          <div className='diary'>
            {selectedDate && <p style={{ paddingLeft: '12rem' }}>Date: {selectedDate}</p>}
            <h1>My Diary</h1>

            {/* Check if a diary exists */}
            {diary ? (
              <div>
                <h2>{diary.date}</h2> {/* Display the diary's date */}
                <p>{diary.text}</p>    {/* Display the diary's text */}
              </div>
            ) : (
              <p>No diary found for this date</p>
            )}
          </div>
        </div>
        <DatePicker onChange={onDateChange} />
      </div>
    </div>
  );
}
