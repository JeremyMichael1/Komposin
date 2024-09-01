import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

function SplashScreen() {
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);

    const handleLogoClick = () => {
        setIsClicked(true);
        setTimeout(() => {
            navigate('/home'); // Navigate to the home screen
        }, 2000);  // Match this with the duration of the fadeOut animation
    };

    return (
        <div className={`splash-screen ${isClicked ? 'fade-out' : ''}`}>
            <img 
                src="/PantryPal.png" 
                alt="App Logo" 
                className={`splash-logo ${isClicked ? 'clicked' : ''}`} 
                onClick={handleLogoClick} 
            />
            <h1 className="app-name">Simpenin</h1>
            <p className="tagline">Your eco-friendly waste management assistant</p>
        </div>
    );
}

export default SplashScreen;
