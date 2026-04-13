-- =============================================================
-- MaQAronesia — Supabase Migration Script
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New)
-- =============================================================

-- ── 1. Profiles (extends auth.users) ──
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  bio text default '',
  is_staff boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. Blog: Categories ──
create table if not exists categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text unique not null
);

alter table categories enable row level security;
create policy "Categories are viewable by everyone"
  on categories for select using (true);

-- ── 3. Blog: Tags ──
create table if not exists tags (
  id bigint generated always as identity primary key,
  name text not null,
  slug text unique not null
);

alter table tags enable row level security;
create policy "Tags are viewable by everyone"
  on tags for select using (true);

-- ── 4. Blog: Posts ──
create table if not exists posts (
  id bigint generated always as identity primary key,
  title text not null,
  slug text unique not null,
  author_id uuid references profiles(id) on delete cascade,
  content text not null default '',
  excerpt text default '',
  category_id bigint references categories(id) on delete set null,
  status text check (status in ('draft', 'published')) default 'draft',
  image_url text,
  read_time int default 5,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table posts enable row level security;

create policy "Published posts are viewable by everyone"
  on posts for select using (status = 'published');

create policy "Staff can view all posts"
  on posts for select using (
    exists (select 1 from profiles where id = auth.uid() and is_staff = true)
  );

create policy "Staff can insert posts"
  on posts for insert with check (
    exists (select 1 from profiles where id = auth.uid() and is_staff = true)
  );

create policy "Staff can update posts"
  on posts for update using (
    exists (select 1 from profiles where id = auth.uid() and is_staff = true)
  );

-- ── 5. Blog: Post-Tags junction ──
create table if not exists post_tags (
  post_id bigint references posts(id) on delete cascade,
  tag_id bigint references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

alter table post_tags enable row level security;
create policy "Post tags are viewable by everyone"
  on post_tags for select using (true);

-- ── 6. Courses ──
create table if not exists courses (
  id bigint generated always as identity primary key,
  title text not null,
  slug text unique not null,
  description text not null default '',
  instructor_id uuid references profiles(id) on delete cascade,
  price numeric(6,2) default 0.00,
  is_published boolean default false,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table courses enable row level security;

create policy "Published courses are viewable by everyone"
  on courses for select using (is_published = true);

create policy "Staff can manage courses"
  on courses for all using (
    exists (select 1 from profiles where id = auth.uid() and is_staff = true)
  );

-- ── 7. Modules ──
create table if not exists modules (
  id bigint generated always as identity primary key,
  course_id bigint references courses(id) on delete cascade,
  title text not null,
  "order" int default 0,
  description text default ''
);

alter table modules enable row level security;
create policy "Modules are viewable by everyone"
  on modules for select using (true);

-- ── 8. Lessons ──
create table if not exists lessons (
  id bigint generated always as identity primary key,
  module_id bigint references modules(id) on delete cascade,
  title text not null,
  slug text not null,
  content text not null default '',
  video_url text default '',
  "order" int default 0,
  is_free_preview boolean default false,
  unique (module_id, slug)
);

alter table lessons enable row level security;
create policy "Lessons are viewable by everyone"
  on lessons for select using (true);

-- ── 9. Enrollment ──
create table if not exists user_course_access (
  user_id uuid references profiles(id) on delete cascade,
  course_id bigint references courses(id) on delete cascade,
  enrolled_at timestamptz default now(),
  primary key (user_id, course_id)
);

alter table user_course_access enable row level security;

create policy "Users can view own enrollment"
  on user_course_access for select using (auth.uid() = user_id);

create policy "Users can enroll themselves"
  on user_course_access for insert with check (auth.uid() = user_id);

create policy "Staff can view all enrollments"
  on user_course_access for select using (
    exists (select 1 from profiles where id = auth.uid() and is_staff = true)
  );

-- ── 10. Lesson Progress ──
create table if not exists user_lesson_progress (
  user_id uuid references profiles(id) on delete cascade,
  lesson_id bigint references lessons(id) on delete cascade,
  completed_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

alter table user_lesson_progress enable row level security;

create policy "Users can view own progress"
  on user_lesson_progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on user_lesson_progress for insert with check (auth.uid() = user_id);

create policy "Users can delete own progress"
  on user_lesson_progress for delete using (auth.uid() = user_id);

-- ── 11. Indexes for performance ──
create index if not exists idx_posts_status_published on posts(status, published_at desc);
create index if not exists idx_posts_slug on posts(slug);
create index if not exists idx_courses_slug on courses(slug);
create index if not exists idx_courses_published on courses(is_published);
create index if not exists idx_modules_course on modules(course_id, "order");
create index if not exists idx_lessons_module on lessons(module_id, "order");

-- ── 12. Storage Buckets (run after tables) ──
-- Go to Storage in Supabase Dashboard and create:
--   - "blog-images" (public)
--   - "course-images" (public)
-- Or via SQL:
insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('course-images', 'course-images', true) on conflict do nothing;

-- Storage policies
create policy "Anyone can view blog images"
  on storage.objects for select using (bucket_id = 'blog-images');

create policy "Staff can upload blog images"
  on storage.objects for insert with check (
    bucket_id = 'blog-images' and
    exists (select 1 from profiles where id = auth.uid() and is_staff = true)
  );

create policy "Anyone can view course images"
  on storage.objects for select using (bucket_id = 'course-images');

create policy "Staff can upload course images"
  on storage.objects for insert with check (
    bucket_id = 'course-images' and
    exists (select 1 from profiles where id = auth.uid() and is_staff = true)
  );
