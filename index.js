const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const db = require('./contacts.db.js')

// GraphQL schema
const schema = buildSchema(`
  type Query {
    allContacts: ContactList!
  }

  type Mutation {
    createContact(contact: CreateContactInput): FullContact!
    updateContact(contact: UpdateContactInput): FullContact!
  }

  type ContactList {
    totalCount: Int!
    contacts: [FullContact!]!
  }

  type FullContact {
    id: ID!
    name: String!
  }

  input CreateContactInput {
    name: String!
  }

  input UpdateContactInput {
    id: ID!
    name: String!
  }
`);
// Root resolver
const root = {
  allContacts: db.getAllContacts,
  createContact: db.createContact,
  updateContact: db.updateContact,
};
// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
