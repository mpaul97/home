import { useState } from "react";

function Favorites({ favPlayers, click }) {

    // const [initSize, setInitSize] = useState(100);

    // const renderFavorites = Array.from({length: initSize}, (_, i) => i + 1).map((i) => 
    //     <li key={i} className="list-element favorite">
    //         {i + ": "}
    //     </li>
    // );

    const [players, setPlayers] = useState(favPlayers);

    const renderInit = <li className="list-element favorite">Add Favorites to Queue</li>;

    return (
        <div className="favorites-container-list">
            <ul className="favorites-list">
                {players.length}
            </ul>
        </div>
    )
};

export default Favorites;