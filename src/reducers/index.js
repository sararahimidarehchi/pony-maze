import { ACTIONS } from '../constants';
const {
	SET_MAZE_WIDTH,
	SET_MAZE_HEIGHT,
	SET_PONY_NAME,
	SET_MAZE_DATA,
	PRINT_MAZE,
	CREATE_NEW_MAZE
} = ACTIONS;

const updateInState = (state, updatedInfo) => Object.assign({}, state, updatedInfo);

export default (state = {}, action) => {
	switch (action.type) {
		case SET_MAZE_WIDTH:
			return updateInState(state, {
				mazeWidth: action.payload
			});
		case SET_MAZE_HEIGHT:
			return updateInState(state, {
				mazeHeight: action.payload
			});
		case SET_PONY_NAME:
			return updateInState(state, {
				ponyName: action.payload
			});
		case CREATE_NEW_MAZE:
			return updateInState(state, {
				mazeId: action.payload
			});
		case SET_MAZE_DATA:
			return updateInState(state, {
				maze: action.payload
			});
		case PRINT_MAZE:
			return updateInState(state, {
				mazeView: action.payload
			});
		default:
			return state;
	}
};
