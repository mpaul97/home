import "./Mock.css";
import PlayerQueue from "./PlayerQueue";

function Mock() {
    //Queue info
    const leagueSize = 12;
    const playersSize = 2;
    const queuePosition = 4;

    //Team Info
    const qb = 1;
    const rb = 2;
    const wr = 2;
    const te = 1;
    const flex = 1;
    const k = 1;
    const dst = 1;
    const bench = 7;

    return (
        <div className="mock-container">
            <div className="header">
                <h1 className="title">Minute Mock</h1>
                <div className="timer-container">
                    <h3 className="timer">0:00</h3>
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
                    <h2 className="subtitle">Team</h2>
                    <div className="team-players-container">

                    </div>
                </div>
                <div className="player-container">

                </div>
                <div className="favorites-container">

                </div>
            </div>
        </div>
    );
}

export default Mock;