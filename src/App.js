import { useState, useEffect } from 'react'
import personService from './services/person'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [filterName, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPerson => {
        setPersons(initialPerson)
      })
  }, [])


  const addName = (e) => {
    e.preventDefault()
    const personObject = {
      name: newName,
      number: phoneNumber,
      date: new Date().toISOString(),
      id: persons.length + 1,
    }
    // console.log(e.target.value)
    if (!persons.some(person => person.name === newName)) {
      personService.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setPhoneNumber('')
        })
    } else if (persons.some(person => person.name === newName)) {
      const message = window.confirm(`${newName} is already added to phonebook, replace old number with new number?`)
      if (message) {
        const person = persons.find(n => n.name === newName)
        const id = person.id
        const editedPerson = { ...person, number: personObject.number }
        personService.update(id, editedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
          }).catch(e => console.log(e))
      }

    }
    else {
      alert(`${newName} is already added to phonebook`)
    }

  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setPhoneNumber(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const handleDelete = (personId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      personService.remove(personId)
        .then(returnedPerson => {
          console.log(returnedPerson)
          const remainingItem = persons.filter(person => person.id !== personId)
          setPersons(remainingItem)
        }).catch(error => {
          alert(error)
        })
    }

  }



  return (
    <div>
      <h2>Phonebook</h2>
      <label htmlFor='filter'>filter shown with:</label>
      <input value={filterName} onChange={handleFilterChange} id='filter' />
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={phoneNumber} onChange={handleNumberChange} type='text' id='phoneid' />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.filter(person => person.name.match(new RegExp(filterName, "i"))).map(person => <div key={person.id}>
        {person.name}{' '}{person.number}<button onClick={() => handleDelete(person.id)}>delete</button>
      </div>)}

    </div>

  )
}

export default App