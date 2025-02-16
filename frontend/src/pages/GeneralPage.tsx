import { useEffect, useState } from 'react';

const GeneralPage = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const user_id = 1; 
            // Коли зробим логін-сторінку, то ми звертатимось до бд 
            // та перевірятимемо чи є юзер там. 
            // Якщо та - забиратимемо id звідти
            const url = `http://127.0.0.1:5000/?user_id=${user_id}&_=${Date.now()}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.message) {
                    setMessage(data.message);
                } else if (data.error) {
                    setError(data.error);
                } else {
                    setMessage("Welcome to the homepage!");
                }
            } catch (error) {
                setError('Failed to fetch data');
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h1>{message}</h1>
        </div>
    );
};

export default GeneralPage;