import { useEffect, useState } from "react";

function getTeamInfo(teamInfo) {
    let arr = [];
    for (var i = 0; i < teamInfo.length; i++) {
        let name = teamInfo[i].name;
        for (var j = 0; j < teamInfo[i].num; j++) {
            arr.push(name);
        }
    }
    return arr;
}

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

function Team({ teamInfo, leagueSize, queuePosition, teamObjs }) {

    const infoArr = getTeamInfo(teamInfo);
    const [selectedOption, setSelectedOption] = useState(queuePosition);

    // const renderTeam = infoArr.map((i) => 
    //     <li key={i + Math.random()} className="list-element team">
    //         {i + ": "}
    //     </li>
    // );

    const [flattenTeamObjs, setFlattenTeamObjs] = useState(displayTeam(teamObjs, selectedOption));

    const renderTeams = flattenTeamObjs.map((i) => 
        <li key={i + Math.random()} className="list-element team">
            {i}
        </li>
    );

    const renderOptions = Array.from({length: leagueSize}, (_, i) => i + 1).map((i) => 
        <option 
            key={"Team " + i} 
            value={i}
        >
            {"Team " + i}
        </option>
    );

    return (
        <div className="team-info">
            <h2 className="subtitle">Team {selectedOption} </h2>
            <ul className="team-info-list">
                {renderTeams}
            </ul>
            <div className="teams-dropdown">
                <form>
                    <select 
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(parseInt(e.target.value))}
                        name="team-select" 
                        className="team-select"
                    >
                        {renderOptions}
                    </select>
                </form>
            </div>
        </div>
    )
};

export default Team;