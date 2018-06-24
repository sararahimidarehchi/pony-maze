import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get, isEmpty } from 'lodash';
import { setMazeWidth, setMazeHeight, setPonyName, initialiseGame } from './actions/initilisation';
import { solveMaze } from './actions/solver';
import './App.css';

export const StartPage = ({
	setMazeWidth,
	setMazeHeight,
	setPonyName,
	initialiseGame,
	mazeView,
	solveMaze
}) => {
	return (
		<div className="container c1">
			<div className="description">
				Here is my amazing maze where you can save the pony from monster. Try it out! <br />
				Width: <input onChange={setMazeWidth} />
				<br />
				Height: <input onChange={setMazeHeight} />
				<br />
				Pony name:{' '}
				<select onChange={setPonyName}>
					<option value="Twilight Sparkle">Twilight Sparkle</option>
					<option value="Rainbow Dash">Rainbow Dash</option>
					<option value="Pinkie Pie">Pinkie Pie</option>
					<option value="Rarity">Rarity</option>
					<option value="Applejack">Applejack</option>
					<option value="Fluttershy">Fluttershy</option>
					<option value="Spike">Spike</option>
				</select>
			</div>
			<div className="buttons">
				<button className="button" onClick={initialiseGame}>
					Start a new maze
				</button>
			</div>
			{!isEmpty(mazeView) && (
				<div>
					<pre>{mazeView}</pre>
					<button className="button" onClick={solveMaze}>
						Save the pony
					</button>
				</div>
			)}
		</div>
	);
};

StartPage.propTypes = {
	setMazeWidth: PropTypes.func,
	setMazeHeight: PropTypes.func,
	setPonyName: PropTypes.func,
	initialiseGame: PropTypes.func,
	mazeView: PropTypes.string
};

export const mapStateToProps = state => ({
	mazeView: get(state, 'mazeView', '')
});
const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{ setMazeWidth, setMazeHeight, setPonyName, initialiseGame, solveMaze },
		dispatch
	);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StartPage);
