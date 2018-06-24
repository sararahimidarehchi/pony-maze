import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get, isEmpty } from 'lodash';
import { initialiseGame, solveMaze } from './actions';
import './App.css';

export const StartPage = ({ initialiseGame, mazeView, solveMaze }) => {
	return (
		<div className="container c1">
			<div className="description">
				Here is my amazing maze where you can save the pony from monster. Try it out!
			</div>
			<div className="buttons">
				<button className="button" onClick={initialiseGame}>
					Start a new game
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
	initialiseGame: PropTypes.func,
	mazeView: PropTypes.string
};

export const mapStateToProps = state => ({
	mazeView: get(state, 'mazeView', '')
});
const mapDispatchToProps = dispatch => bindActionCreators({ initialiseGame, solveMaze }, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StartPage);
