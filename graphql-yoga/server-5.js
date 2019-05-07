const { GraphQLServer } = require('graphql-yoga');
const Store = require('data-store');
const store = new Store({ path: 'data.json' });
const jwt = require('jsonwebtoken');

console.log(jwt.sign({ "id": "P1" }, "AAABBBCCC"));

const typeDefs = `
    type Query {
        messages: [Message!]!
        message(id: ID!): Message
        persons: [Person!]!
        person(id: ID!): Person
    }
    type Mutation {
        createMessage(id: ID!, description: String, person: PersonData!): Message
        createPerson(id: ID!, name: String): Person
    }
    type Message {
        id: ID!
        description: String
        person: Person!
    }
    type Person {
        id: ID!
        name: String
        messages: [Message!]
    }
    input PersonData {
        id: ID!
    }
`;

const resolvers = {
    Query: {
        messages(parent, args, context, info) {
            let userId = verifyUser(context.request.headers.authorization);
            let userMessages = [];
            if (userId) {
                let messages = store.get("messages");
                if (!messages) messages = [];
                userMessages = messages.filter(message => message.person.id === userId);
            }
            return userMessages;
        },
        message(parent, args, context, info) {
            let messages = store.get("messages");
            if (!messages) messages = [];
            let message = messages.filter(message => message.id === args.id);
            return message[0];
        },
        persons(parent, args, context, info) {
            let persons = store.get("persons");
            if (!persons) persons = [];
            return persons;
        },
        person(parent, args, context, info) {
            let persons = store.get("persons");
            if (!persons) persons = [];
            let person = persons.filter(person => person.id === args.id);
            return person[0];
        }
    },
    Mutation: {
        createMessage(parent, args, context, info) {
            let messages = store.get("messages");
            if (!messages) messages = [];
            let persons = store.get("persons");
            let person = persons.filter(person => person.id === args.person.id);
            if (person.length === 0) {
                person = {
                    id: args.person.id
                };
                persons.push(person);
                store.set("persons", persons);
            }
            let newMessage = {
                id: args.id,
                description: args.description,
                person: person
            };
            messages.push(newMessage);
            store.set("messages", messages);
            return newMessage;
        },
        createPerson(parent, args, context, info) {
            let persons = store.get("persons");
            if (!persons) persons = [];
            let newPerson = {
                id: args.id,
                name: args.name
            };
            persons.push(newPerson);
            store.set("persons", persons);
            return newPerson;
        }
    },
    Person: {
        messages(parent, args, context) {
            let personId = parent.id;
            let messages = store.get("messages");
            if (!messages) messages = [];
            let personalMessages = messages.filter(message => message.person.id === personId);
            return personalMessages;
        }
    }
};

function verifyUser(jwtToken) {
    try {
        let user = jwt.verify(jwtToken, "AAABBBCCC");
        return user.id;
    } catch (err) {
        return false;
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: request => {
        return {
            ...request,
        }
    },
});

server.start(() => console.log(`Server is running on http://localhost:4000`))