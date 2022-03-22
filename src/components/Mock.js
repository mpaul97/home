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
import { useForceUpdate } from "framer-motion";

//TeamPlayer -> player name and type
class TeamPlayer {
    constructor(playerType, playerName) {
        this.playerType = playerType;
        this.playerName = playerName;
    }
}

//AllPlayers
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

// Display selected team
function displayTeam(teamObjs, selectedOption) {
    let selectedTeam = teamObjs.filter(x => x.teamNum === selectedOption);
    let arr = [];
    selectedTeam[0].qbs.map((i) => arr.push(i.playerType + ": " + i.playerName));
    selectedTeam[0].rbs.map((i) => arr.push(i.playerType + ": " + i.playerName));
    selectedTeam[0].wrs.map((i) => arr.push(i.playerType + ": " + i.playerName));
    selectedTeam[0].tes.map((i) => arr.push(i.playerType + ": " + i.playerName));
    selectedTeam[0].flexes.map((i) => arr.push(i.playerType + ": " + i.playerName));
    selectedTeam[0].ks.map((i) => arr.push(i.playerType + ": " + i.playerName));
    selectedTeam[0].dsts.map((i) => arr.push(i.playerType + ": " + i.playerName));
    selectedTeam[0].bench.map((i) => arr.push(i.playerType + ": " + i.playerName));
    return arr;
}

//Init team objects
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

function convertTime(time) {
    var secNum = parseInt(time.toString(), 10);
    var hours = Math.floor(secNum / 3600);
    var minutes = Math.floor((secNum - (hours * 3600)) / 60);
    var seconds = secNum - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
}

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
    // var jsonPlayers = JSON.parse(JSON.stringify(tempPlayers));

    // const [allPlayers, setAllPlayers] = useState([]);

    // setAllPlayers(jsonPlayers);

    // if (leagueType == 'STD') {
    //     jsonPlayers = JSON.parse(JSON.stringify(playersStd));
    //     setAllPlayers(jsonPlayers);
    // }

    // Init Players by league type
    const [allPlayers, setAllPlayers] = useState(() => {
        if (leagueType === 'STD') {
            return JSON.parse(JSON.stringify(playersStd));
        }
    });

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

    //***************************************************
    //***************************************************
    //Team Logic

    const [selectedOption, setSelectedOption] = useState(queuePosition);
    const [flattenTeamObjs, setFlattenTeamObjs] = useState(displayTeam(teamObjs, selectedOption));

    const handleSelectedOption = (e) => {
        setSelectedOption(parseInt(e.target.value));
        setFlattenTeamObjs(displayTeam(teamObjs, parseInt(e.target.value)));
    }

    //***************************************************
    //***************************************************
    //Draft Logic
    const updateTeamObj = (player, teamObj, currDrafter) => {
        let position = player.position;
        if (position === 'QB') {
            
        } else if (position === 'RB') {
            for (var i = 0; i < teamObj[0].rbs.length; i++) {
                if (teamObj[0].rbs[i].playerName === '') {
                    teamObj[0].rbs[i] = new TeamPlayer('RB', player.name);
                    break;
                }
            }
        }
        let index = teamObjs.findIndex(x => x.teamNum === currDrafter);
        let newTeamObjs = [...teamObjs];
        newTeamObjs[index] = teamObj;
        setTeamObjs(newTeamObjs);
    }

    const computerDraft = (currDrafter) => {
        let topPlayer = allPlayers[0];
        let teamObj = teamObjs.filter(x => x.teamNum === currDrafter);
        updateTeamObj(topPlayer, teamObj);
        setAllPlayers(allPlayers.filter(x => x.name !== topPlayer.name));
    };

    useEffect(() => {
        console.log(convertTime(timerNum));
        if (timerNum === 0) {
            if (queuePosition !== currDrafter) { //computer
                computerDraft(currDrafter);
                setTimerNum(timerInterval);
            } else {
                setTimerNum(60);
            }
            setCurrDrafter(currDrafter + 1);
        }
    })

    //***************************************************

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
                            selectedOption={selectedOption}
                            handleSelectedOption={handleSelectedOption}
                            flattenTeamObjs={flattenTeamObjs}
                        />
                    </div>
                </div>
                <div className="player-container">
                    <Player 
                        fav={handleFavorite}
                        favPlayers={favPlayers}
                        queuePosition={queuePosition}
                        currDrafter={currDrafter}
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