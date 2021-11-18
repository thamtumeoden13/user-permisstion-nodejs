const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');


var fakeDatabase = {};

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
    
    type RandomDie {
        numSides: Int!
        rollOnce: Int!
        roll(numRolls: Int!): [Int]
    }
  
    input MessageInput {
        content: String
        author: String
    }

    type Message {
        id: ID!
        content: String
        author: String
    }

    type Query {
        quoteOfTheDay: String
        random: Float!
        rollThreeDice: [Int]
        rollDice(numDice: Int!, numSides: Int): [Int]
        getDie(numSides: Int): RandomDie
        getMessage(id: ID!): Message
        ip: String
    }

    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
    }
  
`);
class RandomDie {
    constructor(numSides) {
        this.numSides = numSides;
    }

    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides);
    }

    roll({ numRolls }) {
        var output = [];
        for (var i = 0; i < numRolls; i++) {
            output.push(this.rollOnce());
        }
        return output;
    }
}

// If Message had any complex fields, we'd put them on this object.
class Message {
    constructor(id, { content, author }) {
        this.id = id;
        this.content = content;
        this.author = author;
    }
}

const loggingMiddleware = (req, res, next) => {
    console.log('ip:', req.ip);
    next();
}

// The root provides a resolver function for each API endpoint
var root = {
    quoteOfTheDay: () => {
        return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
    },
    random: () => {
        return Math.random();
    },
    rollThreeDice: () => {
        return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
    },
    rollDice: ({ numDice, numSides }) => {
        var output = [];
        for (var i = 0; i < numDice; i++) {
            output.push(1 + Math.floor(Math.random() * (numSides || 6)));
        }
        return output;
    },
    getDie: ({ numSides }) => {
        return new RandomDie(numSides || 6);
    },
    getMessage: ({ id }) => {
        if (!fakeDatabase[id]) {
            throw new Error('no message exists with id ' + id);
        }
        return new Message(id, fakeDatabase[id]);
    },
    createMessage: ({ input }) => {
        // Create a random id for our "database".
        var id = require('crypto').randomBytes(10).toString('hex');

        fakeDatabase[id] = input;
        return new Message(id, input);
    },
    updateMessage: ({ id, input }) => {
        if (!fakeDatabase[id]) {
            throw new Error('no message exists with id ' + id);
        }
        // This replaces all old data, but some apps might want partial update.
        fakeDatabase[id] = input;
        return new Message(id, input);
    },
    ip: function (args, request) {
        return request.ip;
    }
};

var app = express();
app.use(loggingMiddleware);
app.use('/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');




// const { ROLE, users } = require('./data')
// const { authUser, authRole } = require('./basicAuth')
// const projectRouters = require('./routers/projects')

// const app = express()

// app.use(express.json())
// app.use(setUser)
// app.use('/projects', projectRouters)

// app.get('/', (req, res) => {
//     res.send('Home Page')
// })

// app.get('/dashboard', authUser, (req, res) => {
//     res.send('Dashboard Page')
// })

// app.get('/admin', authUser, authRole(ROLE.ADMIN), (req, res) => {
//     res.send('Admin Page')
// })

// function setUser(req, res, next) {
//     const userId = req.body.userId
//     if (userId) {
//         req.user = users.find(user => user.id == userId)
//     }
//     next()
// }

// app.listen(3000)