"use client";
import { useState } from "react";

export default function SetupPage() {
  const [teamName, setTeamName] = useState(""); 
  
  function handleTeamNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTeamName(event.target.value);
  }
  
  function tryBeginGame() {
    if (teamName.trim() === "") {
      alert("Please enter a team name to begin the game.");
      return;
    }
    // Logic to start the game, e.g., redirect to the first clue page
    window.location.href = `/clue_1?team=${encodeURIComponent(teamName)}`;
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background font-sans text-foreground">
      <h1 className="pt-12 text-5xl font-serif tracking-wide text-center">
        Before You Begin
      </h1>
      <h2 className="m-6 mb-12 mt-12 text-2xl text-center">
        A couple of things before we start the game.<br/><br/>
        First, there is no need to open any drawers, cabinets, or other private areas in search of clues.<br/><br/>
        All objects will be accessible and in plain sight.<br/><br/>
        Second, in order for us to keep track of your progress, please provide a team name below.<br/><br/>
        Create a team name and get ready to start your adventure!
      </h2>
      <input type="text" placeholder="Enter your team name" className="p-2 border border-gray-300 rounded w-64" onChange={handleTeamNameChange} />
      <button className="text-2xl mt-6 px-4 py-2 underline" onClick={tryBeginGame}>Begin Game</button>
    </div>
  );
}