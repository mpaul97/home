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
};

//*************************************** */

// var qSize = 1;
// var rSize = 2;
// var wSize = 2;
// var tSize = 1;
// var fSize = 1;
// var kSize = 1;
// var dSize = 1;
// var bSize = 7;
var leagueSize = 12;
//             q   r  w  t  f  k  d  b
var posSizes = [1, 2, 2, 1, 1, 1, 1, 7];

var playersSize = posSizes.reduce((a, b) => a + b, 0);

var data = JSON.parse(JSON.stringify(playersStd));

var teams = initTeams(leagueSize, posSizes);

var tempTeam = teams[0];

getPlayerRest(tempTeam, data);

//*************************************** */

function ComputerDraft() {
    return (
        <div className="container">

        </div>
    )
};

export default ComputerDraft;