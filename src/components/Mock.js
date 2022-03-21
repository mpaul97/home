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

//Team Objects
class TeamPlayer {
    constructor(playerType, playerName) {
        this.playerType = playerType;
        this.playerName = playerName;
    }
}
  
class TeamObj {
    constructor(teamNum, qbs, rbs, wrs, tes, flexes, ks, dsts, bench) {
        this.teamNum = teamNum;
        this.qbs = qbs;
        this.rbs = rbs;
        this.wrs = wrs;
        this.tes = tes;
        this.flexes = flexes;
        this.ks = ks;
        this.dsts = dsts;
        this.bench = bench;
    }
}

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

function initTeams(qbSize, rbSize, wrSize, teSize, flexSize, kSize, dstSize, benchSize, leagueSize) {
    let teams = [];
    for (var i = 0; i < leagueSize; i++) {
        let team = new TeamObj();
        //team num
        team.teamNum = i + 1;
        //qbs
        let qbs = Array.from({length: qbSize}, (_, i) => i + 1).map((i) => new TeamPlayer('QB', ''));
        team.qbs = qbs;
        //rbs
        let rbs = Array.from({length: rbSize}, (_, i) => i + 1).map((i) => new TeamPlayer('RB', ''));
        team.rbs = rbs;
        //wrs
        let wrs = Array.from({length: wrSize}, (_, i) => i + 1).map((i) => new TeamPlayer('WR', ''));
        team.wrs = wrs;
        //tes
        let tes = Array.from({length: teSize}, (_, i) => i + 1).map((i) => new TeamPlayer('TE', ''));
        team.tes = tes;
        //flexes
        let flexes = Array.from({length: flexSize}, (_, i) => i + 1).map((i) => new TeamPlayer('FLEX', ''));
        team.flexes = flexes;
        //ks
        let ks = Array.from({length: kSize}, (_, i) => i + 1).map((i) => new TeamPlayer('K', ''));
        team.ks = ks;
        //dsts
        let dsts = Array.from({length: dstSize}, (_, i) => i + 1).map((i) => new TeamPlayer('DST', ''));
        team.dsts = dsts;
        //bench
        let bench = Array.from({length: benchSize}, (_, i) => i + 1).map((i) => new TeamPlayer('BEN', ''));
        team.bench = bench;
        teams.push(team);
    }
    return teams;
};

function Mock() {
    //Queue info
    const leagueSize = 12;
    const playersSize = 2;
    const queuePosition = 4;
    const leagueType = 'STD';

    // Build teams
    const qbSize = 1;
    const rbSize = 2;
    const wrSize = 2;
    const teSize = 1;
    const flexSize = 1;
    const kSize = 1;
    const dstSize = 1;
    const benchSize = 7;

    const [teamObjs, setTeamObjs] = useState(initTeams(qbSize, rbSize, wrSize, teSize, flexSize, kSize, dstSize, benchSize, leagueSize));

    // Players from JSON
    var allPlayers = JSON.parse(JSON.stringify(tempPlayers));

    if (leagueType == 'STD') {
        allPlayers = JSON.parse(JSON.stringify(playersStd));
    }

    const [favPlayers, setFavPlayers] = useState([]);

    //Set Player on Favorite
    const handleFavorite = (name) => {
        setFavPlayers([...favPlayers, name]);
    };

    const handleRemoveFav = (name) => {
        setFavPlayers(favPlayers.filter(val => val !== name));
    };

    // Start timer/draft
    const [currDrafter, setCurrDrafter] = useState(1);

    const [startClicked, setStartClicked] = useState(false);

    var timerInterval = 2;
    const [timerNum, setTimerNum] = useState(timerInterval);

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

    const [round, setRound] = useState(1);

    //*************************************
    //Draft Logic
    const computerDraft = () => {
        let p = allPlayers[0].name;
        allPlayers = allPlayers.filter(x => x.name !== p);
        alert(allPlayers[0].name);
    };

    useEffect(() => {
        if (timerNum === 0) {
            if (queuePosition !== currDrafter) { //computer
                computerDraft();
            }
            setCurrDrafter(currDrafter + 1);
            setTimerNum(timerInterval);
        }
    })

    return (
        <div className="mock-container">
            <div className="header">
                <h1 className="title">Minute Mock</h1>
                <div className="header-info">
                    <div className="start-container">
                        <button 
                            className="start-button" 
                            onClick={() => handleStart()}
                            id={startClicked ? 'hide-start' : ''}
                        >
                            Start
                        </button>
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
                    <div className="team-players-container">
                        <Team 
                            teamInfo={teamInfo}
                            leagueSize={leagueSize}
                            queuePosition={queuePosition}
                            teamObjs={teamObjs}
                        />
                    </div>
                </div>
                <div className="player-container">
                    <Player 
                        fav={handleFavorite}
                        favPlayers={favPlayers}
                        allPlayers={allPlayers}
                        queuePosition={queuePosition}
                        currDrafter={currDrafter}
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