import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [hashtagData, setHashtagData] = useState(null);
    const[loading, setLoading] = useState(false)


    const handleOnSave=()=>{
        
        console.log(hashtagData)
        const dict = hashtagData.data
        console.log(JSON.stringify({
            "hashtag": dict['hashtag'],
            "hashtag_stats": [
                {
                    "user": dict['hashtag_stats'][0]['user'],
                    "youtube_stats": dict['hashtag_stats'][0]['youtube_stats']?null:{},
                    "instagram_stats": {
                        "followers": dict['hashtag_stats'][0]['instagram_stats']['followers'],
                        "followings": dict['hashtag_stats'][0]['instagram_stats']['followings'],
                        "posts": dict['hashtag_stats'][0]['instagram_stats']['posts'],
                    },
                    "twitter_stats": {
                        "followers": dict['hashtag_stats'][0]['twitter_stats']['followers'],
                        "followings": dict['hashtag_stats'][0]['twitter_stats']['followings'],
                        "joining_date":dict['hashtag_stats'][0]['twitter_stats']['joining_date'],
                        "comments": [
                            {
                            //     "likes": data['hashtag_stats'][0]['twitter_stats']['comments'][0]['likes'],
                            //     "retweets": data['hashtag_stats'][0]['twitter_stats']['comments'][0]['retweets'],
                            //     "comment_date": data['hashtag_stats'][0]['twitter_stats']['comments'][0]['comment_date']
                            // },
                            // {
                            //     "likes": data['hashtag_stats'][0]['twitter_stats']['comments'][1]['likes'],
                            //     "retweets": data['hashtag_stats'][0]['twitter_stats']['comments'][1]['retweets'],
                            //     "comment_date": data['hashtag_stats'][0]['twitter_stats']['comments'][1]['comment_date']
                            }
                        ]
                    }
                }
            ]
        }))
        fetch('/api/create-hashtag', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "hashtag": dict['hashtag'],
                "hashtag_stats": [
                    {
                        "user": dict['hashtag_stats'][0]['user'],
                        "youtube_stats": dict['hashtag_stats'][0]['youtube_stats']?dict['hashtag_stats'][0]['youtube_stats']:'{}',
                        "instagram_stats": {
                            "followers": dict['hashtag_stats'][0]['instagram_stats']['followers'],
                            "followings": dict['hashtag_stats'][0]['instagram_stats']['followings'],
                            "posts": dict['hashtag_stats'][0]['instagram_stats']['posts'],
                        },
                        "twitter_stats": {
                            "followers": dict['hashtag_stats'][0]['twitter_stats']['followers'],
                            "followings": dict['hashtag_stats'][0]['twitter_stats']['followings'],
                            "joining_date":dict['hashtag_stats'][0]['twitter_stats']['joining_date'],
                            "comments": [
                                {
                                //     "likes": data['hashtag_stats'][0]['twitter_stats']['comments'][0]['likes'],
                                //     "retweets": data['hashtag_stats'][0]['twitter_stats']['comments'][0]['retweets'],
                                //     "comment_date": data['hashtag_stats'][0]['twitter_stats']['comments'][0]['comment_date']
                                // },
                                // {
                                //     "likes": data['hashtag_stats'][0]['twitter_stats']['comments'][1]['likes'],
                                //     "retweets": data['hashtag_stats'][0]['twitter_stats']['comments'][1]['retweets'],
                                //     "comment_date": data['hashtag_stats'][0]['twitter_stats']['comments'][1]['comment_date']
                                }
                            ]
                        }
                    }
                ]
            }),
          }
          ).then(response=>console.log(response)).catch(error=>console.log(error))
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

    const handleOnUserProfile = () => {
        navigate('/user-profile/');
    }

    const handleCategoryClick = (category) => {
        // Perform search based on the searchTerm
        console.log('Category search', category);
    };

    // const handleOnHashtagClick = (hashtag) => {
    //     console.log('Hashtag search', hashtag);
    //     fetch(`/api/get-hashtag?hashtag=${hashtag}`, { method: 'GET' })
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error(`Network response was not ok, status: ${response.status}`);
    //             }
    //             return response.json();
    //         })
    //         .then(data => setHashtagData(data))
    //         .catch(error => console.error('Error during fetch:', error));
    // };

    const handleOnHashtagClick = (hashtag) => {
                navigate(`/search-hashtag/${hashtag}`)
    }

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
                </ul>
                <button onClick={handleOnUserProfile}>Profile</button>
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

