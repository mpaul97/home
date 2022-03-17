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

function Team({ teamInfo, leagueSize }) {

    const infoArr = getTeamInfo(teamInfo);

    const renderTeam = infoArr.map((i) => 
        <li key={i + Math.random()} className="list-element team">
            {i + ": "}
        </li>
    );

    const renderOptions = Array.from({length: leagueSize}, (_, i) => i + 1).map((i) => 
        <option key={"Team " + i} value={"Team " + i}>{"Team " + i}</option>
    );

    return (
        <div className="team-info">
            <ul className="team-info-list">
                {renderTeam}
            </ul>
            <div className="teams-dropdown">
                <form>
                    <select name="team-select" className="team-select">
                        {renderOptions}
                    </select>
                </form>
            </div>
        </div>
    )
};

export default Team;