
CREATE OR REPLACE FUNCTION public.get_leaderboard(_limit int DEFAULT 50)
RETURNS TABLE (
  rank bigint,
  username text,
  coins bigint,
  biggest_win bigint,
  total_wins integer,
  total_spins integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ROW_NUMBER() OVER (ORDER BY p.coins DESC, p.biggest_win DESC) AS rank,
    p.username,
    p.coins,
    p.biggest_win,
    p.total_wins,
    p.total_spins
  FROM public.profiles p
  ORDER BY p.coins DESC, p.biggest_win DESC
  LIMIT GREATEST(1, LEAST(_limit, 200));
$$;

REVOKE EXECUTE ON FUNCTION public.get_leaderboard(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(int) TO anon, authenticated;
