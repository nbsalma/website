-- Quote / RFQ requests submitted from the website.
create table if not exists public.quote_requests (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  reference    text not null unique,
  status       text not null default 'new' check (status in ('new','contacted','proposal_sent','won','lost','spam')),
  material     text not null,
  grade        text,
  quantity     text not null,
  unit         text not null,
  country      text not null,
  port         text,
  order_type   text not null default 'once',
  required_by  text,
  company      text not null,
  contact_name text not null,
  email        text not null,
  phone        text not null,
  notes        text,
  locale       text not null default 'en',
  file_path    text,
  user_agent   text
);

create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index if not exists quote_requests_status_idx on public.quote_requests (status);

-- Only the server (service role) writes/reads. No anon/authenticated policies = no public access.
alter table public.quote_requests enable row level security;

-- Private bucket for uploaded specifications.
insert into storage.buckets (id, name, public, file_size_limit)
values ('quote-files', 'quote-files', false, 10485760)
on conflict (id) do nothing;
