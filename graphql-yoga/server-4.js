const { GraphQLServer } = require('graphql-yoga');
const Store = require('data-store');
const store = new Store({ path: 'data.json' });

const typeDefs = `
    type Query {
        character(id: ID!): Character
    }
    type Mutation {
        addHuman(data: HumanData): Human
        addDroid(data: DroidData): Droid
    }
    interface Character {
        id: ID!
        name: String!
        appearsIn: [Episode]!
    }
    type Human implements Character {
        id: ID!
        name: String!
        appearsIn: [Episode]!
        totalCredits: Int
    }
    type Droid implements Character {
        id: ID!
        name: String!
        appearsIn: [Episode]!
        primaryFunction: String
    }  
    type Episode {
        title: String!
    }
    input HumanData {
        id: ID!
        name: String!
        appearsIn: [EpisodeData]!
        totalCredits: Int!
    }
    input DroidData {
        id: ID!
        name: String!
        appearsIn: [EpisodeData]!
        primaryFunction: String!
    }
    input EpisodeData {
        title: String!
    }
`;

const resolvers = {
    Query: {
        character(parent, args, context, info) {
            let humans = store.get("humans");
            if (humans) {
                let human = humans.filter(human => human.id === args.id);
                if (human.length > 0) return human[0];
            }
            let droids = store.get("droids");
            if (droids) {
                let droid = droids.filter(droid => droid.id === args.id);
                if (droid.length > 0) return droid[0];
            }
            return null;
        }
    },
    Mutation: {
        addHuman(parent, args, context, info) {
            let humans = store.get("humans");
            if (!humans) humans = [];
            humans.push(args.data);
            store.set("humans", humans);
            return args.data;
        },
        addDroid(parent, args, context, info) {
            let droids = store.get("droids");
            if (!droids) droids = [];
            droids.push(args.data);
            store.set("droids", droids);
            return args.data;
        }
    },
    Character: {
        __resolveType(obj, context, info) {
            if (obj.totalCredits) return "Human";
            return "Droid";
        }
    },

};

const server = new GraphQLServer({
    typeDefs,
    resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`))