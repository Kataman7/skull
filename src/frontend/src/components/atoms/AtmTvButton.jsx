const AtmTvButton = ({
    handleClick = () => { },
    top = null,
    bottom = null,
    right = null,
    left = null,
    color = 'black',
    text = ''
}) => {
    return (
        <button style={{
            fontSize: '75px',
            position: 'absolute',
            ...(left !== null ? { left } : {}),
            ...(right !== null ? { right } : {}),
            ...(top !== null ? { top } : {}),
            ...(bottom !== null ? { bottom } : {}),
            backgroundColor: color,
            padding: '2px 10px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            color: 'white',
            fontWeight: 'bold',
            lineHeight: '0.8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '75px',
            height: '75px',
        }}
            onClick={handleClick}
        >
            {text}
        </button>
    );
};

export default AtmTvButton;