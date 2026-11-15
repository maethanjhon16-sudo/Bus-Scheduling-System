-- Run this in Supabase > SQL Editor
create table if not exists public.bus_schedules (
  schedule_id    bigint generated always as identity primary key,
  bus_number     text          not null,
  origin         text          not null,
  destination    text          not null,
  departure_time time          not null,
  fare           numeric(8,2)  not null check (fare >= 0),
  created_at     timestamptz   not null default now()
);

create index if not exists bus_schedules_origin_idx
  on public.bus_schedules (lower(origin));

alter table public.bus_schedules enable row level security;

-- Everyone can view schedules (public page)
create policy "Public can read schedules"
  on public.bus_schedules for select using (true);

-- DEMO ONLY: anyone can add/edit/delete. Replace with
-- "to authenticated" once you add an admin login.
create policy "Demo: public can insert"
  on public.bus_schedules for insert with check (true);
create policy "Demo: public can update"
  on public.bus_schedules for update using (true) with check (true);
create policy "Demo: public can delete"
  on public.bus_schedules for delete using (true);

-- Sample data
insert into public.bus_schedules (bus_number, origin, destination, departure_time, fare) values
  ('DV-101', 'Davao City', 'Tagum City',   '06:00', 120.00),
  ('DV-102', 'Davao City', 'Digos City',   '07:30',  90.00),
  ('DV-205', 'Tagum City', 'Davao City',   '08:15', 120.00),
  ('DV-310', 'Davao City', 'General Santos','09:00', 250.00);
