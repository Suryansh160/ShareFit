export function getIceServers () {
  return [
    {
      urls: process.env.STUN_URL || 'stun:stun.l.google.com:19302'
    },
    {
      urls: [
        'turn:global.relay.metered.ca:80',
        'turn:global.relay.metered.ca:80?transport=tcp',
        'turn:global.relay.metered.ca:443',
        'turns:global.relay.metered.ca:443?transport=tcp'
      ],
      username: process.env.TURN_USERNAME,
      credential: process.env.TURN_PASSWORD
    }
  ]
}
