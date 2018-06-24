import { ACTIONS, BASE_URL } from '../constants';
const {
	SET_MAZE_WIDTH,
	SET_MAZE_HEIGHT,
	SET_PONY_NAME,
	SET_MAZE_DATA,
	PRINT_MAZE,
	CREATE_NEW_MAZE
} = ACTIONS;

const createAction = (type, payload) => ({ type, payload });

export const createNewMaze = () => (dispatch, getState) => {
	const state = getState();
	return fetch(`${BASE_URL}`, {
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			'maze-width': Number(state.mazeWidth) || 15,
			'maze-height': Number(state.mazeHeight) || 25,
			'maze-player-name': state.ponyName || 'Twilight Sparkle',
			difficulty: 0
		})
	})
		.then(response => response.json())
		.then(maze => {
			dispatch(createAction(CREATE_NEW_MAZE, maze.maze_id));
		});
};

export const fetchMazeData = () => (dispatch, getState) => {
	const mazeId = getState().mazeId;
	return fetch(`${BASE_URL}/${mazeId}`, {
		method: 'get',
		headers: {
			Accept: 'application/json'
		}
	})
		.then(response => response.json())
		.then(maze => {
			dispatch(createAction(SET_MAZE_DATA, maze));
		});
};

export const printMaze = () => (dispatch, getState) => {
	const mazeId = getState().mazeId;
	return fetch(`${BASE_URL}/${mazeId}/print`, {
		method: 'get',
		headers: {
			Accept: 'text/html'
		}
	})
		.then(response => response.text())
		.then(mazeView => {
			dispatch(createAction(PRINT_MAZE, mazeView));
		});
};

export const initialiseGame = () => dispatch => {
	dispatch(createNewMaze()).then(() => {
		dispatch(fetchMazeData());
		dispatch(printMaze());
	});
};

export const setMazeWidth = event => dispatch =>
	dispatch(createAction(SET_MAZE_WIDTH, event.target.value));

export const setMazeHeight = event => dispatch =>
	dispatch(createAction(SET_MAZE_HEIGHT, event.target.value));

export const setPonyName = event => dispatch =>
	dispatch(createAction(SET_PONY_NAME, event.target.value));
