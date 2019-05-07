const { GraphQLSchema, GraphQLObjectType, GraphQLBoolean, GraphQLList, GraphQLInt } = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');

const mockDb = [1, 2, 3, 4, 5, 6, 7, 8];

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'QueryType',
        fields: {
            numbers: {
                type: GraphQLList(GraphQLInt),
                args: {
                    "evenOnly": {
                        type: GraphQLBoolean
                    }
                },
                resolve(parent, args, context, info) {
                    if (args.evenOnly) {
                        return mockDb.filter(number => number % 2 == 0);
                    }
                    return mockDb;
                }
            }
        }
    })
});

const app = express();
app.use("/", graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/');