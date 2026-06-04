create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.product_categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  price numeric(12, 2) not null check (price >= 0),
  description text not null,
  safety_level text not null check (safety_level in ('Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5')),
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  materials text[] not null default '{}',
  image_url text not null default 'https://images.pexels.com/photos/2611690/pexels-photo-2611690.jpeg?auto=compress&cs=tinysrgb&w=800',
  image_alt text not null default 'MotoShield Gear product image',
  image_label text not null default 'MS',
  stock_quantity integer not null default 25 check (stock_quantity >= 0),
  best_seller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists image_url text not null default 'https://images.pexels.com/photos/2611690/pexels-photo-2611690.jpeg?auto=compress&cs=tinysrgb&w=800';
alter table public.products add column if not exists image_alt text not null default 'MotoShield Gear product image';
alter table public.products drop constraint if exists products_safety_level_check;
alter table public.products add constraint products_safety_level_check check (safety_level in ('Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Medium', 'High', 'Very High'));

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  status text not null default 'Pending' check (status in ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  total_amount numeric(12, 2) not null default 0 check (total_amount >= 0),
  order_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  payment_method text not null check (payment_method in ('Credit Card', 'PayPal', 'Cash on Delivery', 'Bank Transfer')),
  payment_status text not null default 'Demo pending',
  amount numeric(12, 2) not null check (amount >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.product_customizations (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid references public.order_items(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  size text not null default '',
  color text not null default '',
  initials text not null default '',
  protection_level text not null default '',
  material_type text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

create table if not exists public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('user', 'assistant')),
  message text not null,
  created_at timestamptz not null default now()
);

insert into public.product_categories (name, slug, description) values
  ('Motorcycle Jackets', 'motorcycle-jackets', 'Armored and abrasion-resistant riding jackets.'),
  ('Helmets', 'helmets', 'Full-face and protective motorcycle helmets.'),
  ('Gloves', 'gloves', 'Protective gloves with grip and knuckle support.'),
  ('Riding Pants', 'riding-pants', 'Pants with knee protection and reinforced materials.'),
  ('Boots', 'boots', 'Motorcycle boots with ankle and toe protection.'),
  ('Protective Armor', 'protective-armor', 'Impact armor for key body zones.'),
  ('Rain Gear', 'rain-gear', 'Waterproof riding gear for bad weather.'),
  ('Accessories', 'accessories', 'Useful rider accessories and visibility items.'),
  ('Motorcycle Parts', 'motorcycle-parts', 'Selected parts that improve safety and visibility.')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_label, best_seller)
select id, 'Guardian Pro Armored Jacket', 'guardian-pro-armored-jacket', 249, 'Abrasion-resistant jacket with shoulder, elbow, and back protection for daily riders.', 'Level 5', array['S','M','L','XL','XXL'], array['Black','Orange','Gray'], array['Cordura','Leather'], 'JKT', true
from public.product_categories where slug = 'motorcycle-jackets'
on conflict (slug) do update set price = excluded.price, description = excluded.description, safety_level = excluded.safety_level, sizes = excluded.sizes, colors = excluded.colors, materials = excluded.materials, image_label = excluded.image_label, best_seller = excluded.best_seller;

update public.products set image_url = 'https://images.pexels.com/photos/5807579/pexels-photo-5807579.jpeg?auto=compress&cs=tinysrgb&w=800', image_alt = 'Armored Motorcycle Jacket' where slug = 'guardian-pro-armored-jacket';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_label, best_seller)
select id, 'AeroShield Full Face Helmet', 'aeroshield-full-face-helmet', 319, 'Full-face helmet for highway riding with wide visor and impact shell.', 'Level 5', array['S','M','L','XL'], array['Black','White','Red'], array['Composite Shell'], 'HLM', true
from public.product_categories where slug = 'helmets'
on conflict (slug) do update set price = excluded.price, description = excluded.description, safety_level = excluded.safety_level, sizes = excluded.sizes, colors = excluded.colors, materials = excluded.materials, image_label = excluded.image_label, best_seller = excluded.best_seller;

update public.products set image_url = 'https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg?auto=compress&cs=tinysrgb&w=800', image_alt = 'Full Face Motorcycle Helmet' where slug = 'aeroshield-full-face-helmet';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_label, best_seller)
select id, 'GripSafe Leather Gloves', 'gripsafe-leather-gloves', 79, 'Palm sliders, knuckle protection, and reinforced leather for better grip.', 'Level 3', array['S','M','L','XL'], array['Black','Red'], array['Leather'], 'GLV', false
from public.product_categories where slug = 'gloves'
on conflict (slug) do update set price = excluded.price, description = excluded.description, safety_level = excluded.safety_level, sizes = excluded.sizes, colors = excluded.colors, materials = excluded.materials, image_label = excluded.image_label, best_seller = excluded.best_seller;

update public.products set image_url = 'https://images.pexels.com/photos/6461396/pexels-photo-6461396.jpeg?auto=compress&cs=tinysrgb&w=800', image_alt = 'Riding Gloves' where slug = 'gripsafe-leather-gloves';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_label, best_seller)
select id, 'RoadGuard Riding Pants', 'roadguard-riding-pants', 189, 'Protective riding pants with knee armor and stretch comfort panels.', 'Level 4', array['S','M','L','XL'], array['Black','Gray'], array['Kevlar Denim'], 'PNT', false
from public.product_categories where slug = 'riding-pants'
on conflict (slug) do update set price = excluded.price, description = excluded.description, safety_level = excluded.safety_level, sizes = excluded.sizes, colors = excluded.colors, materials = excluded.materials, image_label = excluded.image_label, best_seller = excluded.best_seller;

update public.products set image_url = 'https://images.pexels.com/photos/5807576/pexels-photo-5807576.jpeg?auto=compress&cs=tinysrgb&w=800', image_alt = 'Motorcycle Riding Pants' where slug = 'roadguard-riding-pants';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_label, best_seller)
select id, 'TorqueShield Riding Boots', 'torqueshield-riding-boots', 169, 'Ankle support, toe reinforcement, and anti-slip sole for city and touring rides.', 'Level 4', array['42','43','44','45'], array['Black','Brown'], array['Leather'], 'BOT', true
from public.product_categories where slug = 'boots'
on conflict (slug) do update set price = excluded.price, description = excluded.description, safety_level = excluded.safety_level, sizes = excluded.sizes, colors = excluded.colors, materials = excluded.materials, image_label = excluded.image_label, best_seller = excluded.best_seller;

update public.products set image_url = 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800', image_alt = 'Motorcycle Boots' where slug = 'torqueshield-riding-boots';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_label, best_seller)
select id, 'FlexCore Protective Armor', 'flexcore-protective-armor', 119, 'Lightweight CE armor set for back, chest, shoulders, elbows, and knees.', 'Level 4', array['S','M','L','XL'], array['Black'], array['Memory Foam'], 'ARM', false
from public.product_categories where slug = 'protective-armor'
on conflict (slug) do update set price = excluded.price, description = excluded.description, safety_level = excluded.safety_level, sizes = excluded.sizes, colors = excluded.colors, materials = excluded.materials, image_label = excluded.image_label, best_seller = excluded.best_seller;

update public.products set image_url = 'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilot-163210.jpeg?auto=compress&cs=tinysrgb&w=800', image_alt = 'Protective Body Armor' where slug = 'flexcore-protective-armor';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_label, best_seller)
select id, 'StormRide Rain Suit', 'stormride-rain-suit', 99, 'Waterproof two-piece rain suit with reflective panels.', 'Level 2', array['S','M','L','XL','XXL'], array['Black','Yellow'], array['Waterproof Nylon'], 'RAN', false
from public.product_categories where slug = 'rain-gear'
on conflict (slug) do update set price = excluded.price, description = excluded.description, safety_level = excluded.safety_level, sizes = excluded.sizes, colors = excluded.colors, materials = excluded.materials, image_label = excluded.image_label, best_seller = excluded.best_seller;

update public.products set image_url = 'https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg?auto=compress&cs=tinysrgb&w=800', image_alt = 'Waterproof Rain Gear' where slug = 'stormride-rain-suit';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_label, best_seller)
select id, 'ReflectRide Visibility Kit', 'reflectride-visibility-kit', 39, 'Reflective straps and compact safety accessories for better night visibility.', 'Level 2', array['Universal'], array['Orange','Yellow'], array['Reflective Fabric'], 'ACC', false
from public.product_categories where slug = 'accessories'
on conflict (slug) do update set price = excluded.price, description = excluded.description, safety_level = excluded.safety_level, sizes = excluded.sizes, colors = excluded.colors, materials = excluded.materials, image_label = excluded.image_label, best_seller = excluded.best_seller;

update public.products set image_url = 'https://images.pexels.com/photos/4489734/pexels-photo-4489734.jpeg?auto=compress&cs=tinysrgb&w=800', image_alt = 'Reflective Safety Vest' where slug = 'reflectride-visibility-kit';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_label, best_seller)
select id, 'BrightPath LED Signal Kit', 'brightpath-led-signal-kit', 59, 'Visibility upgrade kit for safer signaling and night riding.', 'Level 2', array['Universal'], array['Amber'], array['Aluminum'], 'LED', false
from public.product_categories where slug = 'motorcycle-parts'
on conflict (slug) do update set price = excluded.price, description = excluded.description, safety_level = excluded.safety_level, sizes = excluded.sizes, colors = excluded.colors, materials = excluded.materials, image_label = excluded.image_label, best_seller = excluded.best_seller;

update public.products set image_url = 'https://images.pexels.com/photos/1715184/pexels-photo-1715184.jpeg?auto=compress&cs=tinysrgb&w=800', image_alt = 'Motorcycle Chain Kit' where slug = 'brightpath-led-signal-kit';

alter table public.products drop constraint if exists products_safety_level_check;
delete from public.products;
alter table public.products add constraint products_safety_level_check check (safety_level in ('Medium', 'High', 'Very High'));

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_url, image_alt, image_label, best_seller)
select id, 'Armored Motorcycle Jacket', 'armored-motorcycle-jacket', 149.99, 'A protective motorcycle jacket designed for safety, comfort, and everyday riding.', 'High', array['S','M','L','XL','XXL'], array['Black','Orange','Gray'], array['Cordura','Leather'], 'https://images.pexels.com/photos/5807579/pexels-photo-5807579.jpeg?auto=compress&cs=tinysrgb&w=800', 'Armored Motorcycle Jacket', 'JKT', true
from public.product_categories where slug = 'motorcycle-jackets';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_url, image_alt, image_label, best_seller)
select id, 'Full Face Motorcycle Helmet', 'full-face-motorcycle-helmet', 199.99, 'A full face helmet that provides strong protection and a modern riding look.', 'Very High', array['S','M','L','XL'], array['Black','White','Red'], array['Composite Shell'], 'https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg?auto=compress&cs=tinysrgb&w=800', 'Full Face Motorcycle Helmet', 'HLM', true
from public.product_categories where slug = 'helmets';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_url, image_alt, image_label, best_seller)
select id, 'Riding Gloves', 'riding-gloves', 49.99, 'Comfortable motorcycle gloves for grip, protection, and safer control.', 'Medium', array['S','M','L','XL'], array['Black','Red'], array['Leather'], 'https://images.pexels.com/photos/6461396/pexels-photo-6461396.jpeg?auto=compress&cs=tinysrgb&w=800', 'Riding Gloves', 'GLV', false
from public.product_categories where slug = 'gloves';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_url, image_alt, image_label, best_seller)
select id, 'Motorcycle Riding Pants', 'motorcycle-riding-pants', 119.99, 'Durable riding pants with a safety-focused design for motorcycle riders.', 'High', array['S','M','L','XL'], array['Black','Gray'], array['Kevlar Denim'], 'https://images.pexels.com/photos/5807576/pexels-photo-5807576.jpeg?auto=compress&cs=tinysrgb&w=800', 'Motorcycle Riding Pants', 'PNT', false
from public.product_categories where slug = 'riding-pants';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_url, image_alt, image_label, best_seller)
select id, 'Motorcycle Boots', 'motorcycle-boots', 129.99, 'Strong riding boots designed to protect the rider while keeping a stylish look.', 'High', array['42','43','44','45'], array['Black','Brown'], array['Leather'], 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800', 'Motorcycle Boots', 'BOT', true
from public.product_categories where slug = 'boots';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_url, image_alt, image_label, best_seller)
select id, 'Protective Body Armor', 'protective-body-armor', 89.99, 'Protective armor for safer riding and better impact protection.', 'Very High', array['S','M','L','XL'], array['Black'], array['Memory Foam'], 'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilot-163210.jpeg?auto=compress&cs=tinysrgb&w=800', 'Protective Body Armor', 'ARM', false
from public.product_categories where slug = 'protective-armor';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_url, image_alt, image_label, best_seller)
select id, 'Waterproof Rain Gear', 'waterproof-rain-gear', 79.99, 'Waterproof riding gear for rainy weather and safer visibility on the road.', 'Medium', array['S','M','L','XL','XXL'], array['Black','Yellow'], array['Waterproof Nylon'], 'https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg?auto=compress&cs=tinysrgb&w=800', 'Waterproof Rain Gear', 'RAN', false
from public.product_categories where slug = 'rain-gear';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_url, image_alt, image_label, best_seller)
select id, 'Motorcycle Chain Kit', 'motorcycle-chain-kit', 69.99, 'A motorcycle parts kit for maintenance and better riding performance.', 'Medium', array['Universal'], array['Black'], array['Steel'], 'https://images.pexels.com/photos/1715184/pexels-photo-1715184.jpeg?auto=compress&cs=tinysrgb&w=800', 'Motorcycle Chain Kit', 'PRT', false
from public.product_categories where slug = 'motorcycle-parts';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_url, image_alt, image_label, best_seller)
select id, 'Reflective Safety Vest', 'reflective-safety-vest', 34.99, 'A reflective safety vest that helps riders stay visible, especially at night.', 'High', array['Universal'], array['Orange','Yellow'], array['Reflective Fabric'], 'https://images.pexels.com/photos/4489734/pexels-photo-4489734.jpeg?auto=compress&cs=tinysrgb&w=800', 'Reflective Safety Vest', 'VST', false
from public.product_categories where slug = 'accessories';

insert into public.products (category_id, name, slug, price, description, safety_level, sizes, colors, materials, image_url, image_alt, image_label, best_seller)
select id, 'Motorcycle Backpack', 'motorcycle-backpack', 59.99, 'A useful backpack for riders, designed for daily riding and storage.', 'Medium', array['Universal'], array['Black','Gray'], array['Nylon'], 'https://images.pexels.com/photos/2533092/pexels-photo-2533092.jpeg?auto=compress&cs=tinysrgb&w=800', 'Motorcycle Backpack', 'BAG', true
from public.product_categories where slug = 'accessories';

alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.product_customizations enable row level security;
alter table public.contact_messages enable row level security;
alter table public.ai_chat_messages enable row level security;

drop policy if exists "demo read product_categories" on public.product_categories;
drop policy if exists "demo write product_categories" on public.product_categories;
drop policy if exists "demo read products" on public.products;
drop policy if exists "demo write products" on public.products;
drop policy if exists "demo read customers" on public.customers;
drop policy if exists "demo write customers" on public.customers;
drop policy if exists "demo read orders" on public.orders;
drop policy if exists "demo write orders" on public.orders;
drop policy if exists "demo read order_items" on public.order_items;
drop policy if exists "demo write order_items" on public.order_items;
drop policy if exists "demo read payments" on public.payments;
drop policy if exists "demo write payments" on public.payments;
drop policy if exists "demo read product_customizations" on public.product_customizations;
drop policy if exists "demo write product_customizations" on public.product_customizations;
drop policy if exists "demo read contact_messages" on public.contact_messages;
drop policy if exists "demo write contact_messages" on public.contact_messages;
drop policy if exists "demo read ai_chat_messages" on public.ai_chat_messages;
drop policy if exists "demo write ai_chat_messages" on public.ai_chat_messages;

create policy "demo read product_categories" on public.product_categories for select to anon, authenticated using (true);
create policy "demo write product_categories" on public.product_categories for all to anon, authenticated using (true) with check (true);
create policy "demo read products" on public.products for select to anon, authenticated using (true);
create policy "demo write products" on public.products for all to anon, authenticated using (true) with check (true);
create policy "demo read customers" on public.customers for select to anon, authenticated using (true);
create policy "demo write customers" on public.customers for all to anon, authenticated using (true) with check (true);
create policy "demo read orders" on public.orders for select to anon, authenticated using (true);
create policy "demo write orders" on public.orders for all to anon, authenticated using (true) with check (true);
create policy "demo read order_items" on public.order_items for select to anon, authenticated using (true);
create policy "demo write order_items" on public.order_items for all to anon, authenticated using (true) with check (true);
create policy "demo read payments" on public.payments for select to anon, authenticated using (true);
create policy "demo write payments" on public.payments for all to anon, authenticated using (true) with check (true);
create policy "demo read product_customizations" on public.product_customizations for select to anon, authenticated using (true);
create policy "demo write product_customizations" on public.product_customizations for all to anon, authenticated using (true) with check (true);
create policy "demo read contact_messages" on public.contact_messages for select to anon, authenticated using (true);
create policy "demo write contact_messages" on public.contact_messages for all to anon, authenticated using (true) with check (true);
create policy "demo read ai_chat_messages" on public.ai_chat_messages for select to anon, authenticated using (true);
create policy "demo write ai_chat_messages" on public.ai_chat_messages for all to anon, authenticated using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.product_categories to anon, authenticated;
grant select, insert, update, delete on public.products to anon, authenticated;
grant select, insert, update, delete on public.customers to anon, authenticated;
grant select, insert, update, delete on public.orders to anon, authenticated;
grant select, insert, update, delete on public.order_items to anon, authenticated;
grant select, insert, update, delete on public.payments to anon, authenticated;
grant select, insert, update, delete on public.product_customizations to anon, authenticated;
grant select, insert, update, delete on public.contact_messages to anon, authenticated;
grant select, insert, update, delete on public.ai_chat_messages to anon, authenticated;
