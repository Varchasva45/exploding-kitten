// StartGame.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { startGame, setUsername, stopGame } from '../gameSlice';
import { Button } from './ui/button';

const StartGame = () => {
    const gameStatus = useSelector((state) => state.game.gameStatus);
    const dispatch = useDispatch();

    const deck = ['boom', 'shuffle', 'cat', 'defuse'];

    const shuffleArray = (array) => array.sort(() => Math.random() - 0.4);

    const handleStartGame = async () => {
        try {
            const shuffledDeck = shuffleArray(deck);
            console.log('deck: ', shuffledDeck);
            dispatch(startGame({ deck: deck }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleStopGame = async () => {
        try {
            dispatch(stopGame());
            console.log('game stopped');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if(gameStatus === 'idle'){
            setTimeout(() => {
            handleStartGame();
            }, 250);
        }
    },[gameStatus]);


    return (
        <div className=' pb-20 flex justify-start items-start gap-4 p-5'>
            <Button onClick={handleStartGame} className="font-press-start h-12">Start Game 🟢</Button>
            <Button onClick={handleStopGame} className="font-press-start h-12">Stop Game 🛑</Button>
        </div>
    );
};
export default StartGame;