alter table "users" add column "password" text not null default '';
alter table "users" add column "full_name" text not null default '';
alter table "users" add column "phone" text not null default '';
alter table "users" alter column "telegram_id" drop not null;