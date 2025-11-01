const Filter = ({ text, changeText }) => {
    return (
        <div>
            filter shown with:
            <input
                type="text"
                value={text}
                onChange={changeText}
            />
        </div>
    )
}

export default Filter;