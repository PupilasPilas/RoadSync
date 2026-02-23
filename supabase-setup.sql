-- ============================================================
-- RoadSync — Supabase Setup SQL
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ───────────────────────────────────────────────────────────
-- 1. TABLAS
-- ───────────────────────────────────────────────────────────

create table if not exists departments (
  id text primary key,
  name text not null,
  color text not null
);

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('admin', 'dept-lead', 'load-lead')),
  dept text references departments(id),
  avatar text not null
);

create table if not exists trucks (
  id text primary key,
  name text not null,
  assigned_to text not null,
  capacity integer not null,
  status text not null default 'open' check (status in ('open', 'complete', 'transit'))
);

create table if not exists items (
  id text primary key,
  name text not null,
  dept text not null references departments(id),
  type text not null,
  truck_id text references trucks(id),
  "order" integer not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'ready-to-load', 'loaded', 'missing', 'descargado')),
  icon text not null,
  updated_at timestamptz default now()
);

create table if not exists item_history (
  id uuid primary key default gen_random_uuid(),
  item_id text not null references items(id) on delete cascade,
  action text not null,
  user_id uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists annotations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('item', 'truck', 'dept')),
  entity_id text not null,
  text text not null,
  author_id uuid references users(id),
  author_name text not null,
  author_role text not null,
  created_at timestamptz default now()
);

create table if not exists phase (
  id integer primary key default 1,
  value text not null default 'Carga' check (value in ('Carga', 'Descarga'))
);


-- ───────────────────────────────────────────────────────────
-- 2. ROW LEVEL SECURITY
-- ───────────────────────────────────────────────────────────

alter table users enable row level security;
alter table items enable row level security;
alter table trucks enable row level security;
alter table item_history enable row level security;
alter table annotations enable row level security;
alter table phase enable row level security;
alter table departments enable row level security;

-- Departments: todos pueden leer
create policy "read departments" on departments for select to authenticated using (true);

-- Trucks: todos pueden leer y modificar (roles controlados en app)
create policy "read trucks" on trucks for select to authenticated using (true);
create policy "manage trucks" on trucks for all to authenticated using (true);

-- Phase: todos leen y actualizan
create policy "read phase" on phase for select to authenticated using (true);
create policy "update phase" on phase for update to authenticated using (true);

-- Items: todos leen y actualizan
create policy "read items" on items for select to authenticated using (true);
create policy "update items" on items for update to authenticated using (true);

-- Item history: todos leen e insertan
create policy "read history" on item_history for select to authenticated using (true);
create policy "insert history" on item_history for insert to authenticated with check (true);

-- Annotations: todos leen e insertan
create policy "read annotations" on annotations for select to authenticated using (true);
create policy "insert annotations" on annotations for insert to authenticated with check (true);

-- Users: todos leen; cada uno actualiza el suyo
create policy "read users" on users for select to authenticated using (true);
create policy "update own user" on users for update to authenticated using (auth.uid() = id);
create policy "insert user" on users for insert to authenticated with check (auth.uid() = id);


-- ───────────────────────────────────────────────────────────
-- 3. SEED DATA
-- ───────────────────────────────────────────────────────────

-- Departments
insert into departments (id, name, color) values
  ('audio',      'Audio',       '#E30613'),
  ('video',      'Video',       '#F5A623'),
  ('iluminacion','Iluminación', '#00C853'),
  ('staging',    'Staging',     '#448AFF'),
  ('backline',   'Backline',    '#AA00FF')
on conflict (id) do nothing;

-- Phase (una sola fila)
insert into phase (id, value) values (1, 'Carga')
on conflict (id) do nothing;

-- Trucks
insert into trucks (id, name, assigned_to, capacity, status) values
  ('truck-01', 'Camión 01', 'Audio / Video',          32, 'open'),
  ('truck-02', 'Camión 02', 'Iluminación / Staging',  28, 'complete'),
  ('truck-03', 'Camión 03', 'Backline / Varios',       20, 'open')
on conflict (id) do nothing;

-- Items (27 ítems del demo)
insert into items (id, name, dept, type, truck_id, "order", status, icon) values
  ('AUDIO-01','Consola DiGiCo SD7',      'audio','consola','truck-01', 1,'loaded',       'Sliders'),
  ('AUDIO-02','Rack FOH-01',             'audio','rack',   'truck-01', 2,'loaded',       'Server'),
  ('AUDIO-03','Rack FOH-02',             'audio','rack',   'truck-01', 3,'loaded',       'Server'),
  ('AUDIO-04','Sub L-Acoustics KS28 x8', 'audio','case',  'truck-01', 4,'loaded',       'Speaker'),
  ('AUDIO-05','Line Array K2 x12',       'audio','case',  'truck-01', 5,'loaded',       'Speaker'),
  ('AUDIO-06','Rack Monitor',            'audio','rack',   'truck-01', 6,'ready-to-load','Server'),
  ('AUDIO-07','Rack Amplificadores',     'audio','rack',   'truck-01', 7,'ready-to-load','Server'),
  ('AUDIO-08','Case Microfonía',         'audio','case',  'truck-01', 8,'pending',      'Mic'),
  ('VIDEO-01','Pantalla LED P3.9 #1',   'video','case',   'truck-01', 9,'loaded',       'Monitor'),
  ('VIDEO-02','Pantalla LED P3.9 #2',   'video','case',   'truck-01',10,'loaded',       'Monitor'),
  ('VIDEO-03','Case Procesadores Video', 'video','case',  'truck-01',11,'missing',      'Cpu'),
  ('VIDEO-04','Rack Señal Video',        'video','rack',  'truck-01',12,'loaded',       'Server'),
  ('VIDEO-05','Case Cámaras PTZ',        'video','case',  'truck-01',13,'loaded',       'Camera'),
  ('VIDEO-06','Switcher ATEM 4K',        'video','consola','truck-01',14,'ready-to-load','Sliders'),
  ('VIDEO-07','Case Cableado Video',     'video','case',  'truck-01',15,'pending',      'Cable'),
  ('VIDEO-08','Monitores Referencia x4', 'video','case',  'truck-01',16,'loaded',       'Monitor'),
  ('ILUM-01', 'Case Moving Head x8',     'iluminacion','case','truck-02', 1,'loaded',   'Lightbulb'),
  ('ILUM-02', 'Case Wash LED x12',       'iluminacion','case','truck-02', 2,'loaded',   'Lightbulb'),
  ('ILUM-03', 'Consola MA3 Full',        'iluminacion','consola','truck-02',3,'loaded', 'Sliders'),
  ('ILUM-04', 'Case Strobes x6',         'iluminacion','case','truck-02', 4,'loaded',   'Zap'),
  ('ILUM-05', 'Rack Dimmer',             'iluminacion','rack','truck-02', 5,'loaded',   'Server'),
  ('ILUM-06', 'Case Cableado Ilum',      'iluminacion','case','truck-02', 6,'loaded',   'Cable'),
  ('STAG-01', 'Truss Circular 12m',      'staging','case','truck-02', 7,'loaded',       'Box'),
  ('STAG-02', 'Case Motores CM x8',      'staging','case','truck-02', 8,'loaded',       'Settings'),
  ('STAG-03', 'Risers 2x1m x6',         'staging','case','truck-02', 9,'ready-to-load','Box'),
  ('STAG-04', 'Case Herrajes Staging',   'staging','case','truck-02',10,'pending',      'Wrench'),
  ('BACK-01', 'Case Guitarras',          'backline','case','truck-03', 1,'loaded',       'Guitar'),
  ('BACK-02', 'Case Bajos + Amps',       'backline','case','truck-03', 2,'loaded',       'Guitar'),
  ('BACK-03', 'Case Teclados',           'backline','case','truck-03', 3,'ready-to-load','Piano'),
  ('BACK-04', 'Case Batería',            'backline','case','truck-03', 4,'pending',      'Disc')
on conflict (id) do nothing;


-- ───────────────────────────────────────────────────────────
-- 4. REALTIME (habilitar para las tablas que necesitan sync)
-- ───────────────────────────────────────────────────────────
-- Ejecutar esto en Supabase Dashboard > Database > Replication
-- O habilitar desde: Database > Replication > supabase_realtime publication
-- Agregar tablas: items, trucks, phase, item_history, annotations

-- Alternativa SQL:
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table items, trucks, phase, item_history, annotations;
commit;


-- ───────────────────────────────────────────────────────────
-- 5. CREAR PERFIL DE USUARIO (ejecutar DESPUÉS de crear cada
--    usuario en Authentication > Users con su email/password)
-- ───────────────────────────────────────────────────────────
-- Reemplaza <UUID> con el ID que genera Supabase Auth al crear el usuario.
-- Ejemplo:
--
-- insert into users (id, name, role, dept, avatar) values
--   ('<UUID-admin>',    'Pablo Grajales',   'admin',     null,         'PG'),
--   ('<UUID-audio>',    'José Romero',      'dept-lead', 'audio',      'JR'),
--   ('<UUID-video>',    'Esteban Jiménez',  'dept-lead', 'video',      'EJ'),
--   ('<UUID-ilum>',     'Flash',            'dept-lead', 'iluminacion','FL'),
--   ('<UUID-loadlead>', 'Serry',            'load-lead', null,         'SE');
