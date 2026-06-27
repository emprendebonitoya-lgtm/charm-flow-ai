-- Premium entitlement persistence synced from Stripe webhooks / manual resync.
create table if not exists public.billing_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive' check (status in ('active', 'inactive', 'trialing', 'past_due', 'canceled', 'unpaid')),
  plan text check (plan in ('monthly', 'annual')),
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists billing_subscriptions_status_idx
  on public.billing_subscriptions (status);

create index if not exists billing_subscriptions_current_period_end_idx
  on public.billing_subscriptions (current_period_end);

create unique index if not exists billing_subscriptions_stripe_subscription_id_uidx
  on public.billing_subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

create unique index if not exists billing_subscriptions_stripe_customer_id_uidx
  on public.billing_subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;

create or replace function public.set_updated_at_billing_subscriptions()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trg_set_updated_at_billing_subscriptions on public.billing_subscriptions;

create trigger trg_set_updated_at_billing_subscriptions
before update on public.billing_subscriptions
for each row
execute procedure public.set_updated_at_billing_subscriptions();

alter table public.billing_subscriptions enable row level security;

-- Client roles cannot read/write this table directly.
revoke all on public.billing_subscriptions from anon;
revoke all on public.billing_subscriptions from authenticated;

-- Service role keeps full control for server-side sync flows.
grant all on public.billing_subscriptions to service_role;
