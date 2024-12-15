import './written_diaries.css';
import { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import { Button, DatePicker } from 'antd';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

export default function WrittenDiaries() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [diary, setDiary] = useState(null);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

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

            if (data.length > 0 && data[0].text) {
                const rawContent = JSON.parse(data[0].text);
                const contentState = convertFromRaw(rawContent);
                setEditorState(EditorState.createWithContent(contentState));
            } else {
                setEditorState(EditorState.createEmpty());
            }

            setDiary(data[0]);
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
            console.log(data.message);
            setDiary(null);
            setEditorState(EditorState.createEmpty());
        } catch (error) {
            console.error('Error deleting diary:', error);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            const userId = 1;  // This should be dynamic based on the logged-in user
            getDiary(userId);
        }
    }, [selectedDate]);

    return (
        <div className='written-diaries-main-page'>
            <Navbar />
            <div className='written-diaries-main-container'>
                <div className='actions-container'>
                    <DatePicker onChange={onDateChange} />
                    <Button style={{ width: '128px' }} onClick={deleteDiary}>Delete this Diary</Button>
                </div>
                <div className='notebook'>
                    <div className='diary'>
                        {selectedDate ? <p>Date: {selectedDate}</p> : <p>Date: Not Selected</p>}
                        <hr />
                        <br />

                        {diary && selectedDate? (
                            <Editor editorState={editorState} readOnly={true} onChange={() => {}} />
                        ) : (
                            <p>Nothing to show here!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
