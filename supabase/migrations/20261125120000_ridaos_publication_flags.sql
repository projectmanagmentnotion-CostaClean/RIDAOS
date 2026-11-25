create table if not exists public.ridaos_publication_flags (
  scope text primary key check (scope = 'public'),
  dti_only_mode boolean not null default true,
  published_product_codes text[] not null default array['dti-innuro']::text[],
  updated_at timestamptz not null default now(),
  constraint ridaos_publication_flags_known_products check (
    published_product_codes <@ array[
      'dti-innuro', 'textil', 'papeleria', 'flyers', 'vinilo',
      'accesorios', 'rotulacion', 'carteleria', 'neones'
    ]::text[]
  )
);

alter table public.ridaos_publication_flags enable row level security;
revoke all on table public.ridaos_publication_flags from anon, authenticated;
grant select on table public.ridaos_publication_flags to anon, authenticated;

drop policy if exists "Public can read publication flags" on public.ridaos_publication_flags;
create policy "Public can read publication flags"
  on public.ridaos_publication_flags
  for select
  to anon, authenticated
  using (scope = 'public');

insert into public.ridaos_publication_flags (scope, dti_only_mode, published_product_codes)
values ('public', true, array['dti-innuro']::text[])
on conflict (scope) do nothing;
