import React, { useState } from 'react';

const SearchPage = () => {


    const [searchTerm, setSearchTerm] = useState('');
    const [hashtagData, setHashtagData] = useState(null);
    const[loading, setLoading] = useState(false)


    const handleOnSave=()=>{
        fetch('/api/create-hashtag', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(hashtagData),
          })
    }

    const handleSearchClick = () => {
        setLoading(true)
        console.log("inside search click")
        console.log('Hashtag search', searchTerm);
        fetch(`/api/search?key=${searchTerm}`, { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setLoading(false)
                setHashtagData(data)})
            .catch(error => console.error('Error during fetch:', error));
    };

    const handleCategoryClick = (category) => {
        // Perform search based on the searchTerm
        console.log('Category search', category);
    };

    const handleOnHashtagClick = (hashtag) => {
        console.log('Hashtag search', hashtag);
        fetch(`/api/get-hashtag?hashtag=${hashtag}`, { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setHashtagData(data))
            .catch(error => console.error('Error during fetch:', error));
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
                <button onClick={handleSearchClick}>Search</button>
            </div>
            {!searchTerm && <p>Please enter term into the search box</p>}
            {loading && <p>Loading .... .... .... .... .... .... ....</p>}
            <div>
                <h3>Predefined Hashtags:</h3>
                <div>
                    <button onClick={() => handleOnHashtagClick('imVKholi')}>#imVKohli</button>
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
            {hashtagData && (
                <div>
                    <h3>Hashtag Data:</h3>
                    <pre>{JSON.stringify(hashtagData, null, 2)}</pre>
                    <button onClick={handleOnSave}>Save</button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
