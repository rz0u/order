-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS (Extends auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  bio text,
  location text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create a public.users row on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username, display_name)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), 
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- FRIENDS
create table if not exists public.friends (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  friend_id uuid references public.users on delete cascade not null,
  status text check (status in ('pending', 'accepted')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, friend_id)
);

-- STICKY NOTES
create table if not exists public.sticky_notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  content text,
  color text default 'bg-yellow-200',
  x_position integer default 0,
  y_position integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TODO LISTS & TODOS
create table if not exists public.todo_lists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.todos (
  id uuid primary key default uuid_generate_v4(),
  list_id uuid references public.todo_lists on delete cascade not null,
  content text not null,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SCHEDULE EVENTS
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- HABITS
create table if not exists public.habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  current_streak integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.habit_logs (
  id uuid primary key default uuid_generate_v4(),
  habit_id uuid references public.habits on delete cascade not null,
  log_date date not null,
  completed boolean default false,
  unique(habit_id, log_date)
);

-- SOCIAL FEED
create table if not exists public.feed_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.friends enable row level security;
alter table public.sticky_notes enable row level security;
alter table public.todo_lists enable row level security;
alter table public.todos enable row level security;
alter table public.events enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.feed_posts enable row level security;

-- Users can view and update their own profiles
create policy "Users can view their own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);

-- Friends can view profiles (simplified to public read for now)
create policy "Profiles are viewable by everyone" on public.users for select using (true);

-- Events policies
create policy "Users can view their own events" on public.events for select using (auth.uid() = user_id);
create policy "Users can insert their own events" on public.events for insert with check (auth.uid() = user_id);
create policy "Users can update their own events" on public.events for update using (auth.uid() = user_id);
create policy "Users can delete their own events" on public.events for delete using (auth.uid() = user_id);

-- Sticky Notes policies
create policy "Users can view their own notes" on public.sticky_notes for select using (auth.uid() = user_id);
create policy "Users can insert their own notes" on public.sticky_notes for insert with check (auth.uid() = user_id);
create policy "Users can update their own notes" on public.sticky_notes for update using (auth.uid() = user_id);
create policy "Users can delete their own notes" on public.sticky_notes for delete using (auth.uid() = user_id);

-- Todos policies
create policy "Users can view their own lists" on public.todo_lists for select using (auth.uid() = user_id);
create policy "Users can insert their own lists" on public.todo_lists for insert with check (auth.uid() = user_id);
create policy "Users can update their own lists" on public.todo_lists for update using (auth.uid() = user_id);
create policy "Users can delete their own lists" on public.todo_lists for delete using (auth.uid() = user_id);

-- Everyone can view feed posts
create policy "Feed posts are viewable by everyone" on public.feed_posts for select using (true);
create policy "Users can insert their own posts" on public.feed_posts for insert with check (auth.uid() = user_id);
