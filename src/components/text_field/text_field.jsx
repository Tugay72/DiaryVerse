import React, { useState } from 'react';
import { EditorState, RichUtils, convertToRaw } from 'draft-js';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './text_field.css'
import Toolbar from './toolbar';
import { message } from 'antd';

export default function RichTextEditor(currentDate) {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [userId, setUserId] = useState(1);
    const [messageApi, contextHolder] = message.useMessage();

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

    const submitDiary = async () => {
        const contentState = editorState.getCurrentContent();
        const rawContent = convertToRaw(contentState);
        const plainText = contentState.getPlainText();
        
        // Prepare the data to send (you can pass the current date or omit it)
        const diaryData = {
          userId: 1,  // Replace with actual user ID
          text: plainText,
          date: currentDate.date,  // Optional: Pass current date if needed
        };
      
        console.log(diaryData)
        try {
          const response = await fetch('http://localhost:5000/save-diary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(diaryData),
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log('Diary saved:', data);
          } else {
            throw new Error('Failed to save diary');
          }
        } catch (error) {
          console.error('Error saving diary:', error);
          error_message("Already Exists!");
        }
      };      
      
      
      

    return (
        <>
            {contextHolder}
            <Toolbar 
                toggleBlockType={toggleBlockType} 
                toggleInlineStyle={toggleInlineStyle} 
            />
            <div className='editor-container'>
                <Editor
                    editorState={editorState}
                    onChange={setEditorState}
                    handleKeyCommand={handleKeyCommand}
                    placeholder="What did you do today?"
                />
            </div>
            <button style={{
                margin: '3rem 0 0 20rem',
                width: '72px',
                height: '32px'
            }}
            onClick={submitDiary}
            >Save</button>
        </>
    );
}
