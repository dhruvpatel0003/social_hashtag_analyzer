import React, { useState } from 'react';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        // Perform search based on the searchTerm
        console.log('Performing search for:', searchTerm);
    };

    const handleOnHashtagClick = (hashtag) => {
        
       
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter your search term"
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div>
                <h3>Predefined Hashtags:</h3>
                <div>
                    <button onClick={() => handleOnHashtagClick('#imVKohli')}>#imVKohli</button>
                    <button onClick={() => handleOnHashtagClick('#hashtag2')}>#hashtag2</button>
                    <button onClick={() => handleOnHashtagClick('#hashtag3')}>#hashtag3</button>
                    {/* Add more predefined hashtags here */}
                </div>
            </div>
            <div>
                <h3>Categories:</h3>
                <ul>
                    <li>
                        <button onClick={() => handleCategoryClick('YouTube')}>YouTube</button>
                    </li>
                    <li>
                        <button onClick={() => handleCategoryClick('Twitter')}>Twitter</button>
                    </li>
                    <li>
                        <button onClick={() => handleCategoryClick('Instagram')}>Instagram</button>
                    </li>
                    <li>
                        <button onClick={() => handleCategoryClick('Facebook')}>Facebook</button>
                    </li>
                    {/* Add more categories here */}
                </ul>
            </div>
        </div>
    );
};

export default SearchPage;
