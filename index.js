const express = require('express')
const app = express()

const morgan = require('morgan')

const cors = require('cors')

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
  ]
app.use(express.json())
app.use(morgan('tiny'))

/*app.use(
  morgan(
    "Method- :method URL- :url Status- :status ResponseTime-  :response-time ms"
  )
);*/

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))
app.use(cors())

app.get('/api/persons', (request, response) => {
  response.json(persons)
})
//Exercise 3.2

app.get('/info', (request, response) => {
  const dRequest = new Date()
  response.send(`<p>Phone has info for ${persons.length} people</p> ${dRequest}`)
})
//Execise 3.3
app.get('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})
//Exercise 3.4
app.delete('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id)
  const person = persons.filter(person => person.id !== id)
  response.status(204).end()
})

// Exercise 3.5

//geneate a random idea let the max be 100 and the min 4
/*const randomId = () => {
  newId = Math.floor(Math.random() * 100) + 4
}*/
app.post('/api/persons',(request, response) => {

  const body = request.body

  if (!body.name) {
    return response.status(404).json({
      error: "name missing"
    });
  }

  if (!body.number) {
    return response.status(404).json({
      error: "number missing"
    });
  }
  const person = {
       name: body.name,
       number: body.number,
       id: Math.floor(Math.random() * 1000)
     }
  persons =  persons.concat(person)

 response.json(person)

})

const PORT = process.env.PORT || 3001 // Exercise 3.9
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
