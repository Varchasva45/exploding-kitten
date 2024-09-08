import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import kitty from '/kitty.svg';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from "react";
import { setUsername } from "@/gameSlice";



const Landing = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUser] = useState('');

    const handleClick = (e) => {
        e.preventDefault();
        dispatch(setUsername(username));
        navigate('/deck');
    }

    return (
        <div className="w-full min-h-[100dvh] bg-custom-gradient bg-custom-size flex flex-col items-center justify-center px-4 md:px-6">
          <div className="max-w-[800px] w-full flex flex-col items-center justify-center space-y-8">
            <div className="flex flex-col items-center space-y-2 animate-bounce">
              <img
                src={kitty}
                width={200}
                height={200}
                alt="Exploding Kittens"
                className="w-[200px] h-[200px]"
                style={{ aspectRatio: "200/200", objectFit: "cover" }}
              />
              <h1 className="text-4xl text-black font-bold font-press-start">Exploding Kittens</h1>
            </div>
            <div className="w-full max-w-[400px] bg-[#f1f2f6] rounded-lg p-6 shadow-lg">
              <form className="flex flex-col space-y-4">
                <label htmlFor="username" className="text-sm font-medium text-[#2f3542] font-press-start">
                  Enter your username:
                </label>
                <div className="relative font-press-start">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUser(e.target.value)}
                    type="text"
                    placeholder="Username"
                    className="w-full rounded-lg px-4 py-2 text-[#2f3542] focus:outline-none focus:ring-2 focus:ring-[#ff6b81] focus:ring-opacity-50 transition-all duration-300 ease-in-out"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#2f3542] font-press-start">
                    <UserIcon className="h-5 w-5" />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-lg bg-[#ff6b81] text-[#f1f2f6] px-4 py-2 font-medium transition-colors duration-300 ease-in-out hover:bg-[#ff4d6d] font-press-start"
                  onClick={handleClick}
                >
                  Start Playing
                </Button>
              </form>
            </div>
          </div>
        </div>
      )
};

function UserIcon(props) {
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
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  }
export default Landing;