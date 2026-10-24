// Test/example processes fail closed if code tries to open a network connection.
import { syncBuiltinESMExports } from 'node:module'
import net from 'node:net'
import http from 'node:http'
import https from 'node:https'
import tls from 'node:tls'
import dgram from 'node:dgram'

function blocked() { throw new Error('Network access is disabled in showcase tests and examples') }
globalThis.fetch = blocked
globalThis.WebSocket = class { constructor() { blocked() } }
net.connect = blocked
net.createConnection = blocked
net.Socket.prototype.connect = blocked
http.request = blocked
http.get = blocked
https.request = blocked
https.get = blocked
tls.connect = blocked
dgram.createSocket = blocked
syncBuiltinESMExports()
