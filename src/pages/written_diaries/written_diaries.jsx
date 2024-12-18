import './written_diaries.css';
import { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/navbar/navbar';
import { Button, DatePicker, message } from 'antd';  // Added message for feedback
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { UserContext } from '../../context/userContext';

export default function WrittenDiaries() {
    const { userData } = useContext(UserContext);
    const [selectedDate, setSelectedDate] = useState(null);
    const [diary, setDiary] = useState(null);
    const [mood, setMood] = useState(null);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const onDateChange = (date, dateString) => {
        console.log('Date selected:', dateString); // Log date change
        setSelectedDate(dateString);
    };

    const getDiary = async () => {
        try {
            const response = await fetch(`http://localhost:5000/get-diaries/${userData.user_id}/${selectedDate}`);
            if (!response.ok) {
                throw new Error('Failed to fetch diary');
            }
            const data = await response.json();
            console.log("Diary fetch response data:", data); // Check this for correct structure
    
            if (data.diary && data.diary.text) {
                const rawContent = JSON.parse(data.diary.text); // Properly parse the text as JSON
                const contentState = convertFromRaw(rawContent);
                setMood(data.diary.mood);
                setEditorState(EditorState.createWithContent(contentState));
            } else {
                setEditorState(EditorState.createEmpty());
                setMood(null);  // Reset mood when no diary entry found
            }
    
            setDiary(data.diary);
        } catch (error) {
            console.error('Error fetching diary:', error);
            message.error('Failed to fetch diary');  // Display error message
        }
    };
    

    const deleteDiary = async () => {
        if (!selectedDate || !diary) {
            message.warning('No diary selected to delete');
            return;
        }

        console.log(`Deleting diary for user ${userData.user_id} on ${selectedDate}`); // Log delete attempt

        try {
            const response = await fetch(`http://localhost:5000/delete-diary/${userData.user_id}/${selectedDate}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                console.error('Error in fetch response:', response.status, response.statusText); // Log fetch errors
                throw new Error('Failed to delete diary');
            }

            const data = await response.json();
            console.log('Delete diary response data:', data); // Log response data for delete
            setDiary(null);
            setEditorState(EditorState.createEmpty());
            setMood(null);  // Reset mood after deletion
            message.success('Diary deleted successfully!');  // Display success message
        } catch (error) {
            console.error('Error deleting diary:', error); // Log errors during delete
            message.error('Failed to delete diary');  // Display error message
        }
    };

    useEffect(() => {
        if (selectedDate) {
            getDiary();
        }
    }, [selectedDate]);

    return (
        <div className='written-diaries-main-page'>
            <Navbar />
            <div className='written-diaries-main-container'>
                <div className='actions-container'>
                    <DatePicker onChange={onDateChange} />
                    <Button
                        style={{ width: '128px' }}
                        onClick={deleteDiary}
                        disabled={!selectedDate || !diary}
                    >
                        Delete this Diary
                    </Button>
                </div>
                <div className='notebook'>
                    <div className='diary'>
                        {selectedDate ? (
                            <p>Date: {selectedDate} / Mood: <i>{mood ? mood : 'Neutral'}</i></p>
                        ) : (
                            <p>Date: Not Selected</p>
                        )}
                        <hr />
                        <br />

                        {diary ? (
                            <Editor editorState={editorState} readOnly={true} onChange={() => {}} />
                        ) : (
                            <p>No diary entry found for this date!</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
