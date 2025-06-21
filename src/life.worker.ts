const calculateNextGeneration = (alive: string[], width: number, height: number): string[] => {
    const nextGeneration: string[] = [];
    const aliveSet = new Set(alive);

    // Helper to count live neighbors
    const countNeighbors = (x: number, y: number): number => {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const newX = (x + dx + width) % width;
                const newY = (y + dy + height) % height;
                if (aliveSet.has(`${newY}-${newX}`)) count++;
            }
        }
        return count;
    };

    // Check each cell
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const key = `${y}-${x}`;
            const isAlive = aliveSet.has(key);
            const neighbors = countNeighbors(x, y);

            if (isAlive && (neighbors === 2 || neighbors === 3)) {
                nextGeneration.push(key);
            } else if (!isAlive && neighbors === 3) {
                nextGeneration.push(key);
            }
        }
    }

    return nextGeneration;
};

// Create broadcast channel
const broadcastChannel = new BroadcastChannel('game-of-life');

// Keep track of the current generation
let currentGeneration = 0;

// Listen for messages from the main thread
self.onmessage = (e: MessageEvent) => {
    const {alive, width, height, generation} = e.data;
    
    // Reset the generation counter if provided
    if (generation !== undefined) {
        currentGeneration = generation;
    }

    // Set up interval to calculate and broadcast next generation
    const intervalId = setInterval(() => {
        const nextGen = calculateNextGeneration(alive, width, height);
        currentGeneration++;
        broadcastChannel.postMessage({
            nextGen,
            generation: currentGeneration
        });
    }, 1000);

    // Clean up the previous interval when receiving a new message
    return () => clearInterval(intervalId);
};