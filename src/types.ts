export interface SlavePc {
  id: string
  name: string
  status: 'online' | 'offline'
  lastUpdate: string
}