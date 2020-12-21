type Point4d = {
  x: number
  y: number
  z: number
  w: number
}

type Grid = {
  state: Map<string, boolean>,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  minZ: number,
  maxZ: number,
  minW: number,
  maxW: number,
}

const k = (key: Point4d) => `${key.w}:${key.z}:${key.x}:${key.y}`;

const init = (file: string): Grid => ({
  state: file
    .split('\n')
    .map((line, y) =>
      line.split('')
        .map((value, x) => ({ x, y, z: 0, w: 0, value: value === '#' }))
        .filter(entity => entity.value)
        .reduce(((acc, val) => acc.set(k(val), val.value)), new Map()))
    .reduce((acc, val) => new Map([...acc, ...val])),
  minX: 0,
  maxX: file.split('\n')[0].split('').length,
  minY: 0,
  maxY: file.split('\n').filter(x => x).length,
  minZ: 0,
  maxZ: 0,
  minW: 0,
  maxW: 0
});

const buildDelta = (): Point4d[] => {
  const result = [];
  const dim = [-1, 0, 1];

  for (let x of dim)
    for (let y of dim)
      for (let z of dim)
        for (let w of dim)
          if (!(x === 0 && y === 0 && z === 0 && w === 0))
            result.push({ x, y, z, w });

  return result;
};

const delta = buildDelta();

const add = (point1: Point4d, point2: Point4d): Point4d => ({
  x: point1.x + point2.x,
  y: point1.y + point2.y,
  z: point1.z + point2.z,
  w: point1.w + point2.w
});

const getActiveNeighborsCount = (state: Map<string, boolean>, point: Point4d): number =>
  delta
    .filter(diffPoint => state.get(k(add(diffPoint, point))))
    .length;

const isActive = (state: Map<string, boolean>, point: Point4d): boolean => {
  const count = getActiveNeighborsCount(state, point);
  return state.get(k(point)) ? (count === 2 || count === 3) : (count === 3);
};

const iterate = (current: Grid): Grid => {
  const { state, minX, maxX, minY, maxY, minZ, maxZ, minW, maxW } = current;
  const nextState = new Map<string, boolean>();
  const [nextMinX, nextMaxX, nextMinY, nextMaxY, nextMinZ, nextMaxZ, nextMinW, nextMaxW] = [
    minX - 1,
    maxX + 1,
    minY - 1,
    maxY + 1,
    minZ - 1,
    maxZ + 1,
    minW - 1,
    maxW + 1
  ];

  for (let x = nextMinX; x <= nextMaxX; x++) {
    for (let y = nextMinY; y <= nextMaxY; y++) {
      for (let z = nextMinZ; z <= nextMaxZ; z++) {
        for (let w = nextMinW; w <= nextMaxW; w++) {
          if (isActive(state, { x, y, z, w }))
            nextState.set(k({ x, y, z, w }), true);
        }
      }
    }
  }

  return {
    state: nextState,
    minX: nextMinX,
    maxX: nextMaxX,
    minY: nextMinY,
    maxY: nextMaxY,
    minZ: nextMinZ,
    maxZ: nextMaxZ,
    minW: nextMinW,
    maxW: nextMaxW
  };
};

const print = (grid: Grid) => {
  const { state, minX, maxX, minY, maxY, minZ, maxZ, minW, maxW } = grid;

  for (let w = minW; w <= maxW; w++) {
    for (let z = minZ; z <= maxZ; z++) {
      console.log(`z=${z}, w=${w}`);
      for (let y = minY; y <= maxY; y++) {
        const s = [];
        for (let x = minX; x <= maxX; x++) {
          s.push(state.get(k({ x, y, z, w })) ? '#' : '.');
        }
        console.log(s.join(''));
      }
    }
  }
};

const part1 = (file: string) => {
  let grid = init(file);
  for (let i = 0; i < 6; i++) {
    grid = iterate(grid);
    if (i === 0)
      print(grid);
  }

  console.log([...grid.state.values()].length);
};

part1(await Deno.readTextFile('./input.txt'));
