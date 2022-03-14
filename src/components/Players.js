import playerImg from '../assets/player_placeholder.png';

function Players() {
    return (
        <div className="players-all">
            <div className="players-top">
                <img className="player-image" src={playerImg} alt="Player Image"/>
                <div className="player-text">
                    <h3 className="player-name">Firstname Lastname</h3>
                    <p className="player-info">2021 Points: 204.56</p>
                </div>
                <form>
                    <input type="text" className="player-search"/>
                    <button type="submit"><i class="fa fa-search"></i></button>
                </form>
            </div>
            <div className="players-bottom">

            </div>
        </div>
    )
}

export default Players;