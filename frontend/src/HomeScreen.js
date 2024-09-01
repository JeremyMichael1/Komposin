import React, { useEffect, useState, useRef } from 'react';
import './HomeScreen.css';
import { FiCamera, FiChevronUp, FiChevronDown, FiMoreHorizontal, FiFlag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function HomeScreen() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [products, setProducts] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'product_name', direction: 'ascending' });
    const [flaggedItems, setFlaggedItems] = useState([]);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);  // Track loading state
    const navigate = useNavigate();
    const hasFetchedData = useRef(false);

    useEffect(() => {
        if (hasFetchedData.current) return;  // Prevent multiple API calls
        hasFetchedData.current = true;       // Set it to true once the API call is made

        setIsLoaded(true);

        // Fetching the data from the API endpoint with appropriate headers
        fetch('https://backend.simpenin.com/api/v1/get_data_all', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            setProducts(data);
            checkForExpiringItems(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    const checkForExpiringItems = (data) => {
        const expiringItems = data.filter(item => item.days_left < 3);
        if (expiringItems.length > 0) {
            setNotification(expiringItems.map(item => item.product_name).join(', ') + ' are expiring soon!');
        }
    };

    const getCurrentGreeting = () => {
        const hours = new Date().getHours();
        if (hours < 12) return 'Good Morning';
        if (hours < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const handleTakePhoto = () => {
        navigate('/camera');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleEdit = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedProducts = [...products].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setProducts(sortedProducts);
    };

    const handleFlagClick = (productName) => {
        setFlaggedItems(prev => {
            if (prev.includes(productName)) {
                return prev.filter(item => item !== productName);
            } else {
                return [...prev, productName];
            }
        });
    };

    const handleGenerateRecipe = async () => {
        if (flaggedItems.length > 0) {
            const objectParam = flaggedItems.join(',');
            setLoading(true);  // Show spinner
    
            try {
                const response = await fetch(`https://backend.simpenin.com/api/v1/generate_recipe?object=${encodeURIComponent(objectParam)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': '*/*'
                    }
                });
    
                if (response.ok) {
                    const data = await response.text(); // Parse the response as text since it's HTML
                    navigate('/summary-recipe', { state: { details: data } });
                } else {
                    console.error('Failed to fetch recipe details');
                }
            } catch (error) {
                console.error('Error fetching recipe details:', error);
            } finally {
                setLoading(false);  // Hide spinner
            }
        } else {
            alert('Please flag at least one product to generate a recipe.');
        }
    };

    const handleShowMore = async (productName) => {
        setLoading(true);  // Show spinner
        try {
            const response = await fetch(`https://backend.simpenin.com/api/v1/object_todo?object=${encodeURIComponent(productName)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': '*/*'
                }
            });

            if (response.ok) {
                const data = await response.text(); // Parse the response as text since it's HTML
                navigate('/waste-management-suggestion', { state: { productName, details: data } });
            } else {
                console.error('Failed to fetch more details');
            }
        } catch (error) {
            console.error('Error fetching more details:', error);
        } finally {
            setLoading(false);  // Hide spinner
        }
    };

    const filteredProducts = products.filter(product =>
        product.product_name.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className={`home-screen ${isLoaded ? 'loaded' : ''}`}>
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <header className="home-header">
                <img 
                    src="/PantryPal.png" 
                    alt="Komposin Logo" 
                    className="logo" 
                    onClick={handleLogoClick} 
                />
                <h1>{getCurrentGreeting()}, User!</h1>
                <p>Welcome to Simpenin, your eco-friendly waste management assistant.</p>
            </header>

            <input
                type="text"
                placeholder="Search products..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="search-input"
            />

            {notification && (
                <div className="notification">
                    <span>{notification}</span>
                    <button onClick={() => setNotification(null)}>Close</button>
                </div>
            )}

            <div className="product-table">
                {filteredProducts.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('product_name')}>
                                    Product Name {sortConfig.key === 'product_name' && (sortConfig.direction === 'ascending' ? <FiChevronUp /> : <FiChevronDown />)}
                                </th>
                                <th onClick={() => handleSort('qty')}>
                                    Quantity {sortConfig.key === 'qty' && (sortConfig.direction === 'ascending' ? <FiChevronUp /> : <FiChevronDown />)}
                                </th>
                                <th>UOM</th>
                                <th onClick={() => handleSort('due_date')}>
                                    Due Date {sortConfig.key === 'due_date' && (sortConfig.direction === 'ascending' ? <FiChevronUp /> : <FiChevronDown />)}
                                </th>
                                <th onClick={() => handleSort('days_left')}>
                                    Days Left {sortConfig.key === 'days_left' && (sortConfig.direction === 'ascending' ? <FiChevronUp /> : <FiChevronDown />)}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, index) => (
                                <tr key={index} className={product.days_left <= 2 ? 'expiring-soon' : ''}>
                                    <td>
                                        <FiFlag 
                                            className={`flag-icon ${flaggedItems.includes(product.product_name) ? 'flagged' : ''}`} 
                                            onClick={() => handleFlagClick(product.product_name)} 
                                        />
                                        {product.product_name}
                                    </td>
                                    <td
                                        contentEditable
                                        onBlur={e => handleEdit(index, 'qty', parseFloat(e.target.textContent))}
                                    >{product.qty}</td>
                                    <td>{product.uom}</td>
                                    <td>{new Date(product.due_date).toLocaleDateString()}</td>
                                    <td>{formatDistanceToNow(new Date(product.due_date))}</td>
                                    <td>
                                        <FiMoreHorizontal 
                                            className="show-more-icon"
                                            onClick={() => handleShowMore(product.product_name)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-data">No Data Available</div>
                )}
            </div>

            <div className="button-group">
                <button 
                    className="btn-generate-recipe" 
                    onClick={handleGenerateRecipe}
                >
                    <FiFlag /> Generate Recipe
                </button>
            </div>

            <footer className="bottom-footer">
                <FiCamera className="camera-icon" onClick={handleTakePhoto} />
            </footer>
        </div>
    );
}

export default HomeScreen;
