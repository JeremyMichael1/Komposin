import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './WasteManagementSuggestionScreen.css'; // We'll define the CSS below

function WasteManagementSuggestionScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const { productName, details } = location.state;

    const handleBackClick = () => {
        navigate('/home'); // Navigate back to the HomeScreen
    };

    return (
        <div className="suggestion-screen">
            <header className="suggestion-header">
                <h1>Waste Management Suggestion: {productName}</h1>
            </header>

            <div className="suggestion-content" dangerouslySetInnerHTML={{ __html: details }}></div>
            
            <div className="button-group">
                <button className="btn-back" onClick={handleBackClick}>
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default WasteManagementSuggestionScreen;
