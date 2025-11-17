---
layout: page
title: Portfolio
permalink: /portfolio/
---

<section class="ba-online-guide">
  <style>
    .ba-online-guide {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        sans-serif;
      background: #0b1220;
      color: #e5e7eb;
      padding: 1.25rem;
      border-radius: 1rem;
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.55);
      margin: 1.5rem auto;
      max-width: 960px;
    }

    .ba-online-guide h2 {
      margin-top: 0;
      font-size: 1.3rem;
    }

    .ba-online-guide ol {
      margin: 0.9rem 0 1.2rem;
      padding-left: 1.25rem;
      line-height: 1.5;
    }

    .ba-online-guide code,
    .ba-online-guide pre {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo,
        Courier, monospace;
    }

    .ba-online-guide pre {
      background: #020617;
      padding: 0.9rem;
      border-radius: 0.75rem;
      overflow: auto;
      border: 1px solid rgba(148, 163, 184, 0.4);
    }

    .ba-online-guide .ba-guide-note {
      font-size: 0.9rem;
      color: #cbd5f5;
      margin-bottom: 1rem;
    }

    .ba-online-guide ul {
      margin: 0.6rem 0 0.6rem 1.25rem;
    }
  </style>

  <h2>Online multiplayer quickstart (Supabase Realtime)</h2>
  <p class="ba-guide-note">
    Supabase is the fastest option for this GitHub Pages build because it gives
    you a Postgres database, Row Level Security, and realtime listeners that
    work directly from the browser. The steps below wire your existing Blue
    Marble UI to a hosted backend without spinning up custom servers.
  </p>

  <ol>
    <li>
      <strong>Create the Supabase project</strong>
      <ul>
        <li>Visit <a href="https://app.supabase.com" target="_blank">Supabase</a>, create a project, and copy the Project URL + anon public key.</li>
        <li>Under <em>Database &gt; Tables</em> add two tables: <code>rooms</code> (id uuid primary key, code text unique, state jsonb) and <code>players</code> (id uuid, room_id uuid, name text, cash int, position int).</li>
      </ul>
    </li>
    <li>
      <strong>Enable realtime + Row Level Security</strong>
      <ul>
        <li>Turn on RLS for both tables, then add policies such as “Authenticated users can insert/select/update rows where <code>room_id</code> matches their session”. For a prototype, enable <em>Authenticated access</em> and sign clients in anonymously using <code>supabase.auth.signInWithOtp({ email })</code> or <code>signInAnonymously()</code>.</li>
        <li>In <em>Database &gt; Replication</em> enable Realtime for the <code>rooms</code> and <code>players</code> tables so updates are broadcast to clients.</li>
      </ul>
    </li>
    <li>
      <strong>Wire your GitHub Pages UI</strong>
      <ul>
        <li>Add the Supabase JS SDK to <code>portfolio.markdown</code> (ES module: <code>&lt;script type="module"&gt;import { createClient } from 'https://esm.sh/@supabase/supabase-js';&lt;/script&gt;</code>).</li>
        <li>Instantiate the client with your project URL + anon key, then create helpers that read/write the shared <code>state</code> JSON blob (turn, properties, dice queue) on each move.</li>
        <li>Subscribe to realtime changes so remote browsers receive <code>rooms</code> and <code>players</code> updates instantly.</li>
      </ul>
    </li>
    <li>
      <strong>Sample room bootstrap</strong>
      <pre><code>const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const { data: room } = await supabase.from('rooms')
  .insert({ code: lobbyCode, state: initialState })
  .select()
  .single();

supabase
  .channel(`room-${room.id}`)
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
    (payload) => syncBoard(payload.new.state)
  )
  .subscribe();

async function commitMove(patch) {
  await supabase.rpc('apply_move', { room_id: room.id, patch });
}
</code></pre>
    </li>
    <li>
      <strong>Optional: Postgres function for authoritative moves</strong>
      <ul>
        <li>Create an <code>apply_move</code> SQL function that validates turn order, merges player cash/position, and rolls back illegal moves before broadcasting.</li>
        <li>Expose lightweight “start game”, “end game”, and “shuffle golden key” RPCs so every client shares the same randomness.</li>
      </ul>
    </li>
  </ol>

  <p class="ba-guide-note">
    Once this Supabase plumbing is in place, deploy your updated
    <code>portfolio.markdown</code> to GitHub Pages—no extra servers are required,
    and you can later port the same Realtime calls into a Discord Activity.
  </p>
</section>

<div id="burumabul-app">
  <style>
    #burumabul-app {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        sans-serif;
      color: #e5e7eb;
      background: #020617;
      padding: 1rem;
      border-radius: 1rem;
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.65);
      max-width: 1200px;
      margin: 1.5rem auto;
      box-sizing: border-box;
    }

    #burumabul-app * {
      box-sizing: border-box;
    }

    .ba-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .ba-title {
      font-weight: 700;
      font-size: 1.3rem;
    }

    .ba-sub {
      font-size: 0.85rem;
      color: #9ca3af;
    }

    .ba-layout {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }


    .ba-board {
      background: radial-gradient(circle at top left, #1f2937, #020617 60%);
      padding: 0.75rem;
      border-radius: 0.9rem;

      /* 중앙 패널용 */
      position: relative;
      overflow: hidden;
    }

    .ba-board-center-panel {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(360px, 85%);
      background: rgba(2, 6, 23, 0.94);
      border: 1px solid rgba(148, 163, 184, 0.35);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55);
      z-index: 2;
      pointer-events: auto;
      backdrop-filter: blur(5px);
    }

    .ba-board-center-panel .ba-panel-title span {
      color: #cbd5f5;
    }

    .ba-board-center-panel .ba-note {
      color: #94a3b8;
    }

    @media (max-width: 640px) {
      .ba-board-center-panel {
        width: 92%;
        padding: 0.75rem;
      }
    }

    /* 중앙 상세 패널 오버레이 */
    .ba-hidden {
      display: none !important;
    }

    .ba-tile-detail {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(15, 23, 42, 0.7);
      z-index: 10;
    }

    .ba-tile-detail-inner {
      width: min(480px, 90%);
      max-height: 80%;
      padding: 1.25rem 1.5rem;
      border-radius: 1rem;
      background: #020617;
      border: 1px solid rgba(148, 163, 184, 0.7);
      box-shadow: 0 18px 60px rgba(0, 0, 0, 0.7);
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .ba-tile-detail-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.25rem;
    }

    .ba-tile-detail-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #e5e7eb;
    }

    .ba-tile-detail-close {
      border: none;
      border-radius: 999px;
      padding: 0.2rem 0.7rem;
      font-size: 1.2rem;
      line-height: 1;
      background: rgba(15, 23, 42, 0.95);
      color: #e5e7eb;
      cursor: pointer;
      transition: background 0.12s ease, color 0.12s ease, transform 0.08s;
    }

    .ba-tile-detail-close:hover {
      background: rgba(248, 113, 113, 0.95);
      color: #fff;
      transform: translateY(-1px);
    }

    .ba-tile-detail-body {
      font-size: 0.85rem;
      color: #cbd5f5;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .ba-tile-detail-actions {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .ba-tile-detail-actions .ba-btn {
      width: 100%;
      justify-content: center;
    }

    .ba-tile-detail-helper {
      font-size: 0.75rem;
      color: #94a3b8;
      line-height: 1.4;
    }

    .ba-tile-detail-message {
      font-size: 0.78rem;
      color: #fcd34d;
      line-height: 1.4;
    }

    .ba-tile-detail-message.ba-hidden {
      display: none;
    }

    .ba-tile-detail-row {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    }

    .ba-tile-detail-label {
    color: #9ca3af;
    }

    .ba-tile-detail-value {
    font-weight: 500;
    }

    .ba-board-grid {
      display: grid;
      grid-template-columns: repeat(9, minmax(40px, 1fr));
      grid-auto-rows: minmax(40px, 1fr);
      gap: 0.25rem;
      width: 100%;
      aspect-ratio: 1 / 1;
    }

    .ba-tile {
      border-radius: 0.6rem;
      padding: 0.25rem;
      font-size: 0.6rem;
      background: radial-gradient(circle at top left, #111827, #020617 60%);
      border: 1px solid #111827;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    .ba-tile.empty {
      background: radial-gradient(circle at top left, #020617, #020617 50%);
      border: none;
    }

    .ba-tile.donate {
        border-color: #fb923c; /* 주황색 */
        box-shadow: 0 0 0 1px rgba(251, 146, 60, 0.4);
    }


    .ba-tile-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.25rem;
      margin-bottom: 0.1rem;
    }

    .ba-tile-name {
      font-weight: 600;
      font-size: 0.63rem;
      color: #e5e7eb;
      line-height: 1.1;
      word-break: keep-all;
    }

    .ba-tile-price {
      font-size: 0.55rem;
      color: #9ca3af;
      white-space: nowrap;
    }

    .ba-tile-owner {
      font-size: 0.5rem;
      color: #9ca3af;
      min-height: 0.7rem;
    }

    .ba-tile-owned {
      border-color: var(--ba-owner-color, #38bdf8);
      box-shadow: 0 0 0 2px var(--ba-owner-color-soft, rgba(56, 189, 248, 0.45));
    }

    .ba-tile-owned::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        140deg,
        var(--ba-owner-color-tint, rgba(56, 189, 248, 0.2)),
        transparent 65%
      );
      opacity: 0.75;
      pointer-events: none;
    }

    .ba-tile-owner-badge {
      position: absolute;
      top: 0.2rem;
      right: 0.2rem;
      padding: 0.05rem 0.35rem 0.08rem;
      border-radius: 999px;
      font-size: 0.48rem;
      font-weight: 700;
      color: #020617;
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(15, 23, 42, 0.35);
      background: var(--ba-owner-color, #38bdf8);
      z-index: 2;
      letter-spacing: 0.02em;
    }

    .ba-tile-owner-badge .ba-tile-owner-initial {
      width: 0.65rem;
      height: 0.65rem;
      border-radius: 50%;
      background: rgba(248, 250, 252, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.45rem;
      color: #0f172a;
      box-shadow: inset 0 0 4px rgba(15, 23, 42, 0.25);
    }

    .ba-tile-owner-badge .ba-tile-owner-name {
      max-width: 2.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ba-tile-players {
      display: flex;
      flex-wrap: wrap;
      gap: 0.1rem;
      margin-top: 0.1rem;
      min-height: 0.55rem;
    }

    .ba-token {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.45rem;
      color: #020617;
      font-weight: 700;
      outline: 1px solid rgba(15, 23, 42, 0.75);
    }

    .ba-token.current {
      outline: 2px solid rgba(248, 250, 252, 0.9);
      box-shadow: 0 0 10px rgba(248, 250, 252, 0.65);
      transform: scale(1.1);
    }

    .ba-tile-index {
      position: absolute;
      bottom: 0.1rem;
      right: 0.2rem;
      font-size: 0.45rem;
      color: #4b5563;
    }

    .ba-tile.special {
      border-color: #22c55e;
      box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.25);
    }

    .ba-tile.golden {
      border-color: #facc15;
      box-shadow: 0 0 0 1px rgba(234, 179, 8, 0.3);
    }

    .ba-tile-current {
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.7);
    }

    .ba-sidebar {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .ba-panel {
      background: radial-gradient(circle at top left, #020617, #020617 55%);
      border-radius: 0.9rem;
      padding: 0.6rem 0.75rem;
      border: 1px solid #111827;
    }

    .ba-panel + .ba-panel {
      margin-top: 0.25rem;
    }

    .ba-panel-title {
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 0.35rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #e5e7eb;
    }

    .ba-panel-title span {
      font-size: 0.75rem;
      color: #9ca3af;
      font-weight: 400;
    }

    .ba-turn-main {
      font-size: 0.8rem;
      margin-bottom: 0.18rem;
    }

    .ba-turn-sub {
      font-size: 0.7rem;
      color: #9ca3af;
      margin-bottom: 0.25rem;
    }

    .ba-turn-indicator {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 0.8rem;
      border-radius: 0.8rem;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(59, 130, 246, 0.4);
      box-shadow: 0 0 20px rgba(37, 99, 235, 0.25);
      margin-bottom: 0.45rem;
      animation: ba-turn-pulse 1.6s ease-in-out infinite;
    }

    .ba-turn-indicator-ended {
      animation: none;
      border-color: rgba(148, 163, 184, 0.35);
      box-shadow: none;
      opacity: 0.85;
    }

    .ba-turn-indicator-dot {
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 999px;
      border: 2px solid rgba(15, 23, 42, 0.9);
      box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
      flex-shrink: 0;
      background: #475569;
    }

    .ba-turn-indicator-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .ba-turn-indicator-label {
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
    }

    .ba-turn-indicator-name {
      font-size: 0.9rem;
      font-weight: 700;
      color: #f9fafb;
    }

    @keyframes ba-turn-pulse {
      0% {
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.35);
      }
      50% {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
      }
      100% {
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.35);
      }
    }

    .ba-dice-row {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-bottom: 0.25rem;
      flex-wrap: wrap;
    }

    .ba-die {
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 0.35rem;
      background: radial-gradient(circle at 25% 20%, #1f2937, #020617 70%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.8rem;
      border: 1px solid #111827;
    }

    .ba-dice-sum {
      font-size: 0.7rem;
      color: #9ca3af;
      min-width: 4.2rem;
    }

    .ba-control-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-bottom: 0.25rem;
    }

    .ba-reset-row {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.25rem;
    }

    .ba-btn {
      border-radius: 999px;
      border: none;
      padding: 0.25rem 0.7rem;
      font-size: 0.7rem;
      cursor: pointer;
      background: linear-gradient(to bottom right, #1d4ed8, #3b82f6);
      color: #e5e7eb;
      font-weight: 600;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.75);
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .ba-btn.secondary {
      background: linear-gradient(to bottom right, #374151, #111827);
      color: #e5e7eb;
    }

    .ba-btn.danger {
      background: linear-gradient(to bottom right, #b91c1c, #ef4444);
    }

    .ba-btn:disabled {
      opacity: 0.45;
      cursor: default;
      box-shadow: none;
    }

    .ba-message {
      font-size: 0.7rem;
      color: #e5e7eb;
      min-height: 1.4rem;
    }

    .ba-note {
      font-size: 0.65rem;
      color: #9ca3af;
    }

    .ba-player-list {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      max-height: 8.5rem;
      overflow-y: auto;
      padding-right: 0.25rem;
    }

    .ba-player-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.7rem;
      padding: 0.25rem 0.35rem;
      border-radius: 0.45rem;
      background: radial-gradient(circle at top left, #020617, #020617 55%);
    }

    .ba-player-row.ba-player-current {
      border: 1px solid rgba(59, 130, 246, 0.9);
      box-shadow: 0 0 12px rgba(37, 99, 235, 0.35);
      background: radial-gradient(circle at top left, #0f172a, #020617 60%);
      animation: ba-current-glow 1.8s ease-in-out infinite;
    }

    @keyframes ba-current-glow {
      0% {
        box-shadow: 0 0 6px rgba(37, 99, 235, 0.2);
      }
      50% {
        box-shadow: 0 0 16px rgba(37, 99, 235, 0.55);
      }
      100% {
        box-shadow: 0 0 6px rgba(37, 99, 235, 0.2);
      }
    }

    .ba-player-main {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .ba-player-color {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 999px;
      border: 1px solid #020617;
    }

    .ba-player-name {
      font-weight: 600;
    }

    .ba-player-money {
      font-weight: 600;
      font-size: 0.7rem;
    }

    .ba-player-status {
      font-size: 0.62rem;
      color: #9ca3af;
    }

    .ba-pill {
      border-radius: 999px;
      border: 1px solid #374151;
      padding: 0.05rem 0.4rem;
      font-size: 0.61rem;
    }

    .ba-pill.broke {
      border-color: #f97316;
      color: #fdba74;
    }

    .ba-welfare {
      font-size: 0.7rem;
      color: #22c55e;
    }

    .ba-log {
      max-height: 9rem;
      overflow-y: auto;
      padding-right: 0.25rem;
      font-size: 0.65rem;
      display: flex;
      flex-direction: column-reverse;
      gap: 0.1rem;
    }

    .ba-log-entry {
      padding: 0.18rem 0.25rem;
      border-radius: 0.4rem;
      background: radial-gradient(circle at top left, #020617, #020617 55%);
      border: 1px solid #0f172a;
      color: #e5e7eb;
    }

    .ba-log-entry .turn {
      color: #9ca3af;
      margin-right: 0.25rem;
    }

    .ba-log-entry .name {
      font-weight: 600;
      margin-right: 0.15rem;
    }

    .ba-log-entry .money-pos {
      color: #22c55e;
      margin-left: 0.15rem;
    }

    .ba-log-entry .money-neg {
      color: #f97316;
      margin-left: 0.15rem;
    }

    .ba-setup-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.3rem 0.5rem;
      margin-bottom: 0.4rem;
      font-size: 0.7rem;
    }

    .ba-input {
      width: 100%;
      padding: 0.2rem 0.35rem;
      border-radius: 0.45rem;
      border: 1px solid #1f2937;
      background: #020617;
      color: #e5e7eb;
      font-size: 0.7rem;
    }

    .ba-select {
      width: 100%;
      padding: 0.2rem 0.35rem;
      border-radius: 999px;
      border: 1px solid #1f2937;
      background: #020617;
      color: #e5e7eb;
      font-size: 0.7rem;
    }

    .ba-label {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .ba-space-row {
      display: none;
      align-items: center;
      gap: 0.35rem;
      margin-bottom: 0.25rem;
      font-size: 0.7rem;
    }

    .ba-space-row label {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex: 1;
    }

    /* Golden Key Popup Container */
    .ba-golden-popup {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* board보다 위 */
    }

    /* Golden Key Card */
    .ba-golden-card {
    width: 360px;
    padding: 25px 30px;
    background: #fffbea;
    border-radius: 14px;
    border: 2px solid #facc15;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    transform: scale(0.6);
    opacity: 0;
    animation: ba-golden-pop 0.35s ease-out forwards;
    }

    .ba-golden-title {
    font-size: 26px;
    font-weight: 700;
    color: #ca8a04;
    text-align: center;
    margin-bottom: 12px;
    }

    .ba-golden-text {
    font-size: 18px;
    color: #4a3000;
    white-space: pre-line;
    margin-bottom: 20px;
    }

    .ba-btn.golden-btn {
    width: 100%;
    background: #facc15;
    color: #4a3000;
    font-weight: bold;
    border-radius: 8px;
    }

    /* Popup animation */
    @keyframes ba-golden-pop {
    0% { transform: scale(0.6); opacity: 0; }
    70% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
    }

  </style>

  <div class="ba-header">
    <div>
      <div class="ba-title">부루마불 Web</div>
      <div class="ba-sub">출발 월급 20만 · 2~4인 · 건물 · 무인도 · 우주여행 · 황금열쇠</div>
    </div>
  </div>

  <div id="ba-setup" class="ba-panel" style="margin-bottom:0.75rem">
    <div class="ba-panel-title">게임 설정</div>
    <div class="ba-setup-grid">
      <div class="ba-label">
        <span>플레이어 수 (2~4)</span>
        <select id="ba-player-count" class="ba-select">
          <option value="2">2명</option>
          <option value="3" selected>3명</option>
          <option value="4">4명</option>
        </select>
      </div>
      <div class="ba-label">
        <span>선택 규칙</span>
        <select id="ba-rule-mode" class="ba-select">
          <option value="normal">일반 (전/후반 통합)</option>
        </select>
      </div>
      <div class="ba-label">
        <span>타일 세트</span>
        <select id="ba-tile-policy" class="ba-select">
          <option value="vanilla" selected>바닐라 (기본 순서)</option>
          <option value="random">랜덤 (매 게임 새 배열)</option>
          <option value="reversed">역순 (반대 방향 순회)</option>
          <option value="luxury">럭셔리 파도 (땅값 높은 순)</option>
        </select>
      </div>
      <div class="ba-label">
        <span>플레이어 1 이름</span>
        <input id="ba-name-1" class="ba-input" value="플레이어 1" />
      </div>
      <div class="ba-label">
        <span>플레이어 2 이름</span>
        <input id="ba-name-2" class="ba-input" value="플레이어 2" />
      </div>
      <div class="ba-label">
        <span>플레이어 3 이름</span>
        <input id="ba-name-3" class="ba-input" value="플레이어 3" />
      </div>
      <div class="ba-label">
        <span>플레이어 4 이름</span>
        <input id="ba-name-4" class="ba-input" value="플레이어 4" />
      </div>
    </div>
    <div class="ba-control-row" style="justify-content:space-between;">
      <button id="ba-start-btn" class="ba-btn">게임 시작</button>
      <button id="ba-reset-btn" class="ba-btn secondary" style="display:none;">
        리셋
      </button>
    </div>
    <div class="ba-note">
      · 3~4인: 시작 자금 300만 / 2인: 600만<br />
      · 건물은 각 차례 시작에 자신의 땅을 클릭해 지을 수 있습니다.<br />
      · 출발/무인도 위치만 고정되고, 나머지 타일은 정책에 따라 재배치됩니다.
    </div>
  </div>

  <div id="ba-online-panel" class="ba-panel" style="margin-bottom:0.75rem">
    <div class="ba-panel-title">온라인 멀티플레이어 (Supabase)</div>
    <div class="ba-setup-grid">
      <div class="ba-label">
        <span>로비 코드</span>
        <input id="ba-lobby-code" class="ba-input" value="ABCD" maxlength="12" />
      </div>
      <div class="ba-label">
        <span>내 이름</span>
        <input id="ba-online-name" class="ba-input" value="온라인 플레이어" />
      </div>
    </div>
    <div class="ba-control-row">
      <button id="ba-create-room" class="ba-btn secondary">온라인 방 생성</button>
      <button id="ba-join-room" class="ba-btn secondary">참가</button>
    </div>
    <div id="ba-online-status" class="ba-note"></div>
    <div id="ba-online-roster" class="ba-player-list" style="margin:0.4rem 0;"></div>
    <div class="ba-note">
      · 호스트는 위 설정으로 방을 만든 뒤, 로비 코드를 친구에게 공유합니다.<br />
      · 참가자는 같은 코드를 입력하고 참가 버튼을 누르면 동일한 게임 상태를 실시간으로 공유할 수 있습니다.
    </div>
  </div>

  <div id="ba-game" style="display:none;"><!-- Golden Key Popup -->
    <div id="ba-golden-popup" class="ba-golden-popup">
        <div class="ba-golden-card">
            <div class="ba-golden-title">황금 열쇠</div>
            <div id="ba-golden-text" class="ba-golden-text">카드 내용</div>

            <button id="ba-golden-continue" class="ba-btn golden-btn">계속</button>
        </div>
    </div>

    <div class="ba-layout">
        <div class="ba-board">
            <div id="ba-board-grid" class="ba-board-grid"></div>

            <div class="ba-panel ba-board-center-panel">
              <div class="ba-panel-title">
                <span id="ba-turn-title">-</span>
                <span id="ba-welfare">복지기금: 0원</span>
              </div>
              <div id="ba-turn-indicator" class="ba-turn-indicator">
                <div id="ba-turn-indicator-dot" class="ba-turn-indicator-dot"></div>
                <div class="ba-turn-indicator-text">
                  <span class="ba-turn-indicator-label">현재 턴</span>
                  <span
                    id="ba-turn-indicator-name"
                    class="ba-turn-indicator-name"
                    >-</span
                  >
                </div>
              </div>
              <div class="ba-turn-main" id="ba-current-tile">현재 위치: -</div>
              <div class="ba-turn-sub" id="ba-turn-sub">-</div>
              <div class="ba-dice-row">
                <div class="ba-die" id="ba-die-1">-</div>
                <div class="ba-die" id="ba-die-2">-</div>
                <div class="ba-dice-sum">
                  합계: <span id="ba-die-sum">-</span>
                </div>
              </div>
              <div id="ba-space-row" class="ba-space-row">
                <label>
                  우주여행 목적지
                  <select id="ba-space-select" class="ba-select"></select>
                </label>
                <button id="ba-space-go-btn" class="ba-btn secondary">
                  이동
                </button>
              </div>
              <div class="ba-control-row">
                <button id="ba-roll-btn" class="ba-btn">주사위</button>
                <button id="ba-action-btn" class="ba-btn secondary">
                  타일 행동
                </button>
                <button id="ba-endturn-btn" class="ba-btn secondary">
                  턴 종료
                </button>
              </div>
              <div class="ba-reset-row">
                <button id="ba-reset-game-btn" class="ba-btn danger">
                  처음 화면으로
                </button>
              </div>
              <div class="ba-message" id="ba-message"></div>
              <div class="ba-note">
                · 자신의 턴 시작 시, <b>아직 주사위를 굴리기 전에</b> 소유 도시를 클릭하면
                건물을 지을 수 있습니다.<br />
                · 무인도에 갇힌 경우 더블이 나오면 탈출합니다.
              </div>
            </div>

            <!-- 타일 상세 패널 -->
            <div id="ba-tile-detail" class="ba-tile-detail ba-hidden">
              <div class="ba-tile-detail-inner">
                <div class="ba-tile-detail-header">
                  <div id="ba-tile-detail-title" class="ba-tile-detail-title">
                    타일 정보
                  </div>
                  <button
                    type="button"
                    id="ba-tile-detail-close"
                    class="ba-tile-detail-close"
                    aria-label="닫기"
                  >
                    ×
                  </button>
                </div>
                <div id="ba-tile-detail-body" class="ba-tile-detail-body">
                  <!-- JS가 내용 채움 -->
                </div>
                <div
                  id="ba-tile-detail-actions"
                  class="ba-tile-detail-actions"
                ></div>
                <div
                  id="ba-tile-detail-message"
                  class="ba-tile-detail-message ba-hidden"
                ></div>
              </div>
            </div>
          </div>
    </div>

      <div class="ba-sidebar">
        <div class="ba-panel">
          <div class="ba-panel-title">플레이어</div>
          <div id="ba-players" class="ba-player-list"></div>
        </div>

        <div class="ba-panel">
          <div class="ba-panel-title">로그</div>
          <div id="ba-log" class="ba-log"></div>
        </div>
      </div>
    </div>
  <script type="module" src="/assets/js/burumabul.js"></script>

</div>