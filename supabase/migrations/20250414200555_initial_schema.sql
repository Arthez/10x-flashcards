-- Migration: 20250414200555_initial_schema.sql
--
-- Purpose: Initial database schema setup for 10x-Flashcards
-- Tables created: users, flashcards, user_actions
-- Custom types: creation_method_enum, action_type_enum
-- RLS policies, triggers, and indexes are also established
--
-- Author: System
-- Date: 2025-04-14

-- enable uuid extension
create extension if not exists "uuid-ossp";

-- custom types
create type creation_method_enum as enum ('ai', 'manual');
create type action_type_enum as enum ('manual_create', 'ai_accept', 'ai_reject');

-- users table
create table users (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- enable row level security on users table
alter table users enable row level security;

-- users table rls policies
-- policy for authenticated users to see only their own user record
create policy users_select_policy 
    on users for select 
    to authenticated 
    using (id = auth.uid());

-- policy for authenticated users to update only their own user record
create policy users_update_policy 
    on users for update 
    to authenticated 
    using (id = auth.uid());

-- flashcards table
create table flashcards (
    id uuid primary key default uuid_generate_v4(),
    front_content text not null check (length(front_content) >= 2 and length(front_content) <= 200),
    back_content text not null check (length(back_content) >= 2 and length(back_content) <= 200),
    creation_method creation_method_enum not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    user_id uuid not null references users(id) on delete cascade
);

-- enable row level security on flashcards table
alter table flashcards enable row level security;

-- flashcards table rls policies
-- policy for authenticated users to view their own flashcards
create policy flashcards_select_policy 
    on flashcards for select 
    to authenticated 
    using (user_id = auth.uid());

-- policy for authenticated users to insert their own flashcards
create policy flashcards_insert_policy 
    on flashcards for insert 
    to authenticated 
    with check (user_id = auth.uid());

-- policy for authenticated users to update their own flashcards
create policy flashcards_update_policy 
    on flashcards for update 
    to authenticated 
    using (user_id = auth.uid());

-- policy for authenticated users to delete their own flashcards
create policy flashcards_delete_policy 
    on flashcards for delete 
    to authenticated 
    using (user_id = auth.uid());

-- user_actions table
create table user_actions (
    id uuid primary key default uuid_generate_v4(),
    action_type action_type_enum not null,
    created_at timestamp with time zone not null default now(),
    user_id uuid not null references users(id) on delete cascade
);

-- enable row level security on user_actions table
alter table user_actions enable row level security;

-- user_actions table rls policies
-- policy for authenticated users to view their own actions
create policy user_actions_select_policy 
    on user_actions for select 
    to authenticated 
    using (user_id = auth.uid());

-- policy for authenticated users to insert their own actions
create policy user_actions_insert_policy 
    on user_actions for insert 
    to authenticated 
    with check (user_id = auth.uid());

-- indexes for flashcards table
create index idx_flashcards_user_id on flashcards(user_id);
create index idx_flashcards_created_at on flashcards(created_at);
create index idx_flashcards_creation_method on flashcards(creation_method);

-- indexes for user_actions table
create index idx_user_actions_user_id on user_actions(user_id);
create index idx_user_actions_action_type on user_actions(action_type);

-- trigger to update updated_at timestamp on flashcards
create or replace function update_modified_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_flashcards_updated_at
before update on flashcards
for each row
execute function update_modified_column();

-- trigger to update updated_at timestamp on users
create trigger update_users_updated_at
before update on users
for each row
execute function update_modified_column();

-- add policies for anon role
-- policy for anon users can't access users table
create policy users_anon_policy 
    on users for all 
    to anon 
    using (false);

-- policy for anon users can't access flashcards table
create policy flashcards_anon_policy 
    on flashcards for all 
    to anon 
    using (false);

-- policy for anon users can't access user_actions table
create policy user_actions_anon_policy 
    on user_actions for all 
    to anon 
    using (false);

-- add comments for clarity
comment on table users is 'Users of the 10x-Flashcards application';
comment on table flashcards is 'Flashcards created by users for learning purposes';
comment on table user_actions is 'Log of user actions related to flashcard creation and management';
comment on type creation_method_enum is 'Method used to create a flashcard: AI-generated or manually created';
comment on type action_type_enum is 'Type of action performed by a user: manually creating, accepting AI generation, or rejecting AI generation'; 
