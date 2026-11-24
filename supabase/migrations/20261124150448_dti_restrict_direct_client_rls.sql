-- DTI commerce is accessed through scoped Edge Functions using service_role.
-- Keep direct Data API reads and writes denied even if a future GRANT is added.
create policy dti_deny_client_access on public.dti_orders
  as restrictive for all to anon, authenticated using (false) with check (false);
create policy dti_deny_client_access on public.dti_adaptation_quotes
  as restrictive for all to anon, authenticated using (false) with check (false);
create policy dti_deny_client_access on public.dti_artwork_files
  as restrictive for all to anon, authenticated using (false) with check (false);
create policy dti_deny_client_access on public.dti_artwork_versions
  as restrictive for all to anon, authenticated using (false) with check (false);
create policy dti_deny_client_access on public.dti_artwork_events
  as restrictive for all to anon, authenticated using (false) with check (false);
create policy dti_deny_client_access on public.dti_artwork_reviews
  as restrictive for all to anon, authenticated using (false) with check (false);
create policy dti_deny_client_access on public.dti_staff_permissions
  as restrictive for all to anon, authenticated using (false) with check (false);
create policy dti_deny_client_access on public.dti_payment_attempts
  as restrictive for all to anon, authenticated using (false) with check (false);
create policy dti_deny_client_access on public.dti_stripe_events
  as restrictive for all to anon, authenticated using (false) with check (false);
create policy dti_deny_client_access on public.dti_order_events
  as restrictive for all to anon, authenticated using (false) with check (false);
