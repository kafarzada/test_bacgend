const express = require('express')
const graphql = require("express-graphql")
const mongoose = require('mongoose')


const schema = require("./schema/schema")

const app = express()
const PORT = 3005



mongoose.connect('mongodb+srv://kafarzada:09799118vurgun@fullstack.m7sgr.mongodb.net/app_graphql?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true})

app.use("/graphql", graphql.graphqlHTTP({
    schema,
    graphiql: true
}))


const dbConnection = mongoose.connection 
dbConnection.on('error', err => console.log("Connectoion error", err))
dbConnection.once('open', () => console.log('Connected to DB'))

const c = require('./mongoose_models/City')



app.listen(PORT, err => {
    err ? console.log(err) : console.log("Server started");
})