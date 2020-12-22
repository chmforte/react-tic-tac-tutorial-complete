import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    if (props.boldenSqaure) {
        return (
            <button
                className="winning-square"
                onClick={() => props.onClick()}>
                {props.value}
            </button>
        );
    } else {
        return (
            <button
                className="square"
                onClick={() => props.onClick()}>
                {props.value}
            </button>
        );
    }
}


class Board extends React.Component {

    renderSquare(i) {
        let bolden = false;
        if (this.props.winningSquares.length > 0) {
            if (this.props.winningSquares.includes(i)) {
                bolden = true;
                console.log(bolden);
            }
        }
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            boldenSqaure={bolden}
        />;
    }

    render() {
        let board_rows = [];
        let index = 0;
        for (let i = 0; i < 3; i++) {
            let square_row = [];
            for (let j = 0; j < 3; j++) {
                square_row.push(this.renderSquare(index))
                index++;
            }
            board_rows.push(<div className="board-row">{square_row}</div>)
        }
        return board_rows
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                loc: ['', ''],
            }],
            xIsNext: true,
            stepNumber: 0,
            reverse: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        let rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
        let cols = [[0, 3, 6], [1, 4, 7], [2, 5, 8]]
        let row;
        let col;

        for (let j = 0; j < rows.length; j++) {
            if (rows[j].includes(i)) {
                row = j + 1;
            }
        }

        for (let j = 0; j < cols.length; j++) {
            if (cols[j].includes(i)) {
                col = j + 1;
            }
        }

        this.setState({
            history: history.concat([{
                squares: squares,
                loc: [col, row]
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    reverseList() {
        this.setState({
            reverse: !this.state.reverse,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let winning_squares = [];
        if (winner) {
            winning_squares = winningSquares(current.squares);
        }
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move + ` (${history[move].loc[0]}, ${history[move].loc[1]})` : 'Go to game start';
            let ol_li_but;
            if (move === this.state.stepNumber) {
                ol_li_but = <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
            } else {
                ol_li_but = <button onClick={() => this.jumpTo(move)}>{desc}</button>
            }
            return (
                <li key={move}>
                    {ol_li_but}
                </li>
            );
        });

        if (this.state.reverse) {
            moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (!winner && this.state.stepNumber === 9) {
            status = 'It is a draw!';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winningSquares={winning_squares}
                    />
                </div>
                <div className="game-info">
                    <div>
                        <button onClick={() => this.reverseList()}>Reverse List</button>
                    </div>
                    <div>{status}</div>
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
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function winningSquares(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);


