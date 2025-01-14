import { Game } from '../types/game';

interface GameCardProps {
  game: Game;
  onVote: (gameId: string, forPlayer: 1 | 2) => void;
  userVote?: 1 | 2;
}

const voteButtonStyles = {
  base: "w-full px-6 py-2.5 rounded-full font-medium shadow-lg transform transition-all duration-150 active:scale-95",
  active: "bg-green-500 text-white shadow-green-900/20",
  inactive: "bg-gray-700 text-gray-300 cursor-not-allowed shadow-black/20",
  default: "bg-green-500 hover:bg-green-600 text-white shadow-green-900/20"
};

export function GameCard({ game, onVote, userVote }: GameCardProps) {
  const totalVotes = game.votes.player1Votes + game.votes.player2Votes;
  const player1Percentage = totalVotes === 0 ? 0 : Math.round((game.votes.player1Votes / totalVotes) * 100);
  const player2Percentage = totalVotes === 0 ? 0 : Math.round((game.votes.player2Votes / totalVotes) * 100);

  return (
    <div className="border border-zinc-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow bg-zinc-900/50 backdrop-blur-sm">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">{game.time}</h3>
        <span className="text-sm text-red-500 bg-black/50 px-4 py-1 rounded-full font-medium">
          Total voturi: {totalVotes}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Player 1 */}
        <div className="text-center">
          <p className="font-bold text-lg mb-3 text-white">{game.player1}</p>
          {game.player1Image && (
            <div className="flex justify-center items-center mb-3">
              <div className="w-24 h-24 overflow-hidden rounded-xl shadow-md">
                <img
                  src={game.player1Image}
                  alt={game.player1}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div className="text-lg font-medium mb-3 text-red-500">{player1Percentage}%</div>
          <button
            onClick={() => onVote(game.id, 1)}
            className={`${voteButtonStyles.base} ${
              userVote
                ? userVote === 1
                  ? voteButtonStyles.active
                  : voteButtonStyles.inactive
                : voteButtonStyles.default
            }`}
            disabled={userVote !== undefined}
          >
            {userVote === 1 ? 'Votat ✓' : 'Votează'}
          </button>
        </div>

        {/* Player 2 */}
        <div className="text-center">
          <p className="font-bold text-lg mb-3 text-white">{game.player2}</p>
          {game.player2Image && (
            <div className="flex justify-center items-center mb-3">
              <div className="w-24 h-24 overflow-hidden rounded-xl shadow-md">
                <img
                  src={game.player2Image}
                  alt={game.player2}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div className="text-lg font-medium mb-3 text-red-500">{player2Percentage}%</div>
          <button
            onClick={() => onVote(game.id, 2)}
            className={`${voteButtonStyles.base} ${
              userVote
                ? userVote === 2
                  ? voteButtonStyles.active
                  : voteButtonStyles.inactive
                : voteButtonStyles.default
            }`}
            disabled={userVote !== undefined}
          >
            {userVote === 2 ? 'Votat ✓' : 'Votează'}
          </button>
        </div>
      </div>
    </div>
  );
} 