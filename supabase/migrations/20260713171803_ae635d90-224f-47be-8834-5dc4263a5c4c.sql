DROP POLICY IF EXISTS "own history insert" ON public.game_history;
REVOKE INSERT ON public.game_history FROM authenticated, anon;
CREATE POLICY "no direct history insert" ON public.game_history AS RESTRICTIVE FOR INSERT TO authenticated, anon WITH CHECK (false);