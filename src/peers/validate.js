exports.peerId = peerId => {
  if (typeof peerId !== 'string' || !peerId) {
    throw new Error('invalid peer ID')
  }
}

exports.name = name => {
  if (typeof name !== 'string' || !name) {
    throw new Error('invalid name')
  }
}

exports.avatar = avatar => {
  if (typeof avatar !== 'string' || !avatar) {
    throw new Error('invalid avatar')
  }
}

exports.lastSeenAt = lastSeenAt => {
  if (typeof lastSeenAt !== 'number' || lastSeenAt <= 0) {
    throw new Error('invalid last seen time')
  }
}

exports.lastMessage = msg => {
  if (!msg) {
    throw new Error('invalid message')
  }

  if (typeof msg.id !== 'string' || !msg.id) {
    throw new Error('invalid message ID')
  }

  if (typeof msg.text !== 'string' || !msg.text) {
    throw new Error('invalid message text')
  }

  if (typeof msg.receivedAt !== 'number' || msg.receivedAt <= 0) {
    throw new Error('invalid message received time')
  }

  if (msg.readAt != null && (typeof msg.readAt !== 'number' || msg.readAt <= 0)) {
    throw new Error('invalid message read time')
  }
}