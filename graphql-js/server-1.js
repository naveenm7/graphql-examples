const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'QueryType',
        fields: {
            link: {
                type: GraphQLString,
                resolve() {
                    return 'https://google.co.in';
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