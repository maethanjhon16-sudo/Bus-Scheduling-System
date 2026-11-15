export interface BusSchedule {
  schedule_id: number
  bus_number: string
  origin: string
  destination: string
  departure_time: string // "HH:MM:SS" from Postgres
  fare: number
}

export type ScheduleInput = Omit<BusSchedule, 'schedule_id'>
