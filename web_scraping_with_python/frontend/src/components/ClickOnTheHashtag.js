import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ClickOnTheHashtag = () => {

    const { hashtag } = useParams();
    const [data, setData] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/get-hashtag?hashtag=${hashtag}`);
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                setData(error);
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleOnClickBack = () => {
        navigate("/search");
    }



    return (
        <div>
            <button onClick={handleOnClickBack}>Back</button>
            <h1>Data from the Database</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default ClickOnTheHashtag;
