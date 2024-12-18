import React, { useState } from 'react';
import Radio from 'antd/lib/radio';
import './mood_tracker.css';

const MoodTracker = ({ onMoodChange, onClose }) => {
  const [mood, setMood] = useState('neutral');

  const onMoodSelect = (e) => {
    const selectedMood = e.target.value;
    setMood(selectedMood);
    if (onMoodChange) {
      onMoodChange(selectedMood);
    }
  };

  return (
    <div className="mood-tracker-container">
      <div className="mood-picker">
        <div className="mood-options">
          <Radio.Group onChange={onMoodSelect} value={mood} defaultValue={'neutral'}>
            <Radio value="happy">😊 Happy</Radio>
            <Radio value="sad">😢 Sad</Radio>
            <Radio value="neutral">😐 Neutral</Radio>
            <Radio value="angry">😡 Angry</Radio>
            <Radio value="excited">🤩 Excited</Radio>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
