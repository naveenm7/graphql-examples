const { GraphQLServer } = require('graphql-yoga');
const Store = require('data-store');
const store = new Store({ path: 'data.json' });

store.set("info", "Default Info");

const typeDefs = `
type Query {
  info: String
}
type Mutation {
  updateInfo(newInfo: String!): String!
  deleteInfo: String
}
`;

const resolvers = {
    Query: {
        info() {
            return store.get("info");
        }
    },
    Mutation: {
        updateInfo(parent, args, context, info) {
            store.set("info", args.newInfo);
            return args.newInfo;
        },
        deleteInfo() {
            store.set("info", null);
            return "Info deleted successfully";
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`))