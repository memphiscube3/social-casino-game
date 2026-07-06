-- Restrict authenticated profile updates so users cannot tamper with their in-game economy
DROP POLICY IF EXISTS "own profile update" ON public.profiles;

CREATE POLICY "own profile update non-economic"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND coins       = (SELECT p.coins       FROM public.profiles p WHERE p.id = auth.uid())
  AND total_spins = (SELECT p.total_spins FROM public.profiles p WHERE p.id = auth.uid())
  AND total_wins  = (SELECT p.total_wins  FROM public.profiles p WHERE p.id = auth.uid())
  AND biggest_win = (SELECT p.biggest_win FROM public.profiles p WHERE p.id = auth.uid())
);

-- Revoke public EXECUTE from SECURITY DEFINER / trigger-only functions.
-- They still run inside their triggers (owned by postgres), but are no longer callable via the Data API.
REVOKE EXECUTE ON FUNCTION public.handle_new_user()  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;