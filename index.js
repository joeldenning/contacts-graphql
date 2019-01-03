const express = require('express')
const {ApolloServer, gql} = require('apollo-server-express')
const db = require('./contacts.db.js')

// GraphQL schema
const typeDefs = gql(`
  type Query {
    allContacts: ContactList!
  }

  type Mutation {
    createIndividualContact(newContact: IndividualContactInput): IndividualContact
    updateIndividualContact(contactId: ID, contact: UpdateIndividualContactInput): IndividualContact
    createBusinessContact(newContact: BusinessContactInput): BusinessContact
    updateBusinessContact(contactId: ID, contact: UpdateBusinessContactInput): BusinessContact
  }

  input BusinessContactInput {
    contactType: ContactType!
    name: String!
    addresses: BusinessAddressesInput
    contactPerson: String
    ein: String
    businessType: BusinessType
    dateEstablished: Int
    industry: BusinessIndustry
    clientSince: Int
    source: String
    additionalInfo: String
  }

  input UpdateBusinessContactInput {
    contactType: ContactType
    name: String
    addresses: BusinessAddressesInput
    contactPerson: String
    ein: String
    businessType: BusinessType
    dateEstablished: Int
    industry: BusinessIndustry
    clientSince: Int
    source: String
    additionalInfo: String
  }

  input UpdateIndividualContactInput {
    contactType: ContactType
    firstName: String
    middleName: String
    lastName: String
    addresses: IndividualAddressesInput
    emails: IndividualContactEmailsInput
    ssn: String
    dateOfBirth: Int
    occupation: String
    clientSince: Int
    createdAt: Int
    source: String
    additionalInfo: String
  }

  input BusinessAddressesInput {
    mailingAddress: AddressInput
    physicalAddress: AddressInput
    otherAddress: AddressInput
  }

  input IndividualContactInput {
    contactType: ContactType!
    firstName: String!
    middleInitial: String
    lastName: String
    addresses: IndividualAddressesInput
    emails: IndividualContactEmailsInput
    ssn: String
    dateOfBirth: Int
    occupation: String
    clientSince: Int
    createdAt: Int
    source: String
    additionalInfo: String
  }

  input IndividualAddressesInput {
    mailingAddress: AddressInput
    homeAddress: AddressInput
    workAddress: AddressInput
    otherAddress: AddressInput
  }

  input IndividualContactEmailsInput {
    personalEmail: String
    workEmail: String
    otherEmail: String
  }

  input AddressInput {
    isPrimary: Boolean!
    addressLine1: String
    addressLine2: String
    country: String
    locality: String
    postalCode: String
    region: String
  }

  type ContactList {
    totalCount: Int!
    contacts: [Contact!]!
  }

  interface Contact {
    id: ID!
    isBusiness: Boolean!
    contactType: ContactType!
    name: String!
    addresses: Addresses!
    additionalInfo: String
  }

  enum ContactType {
    client
    prospect
    other
  }

  interface Addresses {
    mailingAddress: Address
  }

  type Address {
    isPrimary: Boolean!
    addressLine1: String
    addressLine2: String
    country: String
    locality: String
    postalCode: String
    region: String
  }

  type IndividualContact implements Contact {
    id: ID!
    isBusiness: Boolean!
    contactType: ContactType!
    name: String!
    firstName: String!
    middleInitial: String
    lastName: String!
    phones: IndividualContactPhones!
    emailAddresses: IndividualContactEmails!
    addresses: IndividualAddresses!
    ssn: String
    dateOfBirth: Int
    occupation: String
    clientSince: Int
    createdAt: Int
    source: String
    additionalInfo: String
  }

  type IndividualAddresses implements Addresses {
    mailingAddress: Address
    homeAddress: Address
    workAddress: Address
    otherAddress: Address
  }

  type IndividualContactPhones {
    homePhone: Phone
    mobilePhone: Phone
    workPhone: Phone
    faxNumber: Phone
    otherPhone: Phone
  }

  type IndividualContactEmails {
    personalEmail: String
    workEmail: String
    otherEmail: String
  }

  type Phone {
    number: String!
    extension: String
  }

  type BusinessContact implements Contact {
    id: ID!
    isBusiness: Boolean!
    contactType: ContactType!
    name: String!
    addresses: BusinessAddresses!
    contactPerson: String
    ein: String
    businessType: BusinessType
    dateEstablished: Int
    industry: BusinessIndustry
    clientSince: Int
    createdOn: Int
    source: String
    additionalInfo: String
  }

  type BusinessAddresses implements Addresses {
    mailingAddress: Address
    physicalAddress: Address
    otherAddress: Address
  }

  enum BusinessType {
    C_CORPORATION
    S_CORPORATION
    LLC
    PARTNERSHIP
    SOLE_PROPRIETORSHIP
    ESTATE
    TRUST
    NON_PROFIT
    OTHER
  }

  enum BusinessIndustry {
    ADMINISTRATIVE_AND_SUPPORT
    AGRICULTURE
    APPAREL
    ARTS
    CHEMICALS
    CONSTRUCTION
    EDUCATION
    ELECTRONICS
    ENERGY
    ENGINEERING
    ENTERTAINMENT
    FINANCE
    FISHING
    FOOD_SERVICES
    FORESTRY
    GOVERNMENT
    HEALTH_CARE
    HOSPITALITY
    HUNTING
    INFORMATION_TECHNOLOGY
    INSURANCE
    MANAGEMENT
    MANUFACTURING
    MEDIA
    MINING
    OTHER
    PHARMACEUTICALS
    PROFESSIONAL_SERVICES
    REAL_ESTATE
    RECREATION
    REMEDIATION_SERVICES
    RENTAL_AND_LEASING
    RETAIL_TRADE
    SCIENTIFIC_SERVICES
    SHIPPING
    SOCIAL_ASSISTANCE
    TECHNICAL_SERVICES
    TRANSPORTATION
    UTILITIES
    WAREHOUSING
    WASTE_MANAGEMENT
    WHOLESALE_TRADE
  }
`);

// Root resolver
const resolvers = {
  Query: {
    allContacts: db.getAllContacts,
  },
  Mutation: {
    createIndividualContact: db.createIndividualContact,
    updateIndividualContact: db.updateContact,
    createBusinessContact: db.createBusinessContact,
    updateBusinessContact: db.updateContact,
  },
  Contact: {
    contactType: obj => obj.contactType,
    __resolveType: obj => obj.isBusiness ? 'BusinessContact' : 'IndividualContact',
  },
  Addresses: {
    __resolveType: (...args) => {
      console.log('resolving', ...args)
      return 'IndividualAddresses'
    }
  },
};

// Create an express server and a GraphQL endpoint
const app = express();
const apolloServer = new ApolloServer({typeDefs, resolvers})
apolloServer.applyMiddleware({app})
app.listen(process.env.PORT || 4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
