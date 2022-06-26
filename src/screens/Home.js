import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { render } from "@testing-library/react";
import { useState } from 'react';
import './Home.css';
import HomeButton from '../components/HomeButton';
import QueueButton from '../components/QueueButton';
import cx from 'classnames';
import PlayerInput from '../components/PlayerInput';
import { AiFillInfoCircle } from "react-icons/ai";

const sizes = [8, 10, 12, 14];
const types = ['Standard', 'PPR', 'Half-PPR'];
// const players = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DST'];
const players = [
    {
        name: 'QB',
        size: 2,
        default: 1
    },
    {
        name: 'RB',
        size: 4,
        default: 2
    },
    {
        name: 'WR',
        size: 4,
        default: 2
    },
    {
        name: 'TE',
        size: 2,
        default: 1
    },
    {
        name: 'FLEX',
        size: 4,
        default: 1
    },
    {
        name: 'K',
        size: 2,
        default: 1
    },
    {
        name: 'DST',
        size: 2,
        default: 1
    }
];
const times = ['Instant', 'Fast', 'Medium', 'Slow'];

function Home() {

    const [size, setSize] = useState(8);
    const renderSizes = sizes.map((i) =>
        <li key={i} className="list-element">
            <HomeButton
                value={i} 
                onClick={() => setSize(i)} 
                id={size===i ? 'active' : ''}
                className="home-button"
                />
        </li>
    );

    const [queue, setQueue] = useState(1);
    const renderQueue = Array.from({length: size}, (_, i) => i + 1).map((i) =>
        <li key={i} className="list-element">
            <QueueButton
                value={i} 
                onClick={() => setQueue(i)} 
                id={queue===i ? 'active' : ''}
                className={cx('queue-button', {
                    'left' : i === 1,
                    'right': i === size
                })}
                />
        </li>
    );

    const [type, setType] = useState('Standard');
    const renderType = types.map((i) =>
        <li key={i} className="list-element">
            <HomeButton 
                value={i} 
                onClick={() => setType(i)} 
                id={type===i ? 'active' : ''}
                className="home-button type"
                />
        </li>
    );

    const [qbSize, setQbSize] = useState(players.filter(x => x.name === 'QB')[0].default);
    const [rbSize, setRbSize] = useState(players.filter(x => x.name === 'RB')[0].default);
    const [wrSize, setWrSize] = useState(players.filter(x => x.name === 'WR')[0].default);
    const [teSize, setTeSize] = useState(players.filter(x => x.name === 'TE')[0].default);
    const [flexSize, setFlexSize] = useState(players.filter(x => x.name === 'FLEX')[0].default);
    const [kSize, setKSize] = useState(players.filter(x => x.name === 'K')[0].default);
    const [dstSize, setDstSize] = useState(players.filter(x => x.name === 'DST')[0].default);

    const handleChange = (e) => {
        if (e.target.name === 'QB') {
            setQbSize(parseInt(e.target.value));
        } else if (e.target.name === 'RB') {
            setRbSize(parseInt(e.target.value));
        } else if (e.target.name === 'WR') {
            setWrSize(parseInt(e.target.value));
        } else if (e.target.name === 'TE') {
            setTeSize(parseInt(e.target.value));
        } else if (e.target.name === 'FLEX') {
            setFlexSize(parseInt(e.target.value));
        } else if (e.target.name === 'K') {
            setKSize(parseInt(e.target.value));
        } else if (e.target.name === 'DST') {
            setDstSize(parseInt(e.target.value));
        }
    };

    const renderPlayers = players.map((i) =>
        <li key={i.name} className='list-element players'>
            <PlayerInput
                name={i.name}
                size={i.size}
                initVal={i.default}
                className="player-input"
                onChange={handleChange}
                />
        </li>
    );

    // timing
    const [clock, setClock] = useState('Instant');
    const renderClocks = times.map((i) =>
        <li key={i} className="list-element">
            <HomeButton 
                value={i} 
                onClick={() => setClock(i)} 
                id={clock===i ? 'active' : ''}
                className="home-button clock"
                />
        </li>
    );

    // toggle info
    const [toggled, setToggled] = useState(false);
    
    return (
        <div className='home-container'>
            <div className="info-button" onClick={() => setToggled(!toggled)}>
                <AiFillInfoCircle className="toggle-info" size={25} />
            </div>
            <h2 className='heading'>Minute Mock</h2>
            <p 
                className="info" 
                style={{
                    display: !toggled ? 'none' : 'block'
                }}>
                Minute Mock is an NFL fantasy football mock draft simulator which can be
                very quickly without having to rely on other users and is fully customizable.
                To begin just select select your specifications below  and then click submit. Computer Clock selection 
                determines how fast the comptuer will make its selections. 
                <br></br><b>Instant:</b> 0s, <b>Fast:</b> 2s, <b>Medium:</b> 5s, <b>Slow:</b> 10s<br></br>
                <b>User Time Always:</b> 30s<br></br>
                Once in the draft page, you can then add players to your favorites which will be 
                autoselected if your time expires and your team has room for that position. Finally, 
                click start in the upper right to begin the draft.
            </p>
            <div className='divider'></div>
            <div>
                <div className="section-container" style={{marginTop: -10, textAlign: "center"}}>
                    <h3 className="subheading size">League Size:</h3>
                    <ul className="size list">
                        {renderSizes}
                    </ul>
                    {/*hidden input to pass to form*/}
                    <input className="hidden-input" type="text" name='size' defaultValue={size}></input>
                </div>
                <div className="section-container">
                    <h3 className="subheading queue">Draft Position:</h3>
                    <ul className="queue list">
                        <div className="queue-container">
                            {renderQueue}
                        </div>
                    </ul>
                    <input className="hidden-input" type="text" name='queue' defaultValue={queue}></input>
                </div>
                <div className='section-container'>
                    <h3 className="subheading type">League Type:</h3>
                    <ul className='type list'>
                        {renderType}
                    </ul>
                    <input className="hidden-input" type="text" name='type' defaultValue={type}></input>
                </div>
                <div className='section-container players'>
                    <h3 className="subheading players">Players:</h3>
                    <ul className='players list'>
                        {renderPlayers}
                    </ul>
                </div>
                <div className='section-container clock'>
                    <h3 className="subheading clock">Computer Clock:</h3>
                    <ul className='clock list'>
                        {renderClocks}
                    </ul>
                </div>
                <div className='divider'></div>
                <div className='section-container submit'>
                    <Link 
                        to="/content"
                        state={{
                            leagueSize: size,
                            queuePosition: queue,
                            leagueType: type,
                            playersSize: [qbSize, rbSize, wrSize, teSize, flexSize, kSize, dstSize, 7],
                            clock: clock
                        }}
                    >
                        <input 
                            className="home-button submit" 
                            type='submit' 
                            value='Submit'>
                        </input>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home;