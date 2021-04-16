
import Person from './Person'

const Persons=(props)=>{

  
return(
    <div>
        <ul>
        {props.personsToShow.map(person=>
          <Person key={person.name} person={person} remove={()=>props.remove(person.id)}/>)}
        
      </ul>
    </div>
)
        }

        export default Persons