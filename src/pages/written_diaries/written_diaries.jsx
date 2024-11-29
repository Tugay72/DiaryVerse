import './written_diaries.css';
import {react, useState, useEffect} from 'react';

import Navbar from '../../components/navbar/navbar'
import { DatePicker } from 'antd';


export default function WrittenDiaries() {
    const [selectedDate, setSelectedDate] = useState(null);

    const onDateChange = (date, dateString) => {
        setSelectedDate(dateString)
        console.log(dateString);
    };

    return(
        <div className='written-diaries-main-page'>
            <Navbar></Navbar>
            <div className='written-diaries-main-container'>

                <div className='notebook'>
                    <div className='diary'>
                        <p style={{paddingLeft: '12rem'}}>Date: {selectedDate}</p>
                        <p style={{paddingTop: '2rem'}}>Diaries Are Unique</p>
                    </div>
                    
                </div>
                <DatePicker onChange={onDateChange}/>
            </div>
        </div>
    )
}