import React, { Component } from 'react';
import { render } from "@testing-library/react";
import { useState } from 'react';
import './Home.css';
import HomeButton from '../components/HomeButton';
import QueueButton from '../components/QueueButton';
import cx from 'classnames';
import PlayerInput from '../components/PlayerInput';

const sizes = [8, 10, 12, 14];
const types = ['Standard', 'PPR', 'Non-PPR'];
// const players = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DST'];
const players = [
    {
        name: 'QB',
        size: 2
    },
    {
        name: 'RB',
        size: 4
    },
    {
        name: 'WR',
        size: 4
    },
    {
        name: 'TE',
        size: 2
    },
    {
        name: 'FLEX',
        size: 4
    },
    {
        name: 'K',
        size: 2
    },
    {
        name: 'DST',
        size: 2
    }
];

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

    const [qbSize, setQbSize] = useState(1);
    const [rbSize, setRbSize] = useState(1);
    const [wrSize, setWrSize] = useState(1);
    const [teSize, setTeSize] = useState(1);
    const [flexSize, setFlexSize] = useState(1);
    const [kSize, setKSize] = useState(1);
    const [dstSize, setDstSize] = useState(1);

    const handleChange = (e) => {
        if (e.target.name === 'QB') {
            setQbSize(e.target.value);
        } else if (e.target.name === 'RB') {
            setRbSize(e.target.value);
        } else if (e.target.name === 'WR') {
            setWrSize(e.target.value);
        } else if (e.target.name === 'TE') {
            setTeSize(e.target.value);
        } else if (e.target.name === 'FLEX') {
            setFlexSize(e.target.value);
        } else if (e.target.name === 'K') {
            setKSize(e.target.value);
        } else if (e.target.name === 'DST') {
            setDstSize(e.target.value);
        }
    };

    const renderPlayers = players.map((i) =>
        <li key={i} className='list-element players'>
            <PlayerInput
                name={i.name}
                size={i.size}
                className="player-input"
                onChange={handleChange}
                />
        </li>
    );

    const handleSubmit = () => {
        
    };
    
    return (
        <div className='home-container'>
            <h2 className='heading'>Minute Mock</h2>
            <div className='divider'></div>
            <form onSubmit={handleSubmit}>
                <div className="section-container" style={{marginTop: -10, textAlign: "center"}}>
                    <h3 className="subheading size">League Size:</h3>
                    <ul className="size list">
                        {renderSizes}
                    </ul>
                    {/*hidden input to pass to form*/}
                    <input className="hidden-input" type="text" name='size' value={size}></input>
                </div>
                <div className="section-container">
                    <h3 className="subheading queue">Draft Position:</h3>
                    <ul className="queue list">
                        <div className="queue-container">
                            {renderQueue}
                        </div>
                    </ul>
                    <input className="hidden-input" type="text" name='queue' value={queue}></input>
                </div>
                <div className='section-container'>
                    <h3 className="subheading type">League Type:</h3>
                    <ul className='type list'>
                        {renderType}
                    </ul>
                    <input className="hidden-input" type="text" name='type' value={type}></input>
                </div>
                <div className='section-container'>
                    <h3 className="subheading players">Players:</h3>
                    <ul className='players list'>
                        {renderPlayers}
                    </ul>
                </div>
                <div className='section-container submit'>
                    <input className="home-button submit" type='submit' value='Submit'></input>
                </div>
            </form>
        </div>
    )
}

export default Home;