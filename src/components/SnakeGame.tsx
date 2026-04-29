import React, { useState, useEffect, useCallback } from 'react';

// Grid size
const GRID_SIZE = 20;

type Point = { x: number; y: number };

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving UP

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Generate random food position not on the snake
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawns on snake
      const onSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && isGameOver) {
        resetGame();
        return;
      }
      if (e.key === ' ' && !isGameOver) {
        setIsPaused((p) => !p);
        return;
      }

      if (isPaused || isGameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver, isPaused]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Check self collision
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    };

    // Game loop speed
    const speed = Math.max(50, 150 - Math.floor(score / 50) * 10);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, isGameOver, isPaused, food, score, generateFood]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setHighScore((prev) => Math.max(prev, score));
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] relative overflow-hidden">
      
      {/* Decorative neon glow behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Stats */}
      <div className="w-full flex justify-between items-center mb-6 text-xl z-10">
        <div className="font-mono text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] flex flex-col">
          <span className="text-xs text-gray-400 tracking-widest uppercase">Score</span>
          <span className="text-3xl font-bold">{score}</span>
        </div>
        <div className="font-mono text-fuchsia-400 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] flex flex-col items-end">
          <span className="text-xs text-gray-400 tracking-widest uppercase">High Score</span>
          <span className="text-3xl font-bold">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-gray-950 border-2 border-cyan-500/50 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.3)] z-10"
        style={{
          width: 'clamp(280px, 60vw, 400px)',
          aspectRatio: '1/1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Draw Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${
                isHead 
                  ? 'bg-cyan-400 rounded-sm shadow-[0_0_10px_rgba(34,211,238,1)] z-20' 
                  : 'bg-cyan-600/80 rounded-sm shadow-[0_0_5px_rgba(34,211,238,0.5)] z-10'
              }`}
              style={{
                gridColumn: segment.x + 1,
                gridRow: segment.y + 1,
                transform: isHead ? 'scale(1.1)' : 'scale(0.9)',
                transition: 'all 50ms linear'
              }}
            />
          );
        })}

        {/* Draw Food */}
        <div
          className="bg-fuchsia-500 rounded-full shadow-[0_0_15px_rgba(217,70,239,1)] animate-pulse"
          style={{
            gridColumn: food.x + 1,
            gridRow: food.y + 1,
            transform: 'scale(0.8)'
          }}
        />
      </div>

      {/* Overlay for Game Over / Pause */}
      {(isGameOver || isPaused) && (
        <div className="absolute inset-0 z-30 bg-gray-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center border border-fuchsia-500/20 rounded-2xl">
          <h2 className={`text-4xl font-black uppercase tracking-widest mb-4 ${
            isGameOver ? 'text-fuchsia-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]' : 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]'
          }`}>
            {isGameOver ? 'Game Over' : 'Paused'}
          </h2>
          
          {isGameOver && (
            <p className="text-xl text-gray-300 mb-8 font-mono">
              Final Score: <span className="text-cyan-400 font-bold">{score}</span>
            </p>
          )}

          <button
            onClick={isGameOver ? resetGame : () => setIsPaused(false)}
            className="px-8 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-widest rounded-lg hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all active:scale-95"
          >
            {isGameOver ? 'Play Again' : 'Resume'}
          </button>
          
          <p className="mt-6 text-sm text-gray-500 font-mono hidden sm:block">
            Press [SPACE] to {isGameOver ? 'restart' : 'resume'}
          </p>
        </div>
      )}

      {/* Controls Hint */}
      {!isGameOver && !isPaused && (
        <div className="mt-6 text-gray-500 text-sm font-mono tracking-widest flex gap-4 uppercase select-none z-10">
          <span>WASD / Arrows to move</span>
          <span className="opacity-50">|</span>
          <span>Space to pause</span>
        </div>
      )}

      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2 mt-6 sm:hidden z-10">
        <div />
        <button 
          onClick={() => direction.y !== 1 && setDirection({ x: 0, y: -1 })}
          className="w-12 h-12 flex items-center justify-center bg-gray-800/80 border border-cyan-500/30 rounded-lg active:bg-cyan-500/20"
        >
          ▲
        </button>
        <div />
        <button 
          onClick={() => direction.x !== 1 && setDirection({ x: -1, y: 0 })}
          className="w-12 h-12 flex items-center justify-center bg-gray-800/80 border border-cyan-500/30 rounded-lg active:bg-cyan-500/20"
        >
          ◀
        </button>
        <button 
          onClick={() => direction.y !== -1 && setDirection({ x: 0, y: 1 })}
          className="w-12 h-12 flex items-center justify-center bg-gray-800/80 border border-cyan-500/30 rounded-lg active:bg-cyan-500/20"
        >
          ▼
        </button>
        <button 
          onClick={() => direction.x !== -1 && setDirection({ x: 1, y: 0 })}
          className="w-12 h-12 flex items-center justify-center bg-gray-800/80 border border-cyan-500/30 rounded-lg active:bg-cyan-500/20"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
