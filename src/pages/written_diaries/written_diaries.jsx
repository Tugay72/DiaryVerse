import './written_diaries.css';
import { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import { Button, DatePicker } from 'antd';
import moment from 'moment';  // ES6 import syntax

export default function WrittenDiaries() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [diary, setDiary] = useState(null);

  const onDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    console.log(dateString);
  };

  const getDiary = async (userId) => {
    
    try {
      const response = await fetch(`http://localhost:5000/get-diaries/${userId}/${selectedDate}`);
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

  const deleteDiary = async (userId = 1) => {
    try {
      const response = await fetch(`http://localhost:5000/delete-diary/${1}/${selectedDate}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete diary');
      }
  
      const data = await response.json();
      console.log(data.message); // Log the success message
      // Optionally, you can update the state to remove the deleted diary
      setDiary(prevDiaries => prevDiaries.filter(diary => diary.date !== selectedDate)); // Update state
    } catch (error) {
      console.error('Error deleting diary:', error);
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
            <br />

            {diary && diary[0] && diary[0].text ? (
              <div>
                <p>{diary[0].text}</p>
              </div>
            ) : (
              <p>No diary found for this date</p>
            )}

          </div>
        </div>
        <div className='actions-container'>
          <DatePicker onChange={onDateChange} />
          <Button style={{width: '128px'}} onClick={deleteDiary}>Delete this Diary</Button>
        </div>
        
      </div>
    </div>
  );
}
