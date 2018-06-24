import { map, includes, inRange, findIndex, get, head, last } from 'lodash';

// Solver

const DIRECTIONS = {
	NORTH: 'north',
	SOUTH: 'south',
	WEST: 'west',
	EAST: 'east'
};

export const constructPossiblePathsObject = (data, width, height) => {
	return map(data, (positionData, position) => {
		return {
			north: !includes(positionData, DIRECTIONS.NORTH) && !inRange(position, 0, width),
			west: !includes(positionData, DIRECTIONS.WEST) && position % width !== 0,
			east: !includes(data[position + 1], DIRECTIONS.WEST) && (position + 1) % width !== 0,
			south:
				!includes(data[position + width], DIRECTIONS.NORTH) &&
				!inRange(position, width * height - width, width * height)
		};
	});
};

const getNextPonyPosition = (ponyPosition, direction, width) => {
	switch (direction) {
		case DIRECTIONS.EAST:
			return ponyPosition + 1;
		case DIRECTIONS.NORTH:
			return ponyPosition - width;
		case DIRECTIONS.WEST:
			return ponyPosition - 1;
		case DIRECTIONS.SOUTH:
			return ponyPosition + width;
		default:
			return ponyPosition;
	}
};

const findDirectionByPriority = (ponyPossiblePaths, first, second, third, fourth) => {
	return ponyPossiblePaths[first]
		? first
		: ponyPossiblePaths[second]
			? second
			: ponyPossiblePaths[third]
				? third
				: fourth;
};

const findPonyNextDirection = (possiblePaths, previousDirection, order) => {
	const previousMove = findIndex(order, direction => direction === previousDirection);
	return findDirectionByPriority(
		possiblePaths,
		order[(previousMove + 3) % 4],
		order[(previousMove + 4) % 4],
		order[(previousMove + 5) % 4],
		order[(previousMove + 6) % 4]
	);
};

const movePony = (direction, mazeId) => {
	return fetch(
		`https://ponychallenge.trustpilot.com/pony-challenge/maze/773527c2-585b-457d-9327-7bc02527e3f8`,
		{
			method: 'post',
			headers: {
				'Content-type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				direction: direction
			})
		}
	);
};

const movePonyToEndpoint = (
	possiblePaths,
	ponyPosition,
	movePriorityOrder,
	mazeWidth,
	previousDirection,
	endpoint,
	domokunPosition
) => (dispatch, getState) => {
	let ponyPossiblePaths = possiblePaths[ponyPosition];
	debugger;
	let ponyNextDirection = findPonyNextDirection(
		ponyPossiblePaths,
		previousDirection,
		movePriorityOrder
	);
	let nextPonyPosition = getNextPonyPosition(ponyPosition, ponyNextDirection, mazeWidth);
	if (nextPonyPosition === domokunPosition) {
		debugger;
		// We hit the domokun if we go this way, let's change the direction
		ponyNextDirection = findPonyNextDirection(
			ponyPossiblePaths,
			ponyNextDirection,
			movePriorityOrder
		);
		nextPonyPosition = getNextPonyPosition(ponyPosition, ponyNextDirection, mazeWidth);
	}

	debugger;
	return movePony(ponyNextDirection, getState().mazeId).then(() => {
		debugger;
		dispatch(fetchMazeData());
		dispatch(printMaze());
		const maze = get(getState(), 'maze', {});
		const newPonyPosition = head(maze.pony);
		const newDomokunPosition = head(maze.domokun);
		if (newPonyPosition === endpoint) {
			return alert('success'); // dispatch the success
		} else {
			debugger;
			return setTimeout(function() {
				dispatch(
					movePonyToEndpoint(
						possiblePaths,
						newPonyPosition,
						movePriorityOrder,
						mazeWidth,
						ponyNextDirection,
						endpoint,
						newDomokunPosition
					)
				);
			}, 5000);
			return dispatch(
				movePonyToEndpoint(
					possiblePaths,
					newPonyPosition,
					movePriorityOrder,
					mazeWidth,
					ponyNextDirection,
					endpoint,
					newDomokunPosition
				)
			);
		}
	});
};

export const solveMaze = () => (dispatch, getState) => {
	const maze = get(getState(), 'maze', {});
	const mazeWidth = head(maze.size);
	const mazeHeight = last(maze.size);
	const ponyPosition = head(maze.pony);
	const domokunPosition = head(maze.domokun);
	const endpoint = head(maze['end-point']);
	const mazeData = maze.data;

	const possiblePaths = constructPossiblePathsObject(mazeData, mazeWidth, mazeHeight);
	const movePriorityOrder = [DIRECTIONS.EAST, DIRECTIONS.NORTH, DIRECTIONS.WEST, DIRECTIONS.SOUTH];

	debugger;
	// We assume the first previous move was north to start with
	dispatch(
		movePonyToEndpoint(
			possiblePaths,
			ponyPosition,
			movePriorityOrder,
			mazeWidth,
			DIRECTIONS.NORTH,
			endpoint,
			domokunPosition
		)
	);
};

// Thunks

export const createNewMaze = () => (dispatch, getState) => {
	return fetch('https://ponychallenge.trustpilot.com/pony-challenge/maze', {
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			'maze-width': 15,
			'maze-height': 25,
			'maze-player-name': 'Rarity',
			difficulty: 0
		})
	})
		.then(response => response.json())
		.then(maze => {
			dispatch({
				type: 'CREATE_NEW_MAZE',
				payload: maze.maze_id
			});
		});
};

export const fetchMazeData = () => (dispatch, getState) => {
	const mazeId = getState().mazeId;
	return fetch(
		`https://ponychallenge.trustpilot.com/pony-challenge/maze/773527c2-585b-457d-9327-7bc02527e3f8`,
		{
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		}
	)
		.then(response => response.json())
		.then(maze => {
			dispatch({
				type: 'SET_MAZE_DATA',
				payload: maze
			});
		});
};

export const printMaze = () => (dispatch, getState) => {
	const mazeId = getState().mazeId;
	return fetch(
		`https://ponychallenge.trustpilot.com/pony-challenge/maze/773527c2-585b-457d-9327-7bc02527e3f8/print`,
		{
			method: 'get',
			headers: {
				Accept: 'text/html'
			}
		}
	)
		.then(response => response.text())
		.then(mazeView => {
			dispatch({
				type: 'PRINT_MAZE',
				payload: mazeView
			});
		});
};

export const initialiseGame = () => dispatch => {
	dispatch(createNewMaze()).then(() => {
		dispatch(fetchMazeData());
		dispatch(printMaze());
	});
};
