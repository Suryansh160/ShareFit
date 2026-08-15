export function getIceServers () {
  return [{ urls: process.env.STUN_URL || 'stun:stun.l.google.com:19302' }]
}
