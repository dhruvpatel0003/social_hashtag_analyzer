import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ClickOnTheHashtag = () => {

    const { hashtag } = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch data from the database
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/get-hashtag?hashtag=${hashtag}`);
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Data from the Database</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default ClickOnTheHashtag;
