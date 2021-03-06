import React from 'react';
import Board from './Board';

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			stepNumber: 0,
			reverseSort: false,
			xIsNext: true
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = [...current.squares];

		if(calculateWinner(squares) || squares[i]) return;

		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});

		this.selectedMove.style.fontWeight = 'bold';
	}

	toggleSort() {
		const reverseSort = !this.state.reverseSort;
		this.setState({reverseSort});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const currentMove = this.state.reverseSort ? !move ? 0 : history.length - move : move;
			const desc = move ? `Go to move # ${ currentMove }` : 'Go to game start';
			return (
				<li key={move}>
					<button onClick={(e) => {
						if(this.selectedMove) this.selectedMove.style.fontWeight = 'normal';
						this.selectedMove = e.target;
						this.jumpTo(currentMove);
					}}>{desc}
					</button>
				</li>
			);
		});

		let status = winner ? `Winner: ${winner.player}` : 
							  `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

		return(
			<div className="game">
				<div className="game-board">
					<Board winner={winner} squares={current.squares} onClick={(i) => this.handleClick(i)}/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button onClick={() => this.toggleSort()}>Sort</button>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	for(let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
			return {
				player: squares[a],
				squares: lines[i]
			};
	}

	return null;
}

export default Game;