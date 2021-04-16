import React,{useEffect, useState} from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import personService from './services/Persons'
import Error from './components/Error'


const App=()=>{
  const [persons, setPersons] =useState([])
  

  const [newName, setNewName]=useState('')
  const [newNumber,setNewNumber]=useState('')
  const [filter,setFilter]=useState('')
  const [message,setMessage]=useState(null)
  const [errorMessage,setErrorMessage]=useState(null)

  useEffect(()=>{
    personService
      .getAll()
        .then(persons=>{
          setPersons(persons)
        })
      
  },[])
  

  const addPerson=(event)=>{
    event.preventDefault()

    const tarkistus=persons.map(person=>person.name.toLowerCase())
  

  if(!tarkistus.includes(newName.toLowerCase())){
    console.log(newName)
    const personObject={
      name:newName,
      number:newNumber
    }
    
    personService
      .create(personObject)
        .then(returnedPerson=>{
          setPersons(persons.concat(returnedPerson))
          setMessage(`Added ${newName}`)
    setTimeout(()=>{
      setMessage(null)
    },5000)
        }).catch(error=>{
          console.log(error.response.data.error)
          setErrorMessage(error.response.data.error)
          setTimeout(()=>{
            setErrorMessage(null)
          },5000)
        })
    setNewName('')
    setNewNumber('')
    
  }else if(window.confirm(`${newName} is already included in the phonebook, update number?`)){
  const person=persons.find(p=>p.name.toLowerCase()===newName.toLowerCase())
  const id=person.id
  const changedPerson={...person,number:newNumber}
  
  
  personService
    .update(id,changedPerson)
      .then(returnedPerson=>{
        setPersons(persons.map(person=>person.id!==id?person:returnedPerson))
      })
      .catch(error=>{
        
        setErrorMessage(`The information of ${person.name} has been removed`)
        setTimeout(()=>{
          setErrorMessage(null)
        },5000)
        setPersons(persons.filter(p=>p.id!==id))
      })
      
    setNewName('')
    setNewNumber('')
    setMessage(`Changed ${newName}'s number to ${newNumber}`)
    setTimeout(()=>{
      setMessage(null)
    },5000)
  
  }
  }

  const remove=(id)=>{
    const name=persons.find(p=>p.id===id).name
    if(window.confirm(`Really remove ${name}`))
    personService
      .remove(id)
        .then(setPersons(persons.filter(person=>person.id!==id)))
    setMessage(`Removed ${name}`)
    setTimeout(()=>{
      setMessage(null)
    },5000)
  }

  

  const handleAddName=(event)=>{
    setNewName(event.target.value)
  }

  const handleAddNumber=(event)=>{
    setNewNumber(event.target.value)
  }

  const handleFilter=(event)=>{
    setFilter(event.target.value)
  }

  const personsToShow=filter.length===0 ? persons:persons.filter(person=>person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Error message={errorMessage}/>
      Search: <input value={filter} onChange={handleFilter}/>

     <PersonForm addPerson={addPerson} newName={newName} handleAddName={handleAddName} newNumber={newNumber}
     handleAddNumber={handleAddNumber}/>

      
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} remove={(id)=>remove(id)}/>
    </div>
  )

}

export default App