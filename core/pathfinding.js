class PriorityQueue {
    constructor() {
        this.nodes = [];
    }

    enqueue(priority, value) {
        this.nodes.push({ priority, value });
        this.sort();
    }

    dequeue() {
        return this.nodes.shift().value;
    }

    sort() {
        this.nodes.sort((a, b) => a.priority - b.priority);
    }

    isEmpty() {
        return !this.nodes.length;
    }
}

function findShortestPathWithAStar(mapData, startX, startY, targetX, targetY) {
    const movements = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 }
    ];
    const openList = new PriorityQueue();
    const closedList = new Map();
    const nodeMap = new Map();
    const startNode = {
        coord: { x: startX, y: startY },
        g: 0,
        h: Math.abs(targetX - startX) + Math.abs(targetY - startY),
        parent: null
    };
    startNode.f = startNode.g + startNode.h;
    openList.enqueue(startNode.f, startNode);
    nodeMap.set(`${startX},${startY}`, startNode);

    while (!openList.isEmpty()) {
        let currentNode = openList.dequeue();
        console.log(Object.keys(map[currentNode.coord.y][currentNode.coord.x])[0])

        if (currentNode.coord.x === targetX && currentNode.coord.y === targetY) {
            let path = [];

            while (currentNode != null) {
                path.push(currentNode.coord);
                currentNode = currentNode.parent;
            }
            return path.reverse();
        }
        closedList.set(`${currentNode.coord.x},${currentNode.coord.y}`, true);
        for (const move of movements) {
            const newX = currentNode.coord.x + move.x;
            const newY = currentNode.coord.y + move.y;
            const newCoord = { x: newX, y: newY };
            if (newX >= 0 && newX < mapData.length && newY >= 0 && newY < mapData[0].length) {
                const emoji = Object.keys(mapData[newX][newY])[0];
                if (emoji !== "b" && !closedList.has(`${newX},${newY}`)) {
                    const newG = currentNode.g + 1;
                    const existingNode = nodeMap.get(`${newX},${newY}`);
                    if (!existingNode || newG < existingNode.g) {
                        const newNode = {
                            coord: newCoord,
                            parent: currentNode,
                            g: newG,
                            h: Math.abs(targetX - newX) + Math.abs(targetY - newY)
                        };
                        newNode.f = newNode.g + newNode.h;
                        openList.enqueue(newNode.f, newNode);
                        nodeMap.set(`${newX},${newY}`, newNode);
                    }
                }
            }
        }
    }
    return null;
}


var map =     [[{"🪨" : "b"},{"  " : "w"},{"  " : "b"},{"🍂" : "w"},{"  " : "w"},{"🍂" : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"}],
    [{"  " : "w"},{"🍂" : "w"},{"  " : "b"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"🪨" : "b"},{"🍂" : "w"}],
    [{"  " : "w"},{"🪨" : "w"},{"  " : "b"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"🪨" : "b"},{"  " : "w"},{"  " : "w"},{"  " : "w"}],
    [{"  " : "w"},{"  " : "w"},{"  " : "b"},{"🍂" : "w"},{"🪨" : "b"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"🍂" : "w"},{"  " : "w"}],
    [{"  " : "w"},{"🪨" : "w"},{"  " : "b"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"}],
    [{"  " : "w"},{"  " : "w"},{"  " : "b"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"}],
    [{"  " : "w"},{"  " : "w"},{"🪨" : "b"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"🪨" : "b"},{"🍂" : "w"},{"  " : "w"}],
    [{"🍂": "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"}],
    [{"🪨": "b"},{"  " : "w"},{"🪨" : "b"},{"🍂" : "w"},{"  " : "w"},{"🪨" : "b"},{"🍂" : "w"},{"  " : "w"},{"  " : "w"},{"🍂" : "w"}],
    [{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"  " : "w"},{"🪨" : "b"},{"  " : "w"}],
    [{"  " : "w"},{"🍂" : "w"},{"  " : "w"},{"🔻" : "go/entree-lividus/2/1"},{"🪨" : "b"},{"  " : "w"},{"🍂" : "w"},{"  " : "w"},{"🍂" : "w"},{"  " : "w"}]]


console.log(findShortestPathWithAStar(map, 1,1,6,6))

