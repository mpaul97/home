import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar, AiOutlineMinusCircle, AiFillMinusCircle } from "react-icons/ai";

function Favorites({ favPlayers, handleRemoveFav }) {

    // const [initSize, setInitSize] = useState(100);

    // const renderFavorites = Array.from({length: initSize}, (_, i) => i + 1).map((i) => 
    //     <li key={i} className="list-element favorite">
    //         {i + ": "}
    //     </li>
    // );

    const renderInit = (
        <li className="list-element favorite">
            Click the
            <AiOutlineStar 
                style={
                    {
                        verticalAlign: 'middle', 
                        padding: 2,
                        marginTop: -2
                    }
                } 
            />
            to add players
        </li>
    );

    const renderFavorites = favPlayers.map((name, index) => 
        <li key={name} className="list-element favorite">
            <div className="remove-container">
                <div className="remove-inner-container">
                    <AiOutlineMinusCircle onClick={() => handleRemoveFav(name)} className="remove-favorite" />
                </div>
            </div>
            {index+1}: {name}
        </li>
    );

    return (
        <div className="favorites-container-list">
            <ul className="favorites-list">
                {favPlayers.length===0 ? renderInit : renderFavorites}
            </ul>
        </div>
    )
};

export default Favorites;