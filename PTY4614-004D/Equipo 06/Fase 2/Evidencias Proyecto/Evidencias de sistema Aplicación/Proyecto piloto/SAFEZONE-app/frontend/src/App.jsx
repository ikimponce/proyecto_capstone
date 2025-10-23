import React, { useEffect, useState } from "react";

// Discord-like single-file React app (export default component)
// Technologies: React + Vite compatible component, uses Tailwind CSS utility classes
// Usage: place as src/App.jsx in a Vite + React + Tailwind project and run

export default function App() {
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [profile] = useState({ name: "Usuario", avatarUrl: null });

  useEffect(() => {
    // Attempt to fetch from backend; fallback to sample data
    fetch(`${import.meta.env.VITE_API_URL}/api/games`)
      .then((r) => {
        if (!r.ok) throw new Error("no api");
        return r.json();
      })
      .then((data) => setGames(data))
      .catch(() => setGames(sampleData));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header profile={profile} activeTab={activeTab} onTab={setActiveTab} />

      <main className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </main>
    </div>
  );
}

function Header({ profile, activeTab, onTab }) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto flex items-center gap-6 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="text-sm font-medium">{profile.name}</div>
            <div className="text-xs text-slate-500">Conectado</div>
          </div>
        </div>

        <nav className="ml-auto flex items-center gap-2">
          <Tab id="home" label="Inicio" active={activeTab === "home"} onClick={onTab} />
          <Tab id="servers" label="Servidores" active={activeTab === "servers"} onClick={onTab} />
          <Tab id="friends" label="Amigos" active={activeTab === "friends"} onClick={onTab} />
          <Tab id="settings" label="Ajustes" active={activeTab === "settings"} onClick={onTab} />
        </nav>
      </div>
    </header>
  );
}

function Tab({ id, label, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        active ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}

function GameCard({ game }) {
  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden border">
      <div className="h-44 md:h-48 bg-slate-200 relative">
        {game.image ? (
          <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">Sin imagen</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{game.title}</h3>
        <p className="text-sm text-slate-500 mt-1">{game.subtitle}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Info label="Jugadores" value={`${game.currentPlayers}`} />
          <Info label="Grupos" value={`${game.groups}`} />
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium">Buscan</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {game.roles && game.roles.length ? (
              game.roles.map((r) => (
                <span key={r} className="px-2 py-1 rounded-full text-xs border">
                  {r}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No especificado</span>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <small className="text-xs text-slate-400">Última actualización: {formatDate(game.updatedAt)}</small>
          <button className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm">Unirse</button>
        </div>
      </div>
    </article>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 p-3 rounded-lg border">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

const sampleData = [
  {
    id: "1",
    title: "Apex Legends",
    subtitle: "Battle Royale - PC/Consola",
    image: null,
    currentPlayers: 1280,
    groups: 312,
    roles: ["Healer", "Tank", "DPS"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "League of Legends",
    subtitle: "MOBA - PC",
    image: null,
    currentPlayers: 5400,
    groups: 824,
    roles: ["Support", "ADC", "Jungle"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Final Fantasy XIV",
    subtitle: "MMORPG - Crossplatform",
    image: null,
    currentPlayers: 2300,
    groups: 420,
    roles: ["Healer", "DPS", "Tank"],
    updatedAt: new Date().toISOString(),
  },
];
