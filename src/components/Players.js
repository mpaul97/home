import playerImg from '../assets/player_placeholder.png';
import tempPlayers from '../assets/placeholder.json';
import playersStd from '../assets/tempData_std.json';
import playersPpr from '../assets/tempData_ppr.json';
import playersHalf from '../assets/tempData_half.json';
import playersKings from '../assets/tempData_kings.json';
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

function Players({ fav, favPlayers, queuePosition, currDrafter, allPlayers, handleUserDraft, startClicked }) {

    //Players
    // const [players, setPlayers] = useState([]);
    // const playersCollectionRef = collection(db, "players"); //Firebase

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

    // useEffect(() => {

    //     // const getPlayers = async () => {
    //     //     const data = await getDocs(playersCollectionRef);
    //     //     let tempPlayers = data.docs.map((doc) => ({...doc.data()}));
    //     //     tempPlayers.sort(compare);
    //     //     setPlayers(tempPlayers);
    //     // };

    //     // getPlayers();
        
    // });

    var activePlayers = getCurrentPlayers(activePosition, allPlayers);

    const [selectedPlayer, setSelectedPlayer] = useState(allPlayers[0]);
    const [selectedPlayerName, setSelectedPlayerName] = useState(allPlayers[0].name);
    const [selectedPlayerPoints, setSelectedPlayerPoints] = useState(allPlayers[0].lastSeasonPoints);

    const handleClick = (player) => {
        setSelectedPlayer(player);
        setSelectedPlayerName(player.name);
        setSelectedPlayerPoints(player.lastSeasonPoints);
    };

    const renderPlayers = activePlayers.map((i) => 
        <tr 
            onClick={() => handleClick(i)} 
            className="table-rows" 
            key={i.name}
            id={selectedPlayerName===i.name ? 'activePlayer' : ''}
        >
            <td>{activePosition==='ALL' ? i.overallRanking : (activePosition==='FLEX' ? i.flexRanking : i.positionRanking) }</td>
            <td>{i.name}</td>
            <td>{i.team}</td>
            <td>{i.position}</td>
            <td>{i.projections}</td>
            <td>{i.lastSeasonPoints}</td>
        </tr>
    );

    const emptyStar = <AiOutlineStar />;
    const filledStar = <AiFillStar />;

    const toggleDraftBtn = (queuePosition, currDrafter, startClicked) => {
        if ((queuePosition === currDrafter) && startClicked) {
            return true;
        }
        return false;
    }

    return (
        <div className="players-all">
            <div className="players-top">
                <div className="player-image-info">
                    <img className="player-image" src={playerImg} alt="Player Image"/>
                    <div className="player-text">
                        <h3 className="player-name">{selectedPlayerName}</h3>
                        <p className="player-info">2021 Points: {selectedPlayerPoints}</p>
                    </div>
                </div>
                <div className="player-buttons">
                    <button 
                        className="draft-button"
                        disabled={!toggleDraftBtn(queuePosition, currDrafter, startClicked) ? true : false}
                        id={!toggleDraftBtn(queuePosition, currDrafter, startClicked) ? 'disabled-button' : ''}
                        onClick={() => handleUserDraft(selectedPlayer)}
                    >
                        Draft
                    </button>
                    <div className="add-favorite-container">
                        <button 
                            className="add-favorite"
                            onClick={() => fav(selectedPlayerName)}
                            disabled={favPlayers.includes(selectedPlayerName) ? true : false}
                            id={favPlayers.includes(selectedPlayerName) ? 'disabled-button' : ''}
                        >
                            {favPlayers.includes(selectedPlayerName) ? filledStar : emptyStar}
                        </button>
                    </div>
                </div>
                <div className="search-container">
                    <form className="player-search-form">
                        <input type="text" className="player-search" placeholder="Search players"/>
                        <button type="submit" className="player-search-button"><FaSearch /></button>
                    </form>
                </div>
                <div className="toggle-drafted-container">
                    <form className="toggle-drafted-form">
                        <label htmlFor="toggle-drafted">Show Drafted Players</label>
                        <input name="toggle-drafted" type="checkbox"></input>
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