import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null

  connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket
    }

    const host = window.location.hostname
    const port = window.location.port === '5173' ? '5000' : window.location.port
    const socketUrl = `http://${host}:${port}`

    this.socket = io(socketUrl, {
      path: '/ws',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to SwipeRide Real-Time Gateway:', this.socket?.id)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason)
    })

    this.socket.on('error', (err) => {
      console.error('[Socket] Error:', err)
    })

    return this.socket
  }

  getSocket(): Socket | null {
    return this.socket || this.connect()
  }

  joinRoom(userId?: string, driverId?: string) {
    const socket = this.getSocket()
    if (socket) {
      socket.emit('join', { userId, driverId })
    }
  }

  updateDriverLocation(driverId: string, lat: number, lng: number) {
    const socket = this.getSocket()
    if (socket) {
      socket.emit('driverLocationUpdate', { driverId, lat, lng })
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export const socketService = new SocketService()
