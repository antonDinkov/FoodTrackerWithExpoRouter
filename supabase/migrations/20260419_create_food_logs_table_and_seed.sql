create extension if not exists pgcrypto;

create table if not exists public.food_logs (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  calories integer not null check (calories >= 0),
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_food_logs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_food_logs_updated_at on public.food_logs;

create trigger trg_food_logs_updated_at
before update on public.food_logs
for each row
execute function public.set_food_logs_updated_at();

create index if not exists idx_food_logs_logged_at on public.food_logs (logged_at desc);

-- Keep this app intentionally simple: no auth and no row-level policies.
alter table public.food_logs disable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.food_logs to anon, authenticated;

insert into public.food_logs (id, name, calories, logged_at)
values
  ('2fb0d52f-d53f-4719-8f56-75ac0618e4bb', 'Oatmeal with berries', 320, now() - interval '2 hours'),
  ('7adf26ff-52c2-4f79-a85e-52776d6f3814', 'Chicken salad', 480, now() - interval '6 hours'),
  ('48c03fc6-a44f-4242-8c8a-8dc92b0f255b', 'Greek yogurt', 190, now() - interval '1 day'),
  ('78ea2c8f-98bd-44e0-bf88-b0c44651c8ca', 'Pasta bowl', 640, now() - interval '2 days'),
  ('5509305e-7f01-4dcb-ab2b-56f8225f09bc', 'Protein shake', 250, now() - interval '3 days')
on conflict (id) do nothing;
