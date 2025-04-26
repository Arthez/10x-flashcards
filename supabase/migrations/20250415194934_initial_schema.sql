-- ---------------------------------------------------------------
-- migration: initial_schema
-- description: creates the initial database schema for 10x-flashcards
-- tables: flashcards, generations
-- author: system
-- date: 2025-04-15
-- ---------------------------------------------------------------

-- create custom types
create type creation_method_enum as enum ('ai_full', 'ai_edited', 'manual');

-- flashcards table
create table if not exists flashcards (
    id uuid primary key default uuid_generate_v4(),
    front_content text not null check (length(front_content) >= 2 and length(front_content) <= 200),
    back_content text not null check (length(back_content) >= 2 and length(back_content) <= 200),
    creation_method creation_method_enum not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    user_id uuid not null references auth.users(id) on delete cascade
);

-- enable rls on flashcards table
alter table flashcards enable row level security;

-- rls policies for flashcards table
comment on table flashcards is 'Stores flashcard data created by users';

-- policy for authenticated users to select their own flashcards
create policy "users can view own flashcards" 
    on flashcards for select 
    to authenticated 
    using (user_id = auth.uid());

-- policy for authenticated users to insert their own flashcards
create policy "users can insert own flashcards" 
    on flashcards for insert 
    to authenticated 
    with check (user_id = auth.uid());

-- policy for authenticated users to update their own flashcards
create policy "users can update own flashcards" 
    on flashcards for update 
    to authenticated 
    using (user_id = auth.uid()) 
    with check (user_id = auth.uid());

-- policy for authenticated users to delete their own flashcards
create policy "users can delete own flashcards" 
    on flashcards for delete 
    to authenticated 
    using (user_id = auth.uid());

-- policy for anonymous users - flashcards are private so no anon access
create policy "anon cannot access flashcards" 
    on flashcards for select 
    to anon 
    using (false);

-- generations table
create table if not exists generations (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    total_generated integer not null,
    accepted_full integer not null default 0,
    accepted_edited integer not null default 0,
    generation_time_ms integer not null,
    ai_model text not null,
    error text,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- enable rls on generations table
alter table generations enable row level security;

-- rls policies for generations table
comment on table generations is 'Tracks metrics about flashcard generation sessions';

-- policy for authenticated users to select their own generations
create policy "users can view own generations" 
    on generations for select 
    to authenticated 
    using (user_id = auth.uid());

-- policy for authenticated users to insert their own generations
create policy "users can insert own generations" 
    on generations for insert 
    to authenticated 
    with check (user_id = auth.uid());

-- policy for authenticated users to update their own generations
create policy "users can update own generations" 
    on generations for update 
    to authenticated 
    using (user_id = auth.uid()) 
    with check (user_id = auth.uid());

-- policy for authenticated users to delete their own generations
create policy "users can delete own generations" 
    on generations for delete 
    to authenticated 
    using (user_id = auth.uid());

-- policy for anonymous users - generations are private
create policy "anon cannot access generations" 
    on generations for select 
    to anon 
    using (false);

-- create indexes
-- indexes for flashcards table
create index idx_flashcards_user_id on flashcards(user_id);
create index idx_flashcards_created_at on flashcards(created_at);
create index idx_flashcards_creation_method on flashcards(creation_method);

-- indexes for generations table
create index idx_generations_user_id on generations(user_id);
create index idx_generations_created_at on generations(created_at);

-- create triggers
-- function to update updated_at timestamp
create or replace function update_modified_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- trigger for flashcards
create trigger update_flashcards_updated_at
before update on flashcards
for each row
execute function update_modified_column();

-- trigger for generations
create trigger update_generations_updated_at
before update on generations
for each row
execute function update_modified_column(); 
