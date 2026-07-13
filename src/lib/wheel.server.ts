// Server-only helpers for the wheel-of-fortune server functions.
// These MUST live in a separate module — TanStack's `tss-serverfn-split` moves
// handler bodies into their own chunk and strips sibling declarations that
// live next to `createServerFn` in the same file, causing runtime
// ReferenceError. See knowledge: tanstack-serverfn-splitting.

// Sector table. MUST match the visual order in
// src/components/wheel-of-fortune.tsx so the returned index animates correctly.
export const SECTORS = [
  { mult: 1, label: "×1", weight: 30 },
  { mult: 10, label: "×10", weight: 3 },
  { mult: 2, label: "×2", weight: 15 },
  { mult: 0, label: "×0", weight: 40 },
  { mult: 3, label: "×3", weight: 8 },
  { mult: 25, label: "×25", weight: 1 },
  { mult: 5, label: "×5", weight: 5 },
  { mult: 100, label: "JACKPOT", weight: 0.5 },
] as const;

export const ALLOWED_BETS = [10, 25, 50, 100, 250, 500] as const;

const TOTAL_WEIGHT = SECTORS.reduce((s, x) => s + x.weight, 0);

export function pickWinner(): number {
  let r = Math.random() * TOTAL_WEIGHT;
  for (let i = 0; i < SECTORS.length; i++) {
    if (r < SECTORS[i].weight) return i;
    r -= SECTORS[i].weight;
  }
  return 0;
}

export async function ensureProfile(supabaseAdmin: any, userId: string) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("coins,total_spins,total_wins,biggest_win,username,email")
    .eq("id", userId)
    .maybeSingle();
  if (profile) return profile;

  const { data: userRes } = await supabaseAdmin.auth.admin.getUserById(userId);
  const u = userRes?.user;
  const username =
    (u?.user_metadata as any)?.username ||
    (u?.email ? u.email.split("@")[0] : `hrac_${userId.slice(0, 6)}`);
  const { data: inserted, error: insErr } = await supabaseAdmin
    .from("profiles")
    .insert({ id: userId, username, email: u?.email ?? null })
    .select("coins,total_spins,total_wins,biggest_win,username,email")
    .single();
  if (insErr || !inserted) throw new Error("Profile could not be created");
  return inserted;
}
