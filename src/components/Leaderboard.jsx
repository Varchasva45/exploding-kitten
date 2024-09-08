// Leaderboard.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setLeaderboard } from '../gameSlice';

const Leaderboard = () => {
    // const dispatch = useDispatch();
    // const leaderboard = useSelector((state) => state.game.leaderboard);

    // useEffect(() => {
    //     const fetchLeaderboard = async () => {
    //         try {
    //             const response = await axios.get('/api/leaderboard');
    //             dispatch(setLeaderboard(response.data));
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    //     fetchLeaderboard();
    // }, [dispatch]);

    return (
        <div>
            <h2>Leaderboard</h2>
            <ul>
                hello
            </ul>
        </div>
    );
};

export default Leaderboard;

