import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import {store} from './store';
import Deck from './components/Deck';
import Leaderboard from './components/Leaderboard';
import Landing from './components/Landing';

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <div className='bg-gradient-to-br from-[#FF4081] to-[#F5F4F2]'>
                    {/* Routes should only contain Route or React.Fragment */}
                    <Routes>
                        <Route path="/" element={<Landing/>} />
                        <Route path="/deck" element={<Deck />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
