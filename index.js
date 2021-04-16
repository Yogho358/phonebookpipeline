const express=require('express')
require('dotenv').config()
const morgan=require('morgan')
const app=express()
app.use(express.json())
const cors=require('cors')
app.use(cors())
app.use(express.static('build'))
const Person=require('./models/person')

// eslint-disable-next-line no-unused-vars
morgan.token('person',function(request,response){
  console.log(JSON.stringify(request.body))
  return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/health',(req,res) => {
  res.send('ok')
})

app.get('/version',(req,res) => {
  res.send('2')
})

app.delete('/api/persons/:id',(request,response,next) => {
  Person.findByIdAndRemove(request.params.id)
    // eslint-disable-next-line no-unused-vars
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info',(request,response) => {
  const date=new Date()


  Person.countDocuments({},(err,count) => {
    response.send(`Phonebook has info for ${count} people on ${date}`)
  })


})

app.get('/api/persons',(request,response,next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id',(request,response,next) => {
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person.toJSON())
    }else{
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.post('/api/persons',(request,response,next) => {
  const body=request.body

  const person=new Person({
    name:body.name,
    number:body.number
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id',(request,response,next) => {
  const body=request.body

  const person={
    name:body.name,
    number:body.number
  }
  Person.findByIdAndUpdate(request.params.id,person,{ new:true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})



const unknownEndpoint=(request,response) => {
  response.status(404).send({ error:'unknown endpoint' })
}
app.use(unknownEndpoint)



// eslint-disable-next-line no-unused-vars
const errorHandler=(error,request,response,next) => {
  return response.status(400).send({ error: error.message })

}

app.use(errorHandler)


// eslint-disable-next-line no-undef
const PORT=process.env.PORT
app.listen(PORT,() => {
  console.log(`server running on port ${PORT}`)

})