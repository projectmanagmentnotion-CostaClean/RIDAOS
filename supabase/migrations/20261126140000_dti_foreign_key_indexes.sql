create index if not exists dti_adaptation_quotes_created_by_idx
  on public.dti_adaptation_quotes(created_by);

create index if not exists dti_artwork_events_actor_user_id_idx
  on public.dti_artwork_events(actor_user_id);
create index if not exists dti_artwork_events_artwork_version_id_idx
  on public.dti_artwork_events(artwork_version_id);

create index if not exists dti_artwork_reviews_artwork_version_id_idx
  on public.dti_artwork_reviews(artwork_version_id);
create index if not exists dti_artwork_reviews_reviewer_user_id_idx
  on public.dti_artwork_reviews(reviewer_user_id);

create index if not exists dti_artwork_versions_uploaded_by_idx
  on public.dti_artwork_versions(uploaded_by);

create index if not exists dti_order_events_actor_user_id_idx
  on public.dti_order_events(actor_user_id);

create index if not exists dti_orders_adaptation_quote_id_idx
  on public.dti_orders(adaptation_quote_id);

create index if not exists dti_payment_attempts_adaptation_quote_id_idx
  on public.dti_payment_attempts(adaptation_quote_id);
create index if not exists dti_payment_attempts_artwork_version_id_idx
  on public.dti_payment_attempts(artwork_version_id);

create index if not exists dti_staff_permissions_granted_by_idx
  on public.dti_staff_permissions(granted_by);
