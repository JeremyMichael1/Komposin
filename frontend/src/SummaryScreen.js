import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SummaryScreen.css';
import { FiArrowRight, FiPlusCircle, FiMinusCircle, FiEdit, FiCheck } from 'react-icons/fi';

const IS_TESTING = false;

function SummaryScreen() {
    const [objects, setObjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const imageName = location.state?.imageName || '';
    const hasFetched = useRef(false);

    useEffect(() => {
        const fetchSummary = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;

            try {
                if (IS_TESTING) {
                    const dummyData = [
                        { object_name: 'Apple', DaysExpired: 5 },
                        { object_name: 'Tomato', DaysExpired: 2 },
                        { object_name: 'Grape', DaysExpired: 7 },
                        { object_name: 'Banana', DaysExpired: 3 },
                    ];
                    setObjects(dummyData);
                } else {
                    const detectResponse = await fetch(`https://backend.simpenin.com/api/v1/image_detection?image_url=${encodeURIComponent(imageName)}`, {
                        method: 'GET',
                        headers: { 
                            'Content-Type': 'application/json' 
                        }
                    });

                    const responseData = await detectResponse.json();
                    console.log(responseData);

                    if (responseData.objects) {
                        setObjects(responseData.objects.map(obj => ({
                            object_name: obj.object_name,
                            DaysExpired: obj.day_expired,
                            Qty: '',
                            UOM: '',
                        })));
                    } else {
                        setErrorMessage('No objects detected.');
                    }
                }
            } catch (error) {
                console.error('Error fetching summary data:', error);
                setErrorMessage('An error occurred while fetching data.');
            }
        };

        fetchSummary();
    }, [imageName]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleObjectChange = (index, key, value) => {
        const updatedObjects = [...objects];
        updatedObjects[index][key] = value;
        setObjects(updatedObjects);
    };

    const handleAddObject = () => {
        setObjects([...objects, { object_name: '', Qty: '', UOM: '', DaysExpired: '' }]);
    };

    const handleDeleteObject = (index) => {
        const updatedObjects = objects.filter((_, i) => i !== index);
        setObjects(updatedObjects);
    };

    const handleSave = () => {
        setIsEditing(false);  // Return to non-edit mode
    };

    const handleSubmit = async () => {
        const userId = 1; // Replace with the actual user ID if needed
        const currentDate = new Date().toISOString();
        const dataToSubmit = objects.map(obj => ({
            ProductName: obj.object_name,
            Qty: obj.Qty || 0, // Default to 0 if Qty is not provided
            UOM: obj.UOM || '', // Default to empty string if UOM is not provided
            Created: currentDate,
            DaysExpired: obj.DaysExpired,
            DueDate: new Date(Date.now() + obj.DaysExpired * 24 * 60 * 60 * 1000).toISOString(),
        }));
    
        const insertQueries = dataToSubmit.map(obj => 
            `INSERT INTO M_Product (User_ID, Product_Name, Created, Days_Expired, Qty, UOM, Due_Date) VALUES (${userId}, '${obj.ProductName}', '${obj.Created}', ${obj.DaysExpired}, ${obj.Qty}, '${obj.UOM}', '${obj.DueDate}');`
        ).join('\n');
    
        console.log(insertQueries); // Log the queries to the console for debugging or sending to the backend
        console.log(JSON.stringify({ queries: insertQueries }));
        try {
            const response = await fetch('https://backend.simpenin.com/api/v1/insert_db', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ queries: insertQueries })
            });
            if (response.ok) {
                alert('Objects submitted to the database successfully!');
                navigate('/home'); // Redirect to the next step or screen
            } else {
                alert('Failed to submit objects.');
            }
        } catch (error) {
            console.error('Error submitting objects:', error);
            alert('An error occurred while submitting.');
        }
    };

    return (
        <div className="summary-screen">
            <h1>Detected Products</h1>
            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}
            <table className="objects-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>UOM</th>
                        <th>Days to Expire</th>
                        {isEditing && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {objects.map((obj, index) => (
                        <tr key={index}>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={obj.object_name}
                                        onChange={(e) => handleObjectChange(index, 'object_name', e.target.value)}
                                    />
                                ) : (
                                    obj.object_name
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={obj.Qty}
                                        onChange={(e) => handleObjectChange(index, 'Qty', e.target.value)}
                                    />
                                ) : (
                                    obj.Qty
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={obj.UOM}
                                        onChange={(e) => handleObjectChange(index, 'UOM', e.target.value)}
                                    />
                                ) : (
                                    obj.UOM
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={obj.DaysExpired}
                                        onChange={(e) => handleObjectChange(index, 'DaysExpired', e.target.value)}
                                    />
                                ) : (
                                    obj.DaysExpired
                                )}
                            </td>
                            {isEditing && (
                                <td>
                                    <FiMinusCircle 
                                        className="action-icon delete-icon"
                                        onClick={() => handleDeleteObject(index)} 
                                    />
                                </td>
                            )}
                        </tr>
                    ))}
                    {isEditing && (
                        <tr>
                            <td colSpan="5">
                                <FiPlusCircle 
                                    className="action-icon add-icon"
                                    onClick={handleAddObject}
                                />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="button-group">
                {isEditing ? (
                    <FiCheck 
                        className="btn-save"
                        onClick={handleSave}
                    />
                ) : (
                    <FiEdit 
                        className="btn-edit"
                        onClick={handleEditToggle}
                    />
                )}
                <FiArrowRight 
                    className="btn-arrow"
                    onClick={handleSubmit}  // This will submit the data to the backend
                />
                <button 
                    className="btn-scan-more"
                    onClick={() => navigate('/camera', { replace: true })}
                >
                    Scan More!
                </button>
            </div>
        </div>
    );
}

export default SummaryScreen;
