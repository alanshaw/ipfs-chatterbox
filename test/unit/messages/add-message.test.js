import test from 'ava'
import hat from 'hat'
import { fakePeerId } from '../../_helpers'
import AddMessage from '../../../src/messages/add-message'

const fakeMessage = () => ({ id: hat(), text: hat(), receivedAt: Date.now() })

test('should validate passed peer ID', async t => {
  const ipfs = {}
  const peers = {}
  const syndicate = {}
  const getMessagesPath = () => {}
  const getMessagesList = () => {}
  const friendsMessageHistorySize = 1000

  const addMessage = AddMessage({
    ipfs,
    peers,
    syndicate,
    getMessagesPath,
    getMessagesList,
    friendsMessageHistorySize
  })

  let err

  err = await t.throwsAsync(addMessage(null))
  t.is(err.message, 'invalid peer ID')

  err = await t.throwsAsync(addMessage('NOT A PEER ID'))
  t.is(err.message, 'invalid peer ID')
})

test('should validate passed text', async t => {
  const ipfs = {}
  const peers = {}
  const syndicate = {}
  const getMessagesPath = () => {}
  const getMessagesList = () => {}
  const friendsMessageHistorySize = 1000

  const addMessage = AddMessage({
    ipfs,
    peers,
    syndicate,
    getMessagesPath,
    getMessagesList,
    friendsMessageHistorySize
  })

  const err = await t.throwsAsync(addMessage(fakePeerId(), null))

  t.is(err.message, 'invalid message text')
})

test('should add a message for a peer', async t => {
  const repoDir = `/${Date.now()}`
  const peerId = fakePeerId()
  const text = hat()
  let messages = [fakeMessage()]

  const ipfs = {
    _id: hat(),
    id: () => ({ id: ipfs._id }),
    files: {
      write: (path, data) => {
        t.is(path, getMessagesPath(peerId))
        messages = JSON.parse(data)
      }
    }
  }
  const peers = {
    __unsafe__: {
      set: () => {},
      get: () => {}
    }
  }
  const syndicate = { publish: () => {} }
  const getMessagesPath = peerId => `${repoDir}/${peerId}/messages.json`
  const getMessagesList = () => messages
  const friendsMessageHistorySize = 1000

  const addMessage = AddMessage({
    ipfs,
    peers,
    syndicate,
    getMessagesPath,
    getMessagesList,
    friendsMessageHistorySize
  })

  await addMessage(peerId, text)

  t.is(messages.length, 1) // Only the last message per peer is retained
  t.deepEqual(messages[0].text, text)
})

test('should add a message for a friend', async t => {
  const repoDir = `/${Date.now()}`
  const peerId = fakePeerId()
  const text = hat()
  const message = fakeMessage()
  let messages = [message]

  const ipfs = {
    _id: fakePeerId(),
    id: () => ({ id: ipfs._id }),
    files: {
      write: (path, data) => {
        t.is(path, getMessagesPath(peerId))
        messages = JSON.parse(data)
      }
    }
  }
  const peers = {
    __unsafe__: {
      set: () => {},
      get: () => ({
        id: peerId,
        isFriend: true
      })
    }
  }
  const syndicate = { publish: () => {} }
  const getMessagesPath = peerId => `${repoDir}/${peerId}/messages.json`
  const getMessagesList = () => messages
  const friendsMessageHistorySize = 1000

  const addMessage = AddMessage({
    ipfs,
    peers,
    syndicate,
    getMessagesPath,
    getMessagesList,
    friendsMessageHistorySize
  })

  await addMessage(peerId, text)

  t.is(messages.length, 2)
  t.deepEqual(messages[0], message)
  t.deepEqual(messages[1].text, text)
})

test('should limit message history for friends', async t => {
  const repoDir = `/${Date.now()}`
  const peerId = fakePeerId()
  const text = hat()
  const message = fakeMessage()
  let messages = [message]

  const ipfs = {
    _id: fakePeerId(),
    id: () => ({ id: ipfs._id }),
    files: {
      write: (path, data) => {
        t.is(path, getMessagesPath(peerId))
        messages = JSON.parse(data)
      }
    }
  }
  const peers = {
    __unsafe__: {
      set: () => {},
      get: () => ({
        id: peerId,
        isFriend: true
      })
    }
  }
  const syndicate = { publish: () => {} }
  const getMessagesPath = peerId => `${repoDir}/${peerId}/messages.json`
  const getMessagesList = () => messages
  const friendsMessageHistorySize = 1

  const addMessage = AddMessage({
    ipfs,
    peers,
    syndicate,
    getMessagesPath,
    getMessagesList,
    friendsMessageHistorySize
  })

  await addMessage(peerId, text)

  t.is(messages.length, 1)
  t.deepEqual(messages[0].text, text)
})

test('should add a message from self', async t => {
  const repoDir = `/${Date.now()}`
  const peerId = fakePeerId()
  const text = hat()
  const message = fakeMessage()
  let messages = [message]

  const ipfs = {
    id: () => ({ id: peerId }),
    files: {
      write: (path, data) => {
        t.is(path, getMessagesPath(peerId))
        messages = JSON.parse(data)
      }
    }
  }
  const peers = {
    __unsafe__: {
      set: () => {},
      get: () => ({
        id: peerId
      })
    }
  }
  const syndicate = { publish: () => {} }
  const getMessagesPath = peerId => `${repoDir}/${peerId}/messages.json`
  const getMessagesList = () => messages
  const friendsMessageHistorySize = 1000

  const addMessage = AddMessage({
    ipfs,
    peers,
    syndicate,
    getMessagesPath,
    getMessagesList,
    friendsMessageHistorySize
  })

  await addMessage(peerId, text)

  t.is(messages.length, 2)
  t.deepEqual(messages[0], message)
  t.deepEqual(messages[1].text, text)
})
