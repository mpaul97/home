import HorizontalScroll from "react-scroll-horizontal";
import cx from 'classnames';

function buildArray(leagueSize, playersSize) {
    let arr = [];
    for (var i = 0; i < playersSize; i++) {
        if (i % 2 === 0) {
            for (var j = 1; j < leagueSize + 1; j++) {
                arr.push(j);
            }
        } else {
            for (var j = leagueSize; j > 0; j--) {
                arr.push(j);
            }
        }
        if (i != playersSize - 1) {
            arr.push(-1);
            arr.push('Round ' + (i + 2));
        }
    }
    return arr;
}

function PlayerQueue({ queuePosition, queueArr }) {

    const childScroll   = { width: `40px`, height: `40px`};
    const parentScroll  = { width: `100%`, height: `50px`, overflow: 'hidden', paddingBottom: 2};

    // const queueArr = buildArray(leagueSize, playersSize);
    // queueArr.unshift('Round 1');

    const renderQueue = queueArr.map((element, index) => 
        <li key={element.round + ":" + element.queueVal} className="list-element queue">
            <div 
                style={childScroll}
                className={cx("queue-element-container", {
                    'partition' : element.queueVal === -1,
                    'round' : element.queueVal.toString().includes('Round'),
                    'first-round' : index === 0
                })}
                id={element.queueVal===queuePosition ? 'active' : ''}
            >
                {element.queueVal}
            </div>
        </li>
    );
    
    return (
        <ul>
            <div style={parentScroll}>
                <div className="queue-scroll">
                    {renderQueue}
                </div>
            </div>
      </ul>
    )
}

export default PlayerQueue;