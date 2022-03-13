function QueueButton({ value, onClick, id, className }) {
    return (
        <input
            onClick={onClick}
            value={value}
            id={id}
            type="button"
            className={className}
            >
        </input>
    );
}

export default QueueButton;