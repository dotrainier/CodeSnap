-- CodeSnap schema (Supabase)

create table snippets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title varchar(255) not null,
  code text not null,
  language varchar(50) not null,
  description text,
  tags text[] default '{}',
  is_public boolean default false,
  is_favorite boolean default false,
  share_id varchar(20) unique,
  view_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_snippets_user_id on snippets(user_id);
create index idx_snippets_share_id on snippets(share_id);
create index idx_snippets_created_at on snippets(created_at desc);
create index idx_snippets_tags on snippets using gin(tags);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger snippets_updated_at
  before update on snippets
  for each row
  execute function update_updated_at();

alter table snippets enable row level security;

create policy "Users can view own snippets"
  on snippets for select
  using (auth.uid() = user_id or is_public = true);

create policy "Users can create snippets"
  on snippets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own snippets"
  on snippets for update
  using (auth.uid() = user_id);

create policy "Users can delete own snippets"
  on snippets for delete
  using (auth.uid() = user_id);