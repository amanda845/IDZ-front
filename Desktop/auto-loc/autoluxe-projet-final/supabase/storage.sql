-- ============================================================
-- STORAGE SETUP - Run this AFTER schema.sql
-- ============================================================

-- Create the 'licenses' bucket (private)
insert into storage.buckets (id, name, public)
values ('licenses', 'licenses', false)
on conflict (id) do nothing;

-- Allow authenticated users to upload to licenses bucket
create policy "Auth users can upload licenses"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'licenses' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own licenses
create policy "Users can view own licenses"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'licenses' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own licenses
create policy "Users can update own licenses"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'licenses' AND auth.uid()::text = (storage.foldername(name))[1]);
