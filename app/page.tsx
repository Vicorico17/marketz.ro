'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Game, GameFormData, UserVotes } from './types/game';
import { Admin, AdminState } from './types/auth';
import { CreateGameForm } from './components/CreateGameForm';
import { GameCard } from './components/GameCard';
import { AdminLogin } from './components/AdminLogin';
import { AdminList } from './components/AdminList';

const STORAGE_KEY = 'marketz_user_votes';
const ADMIN_STORAGE_KEY = 'marketz_admins';
const ADMIN_STATE_KEY = 'marketz_admin_state';

const buttonStyles = {
  base: "font-medium shadow-lg transform transition-all duration-150 active:scale-95 px-6 py-3 rounded-full text-sm sm:text-base",
  admin: "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-red-900/20 text-base px-6 py-3 border border-red-500/20 hover:scale-105",
  create: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-900/20 text-sm px-4 py-2 border border-red-400/20 hover:scale-105 hover:shadow-red-900/40",
  add: "bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-800 hover:to-black text-white shadow-red-900/20 text-sm px-4 py-2",
  logout: "bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white shadow-red-900/20 text-sm px-4 py-2"
};

const INITIAL_ADMINS: Admin[] = [
  {
    username: 'vicorico',
    password: 'admin123'
  },
  {
    username: 'Cristi13',
    password: 'adidas13'
  },
  {
    username: 'palade',
    password: 'filip123'
  },
  {
    username: 'curelao',
    password: 'daos.bjj'
  }
];

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userVotes, setUserVotes] = useState<UserVotes>({});
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminList, setShowAdminList] = useState(false);
  const [adminState, setAdminState] = useState<AdminState>({ isLoggedIn: false });
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  useEffect(() => {
    // Load user votes
    const savedVotes = localStorage.getItem(STORAGE_KEY);
    if (savedVotes) {
      setUserVotes(JSON.parse(savedVotes));
    }

    // Load admin state
    const savedAdminState = localStorage.getItem(ADMIN_STATE_KEY);
    if (savedAdminState) {
      setAdminState(JSON.parse(savedAdminState));
    }

    // Initialize admins if they don't exist
    const admins = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!admins) {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(INITIAL_ADMINS));
    }
  }, []);

  const handleCreateGame = (formData: GameFormData) => {
    const newGame: Game = {
      id: Date.now().toString(),
      ...formData,
      votes: {
        player1Votes: 0,
        player2Votes: 0,
      },
      createdAt: new Date(),
    };
    setGames([newGame, ...games]);
    setShowCreateForm(false);
  };

  const handleVote = (gameId: string, forPlayer: 1 | 2) => {
    if (userVotes[gameId]) {
      return;
    }

    setGames(games.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          votes: {
            ...game.votes,
            [`player${forPlayer}Votes`]: game.votes[`player${forPlayer}Votes`] + 1
          }
        };
      }
      return game;
    }));

    const newUserVotes = {
      ...userVotes,
      [gameId]: forPlayer
    };
    setUserVotes(newUserVotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUserVotes));
  };

  const handleAdminLogin = (credentials: Admin) => {
    if (isRegisterMode) {
      if (!adminState.isLoggedIn) {
        alert('Doar administratorii pot crea conturi noi!');
        return;
      }
      
      const admins = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || '[]');
      if (admins.some((a: Admin) => a.username === credentials.username)) {
        alert('Acest nume de utilizator există deja!');
        return;
      }
      admins.push(credentials);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admins));
      setIsRegisterMode(false);
      alert('Cont admin creat cu succes!');
      return;
    }

    const admins = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || '[]');
    const admin = admins.find(
      (a: Admin) => a.username === credentials.username && a.password === credentials.password
    );

    if (admin) {
      const newAdminState = { isLoggedIn: true, currentUser: admin.username };
      setAdminState(newAdminState);
      localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(newAdminState));
      setShowAdminLogin(false);
    } else {
      alert('Credențiale invalide!');
    }
  };

  const handleLogout = () => {
    setAdminState({ isLoggedIn: false });
    localStorage.removeItem(ADMIN_STATE_KEY);
    setShowCreateForm(false);
  };

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto relative">
        {/* Top Navigation */}
        <div className="absolute top-0 right-0 flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
          {adminState.isLoggedIn ? (
            <>
              <span className="text-white/90 font-medium order-first mb-2 sm:mb-0">
                Admin: {adminState.currentUser}
              </span>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button
                  onClick={() => setShowAdminList(true)}
                  className={`${buttonStyles.base} ${buttonStyles.add}`}
                >
                  Vezi Admini
                </button>
                <button
                  onClick={() => {
                    setIsRegisterMode(true);
                    setShowAdminLogin(true);
                  }}
                  className={`${buttonStyles.base} ${buttonStyles.add}`}
                >
                  Adaugă Admin
                </button>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className={`${buttonStyles.base} ${buttonStyles.create}`}
                >
                  {showCreateForm ? 'Închide' : 'Creează Meci'}
                </button>
                <button
                  onClick={handleLogout}
                  className={`${buttonStyles.base} ${buttonStyles.logout}`}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => {
                setIsRegisterMode(false);
                setShowAdminLogin(true);
              }}
              className={`${buttonStyles.base} ${buttonStyles.admin} animate-pulse hover:animate-none`}
            >
              Login Admin
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="text-center mb-16 pt-24 sm:pt-16">
          <div className="flex flex-col items-center justify-center">
            <h1 className="logo-text mb-2" style={{ fontFamily: 'Permanent Marker, cursive' }}>
              Marketz.ro
            </h1>
            <div className="w-40 h-40 sm:w-56 sm:h-56">
              <Image
                src="/logo.png"
                alt="Marketz.ro Logo"
                width={224}
                height={224}
                className="object-contain"
                priority
              />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl mb-8 text-red-500 font-semibold mt-8">Cine o sa castige?</p>
        </div>

        {showCreateForm && adminState.isLoggedIn && (
          <div className="mb-12">
            <CreateGameForm onSubmit={handleCreateGame} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onVote={handleVote}
              userVote={userVotes[game.id]}
            />
          ))}
          {games.length === 0 && (
            <p className="text-center text-gray-400 col-span-full">Nu există meciuri momentan.</p>
          )}
        </div>
      </div>

      {showAdminLogin && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
          isRegisterMode={isRegisterMode}
        />
      )}

      {showAdminList && (
        <AdminList
          onClose={() => setShowAdminList(false)}
        />
      )}
    </main>
  );
} 