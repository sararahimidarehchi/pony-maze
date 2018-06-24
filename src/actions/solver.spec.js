import {
	constructPossiblePathsObject,
	getNextPonyPosition,
	findPonyNextDirection,
	MayHitDomokun,
	getPonyNextDirection
} from './solver';
import { DIRECTIONS } from '../constants';
const { NORTH, SOUTH, WEST, EAST } = DIRECTIONS;

/*
|-----------------------------------------------------------------------------
| Here is the mocked maze used in tests:
|   +---+---+---+---+
|   |               |
|   +---+---+---+   +
|   |           |   |
|   +   +---+---+   +
|   |   |           |
|   +   +---+---+   +
|   |               |
|   +---+---+---+---+
|-----------------------------------------------------------------------------
*/

const maze = {
	pony: [0],
	domokun: [9],
	'end-point': [6],
	size: [4, 4],
	'game-state': {
		state: 'active'
	},
	data: [
		[],
		[],
		[],
		[],
		[NORTH],
		[NORTH],
		[NORTH],
		[WEST],
		[],
		[NORTH, WEST],
		[NORTH],
		[],
		[],
		[NORTH],
		[NORTH],
		[]
	]
};

const possiblePathsObject = [
	{ north: false, west: false, east: true, south: false },
	{ north: false, west: true, east: true, south: false },
	{ north: false, west: true, east: true, south: false },
	{ north: false, west: true, east: false, south: true },
	{ north: false, west: false, east: true, south: true },
	{ north: false, west: true, east: true, south: false },
	{ north: false, west: true, east: false, south: false },
	{ north: true, west: false, east: false, south: true },
	{ north: true, west: false, east: false, south: true },
	{ north: false, west: false, east: true, south: false },
	{ north: false, west: true, east: true, south: false },
	{ north: true, west: true, east: false, south: true },
	{ north: true, west: false, east: true, south: false },
	{ north: false, west: true, east: true, south: false },
	{ north: false, west: true, east: true, south: false },
	{ north: true, west: true, east: false, south: false }
];

const movePriorityOrder = [EAST, NORTH, WEST, SOUTH];

it('constructPossiblePathsObject: can build the object correctly', () => {
	expect(constructPossiblePathsObject(maze.data, maze.size[0], maze.size[1])).toEqual(
		possiblePathsObject
	);
});

it('getNextPonyPosition: returns correct position based on the direction', () => {
	expect(getNextPonyPosition(1, EAST, 4)).toEqual(2);
	expect(getNextPonyPosition(1, WEST, 4)).toEqual(0);
	expect(getNextPonyPosition(1, SOUTH, 4)).toEqual(5);
	expect(getNextPonyPosition(5, NORTH, 4)).toEqual(1);
});

it('findPonyNextDirection: returns the next direction correctly', () => {
	expect(findPonyNextDirection(possiblePathsObject[3], EAST, movePriorityOrder)).toEqual(SOUTH);
	expect(findPonyNextDirection(possiblePathsObject[10], WEST, movePriorityOrder)).toEqual(WEST);
	expect(findPonyNextDirection(possiblePathsObject[8], NORTH, movePriorityOrder)).toEqual(NORTH);
	expect(findPonyNextDirection(possiblePathsObject[7], SOUTH, movePriorityOrder)).toEqual(SOUTH);
	expect(findPonyNextDirection({}, SOUTH, movePriorityOrder)).toEqual(undefined);
});

describe('MayHitDomokun', () => {
	it('returns true if the next position is one step away from domokun', () => {
		expect(MayHitDomokun(10, 9, possiblePathsObject, 4)).toBe(true);
		expect(MayHitDomokun(11, 15, possiblePathsObject, 4)).toBe(true);
		expect(MayHitDomokun(15, 11, possiblePathsObject, 4)).toBe(true);
		expect(MayHitDomokun(9, 10, possiblePathsObject, 4)).toBe(true);
	});

	it('returns false if the next position is one step away from domokun, but domokun cannot move that way', () => {
		expect(MayHitDomokun(8, 9, possiblePathsObject, 4)).toBe(false);
		expect(MayHitDomokun(5, 9, possiblePathsObject, 4)).toBe(false);
	});

	it('returns false if the next position is not close to domokun', () => {
		expect(MayHitDomokun(3, 14, possiblePathsObject, 4)).toBe(false);
	});
});

describe('getPonyNextDirection: returns the right new direction avoiding domokun', () => {
	expect(getPonyNextDirection(11, 9, possiblePathsObject, SOUTH, movePriorityOrder, 4)).toEqual(
		SOUTH
	);
	expect(getPonyNextDirection(11, 14, possiblePathsObject, SOUTH, movePriorityOrder, 4)).toEqual(
		WEST
	);
	expect(getPonyNextDirection(13, 15, possiblePathsObject, EAST, movePriorityOrder, 4)).toEqual(
		WEST
	);
	expect(getPonyNextDirection(6, 4, possiblePathsObject, EAST, movePriorityOrder, 4)).toEqual(
		undefined
	);
});
