
-- 1) Lock down SECURITY DEFINER leaderboard function
REVOKE EXECUTE ON FUNCTION public.get_leaderboard(int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(int) TO service_role;

-- 2) Tighten profiles INSERT policy to prevent economic tampering at signup
DROP POLICY IF EXISTS "own profile insert" ON public.profiles;
CREATE POLICY "own profile insert safe defaults"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id
  AND coins = 1000
  AND total_spins = 0
  AND total_wins = 0
  AND biggest_win = 0
);

-- 3) Explicit restrictive deny policies for UPDATE/DELETE on game_history
CREATE POLICY "no history update"
ON public.game_history
AS RESTRICTIVE
FOR UPDATE
TO authenticated, anon
USING (false)
WITH CHECK (false);

CREATE POLICY "no history delete"
ON public.game_history
AS RESTRICTIVE
FOR DELETE
TO authenticated, anon
USING (false);
