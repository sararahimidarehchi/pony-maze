import { map, includes, inRange, findIndex, get, head, last, clone } from 'lodash';
import swal from 'sweetalert';
import { DIRECTIONS, BASE_URL } from '../constants';
import { fetchMazeData, printMaze } from './initilisation';
const { NORTH, SOUTH, WEST, EAST } = DIRECTIONS;

/*
|-----------------------------------------------------------------------------
| HELPERS
|-----------------------------------------------------------------------------
*/

export const constructPossiblePathsObject = (data, width, height) =>
	map(data, (positionData, position) => {
		return {
			north: !includes(positionData, NORTH) && !inRange(position, 0, width),
			west: !includes(positionData, WEST) && position % width !== 0,
			east: !includes(data[position + 1], WEST) && (position + 1) % width !== 0,
			south:
				!includes(data[position + width], NORTH) &&
				!inRange(position, width * height - width, width * height)
		};
	});

export const getNextPonyPosition = (ponyPosition, direction, width) => {
	switch (direction) {
		case EAST:
			return ponyPosition + 1;
		case NORTH:
			return ponyPosition - width;
		case WEST:
			return ponyPosition - 1;
		case SOUTH:
			return ponyPosition + width;
		default:
			return ponyPosition;
	}
};

const findDirectionByPriority = (ponyPossiblePaths, priorities) =>
	ponyPossiblePaths[priorities[0]]
		? priorities[0]
		: ponyPossiblePaths[priorities[1]]
			? priorities[1]
			: ponyPossiblePaths[priorities[2]]
				? priorities[2]
				: ponyPossiblePaths[priorities[3]]
					? priorities[3]
					: undefined;

export const findPonyNextDirection = (possiblePaths, previousDirection, order) => {
	const previousMove = findIndex(order, direction => direction === previousDirection);
	return findDirectionByPriority(possiblePaths, [
		order[(previousMove + 3) % 4],
		order[(previousMove + 4) % 4],
		order[(previousMove + 5) % 4],
		order[(previousMove + 6) % 4]
	]);
};

const movePony = (direction, mazeId) =>
	fetch(`${BASE_URL}/${mazeId}`, {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			direction: direction
		})
	});

export const MayHitDomokun = (nextPonyPosition, domokunPosition, possiblePaths, mazeWidth) => {
	const domokunPossiblePaths = possiblePaths[domokunPosition];
	return (
		(nextPonyPosition === domokunPosition - 1 && domokunPossiblePaths[WEST]) ||
		(nextPonyPosition === domokunPosition + 1 && domokunPossiblePaths[EAST]) ||
		(nextPonyPosition === domokunPosition + mazeWidth && domokunPossiblePaths[SOUTH]) ||
		(nextPonyPosition === domokunPosition - mazeWidth && domokunPossiblePaths[NORTH])
	);
};

export const getPonyNextDirection = (
	ponyPosition,
	domokunPosition,
	possiblePaths,
	previousDirection,
	movePriorityOrder,
	mazeWidth
) => {
	const ponyPossiblePaths = possiblePaths[ponyPosition];
	let ponyNextDirection = findPonyNextDirection(
		ponyPossiblePaths,
		previousDirection,
		movePriorityOrder
	);
	if (
		MayHitDomokun(
			getNextPonyPosition(ponyPosition, ponyNextDirection, mazeWidth),
			domokunPosition,
			possiblePaths,
			mazeWidth
		)
	) {
		// We may hit the domokun if we go this way, let's change the direction
		const newPonyPossiblePaths = clone(ponyPossiblePaths);
		newPonyPossiblePaths[ponyNextDirection] = false;
		ponyNextDirection = findPonyNextDirection(
			newPonyPossiblePaths,
			previousDirection,
			movePriorityOrder
		);
	}
	return ponyNextDirection;
};

/*
|-----------------------------------------------------------------------------
| THUNKS
|-----------------------------------------------------------------------------
*/

const movePonyToEndpoint = (
	possiblePaths,
	movePriorityOrder,
	mazeWidth,
	previousDirection,
	endpoint
) => (dispatch, getState) => {
	const maze = get(getState(), 'maze', {});
	const ponyPosition = head(maze.pony);
	const domokunPosition = head(maze.domokun);
	if (get(maze, 'game-state.state') === 'won') {
		return swal({ text: 'Good job! You saved the pony!', icon: 'success' });
	}
	if (get(maze, 'game-state.state') === 'over') {
		return swal({ text: 'Sorry! The scary domokun caught the pony!', icon: 'error' });
	}

	const ponyNextDirection = getPonyNextDirection(
		ponyPosition,
		domokunPosition,
		possiblePaths,
		previousDirection,
		movePriorityOrder,
		mazeWidth
	);

	return movePony(ponyNextDirection, getState().mazeId).then(() => {
		dispatch(fetchMazeData()).then(() => {
			dispatch(printMaze());
			dispatch(
				movePonyToEndpoint(possiblePaths, movePriorityOrder, mazeWidth, ponyNextDirection, endpoint)
			);
		});
	});
};

export const solveMaze = () => (dispatch, getState) => {
	const maze = get(getState(), 'maze', {});
	const mazeWidth = head(maze.size);
	const mazeHeight = last(maze.size);
	const endpoint = head(maze['end-point']);
	const mazeData = maze.data;

	const possiblePaths = constructPossiblePathsObject(mazeData, mazeWidth, mazeHeight);
	const movePriorityOrder = [EAST, NORTH, WEST, SOUTH];

	// We assume the first previous move was north to start with
	dispatch(movePonyToEndpoint(possiblePaths, movePriorityOrder, mazeWidth, NORTH, endpoint));
};
