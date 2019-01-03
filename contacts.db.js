let nextId = 10

const contacts = [
  {
    id: '1',
    isBusiness: false,
    name: "Johnny Appleseed",
    contactType: "client",
    phones: {
      homePhone: {
        number: '8014444444',
      },
    },
    emailAddresses: {
      personalEmail: 'why@hello.com',
    },
    occupation: "Software Engineer",
    addresses: {
      mailingAddress: {
        isPrimary: false,
        addressLine1: '2524 E 3444 S',
        addressLine2: null,
        country: 'United States',
        locality: 'Salt Lake City',
        postalCode: '84199',
        region: 'UT'
      },
      homeAddress: {
        isPrimary: true,
        addressLine1: '2524 E 3444 S',
        addressLine2: null,
        country: 'United States',
        locality: 'Salt Lake City',
        postalCode: '84199',
        region: 'UT'
      },
      workAddress: {
        isPrimary: false,
        addressLine1: '2524 E 3444 S',
        addressLine2: null,
        country: 'United States',
        locality: 'Salt Lake City',
        postalCode: '84199',
        region: 'UT'
      },
      otherAddress: {
        isPrimary: false,
        addressLine1: '2524 E 3444 S',
        addressLine2: null,
        country: 'United States',
        locality: 'Salt Lake City',
        postalCode: '84199',
        region: 'UT'
      },
    },
    ssn: '234234243',
    dateOfBirth: 123,
    occupation: 'Engineer',
    clientSince: 123,
    createdAt: 123,
    source: 'referral',
    additionalInfo: 'This person is sorta hard to work with.',
  },
  {
    id: '2',
    isBusiness: true,
    name: "Jackson Hewitt",
    contactType: "prospect",
    addresses: {
      mailingAddress: {
        isPrimary: false,
      },
    },
    contactPerson: "Rod Gilbert",
    additionalInfo: "Enterprisey",
    industry: 'GOVERNMENT',
    businessType: 'C_CORPORATION',
  },
]

exports.getAllContacts = () => {
  return {
    contacts,
    totalCount: contacts.length,
  }
}

exports.createIndividualContact = (_, input) => {
  const contact = input.newContact
  contact.isBusiness = false
  contact.name = contact.firstName + (contact.middleInitial ? ` ${contact.middleInitial}` : '') + (contact.lastName ? ` ${contact.lastName}` : '')
  contact.addresses = contact.addresses || {}
  contact.emailAddresses = contact.emailAddresses || {}
  const fullContact = {...contact, id: String(nextId++)}
  contacts.push(fullContact)

  return fullContact
}

exports.createBusinessContact = (_, input) => {
  const contact = input.newContact
  contact.isBusiness = true
  contact.addresses = contact.addresses || {}
  const fullContact = {...contact, id: String(nextId++)}
  contacts.push(fullContact)

  return fullContact
}

exports.updateContact = (_, input) => {
  const newContact = input.contact
  const id = input.contactId
  const existingContact = contacts.find(contact => contact.id === id)
  if (!existingContact) {
    throw Error(`Cannot update contact with id '${id}' -- no such contact`)
  }

  const result = Object.assign(existingContact, newContact)

  return result
}
