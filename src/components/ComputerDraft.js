import playersStd from '../assets/tempData_std.json';

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

function buildQueue(leagueSize, playersSize) {
    var arr = [];
    for (var i = 0; i < playersSize; i++) {
        if (i % 2 === 0) {
            for (var j = 1; j < leagueSize + 1; j++) {
                arr.push([i + 1, j]);
            };
        } else {
            for (var j = leagueSize; j > 0; j--) {
                arr.push([i + 1, j]);
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

//*************************************** */

// var qSize = 1;
// var rSize = 2;
// var wSize = 2;
// var tSize = 1;
// var fSize = 1;
// var kSize = 1;
// var dSize = 1;
// var bSize = 7;
// var leagueSize = 12;
// //             q   r  w  t  f  k  d  b
// var posSizes = [1, 2, 2, 1, 1, 1, 1, 7];

// var playersSize = posSizes.reduce((a, b) => a + b, 0);

// var data = JSON.parse(JSON.stringify(playersStd));
// var unalteredData = JSON.parse(JSON.stringify(playersStd));

// var teams = initTeams(leagueSize, posSizes);

// var tempTeam = teams[0];
// teams[0].qbs[0].playerName = "Aaron Rodgers";
// teams[0].wrs[0].playerName = "Davante Adams";
// teams[0].rbs[0].playerName = "Aaron Jones";

// // var playerIndex = getPlayerRest(tempTeam, data);
// // var player = data[playerIndex];

// // updateNeeds(tempTeam, 'r', 2, playersSize);

// getRatings(teams, unalteredData);

//*************************************** */

// function ComputerDraft() {
//     return (
//         <div className="container" style={{textAlign: 'center', marginTop: 20}}>
//             <input name="test" type="text" style={{padding: 5}}></input>
//         </div>
//     )
// };

// export default ComputerDraft;