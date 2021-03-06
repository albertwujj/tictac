import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    const highlighted = props.highlighted ? " highlighted" : "";
    return (
      <button className={"square" + highlighted} onClick={props.onClick}> 
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    
    renderSquare(i) {
      return <
        Square value={this.props.squares[i]} 
        highlighted={this.props.winningSquares.includes(i)} 
        onClick={() => this.props.onClick(i)}
      />;
    }
  
    render() {
        
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
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
        return [squares[a], [a, b, c]];
      }
    }
    return null;
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{squares: Array(9).fill(null)}],
        xIsNext: true,
        stepNumber: 0,
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length-1].squares;
      const squares = current.slice();
      if (squares[i] != null || calculateWinner(squares)) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{squares: squares, move: i}]), 
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      });
    }

    jumpTo(move) {
      this.setState({
        stepNumber: move,
        xIsNext: move % 2 === 0,
      });
    }

    render() {
      const history = this.state.history;
      const squares = history[this.state.stepNumber].squares;
      const [winner, winningSquares] = calculateWinner(squares) ?? [null, []];

      const moves = history.map((step, move) => {
        const desc = move ? "Go to move #" + move : "Go to game start";
        let moveDesc = (<></>)
        if (move) {
          const row = Math.floor(step.move / 3);
          const col = step.move % 3;
          moveDesc = (<div>({row}, {col})</div>)
        }
        let bold = "";
        if (this.state.stepNumber == move) {
          bold = "bold"
        }
        return (
          <li key={move}>
            <button  class={bold} onClick={() => this.jumpTo(move)}>{desc}</button>
            {moveDesc}
          </li>
        );
      });

      let status;
      if (winner) {
          status = 'Winner: ' + winner;
      } else {
        if (this.state.stepNumber === 9) {
          status = 'Draw.';
        } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board squares={squares} winningSquares={winningSquares} onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  
