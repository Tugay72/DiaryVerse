import './text_field.css'
import React, { useState, useContext } from 'react';
import { EditorState, RichUtils, convertToRaw, Modifier } from 'draft-js';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { message, Modal } from 'antd';
import Toolbar from './toolbar';
import MoodTracker from '../mood_tracker/mood_tracker';
import { UserContext } from '../../context/userContext';

export default function RichTextEditor(currentDate, { handleSave }) {
    const {userData} = useContext(UserContext);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [emojiPicker, setEmojiPicker] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedMood, setSelectedMood] = useState(null);
    const [isMoodModalOpen, setMoodIsModalOpen] = useState(false);

    const error_message = (message) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };

    const handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const toggleBlockType = (blockType) => {
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    };

    const toggleInlineStyle = (inlineStyle) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };

    const handleMoodChange = (mood) => {
        setSelectedMood(mood);
        console.log('Selected Mood:', mood);
        setMoodIsModalOpen(false);
    };

    const submitDiary = async () => {
        const contentState = editorState.getCurrentContent();
        const rawContent = convertToRaw(contentState);
        const plainText = contentState.getPlainText();
        
        console.log(userData)
        const diaryData = {
            userId: userData.user_id,
            text: rawContent,
            date: currentDate.date,
            mood: selectedMood
        };
    
        console.log(diaryData);
    
        try {
            const response = await fetch('http://localhost:5000/save-diary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(diaryData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                error_message("Already Exists!");
                return;
            }
    
            const data = await response.json();
            console.log('Diary saved:', data);
            currentDate.handleSave();
            message.success("Diary saved successfully!");
        } catch (error) {
            console.error('Error saving diary:', error);
            error_message("Failed to save diary!");
        }
    };
    

    const handleEmojiSelection = (emojiData) => {
        const emoji = emojiData.emoji; // Selected emoji

        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();

        // Insert emoji into content
        const newContentState = Modifier.insertText(
            contentState,
            selectionState,
            emoji
        );

        // Create a new editor state with the updated content
        const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
        setEditorState(newEditorState);
    };

    return (
        <>
            {contextHolder}
            <div style={{display: 'flex', flexDirection: 'row', gap: '850px'}}>
                <Toolbar
                    toggleBlockType={toggleBlockType}
                    toggleInlineStyle={toggleInlineStyle}

                    // Emoji Picker Props
                    open={emojiPicker}
                    handleEmojiSelection={handleEmojiSelection}
                    setEmojiPicker={setEmojiPicker}
                />
                <Modal
                    title="Track Your Mood"
                    visible={isMoodModalOpen}
                    onCancel={() => setMoodIsModalOpen(false)}
                    footer={null}
                    >
                    <MoodTracker
                        onMoodChange={handleMoodChange}
                        onClose={() => setMoodIsModalOpen(false)}
                    />
                </Modal>
                <button
                    onClick={() => setMoodIsModalOpen(true)}
                    style={{ margin: '1px 0 10px 0'}}
                >Mood</button>
            </div>
            
            <div className='editor-container'>

                <Editor
                    editorState={editorState}
                    onChange={setEditorState}
                    handleKeyCommand={handleKeyCommand}
                    placeholder="What did you do today?"
                />
            </div>

            <button style={{
                margin: '4rem 0 0 0',
                width: '72px',
                height: '32px'
            }}
                onClick={submitDiary}
            >Save</button>
        </>
    );
}
