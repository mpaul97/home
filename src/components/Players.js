import playerImg from '../assets/player_placeholder.png';
import tempPlayers from '../assets/placeholder.json';
import { FaSearch } from 'react-icons/fa';
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

function compareOverall(a, b) {
    const aRank = a.overallRanking;
    const bRank = b.overallRanking;
    if (aRank < bRank) {
        return -1;
    }
    if (aRank > bRank) {
        return 1;
    }
    return 0;
}

function comparePosition(a, b) {
    const aRank = a.positionRanking;
    const bRank = b.positionRanking;
    if (aRank < bRank) {
        return -1;
    }
    if (aRank > bRank) {
        return 1;
    }
    return 0;
}

function compareFlex(a, b) {
    const aRank = a.flexRanking;
    const bRank = b.flexRanking;
    if (aRank < bRank) {
        return -1;
    }
    if (aRank > bRank) {
        return 1;
    }
    return 0;
}

function getCurrentPlayers(activePosition, temp) {
    if (activePosition == 'ALL') {
        temp.sort(compareOverall);
    } else if (activePosition == 'QB') {
        temp = temp.filter(x => x.position === 'QB');
        temp.sort(comparePosition);
    } else if (activePosition == 'RB') {
        temp = temp.filter(x => x.position === 'RB');
        temp.sort(comparePosition);
    } else if (activePosition == 'WR') {
        temp = temp.filter(x => x.position === 'WR');
        temp.sort(comparePosition);
    } else if (activePosition == 'TE') {
        temp = temp.filter(x => x.position === 'TE');
        temp.sort(comparePosition);
    } else if (activePosition == 'FLEX') {
        temp = temp.filter(x => (x.position === 'RB' || x.position === 'WR' || x.position === 'TE'));
        temp.sort(compareFlex);
    } else if (activePosition == 'K') {
        temp = temp.filter(x => x.position === 'K');
        temp.sort(comparePosition);
    } else if (activePosition == 'DST') {
        temp = temp.filter(x => x.position === 'DST');
        temp.sort(comparePosition);
    }
    return temp;
}

const positionOptions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DST'];

function Players() {
    //Players
    const [players, setPlayers] = useState([]);
    const playersCollectionRef = collection(db, "players");

    const [activePosition, setActivePosition] = useState('ALL');
    const renderPositionOptions = positionOptions.map((i) =>
        <li 
            className={"position-option " + i} 
            key={i}
            onClick={() => setActivePosition(i)}
            id={activePosition===i ? 'active1' : ''}
        >
            {i}
        </li>
    );

    useEffect(() => {

        // const getPlayers = async () => {
        //     const data = await getDocs(playersCollectionRef);
        //     let tempPlayers = data.docs.map((doc) => ({...doc.data()}));
        //     tempPlayers.sort(compare);
        //     setPlayers(tempPlayers);
        // };

        // getPlayers();
    });

    // Player Table Logic
    var temp = JSON.parse(JSON.stringify(tempPlayers));

    temp = getCurrentPlayers(activePosition, temp);

    const [selectedPlayer, setSelectedPlayer] = useState();
    const [selectedPlayerPoints, setSelectedPlayerPoints] = useState();

    const handleClick = (player) => {
        setSelectedPlayer(player.name);
        setSelectedPlayerPoints(player.lastSeasonPoints);
    };

    const renderPlayers = temp.map((i) => 
        <tr onClick={() => handleClick(i)} className="table-rows" key={i.name}>
            <td>{activePosition==='ALL' ? i.overallRanking : (activePosition==='FLEX' ? i.flexRanking : i.positionRanking) }</td>
            <td>{i.name}</td>
            <td>{i.team}</td>
            <td>{i.position}</td>
            <td>{i.projections}</td>
            <td>{i.lastSeasonPoints}</td>
        </tr>
    );

    return (
        <div className="players-all">
            <div className="players-top">
                <div className="player-image-info">
                    <img className="player-image" src={playerImg} alt="Player Image"/>
                    <div className="player-text">
                        <h3 className="player-name">{selectedPlayer}</h3>
                        <p className="player-info">2021 Points: {selectedPlayerPoints}</p>
                    </div>
                </div>
                <div className="add-favorite-container">
                    <button className="add-favorite"><AiOutlineStar /></button>
                </div>
                <div className="search-container">
                    <form className="player-search-form">
                        <input type="text" className="player-search" placeholder="Search players"/>
                        <button type="submit" className="player-search-button"><FaSearch /></button>
                    </form>
                </div>
            </div>
            <div className="players-bottom">
                <div className="player-positions-container">
                    <ul className="player-positions-list">
                        {renderPositionOptions}
                    </ul>
                </div>
                <div className="all-players-container">
                    <table className="players-table">
                        <thead>
                            <tr className="table-head">
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Team</th>
                                <th>Position</th>
                                <th>2022 Projection</th>
                                <th>2021 Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderPlayers}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Players;