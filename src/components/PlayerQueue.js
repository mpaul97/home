import HorizontalScroll from "react-scroll-horizontal";
import cx from 'classnames';
import { scryRenderedComponentsWithType } from "react-dom/test-utils";

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

function PlayerQueue({ leagueSize, playersSize, queuePosition }) {

    const childScroll   = { width: `40px`, height: `40px`};
    const parentScroll  = { width: `100%`, height: `52px`};

    const queueArr = buildArray(leagueSize, playersSize);
    queueArr.unshift('Round 1');

    const renderQueue = queueArr.map((i) => 
        <li key={i} className="list-element queue">
            <div 
                style={childScroll}
                className={cx("queue-element-container", {
                    'partition' : i === -1,
                    'round' : i.toString().includes('Round'),
                    'first-round' : i.toString() === 'Round 1'
                })}
                id={i===queuePosition ? 'active' : ''}
            >
                {i}
            </div>
        </li>
    );
    
    return (
        <ul>
            <div style={parentScroll}>
                <HorizontalScroll className="queue-scroll">
                    {renderQueue}
                </HorizontalScroll>
            </div>
      </ul>
    )
}

export default PlayerQueue;