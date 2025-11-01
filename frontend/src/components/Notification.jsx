
const Notification = ({ type, message }) => {
    if (!message) {
        return null;
    }

    console.log(type)
    return (<div className={type}>
        {message}
    </div>
    );
}

export default Notification;