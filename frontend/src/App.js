import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SplashScreen from './SplashScreen';
import HomeScreen from './HomeScreen';
import CameraUploadScreen from './CameraUploadScreen';
import SummaryScreen from './SummaryScreen';
import WasteManagementSuggestionScreen from './WasteManagementSuggestionScreen';
import SummaryRecipeScreen from './SummaryRecipeScreen';

function App() {
    return (
        <Router>
            <div className="App">
                    <Routes>
                        <Route path="/" element={<SplashScreen />} />
                        <Route path="/home" element={<HomeScreen />} />
                        <Route path="/camera" element={<CameraUploadScreen />} />
                        <Route path="/summary" element={<SummaryScreen />} />
                        <Route path="/waste-management-suggestion" element={<WasteManagementSuggestionScreen />} />
                        <Route path="/summary-recipe" element={<SummaryRecipeScreen />} />
                    </Routes>
            </div>
        </Router>
    );
}

export default App;
