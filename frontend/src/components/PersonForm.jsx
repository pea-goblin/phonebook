const PersonForm = (props) => {
    const { addName, name, number, changeName, changeNumber } = props;
    return (
        <form onSubmit={addName}>
            <div>name:
                <input
                    value={name}
                    onChange={changeName}
                />
            </div>
            <div>
                number:
                <input
                    value={number}
                    onChange={changeNumber}
                />
            </div>

            <div>
                <button
                    type="submit"
                >
                    Add
                </button>
            </div>

        </form>
    )
}

export default PersonForm;