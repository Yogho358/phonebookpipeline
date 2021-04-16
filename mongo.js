/* eslint-disable no-undef */
const mongoose=require('mongoose')

if(process.argv.length<3){
  console.log('give password as argument')
  process.exit(1)
}

const password=process.argv[2]

const url=`mongodb+srv://fullstack:${password}@cluster0.b9oab.mongodb.net/<dbname>?retryWrites=true`

mongoose.connect(url,{ useNewUrlParser:true, useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true })

const personSchema=new mongoose.Schema({
  name:String,
  number:String
})

const Person=mongoose.model('Person',personSchema)

if(process.argv.length>3){

  const person=new Person({
    name:process.argv[3],
    number:process.argv[4]
  })

  // eslint-disable-next-line no-unused-vars
  person.save().then(response => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}else{
  console.log('Phonebook')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}