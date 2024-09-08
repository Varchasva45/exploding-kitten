// Deck.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { drawCard, stopGame } from '../gameSlice';
import { Button } from './ui/button';
import unknown from '/unknown.svg';
import StartGame from './StartGame';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from './ui/animated-modal';
import { motion } from 'framer-motion';
import ConfettiExplosion from 'react-confetti-explosion';

const Deck = () => {
    const dispatch = useDispatch();
    const gameStatus = useSelector((state) => state.game.gameStatus);
    const username = useSelector((state) => state.game.username);
    const deck = useSelector((state) => state.game.deck);
    const cardDrawn = useSelector((state) => state.game.cardDrawn);
    const totalCards = 4;
    const [revealedCards, setRevealedCards] = useState(Array(totalCards).fill(null));
    const [hasWon, setHasWon] = useState(false);

    const handleDrawCard = () => {
      dispatch(drawCard());        
    };

    useEffect(()=>{
      updateState();
    }, [cardDrawn])

    useEffect(() => {
      if(gameStatus === 'started'){
        return;
      }

      if (gameStatus === 'won') {
        setHasWon(true);
        setTimeout(() => {    
          document.getElementById('win').click();
          dispatch(stopGame())
          setHasWon(false);
        }, 1000);

      } else if (gameStatus === 'lost') {
        setTimeout(() => {
          document.getElementById('loose').click();
          dispatch(stopGame());
        }, 500);
      }
      setTimeout(() =>{
      setRevealedCards(Array(totalCards).fill(null));
      }, 250);
    }, [gameStatus]);

    
    const updateState = () =>{
      const nextIndex = totalCards - deck.length;
      console.log('nextIndex: ', nextIndex);
      console.log('cardDrawn: ', cardDrawn);

      if (nextIndex <= totalCards) {
        setRevealedCards((prev) => {
          const updatedCards = [...prev];
          updatedCards[nextIndex - 1] = cardDrawn;
          return updatedCards;
        });
      };
    }

    

    const renderCard = (card) => {
      // If the card hasn't been drawn, show a placeholder with "???"
      if (card === null) {
        return (
          <>
            <img className="w-24 h-24" src={unknown} alt="Hidden Card" />
            <h3 className="text-lg font-bold mt-4 font-press-start">???</h3>
          </>
        );
      }
  
      // If the card has been drawn, render it based on its type
      switch (card) {
        case 'cat':
          return (
            <>
              <CatIcon className="w-24 h-24 text-[#ff69b4]" />
              <h3 className="text-lg font-bold mt-4 font-press-start">Cat</h3>
            </>
          );
        case 'defuse':
          return (
            <>
              <DiffIcon className="w-24 h-24 text-[#00bfff]" />
              <h3 className="text-lg font-bold mt-4 font-press-start">Defuse</h3>
            </>
          );
        case 'shuffle':
          return (
            <>
              <ShuffleIcon className="w-24 h-24 text-[#9370db]" />
              <h3 className="text-lg font-bold mt-4 font-press-start">Shuffle</h3>
            </>
          );
        case 'boom':
          return (
            <>
              <BombIcon className="w-24 h-24 text-[#ff6347]" />
              <h3 className="text-lg font-bold mt-4 font-press-start">Bomb</h3>
            </>
          );
        default:
          return null;
      }
    };


    return (
      <div className='flex'>
        <StartGame />
        {hasWon && <ConfettiExplosion />}
        <div className="flex flex-col items-center justify-center h-screen">
          
          <h1 className="text-3xl font-bold text-white mb-8 font-press-start">
            {gameStatus === 'won' ? 'You Win ✌️' : gameStatus == 'lost' ? 'You lost buddy 😒' : 'Draw a Card 😊'}
          </h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {revealedCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
              {renderCard(card)}
            </div>
          ))}
        </div>
        <Button size="lg" className="mt-8 animate-bounce font-press-start h-12" onClick={handleDrawCard} disabled={gameStatus === 'stop'}>
          Draw a Card
        </Button>
        <Modal>
          <ModalTrigger>
            <button  id='win' className='hidden'>Win</button>
          </ModalTrigger>
          <ModalBody>
            <ModalContent>
              <h1 className='text-5xl font-bold font-press-start text-center'>You Win 🚩</h1>
            </ModalContent>
          </ModalBody>
        </Modal>

        <Modal>
          <ModalTrigger>
          <button id='loose'className='hidden'>Loose</button>
          </ModalTrigger>
          <ModalBody>
            <ModalContent>
            <h1 className='text-5xl font-bold font-press-start text-center'>You Loose ☠️</h1>
            </ModalContent>
          </ModalBody>
        </Modal>
      </div>
      <div className="relative flex flex-col justify-center items-center pl-10">
          <img
          src="https://www.svgrepo.com/show/443128/brand-hello-kitty.svg"
          alt="Hello Kitty"
          className="w-48 h-48 animate-bounce"
          />
          <h1 className="text-lg font-bold text-pink-600">Hey {username}, Let's Play!</h1>
        </div>
      </div>
    );
};

function BombIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="13" r="9" />
        <path d="M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95" />
        <path d="m22 2-1.5 1.5" />
      </svg>
    )
}

function CatIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
        <path d="M8 14v.5" />
        <path d="M16 14v.5" />
        <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
      </svg>
    )
  }
  
  
  function DiffIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v14" />
        <path d="M5 10h14" />
        <path d="M5 21h14" />
      </svg>
    )
  }
  
  
  function ShuffleIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
        <path d="m18 2 4 4-4 4" />
        <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
        <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
        <path d="m18 14 4 4-4 4" />
      </svg>
    )
  }

export default Deck;
