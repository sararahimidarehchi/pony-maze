export default (state, action) => {
	switch (action.type) {
		case 'CREATE_NEW_MAZE':
			return Object.assign({}, state, {
				mazeId: action.payload
			});
		case 'SET_MAZE_DATA':
		debugger;
			return Object.assign({}, state, {
				maze: action.payload
			});
		case 'PRINT_MAZE':
			return Object.assign({}, state, {
				mazeView: action.payload
			});
		default:
			return state;
	}
};
