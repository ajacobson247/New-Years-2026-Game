import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type EventRow = {
  id: string;
  created_at: string;
  type: string;
  clue: string | null;
  player_id: string | null;
  player_name: string | null;
  is_correct: boolean | null;
};

export const dynamic = "force-dynamic";

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function formatDuration(ms: number) {
  if (!Number.isFinite(ms) || ms < 0) return "";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss.padStart(2, "0")}`;
}

function displayTeamName(
  playerId: string | null,
  directName: string | null,
  playerNameById: Map<string, string>
) {
  const trimmed = directName?.trim() ?? "";
  if (trimmed) return trimmed;
  if (playerId) return playerNameById.get(playerId) ?? playerId;
  return "";
}

export default async function AdminPage() {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("events")
    .select("id, created_at, type, clue, player_id, player_name, is_correct")
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8 font-sans">
        <h1 className="text-4xl font-serif">Admin</h1>
        <p className="mt-6">Failed to load events: {error.message}</p>
      </div>
    );
  }

  const events = (data ?? []) as EventRow[];

  const uniquePlayers = new Set(events.map((e) => e.player_id).filter(Boolean));
  const clueViews = events
    .filter((e) => e.type === "view_clue")
    .map((e) => e.clue ?? "unknown");

  const finishers = events.filter((e) => e.type === "finish");

  const playerNameById = new Map<string, string>();
  for (const e of events) {
    if (!e.player_id || !e.player_name) continue;
    if (!playerNameById.has(e.player_id)) {
      playerNameById.set(e.player_id, e.player_name);
    }
  }

  // Per-team time-to-reach each clue (from first view_home)
  const startByPlayer = new Map<string, number>();
  for (const e of events) {
    if (e.type !== "view_home" || !e.player_id) continue;
    const t = Date.parse(e.created_at);
    if (!Number.isFinite(t)) continue;
    const prev = startByPlayer.get(e.player_id);
    if (prev === undefined || t < prev) startByPlayer.set(e.player_id, t);
  }

  const firstViewByPlayerClue = new Map<string, number>();
  for (const e of events) {
    if (e.type !== "view_clue" || !e.player_id || !e.clue) continue;
    const key = `${e.player_id}::${e.clue}`;
    const t = Date.parse(e.created_at);
    if (!Number.isFinite(t)) continue;
    const prev = firstViewByPlayerClue.get(key);
    if (prev === undefined || t < prev) firstViewByPlayerClue.set(key, t);
  }

  const firstCorrectAnswerByPlayerClue = new Map<string, number>();
  const wrongAttemptsByPlayerClue = new Map<string, number>();
  for (const e of events) {
    if (e.type !== "answer" || !e.player_id || !e.clue) continue;
    const key = `${e.player_id}::${e.clue}`;
    const t = Date.parse(e.created_at);
    if (!Number.isFinite(t)) continue;

    if (e.is_correct) {
      const prev = firstCorrectAnswerByPlayerClue.get(key);
      if (prev === undefined || t < prev) firstCorrectAnswerByPlayerClue.set(key, t);
    } else {
      wrongAttemptsByPlayerClue.set(key, (wrongAttemptsByPlayerClue.get(key) ?? 0) + 1);
    }
  }

  const teamClueRows = Array.from(firstViewByPlayerClue.entries())
    .map(([key, firstView]) => {
      const [playerId, clue] = key.split("::");
      const start = startByPlayer.get(playerId);
      const firstCorrect = firstCorrectAnswerByPlayerClue.get(key);
      const wrong = wrongAttemptsByPlayerClue.get(key) ?? 0;

      return {
        playerId,
        playerName: playerNameById.get(playerId) ?? null,
        clue,
        reachedMs: start ? firstView - start : null,
        solveMs: firstCorrect ? firstCorrect - firstView : null,
        wrong,
        firstView,
      };
    })
    .sort((a, b) => {
      if (a.clue !== b.clue) return a.clue.localeCompare(b.clue);
      if (a.reachedMs === null && b.reachedMs !== null) return 1;
      if (a.reachedMs !== null && b.reachedMs === null) return -1;
      return (a.reachedMs ?? 0) - (b.reachedMs ?? 0);
    });

  const clueViewCounts = countBy(clueViews);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <h1 className="text-4xl font-serif">Admin</h1>

      <div className="mt-6 grid gap-3">
        <div className="rounded border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-sm text-muted">Recent events loaded</div>
          <div className="text-2xl font-semibold">{events.length}</div>
        </div>
        <div className="rounded border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-sm text-muted">Unique players (approx)</div>
          <div className="text-2xl font-semibold">{uniquePlayers.size}</div>
        </div>
        <div className="rounded border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-sm text-muted">Finish events</div>
          <div className="text-2xl font-semibold">{finishers.length}</div>
        </div>
      </div>

      <h2 className="mt-10 text-2xl font-serif">Clue Views</h2>
      <div className="mt-3 rounded border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
        {Object.keys(clueViewCounts).length === 0 ? (
          <div className="text-muted">No clue views yet.</div>
        ) : (
          <ul className="space-y-1">
            {Object.entries(clueViewCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([clue, count]) => (
                <li key={clue} className="flex justify-between gap-4">
                  <span>{clue}</span>
                  <span className="font-semibold">{count}</span>
                </li>
              ))}
          </ul>
        )}
      </div>

      <h2 className="mt-10 text-2xl font-serif">Time To Reach Each Clue (Per Team)</h2>
      <div className="mt-3 overflow-x-auto rounded border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/5">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 dark:border-white/10">
            <tr>
              <th className="p-3">Clue</th>
              <th className="p-3">Team</th>
              <th className="p-3">Reached</th>
              <th className="p-3">Solved</th>
              <th className="p-3">Wrong</th>
            </tr>
          </thead>
          <tbody> 
            {teamClueRows.length === 0 ? (
              <tr>
                <td className="p-3 text-muted" colSpan={5}>
                  No clue/team data yet.
                </td>
              </tr>
            ) : (
              teamClueRows.map((row) => (
                <tr
                  key={`${row.playerId}::${row.clue}`}
                  className="border-b border-black/5 last:border-b-0 dark:border-white/5"
                >
                  <td className="p-3 whitespace-nowrap">{row.clue}</td>
                  <td className="p-3 whitespace-nowrap">{row.playerName ?? row.playerId}</td>
                  <td className="p-3 whitespace-nowrap">
                    {row.reachedMs === null ? "" : formatDuration(row.reachedMs)}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {row.solveMs === null ? "" : formatDuration(row.solveMs)}
                  </td>
                  <td className="p-3 whitespace-nowrap">{row.wrong}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-2xl font-serif">Recent Events</h2>
      <div className="mt-3 overflow-x-auto rounded border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/5">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 dark:border-white/10">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Type</th>
              <th className="p-3">Clue</th>
              <th className="p-3">Player</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr
                key={e.id}
                className="border-b border-black/5 last:border-b-0 dark:border-white/5"
              >
                <td className="p-3 whitespace-nowrap">
                  {new Date(e.created_at).toLocaleString()}
                </td>
                <td className="p-3 whitespace-nowrap">{e.type}</td>
                <td className="p-3 whitespace-nowrap">{e.clue ?? ""}</td>
                <td className="p-3 whitespace-nowrap">
                  {displayTeamName(e.player_id, e.player_name, playerNameById)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
