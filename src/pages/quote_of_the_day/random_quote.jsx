
import './random_quote.css';
import React, {useState, useEffect} from "react";
import quotes from './quotes.json';
import Navbar from '../../components/navbar/navbar';

const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.quotes.length);
    return quotes.quotes[randomIndex];
};

export default function DailyQuote(){
    const [saveTrigger, setSaveTrigger] = useState(1);
    const [randomQuote, setRandomQuote] = useState(null);

    // Set a random quote when the component mounts
    useEffect(() => {
        setRandomQuote(getRandomQuote());
    }, [saveTrigger]);

    return(
        <div className="daily-quotes-main">
            <Navbar/>
            <div className="daily-quotes-main-container">
                {randomQuote ? (
                    <>
                        <p>{randomQuote.text}</p>
                        <p><em>- {randomQuote.author}</em></p>
                        <button style={{marginTop: '32px'}} onClick={() => setSaveTrigger((prev) => prev + 1)}>New Quote</button>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}