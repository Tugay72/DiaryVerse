import React, { useState } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './text_field.css'
import Toolbar from './toolbar';

export default function RichTextEditor() {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

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

    return (
        <>
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
            }}>Save</button>
        </>
    );
}
