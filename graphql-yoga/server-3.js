const { GraphQLServer } = require('graphql-yoga');
const Store = require('data-store');
const store = new Store({ path: 'data.json' });

const typeDefs = `
    type Query {
        author(id: ID!): Author
        authors: [Author!]!
        book(id: ID!): Book
        books: [Book!]!
    }
    type Mutation {
        addAuthor(id: ID!, name: String!): Author
        addBook(id: ID!, title: String!, author: AuthorData): Book
    }
    type Author {
        id: ID!
        name: String!
        books: [Book]
    }
    type Book {
        id: ID!
        title: String!
        author: Author
    }
    input AuthorData {
        id: ID!
        name: String!
    }
`;

const resolvers = {
    Query: {
        author(parent, args, context, info) {
            let authors = store.get("authors");
            if (!authors) return null;
            let author = authors.filter(author => author.id === args.id);
            return author[0];
        },
        authors() {
            return store.get("authors");
        },
        book(parent, args, context, info) {
            let books = store.get("books");
            if (!books) return null;
            let book = books.filter(book => book.id === args.id);
            return book[0];
        }
    },
    Mutation: {
        addAuthor(parent, args, context, info) {
            let authors = store.get("authors");
            if (!authors) authors = [];
            let author = {
                id: args.id,
                name: args.name
            };
            authors.push(author);
            store.set("authors", authors);
            return author;
        },
        addBook(parent, args, context, info) {
            let books = store.get("books");
            if (!books) books = [];
            let book = {
                id: args.id,
                title: args.title,
                author: args.author
            };
            books.push(book);
            store.set("books", books);
            return book;
        }
    },
    Author: {
        books(parent, args, context, info) {
            let books = store.get("books");
            let authorBooks = books.filter(book => book.author.id === parent.id);
            return authorBooks;
        }
    }

};

const server = new GraphQLServer({
    typeDefs,
    resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`))