
-- Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Trigger to auto-create notification on order status change
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, title, message, order_id)
    VALUES (
      NEW.user_id,
      'Cập nhật đơn hàng',
      CASE NEW.status
        WHEN 'confirmed' THEN 'Đơn hàng #' || LEFT(NEW.id::text, 8) || ' đã được xác nhận'
        WHEN 'shipping' THEN 'Đơn hàng #' || LEFT(NEW.id::text, 8) || ' đang được giao'
        WHEN 'completed' THEN 'Đơn hàng #' || LEFT(NEW.id::text, 8) || ' đã hoàn thành'
        WHEN 'cancelled' THEN 'Đơn hàng #' || LEFT(NEW.id::text, 8) || ' đã bị hủy'
        ELSE 'Đơn hàng #' || LEFT(NEW.id::text, 8) || ' đã cập nhật trạng thái: ' || NEW.status
      END,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_status_change();
