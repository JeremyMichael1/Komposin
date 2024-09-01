import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SummaryRecipeScreen.css';

function SummaryRecipeScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const { details } = location.state || {};  // Get the HTML details passed from the previous screen

    return (
        <div className="summary-recipe-screen">
            <header className="summary-recipe-header">
                <h1>Generated Recipe</h1>
                <button onClick={() => navigate('/home')}>Back to Home</button>
            </header>
            <div 
                className="recipe-content"
                dangerouslySetInnerHTML={{ __html: details }}  // Render the HTML content safely
            />
        </div>
    );
}

export default SummaryRecipeScreen;
