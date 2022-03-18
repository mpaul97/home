import { useState } from "react";

function Favorites({ func }) {

    const [initSize, setInitSize] = useState(100);

    const renderFavorites = Array.from({length: initSize}, (_, i) => i + 1).map((i) => 
        <li key={i} className="list-element favorite">
            {i + ": "}
        </li>
    );


    return (
        <div className="favorites-container-list" onClick={func}>
            <ul className="favorites-list">
                {renderFavorites}
            </ul>
        </div>
    )
};

export default Favorites;