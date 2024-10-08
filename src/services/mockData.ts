import { SlavePc } from '../types';

export const mockSlavePcs: SlavePc[] = [
  {
    id: 'pc-001',
    name: 'Slave PC 1',
    status: 'online',
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 'pc-002',
    name: 'Slave PC 2',
    status: 'offline',
    lastUpdate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 'pc-003',
    name: 'Slave PC 3',
    status: 'online',
    lastUpdate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
];

export function getRandomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}