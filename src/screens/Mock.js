import "./Mock.css";
import PlayerQueue from "../components/PlayerQueue";
import Team from "../components/Team";
import Player from "../components/Players";
import tempPlayers from '../assets/placeholder.json';
import playersStd from '../assets/tempData_std.json';
import playersPpr from '../assets/tempData_ppr.json';
import playersHalf from '../assets/tempData_half.json';
import playersKings from '../assets/tempData_kings.json';
import { useDebugValue, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Favorites from "../components/Favorites";
import { useForceUpdate, useTime } from "framer-motion";

//*************************************************** */
//****************** Draft Logic ******************** */
//--------------------------------------------------- */

//********************************** */
//************ Classes ************* */

class TeamPlayer {
    constructor(playerType, playerName) {
        this.playerType = playerType;
        this.playerName = playerName;
    }
}

class TeamObj {
    constructor() {
        this.teamNum = null;
        this.qbs = null;
        this.rbs = null;
        this.wrs = null;
        this.tes = null;
        this.flexes = null;
        this.ks = null;
        this.dsts = null;
        this.bench = null;
        this.needs = null;
    }
}

class Need {
    constructor(positionAbbr, weight) {
        this.positionAbbr = positionAbbr;
        this.weight = weight;
    }
}

class QueueObj {
    constructor(round, queueVal) {
        this.round = round;
        this.queueVal = queueVal;
    }
}

//************************************** */
//********** Helper Functions ************ */

function randomFloatInRange(min, max) {
    const str = (Math.random() * (max - min) + min);
    return parseFloat(str);
};

function choice(events, size, probability) {
    if (probability != null) {
        const pSum = probability.reduce((a, b) => a + b);
        if (pSum < 1 - Number.EPSILON || pSum > 1 + Number.EPSILON) {
            throw Error("Overall probability has to be 1.");
        }
        if (probability.find((p) => p < 0) != undefined) {
            throw Error("Probability cannot contain negative values.");
        }
        if (events.length != probability.length) {
            throw Error("Events and probability must be same length.");
        }
    } else {
        probability = new Array(events.length).fill(1 / events.length);
    }

    var probabilityRanges = probability.reduce((ranges, v, i) => {
        var start = i > 0 ? ranges[i-1][1] : 0 - Number.EPSILON;
        ranges.push([start, v + start + Number.EPSILON]);
        return ranges;
    }, []);
  
    var choices = new Array();
    for(var i = 0; i < size; i++) {
        var random = Math.random();
        var rangeIndex = probabilityRanges.findIndex((v, i) => random > v[0] && random <= v[1]);
        choices.push(events[rangeIndex]);
    };
    return choices;
};

function getMaxNeed(needs) {
    var max = 0;
    var need = needs[0];
    for (var i = 0; i < needs.length; i++) {
        if (needs[i].weight > max) {
            max = needs[i].weight;
            need = needs[i];
        }
    };
    return need;
};

//************************************** */
//********** Init Functions ************ */

function initNeeds() {
    var needs = [];
    needs.push(new Need('q', randomFloatInRange(0, 0.2)));
    needs.push(new Need('r', randomFloatInRange(0.3, 0.6)));
    needs.push(new Need('w', randomFloatInRange(0.2, 0.5)));
    needs.push(new Need('t', randomFloatInRange(0, 0.1)));
    needs.push(new Need('k', 0));
    needs.push(new Need('d', 0));
    return needs;
};

function initTeams(leagueSize, posSizes) {
    var arr = [];
    for (var i = 0; i < leagueSize; i++) {
        var team = new TeamObj();
        team.teamNum = i + 1;
        team.qbs = [...Array(posSizes[0]).keys()].map(x => new TeamPlayer('QB', ''));
        team.rbs = [...Array(posSizes[1]).keys()].map(x => new TeamPlayer('RB', ''));
        team.wrs = [...Array(posSizes[2]).keys()].map(x => new TeamPlayer('WR', ''));
        team.tes = [...Array(posSizes[3]).keys()].map(x => new TeamPlayer('TE', ''));
        team.flexes = [...Array(posSizes[4]).keys()].map(x => new TeamPlayer('FLEX', ''));
        team.ks = [...Array(posSizes[5]).keys()].map(x => new TeamPlayer('K', ''));
        team.dsts = [...Array(posSizes[6]).keys()].map(x => new TeamPlayer('DST', ''));
        team.bench = [...Array(posSizes[7]).keys()].map(x => new TeamPlayer('BEN', ''));
        team.needs = initNeeds();
        arr.push(team);
    };
    return arr;
};

function buildSimpleQueue(leagueSize, playersSize) {
    var arr = [];
    for (var i = 0; i < playersSize; i++) {
        if (i % 2 === 0) {
            for (var j = 1; j < leagueSize + 1; j++) {
                arr.push(j);
            };
        } else {
            for (var j = leagueSize; j > 0; j--) {
                arr.push(j);
            }
        };
    };
    return arr;
};

//*************************************** */
//********** Logic Functions ************ */

function getPlayerRound1Top3(data) {
    var top3 = [...Array(3).keys()];
    var randomArr = choice(top3, 3, [0.7, 0.2, 0.1]);
    var playerIndex = randomArr[0];
    var player = data[playerIndex];
    return [player, playerIndex];
};

function getPlayerRound1(data) {
    var top10 = [...Array(10).keys()];
    var randomArr = choice(top10, 10, [0.3, 0.2, 0.115, 0.1, 0.085, 0.065, 0.055, 0.045, 0.025, 0.01]);
    var playerIndex = randomArr[0];
    var player = data[playerIndex];
    return [player, playerIndex];
};

function getPlayerRest(team, data) {
    var pos = getMaxNeed(team.needs).positionAbbr;
    var playerIndex = 0;
    if (pos === 'q') {
        var temp = data.filter(x => x.position === 'QB');
        temp = temp.sort(x => x.positionRanking);
        playerIndex = data.findIndex(x => x.name === temp[0].name);
    } else if (pos === 'r') {
        var temp = data.filter(x => x.position === 'RB');
        temp = temp.sort(x => x.positionRanking);
        playerIndex = data.findIndex(x => x.name === temp[0].name);
    } else if (pos === 'w') {
        var temp = data.filter(x => x.position === 'WR');
        temp = temp.sort(x => x.positionRanking);
        playerIndex = data.findIndex(x => x.name === temp[0].name);
    } else if (pos === 't') {
        var temp = data.filter(x => x.position === 'TE');
        temp = temp.sort(x => x.positionRanking);
        playerIndex = data.findIndex(x => x.name === temp[0].name);
    } else if (pos === 'k') {
        var temp = data.filter(x => x.position === 'K');
        temp = temp.sort(x => x.positionRanking);
        playerIndex = data.findIndex(x => x.name === temp[0].name);
    } else if (pos === 'd') {
        var temp = data.filter(x => x.position === 'DST');
        temp = temp.sort(x => x.positionRanking);
        playerIndex = data.findIndex(x => x.name === temp[0].name);
    };
    return playerIndex;
};

// NEEDS **********************************/
//*************************************** */

function getMissingQbs(team) {
    var count = 0;
    for (var i = 0; i < team.qbs.length; i++) {
        if (team.qbs[i].playerName.length !== 0) {
            count++;
        }
    };
    return ['q', team.qbs.length - count];
}

function getMissingRbs(team) {
    var count = 0;
    for (var i = 0; i < team.rbs.length; i++) {
        if (team.rbs[i].playerName.length !== 0) {
            count++;
        }
    };
    return ['r', team.rbs.length - count];
}

function getMissingWrs(team) {
    var count = 0;
    for (var i = 0; i < team.wrs.length; i++) {
        if (team.wrs[i].playerName.length !== 0) {
            count++;
        }
    };
    return ['w', team.wrs.length - count];
}

function getMissingTes(team) {
    var count = 0;
    for (var i = 0; i < team.tes.length; i++) {
        if (team.tes[i].playerName.length !== 0) {
            count++;
        }
    };
    return ['t', team.tes.length - count];
}

function getMissingFlexes(team) {
    var count = 0;
    for (var i = 0; i < team.flexes.length; i++) {
        if (team.flexes[i].playerName.length !== 0) {
            count++;
        }
    };
    return ['f', team.flexes.length - count];
}

function getMissingKs(team) {
    var count = 0;
    for (var i = 0; i < team.ks.length; i++) {
        if (team.ks[i].playerName.length !== 0) {
            count++;
        }
    };
    return ['k', team.ks.length - count];
}

function getMissingDsts(team) {
    var count = 0;
    for (var i = 0; i < team.dsts.length; i++) {
        if (team.dsts[i].playerName.length !== 0) {
            count++;
        }
    };
    return ['d', team.dsts.length - count];
}

function getMissingStarters(team) {
    var missing = [];
    missing.push(getMissingQbs(team));
    missing.push(getMissingRbs(team));
    missing.push(getMissingWrs(team));
    missing.push(getMissingTes(team));
    missing.push(getMissingFlexes(team));
    missing.push(getMissingKs(team));
    missing.push(getMissingDsts(team));
    return missing;
}

function benchFull(team) {
    var count = 0;
    var bench = team.bench;
    for (var b of bench) {
        if (b.playerName.length !== 0) {
            count++;
        }
    }
    if (count === bench.length) {
        return true;
    }
    return false;
}

function getPosLength(team, pos) {
    if (pos === 'q') {
        return team.qbs.length;
    } else if (pos === 'r') {
        return team.rbs.length;
    } else if (pos === 'w') {
        return team.wrs.length;
    } else if (pos === 't') {
        return team.tes.length;
    } else if (pos === 'f') {
        return team.flexes.length;
    } else if (pos === 'k') {
        return team.ks.length;
    } else if (pos === 'd') {
        return team.dsts.length;
    }
    return -1;
}

function updateNeeds(team, pos, round, playersSize) {
    var earlyRoundPositions = ['q', 'r', 'w', 't'];
    var needs = team.needs;
    for (var i = 0; i < needs.length; i++) {
        var n = needs[i];
        var abbr = n.positionAbbr;
        var weight = n.weight;
        if (getPosLength(team, abbr) > 0) {
            if (abbr === pos) {
                team.needs[i] = new Need(abbr, weight - randomFloatInRange(0, 0.1));
            }
            if (abbr !== pos && round <= 5) {
                if (earlyRoundPositions.includes(abbr)) {
                    team.needs[i] = new Need(abbr, weight + randomFloatInRange(0, 0.1));
                }
            } else if (abbr !== pos && round > 5) {
                team.needs[i] = new Need(abbr, weight + randomFloatInRange(0, 0.1));
            }
        }
    }
    if (benchFull(team)) {
        var i = team.needs.map(x => x.positionAbbr).indexOf(pos);
        team.needs[i] = new Need(pos, 0);
        var missing = getMissingStarters(team);
        for (var m of missing) {
            var abbr = m[0];
            var val = m[1];
            if (val !== 0) {
                var index = team.needs.map(x => x.positionAbbr).indexOf(abbr);
                team.needs[index] = new Need(abbr, 5);
            }
        }
    }
    return team;
}

//*************************************** */
//*************** GRADES **************** */
//*************************************** */

function sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
}

function deviation(arr, mean) {
    arr = arr.map((x) => { return (x - mean)**2 });
    var temp = sum(arr);
    return Math.sqrt(temp / arr.length);
}

function getGrades(points) {
    var points = points.map(x => isNaN(x) ? 0 : x);
    var grades = [];
    var pointSum = sum(points);
    var mean = pointSum / points.length;
    var dev = deviation(points, mean);
    for (var p of points) {
        var temp = p - mean;
        temp /= dev;
        if (temp <= -1.5) {
            grades.push([p, 'F']);
        } else if (temp > -1.5 && temp <= -1.0) {
            grades.push([p, 'D']);
        } else if (temp > -1.0 && temp <= 0) {
            grades.push([p, 'C']);
        } else if (temp > 0 && temp <= 0.5) {
            grades.push([p, 'B']);
        } else if (temp > 0.5) {
            grades.push([p, 'A']);
        }
    }
    return grades;
}

function getAllPlayerNames(team) {
    var names = [];
    var q = team.qbs.filter(x => x.playerName.length !== 0);
    var r = team.rbs.filter(x => x.playerName.length !== 0);
    var w = team.wrs.filter(x => x.playerName.length !== 0);
    var t = team.tes.filter(x => x.playerName.length !== 0);
    var f = team.flexes.filter(x => x.playerName.length !== 0);
    var k = team.ks.filter(x => x.playerName.length !== 0);
    var d = team.dsts.filter(x => x.playerName.length !== 0);
    var b = team.bench.filter(x => x.playerName.length !== 0);
    names = names.concat(q, r, w, t, f, k, d, b);
    return names;
}

function getRatings(teams, data) {
    var allPoints = [];
    for (var i = 0; i < teams.length; i++) {
        var teamPoints = [];
        var playerNames = getAllPlayerNames(teams[i]);
        for (var p of playerNames) {
            var player = data.filter(x => x.name===p.playerName);
            teamPoints.push(player[0]['lastSeasonPoints']);
        }
        var temp = sum(teamPoints);
        var avg = temp / teamPoints.length;
        allPoints.push(avg);
    };
    var grades = getGrades(allPoints);
    var gradeObjects = [];
    for (var i = 0; i < grades.length; i++) {
        gradeObjects.push([i+1, grades[i][1]]);
    };
    return gradeObjects;
}

//--------------------------------------------------- */
//**************** End Draft Logic ****************** */

//*********************************************** */
//*********************************************** */

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

// // Init team objects
// function initTeams(qbSize, rbSize, wrSize, teSize, flexSize, kSize, dstSize, benchSize, leagueSize) {
//     let teams = [];
//     for (var i = 0; i < leagueSize; i++) {
//         let team = new TeamObj();
//         //team num
//         team.teamNum = i + 1;
//         //qbs
//         let qbs = Array.from({length: qbSize}, (_, i) => i + 1).map((i) => new TeamPlayer('QB', ''));
//         team.qbs = qbs;
//         //rbs
//         let rbs = Array.from({length: rbSize}, (_, i) => i + 1).map((i) => new TeamPlayer('RB', ''));
//         team.rbs = rbs;
//         //wrs
//         let wrs = Array.from({length: wrSize}, (_, i) => i + 1).map((i) => new TeamPlayer('WR', ''));
//         team.wrs = wrs;
//         //tes
//         let tes = Array.from({length: teSize}, (_, i) => i + 1).map((i) => new TeamPlayer('TE', ''));
//         team.tes = tes;
//         //flexes
//         let flexes = Array.from({length: flexSize}, (_, i) => i + 1).map((i) => new TeamPlayer('FLEX', ''));
//         team.flexes = flexes;
//         //ks
//         let ks = Array.from({length: kSize}, (_, i) => i + 1).map((i) => new TeamPlayer('K', ''));
//         team.ks = ks;
//         //dsts
//         let dsts = Array.from({length: dstSize}, (_, i) => i + 1).map((i) => new TeamPlayer('DST', ''));
//         team.dsts = dsts;
//         //bench
//         let bench = Array.from({length: benchSize}, (_, i) => i + 1).map((i) => new TeamPlayer('BEN', ''));
//         team.bench = bench;
//         teams.push(team);
//     }
//     return teams;
// };

// int time to String
function convertTime(time) {
    var secNum = parseInt(time.toString(), 10);
    var hours = Math.floor(secNum / 3600);
    var minutes = Math.floor((secNum - (hours * 3600)) / 60);
    var seconds = secNum - (hours * 3600) - (minutes * 60);

    // if (minutes < 10) {
    //     minutes = "0" + minutes;
    // }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
}

// Build queue array
function buildQueueArray(leagueSize, playersSize) {
    let arr = [];
    arr.push(new QueueObj(1, 'Round 1'));
    for (var i = 0; i < playersSize; i++) {
        if (i % 2 === 0) {
            for (var j = 1; j < leagueSize + 1; j++) {
                arr.push(new QueueObj(i + 1, j));
            }
        } else {
            for (var j = leagueSize; j > 0; j--) {
                arr.push(new QueueObj(i + 1, j));
            }
        }
        if (i !== playersSize - 1) {
            arr.push(new QueueObj(i + 2, -1));
            arr.push(new QueueObj(i + 2, 'Round ' + (i + 2)));
        }
    }
    return arr;
}

function Mock() {
    //Queue info
    const leagueSize = 4;
    const playersSize = 4;
    const queuePosition = 2;
    const leagueType = 'STD';

    const [queueArr, setQueueArr] = useState(buildQueueArray(leagueSize, playersSize));

    const shiftQueue = (currDrafter, round) => {
        let temp = queueArr;
        let index = temp.findIndex(x => x.queueVal === currDrafter && x.round === round);
        temp.splice(index, 1);
        if (temp[0].queueVal.toString().includes('Round') && temp[1].queueVal === -1) {
            temp.shift();
            temp.shift();
        }
        setQueueArr(temp);
        // setQueueArr(queueArr.filter(x => x.queueVal !== currDrafter && x.round !== round));
    };

    // Build teams
    // const qbSize = 1;
    // const rbSize = 2;
    // const wrSize = 2;
    // const teSize = 1;
    // const flexSize = 1;
    // const kSize = 1;
    // const dstSize = 1;
    // const benchSize = 7;

    //             q   r  w  t  f  k  d  b
    var posSizes = [1, 2, 2, 1, 1, 1, 1, 7];

    const [teamObjs, setTeamObjs] = useState(initTeams(leagueSize, posSizes));

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

    // Start timer
    const [startClicked, setStartClicked] = useState(false);

    var allTimerInterval;
    var computerTime = 2;
    var userTime = 5;

    if (queuePosition === 1) {
        allTimerInterval = userTime;
    } else {
        allTimerInterval = computerTime;
    }
    const [timerNum, setTimerNum] = useState(allTimerInterval);

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
    const findEmptyPositions = (teamObj) => {
        //              q  r  w  t  f  k  d  b
        var emptyArr = [0, 0, 0, 0, 0, 0, 0, 0];
        // QB
        for (var p of teamObj.qbs) {
            if (p.playerName === '') {
                emptyArr[0]++;
            }
        };
        // RB
        for (var p of teamObj.rbs) {
            if (p.playerName === '') {
                emptyArr[1]++;
            }
        };
        // WR
        for (var p of teamObj.wrs) {
            if (p.playerName === '') {
                emptyArr[2]++;
            }
        };
        // TE
        for (var p of teamObj.tes) {
            if (p.playerName === '') {
                emptyArr[3]++;
            }
        };
        // FLEX
        for (var p of teamObj.flexes) {
            if (p.playerName === '') {
                emptyArr[4]++;
            }
        };
        // K
        for (var p of teamObj.ks) {
            if (p.playerName === '') {
                emptyArr[5]++;
            }
        };
        // DST
        for (var p of teamObj.dsts) {
            if (p.playerName === '') {
                emptyArr[6]++;
            }
        };
        // BENCH
        for (var p of teamObj.bench) {
            if (p.playerName === '') {
                emptyArr[7]++;
            }
        };
        return emptyArr;
    };

    const getEmptyIndex = (key) => {
        var arr = ['q', 'r', 'w', 't', 'f', 'k', 'd', 'b'];
        return arr.indexOf(key);
    };

    const updateTeamObj = (player, teamObj, currDrafter) => {
        var emptyPositions = findEmptyPositions(teamObj[0]);
        let position = player.position;
        if (position === 'QB') {
            
        } else if (position === 'RB') {
            if (emptyPositions[getEmptyIndex('r')] !== 0) {
                for (var i = 0; i < teamObj[0].rbs.length; i++) {
                    if (teamObj[0].rbs[i].playerName === '') {
                        teamObj[0].rbs[i] = new TeamPlayer('RB', player.name);
                        break;
                    }
                };
            } else if (emptyPositions[getEmptyIndex('f')] !== 0) {
                for (var i = 0; i < teamObj[0].flexes.length; i++) {
                    if (teamObj[0].flexes[i].playerName === '') {
                        teamObj[0].flexes[i] = new TeamPlayer('FLEX', player.name);
                        break;
                    }
                };
            };
        }
        let index = teamObjs.findIndex(x => x.teamNum === currDrafter);
        let newTeamObjs = [...teamObjs];
        newTeamObjs[index] = teamObj[0];
        setTeamObjs(newTeamObjs);
        setFlattenTeamObjs(displayTeam(newTeamObjs, selectedOption));
    }

    const handleComputerDraft = () => {
        let topPlayer = allPlayers[0];
        let teamObj = teamObjs.filter(x => x.teamNum === currDrafter);
        updateTeamObj(topPlayer, teamObj, currDrafter);
        setAllPlayers(allPlayers.filter(x => x.name !== topPlayer.name));
    };

    const handleUserDraft = (selectedPlayer) => {
        let teamObj = teamObjs.filter(x => x.teamNum === currDrafter);
        updateTeamObj(selectedPlayer, teamObj, currDrafter);
        setAllPlayers(allPlayers.filter(x => x.name !== selectedPlayer.name));
        setTimerNum(-1);
    };

    const [queueIndex, setQueueIndex] = useState(0);
    const simpleQueueArr = buildSimpleQueue(leagueSize, playersSize);
    const [currDrafter, setCurrDrafter] = useState(simpleQueueArr[queueIndex]);

    useEffect(() => {
        if (startClicked) {
            if (timerNum === -1) {
                if (currDrafter !== queuePosition) {
                    handleComputerDraft();
                    setCurrDrafter(simpleQueueArr[queueIndex + 1]);
                    setQueueIndex(queueIndex + 1);
                    shiftQueue(currDrafter, round);
                    if (simpleQueueArr[queueIndex] === simpleQueueArr[queueIndex + 1]) {
                        setRound(round + 1);
                    }
                    if ((simpleQueueArr[queueIndex + 1]) !== queuePosition) {
                        setTimerNum(computerTime);
                    } else {
                        setTimerNum(userTime);
                    }
                } else {
                    setCurrDrafter(simpleQueueArr[queueIndex + 1]);
                    setQueueIndex(queueIndex + 1);
                    shiftQueue(currDrafter, round);
                    if (simpleQueueArr[queueIndex] === simpleQueueArr[queueIndex + 1]) {
                        setRound(round + 1);
                    }
                    if ((simpleQueueArr[queueIndex + 1]) !== queuePosition) {
                        setTimerNum(computerTime);
                    } else {
                        setTimerNum(userTime);
                    }
                }
            }
        }
    });

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
                            {timerNum !== -1 ? convertTime(timerNum) : '0:00'}
                        </h3>
                    </div>
                </div>
            </div>
            <div className="player-queue">
                <PlayerQueue
                    queuePosition={queuePosition}
                    queueArr={queueArr}
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
                        handleUserDraft={handleUserDraft}
                        startClicked={startClicked}
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