
import { useState, useEffect } from "react";
import personServices from "./services/persons";
import axios from "axios";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import Notification from "./components/Notification";

function App() {
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState('');
  const [number, setNumber] = useState('');
  const [searchName, setSearchName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    if (!persons) {
      personServices
        .getAll()
        .then(p => setPersons(p));
    }
  }, []);

  if (!persons) {
    return <div>Loading...</div>;;
  }

  const lowerCaseName = searchName.toLowerCase();

  const handleClickDelete = (id) => {
    const person = persons.find(p => p.id === id);

    if (window.confirm(`Do you want to delete ${person.name} ?`)) {
      personServices
        .deleteOne(id)
        .then(res => {
          setPersons(
            persons.filter(p => p.id !== id)
          )
          setType("success");
          setErrorMessage(`Deleted ${newName}`);
        }
        );
    }
  }

  const filteredPersons = persons.filter(p => {
    if (p?.name.toLocaleLowerCase().includes(lowerCaseName)) {
      return p;
    }
  });

  const addName = (e) => {
    e.preventDefault();
    const person = persons.find(p => p.name === newName);

    if (!person) {
      const newPerson = { id: String(Math.floor(Math.random() * 100000)), name: newName, number: number };
      personServices
        .create(newPerson)
        .then(res => {
          setPersons(persons.concat(res));
          setType("success");
          setErrorMessage(`Added ${newName} to the phonebook`);
        })
        .catch(error => {
          setType("failed")
          setErrorMessage(error.message);
        })
        ;
      setSearchName("");
      setNewName("");
      setNumber("");

    } else if (window.confirm(`${person.name} exist in phone book, do you want replace old ?`)) {
      const newPerson = {
        ...person, number: number
      }
      personServices
        .update(person.id, newPerson)
        .then(res => {
          setPersons(persons.map(p =>
            p.id === newPerson.id ? res : p)
          )
          setType("success");
          setErrorMessage(`Changed number of ${newName} to ${number}`);
        })
        .catch(error => {
          setType("failed");
          setErrorMessage(error.message);
        });
      setSearchName("");
      setNewName("");
      setNumber("");
    }

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000
    )
    // clearTimeout(timer);
  }

  const handleChangeName = (e) => {
    setNewName(e.target.value);
  }
  const handleChangeNumber = e => {
    setNumber(e.target.value);
  }
  const handleChangeSearchName = (e) => {
    setSearchName(e.target.value);
  }

  const formProps = { addName, name: newName, number, changeName: handleChangeName, changeNumber: handleChangeNumber }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        type={type}
        message={errorMessage}
      />
      <Filter
        text={searchName}
        changeText={handleChangeSearchName}
      />

      <h2>Add a new</h2>
      <PersonForm
        {...formProps}
      />

      <h2>Numbers</h2>
      <Persons
        persons={filteredPersons}
        clickDelete={(id) => handleClickDelete(id)}
      />
    </div>
  )
}

export default App
