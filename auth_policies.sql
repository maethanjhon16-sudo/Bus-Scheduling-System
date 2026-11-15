-- Run in Supabase > SQL Editor (after schema.sql)
-- Removes the demo "anyone can edit" policies and
-- limits writes to logged-in users. Reading stays public.

drop policy if exists "Demo: public can insert" on public.bus_schedules;
drop policy if exists "Demo: public can update" on public.bus_schedules;
drop policy if exists "Demo: public can delete" on public.bus_schedules;

create policy "Admin can insert"
  on public.bus_schedules for insert to authenticated with check (true);
create policy "Admin can update"
  on public.bus_schedules for update to authenticated using (true) with check (true);
create policy "Admin can delete"
  on public.bus_schedules for delete to authenticated using (true);
