import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import {StartPage} from './App';

describe('<StartPage>', () => {
	it('renders correctly when no maze is initialised', () => {
		const props = {
			setMazeWidth: jest.fn(),
			setMazeHeight: jest.fn(),
            setPonyName: jest.fn(),
            initialiseGame: jest.fn(),
            mazeView: '',
            solveMaze: jest.fn()
		};

		const tree = shallow(<StartPage {...props} />);
		expect(tree).toMatchSnapshot();
    });
    
    it('renders correctly when there is a mazeView', () => {
		const props = {
			setMazeWidth: jest.fn(),
			setMazeHeight: jest.fn(),
            setPonyName: jest.fn(),
            initialiseGame: jest.fn(),
            mazeView: 'a maze view',
            solveMaze: jest.fn()
		};

		const tree = shallow(<StartPage {...props} />);
		expect(tree).toMatchSnapshot();
	});
});
