import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    deck: [],
    cardDrawn: null,
    defuseCards: 0,
    gameStatus: 'stop', // 'idle', 'started', 'won', 'lost', 'stop'
    username: '',
    leaderboard: [],
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        stopGame: (state) => {
            state.gameStatus = 'stop';
            state.deck = [];
            state.cardDrawn = null;
            state.defuseCards = 0;
        },
        startGame: (state, action) => {
            state.cardDrawn = null,
            state.deck = action.payload.deck;
            state.defuseCards = 0;
            state.gameStatus = 'started';
        },
        drawCard: (state) => {
            const drawnCard = state.deck.pop();
            state.cardDrawn = drawnCard;
            if (drawnCard === 'boom') {
                if (state.defuseCards > 0) {
                    state.defuseCards--;
                } else {
                    state.gameStatus = 'lost';
                }
            } else if (drawnCard === 'cat') {
                // Remove the cat card
            } else if (drawnCard === 'defuse') {
                state.defuseCards++;
            } else if (drawnCard === 'shuffle') {
                state.gameStatus = 'idle';
            }

            if (state.deck.length === 0 && state.gameStatus !== 'lost') {
                state.gameStatus = 'won';
            }
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setLeaderboard: (state, action) => {
            state.leaderboard = action.payload;
        },
    },
});

export const { startGame, drawCard, setUsername, setLeaderboard, stopGame } = gameSlice.actions;
export default gameSlice.reducer;
