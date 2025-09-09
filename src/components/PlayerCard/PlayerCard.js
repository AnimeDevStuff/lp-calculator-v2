import { useState, useEffect, useRef } from "react";
function PlayerCard({ player, onChangeLP, onSetLP, onDelete, maxLP = 4000 }) {
  const [custom, setCustom] = useState("");
  const [displayLP, setDisplayLP] = useState(player.lp);
  const audioRef = useRef(null);

  // Animate displayLP toward player.lp
const animatingRef = useRef(false);

//   useEffect(() => {
//     if (player.lp === displayLP) return;

//     // Play the sound once at the start
//     if (audioRef.current) {
//       audioRef.current.currentTime = 0;
//       audioRef.current.play().catch(() => {});
//     }
// }, [displayLP])
;
  useEffect(() => {
    if (player.lp === displayLP) return;

    let animationFrame;

    const step = () => {
      setDisplayLP(prev => {
        const diff = player.lp - prev;
        if (diff === 0) return prev; // done
        const change = Math.sign(diff) * Math.min(Math.abs(diff), 50);
        return prev + change;
      });

      // schedule next frame if not done

      animationFrame = requestAnimationFrame(() => {
        if (displayLP !== player.lp) step();
      });
    };
    

    step();

    return () => cancelAnimationFrame(animationFrame);
  }, [player.lp]);
  
const lpPercent = Math.min((displayLP / maxLP) * 100, 100); // clamp to 100%

const getGaugeColor = (lp) => {
  const percent = (lp / maxLP) * 100;
  if (lp > maxLP) return "bg-blue-500";    // top quarter
  if (percent > 75) return "bg-green-500";    // top quarter
  if (percent > 50) return "bg-yellow-400";   // 50–75%
  if (percent > 25) return "bg-orange-500";   // 25–50%
  return "bg-red-600";                        // 0–25%
};

  return (
    <div className="bg-gray-100 shadow-lg rounded-2xl p-4 flex flex-col items-center w-64">
     
           <audio ref={audioRef} src="./lp-drop.mp3" />
      <h2 className="text-xl font-bold mb-2">Player {player.id}</h2>

      <p className="text-3xl font-mono mb-2">{displayLP}</p>

      {/* LP Gauge */}
      <div className="w-full h-4 bg-gray-300 rounded-full mb-4">
        <div
          className={`h-4 rounded-full transition-all duration-200 ${getGaugeColor(displayLP)}`}
          style={{ width: `${lpPercent}%` }}
        ></div>
      </div>

      {/* Quick buttons */}
      <div className="flex gap-2 mb-2">
        <button
          className="px-3 py-1 bg-green-500 text-white rounded"
          onClick={() => onChangeLP(player.id, maxLP / 8)} // example: +500 on 4k LP
        >
          +{maxLP / 8}
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={() => onChangeLP(player.id, -maxLP / 8)}
        >
          -{maxLP / 8}
        </button>
      </div>

      {/* Custom input */}
      <div className="flex gap-2 mb-2">
        <input
          type="number"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Custom"
          className="w-24 px-1 py-1 border rounded"
        />
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded"
          onClick={() => {
            if (custom) {
              onChangeLP(player.id, -parseInt(custom, 10));
              setCustom("");
            }
          }}
        >
          -
        </button>
        <button
          className="px-2 py-1 bg-green-600 text-white rounded"
          onClick={() => {
            if (custom) {
              onChangeLP(player.id, parseInt(custom, 10));
              setCustom("");
            }
          }}
        >
          +
        </button>
      </div>

      {/* Reset & Delete */}
      <div className="flex gap-2 mt-auto w-full">
        <button
          className="flex-1 px-3 py-1 bg-gray-400 text-white rounded"
          onClick={() => onSetLP(player.id, maxLP)}
        >
          Reset LP
        </button>

        <button
          className="flex-1 px-3 py-1 bg-red-600 text-white rounded"
          onClick={() => onDelete(player.id)}
        >
          Remove
        </button>

        
      </div>
    </div>
  );
}




export default function GameBoard() {
  const [players, setPlayers] = useState([
    { id: 1, lp: 4000, maxLP: 8000 },
    { id: 2, lp: 4000, maxLP: 8000 },
  ]);

  const changeLP = (id, amount) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, lp: Math.max(p.lp + amount, 0) } : p
      )
    );
  };

  const setLP = (id, value) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, lp: value } : p))
    );
  };

  const addPlayer = () => {
    setPlayers((prev) => [
      ...prev,
      { id: prev.length + 1, lp: 4000 },
    ]);
  };

  const deletePlayer = (id) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const deleteAllPlayers = () => {
    setPlayers([]);
  };

  const resetAll = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, lp: 4000 })));
  };

  
  const format8000 = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, lp: 8000, maxLP: 8000 })));
  };

    const format4000 = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, lp: 4000, maxLP: 4000 })));
  };

  return (
    <div className="p-6">
      {/* Top-level buttons */}
      <div className="flex justify-center gap-4 mb-8 border-b-2 border-gray-300 pb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={addPlayer}
        >
          Add Player
        </button>
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded"
          onClick={resetAll}
        >
          Reset All
        </button>

                <button
          className="px-4 py-2 bg-red-700 text-white rounded"
          onClick={deleteAllPlayers}
        >
          Delete All
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={format4000}
        >
          4K LP Format
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={format8000}
        >
          8K LP Format
        </button>
        
      </div>

      {/* Player grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-1">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onChangeLP={changeLP}
            onSetLP={setLP}
            onDelete={deletePlayer}
          />
        ))}
      </div>
    </div>

  );
}
