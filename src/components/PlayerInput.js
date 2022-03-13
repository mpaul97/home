function PlayerInput({ name, onChange, className, size }) {
    return (
        <div key={name} className="player-element">
            <label htmlFor={name}>{name}</label>
            <select name={name} onChange={onChange}>
                {Array.from({length: size}, (_, i) => i + 1).map((i) => 
                    <option key={name + i} value={i}>{i}</option>
                )}
            </select>
        </div>
    );
}

export default PlayerInput;