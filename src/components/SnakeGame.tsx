import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving UP
const GAME_SPEED = 120; // ms per frame

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Generate random food position not on snake
  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!hasStarted && ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setHasStarted(true);
      }

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
        case ' ':
        case 'Escape':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, hasStarted]);

  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check Wall Collisions
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check Self Collisions
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, gameOver, isPaused, food, generateFood, hasStarted]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setHasStarted(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 border border-cyan-500 rounded-xl neon-border-cyan relative">
      
      {/* Header Info */}
      <div className="w-full flex justify-between items-center mb-6 px-2">
        <h2 className="text-2xl font-bold text-cyan-400 neon-text-cyan tracking-widest uppercase">Grid Runner</h2>
        <div className="text-xl font-bold text-green-400 neon-text-green">
          SCORE: {score.toString().padStart(4, '0')}
        </div>
      </div>

      {/* Grid Canvas Setup */}
      <div 
        className="grid bg-[#050510] border-2 border-cyan-900 rounded shadow-[0_0_30px_rgba(6,182,212,0.2)]"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(70vmin, 500px)',
          height: 'min(70vmin, 500px)'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
          const isFood = food.x === x && food.y === y;

          let cellClass = "w-full h-full border border-cyan-950/20 ";
          
          if (isSnakeHead) {
            cellClass += "bg-green-400 shadow-[0_0_10px_#4ade80] rounded-sm z-10 scale-110";
          } else if (isSnakeBody) {
            cellClass += "bg-green-600 shadow-[0_0_5px_#16a34a] rounded-sm opacity-90";
          } else if (isFood) {
            cellClass += "bg-pink-500 shadow-[0_0_12px_#ec4899] rounded-full animate-pulse scale-75";
          }

          return (
            <div key={i} className="relative p-[1px]">
              <div className={cellClass}></div>
            </div>
          );
        })}
      </div>

      {/* Overlays */}
      {!hasStarted && !gameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 rounded-xl backdrop-blur-sm">
          <h3 className="text-3xl font-bold text-cyan-400 neon-text-cyan mb-4 animate-pulse">PRESS ANY DIRECTION</h3>
          <p className="text-cyan-200">Use W,A,S,D or Arrow Keys</p>
          <p className="text-cyan-200 mt-2">Space to Pause</p>
        </div>
      )}

      {isPaused && hasStarted && !gameOver && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 rounded-xl backdrop-blur-sm">
          <h3 className="text-4xl font-bold text-yellow-400 drop-shadow-[0_0_10px_#facc15] tracking-[num]">PAUSED</h3>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 rounded-xl backdrop-blur-md border border-red-500 shadow-[inset_0_0_50px_rgba(239,68,68,0.3)]">
          <h3 className="text-5xl font-bold text-red-500 mb-2 drop-shadow-[0_0_15px_#ef4444]">GAME OVER</h3>
          <p className="text-2xl text-green-400 neon-text-green mb-8">FINAL SCORE: {score}</p>
          <button 
            onClick={resetGame}
            className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded neon-border-cyan transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
