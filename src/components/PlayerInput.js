function PlayerInput({ name, onChange, className, size, initVal }) {
    return (
        <div key={name} className="player-element">
            <label htmlFor={name}>{name}</label>
            <select name={name} onChange={onChange} defaultValue={initVal}>
                {Array.from({length: size + 1}, (_, i) => i).map((i) => 
                    <option 
                        key={name + i} 
                        value={i}
                    >
                        {i}
                    </option>
                )}
            </select>
        </div>
    );
}

export default PlayerInput;