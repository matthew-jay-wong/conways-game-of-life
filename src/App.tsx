import {type ReactElement, useState, useEffect, useCallback} from 'react'
import './App.css'

function App() {
    const [x, setX] = useState(20);
    const [y, setY] = useState(20);
    const [alive, setAlive] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [generation, setGeneration] = useState(0);

    useEffect(() => {
        // Create broadcast channel
        const channel = new BroadcastChannel('game-of-life');

        // Listen for updates from the worker
        channel.onmessage = (e) => {
            setAlive(e.data.nextGen);
            setGeneration(e.data.generation);
        };

        return () => {
            channel.close();
        };
    }, []);

    useEffect(() => {
        let worker: Worker | null = null;

        if (isRunning) {
            // Create a new worker
            worker = new Worker(new URL('./life.worker.ts', import.meta.url), {
                type: 'module'
            });

            // Send initial state to worker
            worker.postMessage({alive, width: x, height: y, generation});
        }

        return () => {
            if (worker) {
                worker.terminate();
            }
        };
    }, [isRunning, alive, x, y, generation]);

    const createGrid = useCallback(() => {
        const cells: ReactElement[] = [];
        for (let i = 0; i < y; i++) {
            for (let j = 0; j < x; j++) {
                const key = `${i}-${j}`;
                cells.push(
                    <div
                        key={key}
                        className={alive.includes(key) ? 'cell-black' : 'cell-white'}
                        onClick={() => {
                            setAlive((prev) => {
                                if (prev.includes(key)) {
                                    return prev.filter((cell) => cell !== key);
                                } else {
                                    return [...prev, key];
                                }
                            });
                        }}
                    />
                );
            }
        }
        return cells;
    }, [alive, x, y]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
        }}>
            <h1>Conway's Game of Life</h1>

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
            }}>
                <div>Generation: {generation}</div>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
            }}>
                <label>
                    X:
                    <input
                        type="number"
                        value={x}
                        disabled={isRunning}
                        onChange={(e) => setX(parseInt(e.target.value))}
                    />
                </label>
                <label>
                    Y:
                    <input
                        type="number"
                        value={y}
                        disabled={isRunning}
                        onChange={(e) => setY(parseInt(e.target.value))}
                    />
                </label>
            </div>


            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
            }}>
                <button disabled={alive.length == 0 && generation == 0} onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? 'Stop' : 'Start'}
                </button>
                <button
                    disabled={isRunning}
                    onClick={() => {
                        setAlive([]);
                        setGeneration(0);
                    }}
                >
                    Clear
                </button>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div
                    className="grid-container"
                    style={{
                        '--x': x,
                        '--y': y
                    } as React.CSSProperties}
                >
                    {createGrid()}
                </div>
            </div>
        </div>
    );
}

export default App