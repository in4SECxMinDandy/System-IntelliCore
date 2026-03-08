
-- Replace overly permissive INSERT policy with a more restrictive one
-- Notifications are only inserted by the trigger (SECURITY DEFINER), not by users directly
DROP POLICY "System can insert notifications" ON public.notifications;
CREATE POLICY "Only service role can insert notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
