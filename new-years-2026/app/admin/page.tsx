import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type EventRow = {
  id: string;
  created_at: string;
  type: string;
  clue: string | null;
  player_id: string | null;
  player_name: string | null;
};

export const dynamic = "force-dynamic";

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

export default async function AdminPage() {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("events")
    .select("id, created_at, type, clue, player_id, player_name")
    .order("created_at", { ascending: false })
    .limit(200);

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
                  {e.player_name ?? e.player_id ?? ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
