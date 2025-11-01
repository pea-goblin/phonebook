const Person = ({ person, clickDelete }) => {
    return (
        <div>
            <li> {person.id} {person.name} {person.number}</li>
            <form action={
                () => clickDelete(person.id)}
            >
                <button type="submit">delete</button>
            </form>
        </div>
    )
}
export default Person;