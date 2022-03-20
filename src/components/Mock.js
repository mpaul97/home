import "./Mock.css";
import PlayerQueue from "./PlayerQueue";
import Team from "./Team";
import Player from "./Players";
import tempPlayers from '../assets/placeholder.json';
import playersStd from '../assets/tempData_std.json';
import playersPpr from '../assets/tempData_ppr.json';
import playersHalf from '../assets/tempData_half.json';
import playersKings from '../assets/tempData_kings.json';
import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Favorites from "./Favorites";

//Team Info
const teamInfo = [
    {
        name: 'QB',
        num: 1
    },
    {
        name: 'RB',
        num: 2
    },
    {
        name: 'WR',
        num: 2
    },
    {
        name: 'TE',
        num: 1
    },
    {
        name: 'FLEX',
        num: 1
    },
    {
        name: 'K',
        num: 1
    },
    {
        name: 'DST',
        num: 1
    },
    {
        name: 'BEN',
        num: 7
    }
]

function Mock() {
    //Queue info
    const leagueSize = 12;
    const playersSize = 2;
    const queuePosition = 4;
    const leagueType = 'STD';

    // Players from JSON
    var allPlayers = JSON.parse(JSON.stringify(tempPlayers));

    if (leagueType == 'STD') {
        allPlayers = JSON.parse(JSON.stringify(playersStd));
    }

    const [currDrafter, setCurrDrafter] = useState(1);

    const [startClicked, setStartClicked] = useState(false);
    const [timerNum, setTimerNum] = useState(10);

    const [favPlayers, setFavPlayers] = useState([]);

    //Set Player on Favorite
    const handleFavorite = (name) => {
        setFavPlayers([...favPlayers, name]);
    };

    const handleRemoveFav = (name) => {
        setFavPlayers(favPlayers.filter(val => val !== name));
    };

    // Start timer/draft
    const handleStart = () => {
        setStartClicked(true);
    };

    useEffect(() => {
        let timer = null;
        if (startClicked) {
            timer = setInterval(() => {
                setTimerNum(timerNum - 1);
            }, 1000);
        };
        return () => {
            clearInterval(timer);
        };
    });

    //Draft
    const computerDraft = (teamNum) => {
        
    };

    useEffect(() => {
        if (timerNum === 0) {
            if (queuePosition !== currDrafter) {
                computerDraft(currDrafter);
            }
            setTimerNum(10);
        }
    })

    return (
        <div className="mock-container">
            <div className="header">
                <h1 className="title">Minute Mock</h1>
                <div className="header-info">
                    <div className="start-container">
                        <button className="start-button" onClick={() => handleStart()}>Start</button>
                    </div>
                    <div className="timer-container">
                        <h3 className="timer">
                            0:{timerNum.toString().length===1 ? "0" + timerNum : timerNum}
                        </h3>
                    </div>
                </div>
            </div>
            <div className="player-queue">
                <PlayerQueue
                    leagueSize={leagueSize}
                    playersSize={playersSize}
                    queuePosition={queuePosition}
                />
            </div>
            <div className="content-container">
                <div className="team-container">
                    <h2 className="subtitle">Team {queuePosition} </h2>
                    <div className="team-players-container">
                        <Team 
                            teamInfo={teamInfo}
                            leagueSize={leagueSize}
                        />
                    </div>
                </div>
                <div className="player-container">
                    <Player 
                        fav={handleFavorite}
                        favPlayers={favPlayers}
                        allPlayers={allPlayers}
                    />
                </div>
                <div className="favorites-container">
                    <h2 className="subtitle">Favorites</h2>
                    <Favorites 
                        favPlayers={favPlayers}
                        handleRemoveFav={handleRemoveFav}
                    />
                </div>
            </div>
        </div>
    );
}

export default Mock;