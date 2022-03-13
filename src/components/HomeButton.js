function HomeButton({ value, onClick, id, className }) {
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

export default HomeButton;