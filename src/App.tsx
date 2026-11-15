import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { supabase } from './lib/supabase'
import type { BusSchedule, ScheduleInput } from './types'
import './App.css'

const emptyForm = {
  bus_number: '',
  origin: '',
  destination: '',
  departure_time: '',
  fare: '',
}

const formatTime = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

const formatFare = (n: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n)

export default function App() {
  const [schedules, setSchedules] = useState<BusSchedule[]>([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  // Display + search by departure location (debounced, server-side)
  useEffect(() => {
    let stale = false
    const timer = setTimeout(async () => {
      setLoading(true)
      let q = supabase.from('bus_schedules').select('*').order('departure_time')
      if (search.trim()) q = q.ilike('origin', `%${search.trim()}%`)
      const { data, error } = await q
      if (stale) return
      if (error) setError(error.message)
      else {
        setError('')
        setSchedules(data as BusSchedule[])
      }
      setLoading(false)
    }, 250)
    return () => {
      stale = true
      clearTimeout(timer)
    }
  }, [search, reload])

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  // Add + edit
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const payload: ScheduleInput = {
      bus_number: form.bus_number.trim(),
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      departure_time: form.departure_time,
      fare: Number(form.fare),
    }
    const { error } =
      editingId === null
        ? await supabase.from('bus_schedules').insert(payload)
        : await supabase.from('bus_schedules').update(payload).eq('schedule_id', editingId)
    if (error) return setError(error.message)
    cancelEdit()
    setReload((n) => n + 1)
  }

  const startEdit = (s: BusSchedule) => {
    setEditingId(s.schedule_id)
    setForm({
      bus_number: s.bus_number,
      origin: s.origin,
      destination: s.destination,
      departure_time: s.departure_time.slice(0, 5),
      fare: String(s.fare),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  // Delete
  const remove = async (s: BusSchedule) => {
    if (!confirm(`Delete ${s.bus_number} (${s.origin} to ${s.destination})?`)) return
    const { error } = await supabase.from('bus_schedules').delete().eq('schedule_id', s.schedule_id)
    if (error) return setError(error.message)
    setReload((n) => n + 1)
  }

  return (
    <main>
      <header>
        <h1>Bus Schedules</h1>
        <label className="search">
          <span>Departing from</span>
          <input
            type="search"
            placeholder="e.g. Davao City"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </header>

      {error && <p className="error" role="alert">{error}</p>}

      <section aria-label="Schedules">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Bus</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Departs</th>
              <th>Fare</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.schedule_id}>
                <td data-label="ID">{s.schedule_id}</td>
                <td data-label="Bus" className="bus">{s.bus_number}</td>
                <td data-label="Origin">{s.origin}</td>
                <td data-label="Destination">{s.destination}</td>
                <td data-label="Departs" className="time">{formatTime(s.departure_time)}</td>
                <td data-label="Fare">{formatFare(s.fare)}</td>
                <td className="actions">
                  <button onClick={() => startEdit(s)}>Edit</button>
                  <button className="danger" onClick={() => remove(s)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && schedules.length === 0 && (
          <p className="empty">
            {search ? `No buses leave from "${search}". Try another location.` : 'No schedules yet. Add the first one below.'}
          </p>
        )}
      </section>

      <section aria-label="Schedule form">
        <h2>{editingId === null ? 'Add a schedule' : `Edit schedule #${editingId}`}</h2>
        <form onSubmit={onSubmit}>
          <label>Bus number<input name="bus_number" value={form.bus_number} onChange={onChange} required /></label>
          <label>Origin<input name="origin" value={form.origin} onChange={onChange} required /></label>
          <label>Destination<input name="destination" value={form.destination} onChange={onChange} required /></label>
          <label>Departure time<input type="time" name="departure_time" value={form.departure_time} onChange={onChange} required /></label>
          <label>Fare (PHP)<input type="number" name="fare" min="0" step="0.01" value={form.fare} onChange={onChange} required /></label>
          <div className="form-actions">
            <button type="submit" className="primary">{editingId === null ? 'Add schedule' : 'Save changes'}</button>
            {editingId !== null && <button type="button" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
      </section>
    </main>
  )
}
