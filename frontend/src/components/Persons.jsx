import Person from "./Person";

const Persons = ({ persons, clickDelete }) => {
    return (
        <div>
            {
                persons.map(p => {
                    return (
                        <Person
                            key={p.id}
                            person={p}
                            clickDelete={clickDelete}
                        />
                    )
                })
            }
        </div>
    )
}
export default Persons;