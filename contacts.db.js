let nextId = 10

const contacts = [
  {
    id: '1',
    name: "Johnny Appleseed",
  },
  {
    id: '2',
    name: "Kurt Avarell",
  },
]

exports.getAllContacts = () => {
  return {
    contacts,
    totalCount: contacts.length,
  }
}

exports.createContact = input => {
  const fullContact = {...input.contact, id: nextId++}
  contacts.push(fullContact)

  return fullContact
}

exports.updateContact = input => {
  console.log('input', input)
  const newContact = input.contact
  const existingContact = contacts.find(contact => contact.id === newContact.id)
  if (!existingContact) {
    throw Error(`Cannot update contact with id '${newContact.id}' -- no such contact`)
  }

  const result = Object.assign(existingContact, newContact)

  return result
}
