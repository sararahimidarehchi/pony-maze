This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

This is a react app created to visualise a maze solver. It uses APIs provided by trustpilot here: https://jobs.trustpilot.com/position/548539?gh_jid=548539.

The algorithm to save the pony works with go right first logic. The pony always tries to turn right if possible and if not, it will try to go straight, left and back respectively. 
The algorithm keeps the pony safe from monster by not going to tiles with 1 step distance from monster's current position.

## How to run the app

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

## Future improvements

- Currently the difficulty of the maze is hardcoded to 0. We can make it possible to be specified in the user interface.
- There are some limits for the size of maze, but there is no error handling for that in the current version. We can add nice warnings to the UI when user types invalid sizes.
- Improve the algorithm to find the solution faster.
- We can provide the ability for the user to play the maze as well and try to solve it manually.
- Make a start page and resume game option
- Draw the maze beautifully and put pony, monster and endpoint icons instead of letters.
- When the app can draw the maze itself, the pony can be moved optimistically assuming that the api will be successfull with a rollback strategy.
