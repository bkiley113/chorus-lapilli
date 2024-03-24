import { useState, useEffect } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [xmoves, setxmoves] = useState(0);
  const [omoves, setomoves] = useState(0);
  const [xmess, setxmess] = useState(null);
  const [omess, setomess] = useState(null);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [game, setgame] = useState('standard');
  const [select, setselect] = useState(null);
  const [moves, setmoves] = useState(0);
  const [canwin, setwin] = useState(null);
  const current = xIsNext ? 'X' : 'O';
  const [centerlock, setlock] = useState(false);
  const [locked, setlockmess] = useState(null);
  const [winlock, setwinlock] = useState(false);
  const [movetowin, setwinmove] = useState(null);
  const [winlockmess, setwinlockmess] = useState(false);

  const [nf, setnf] = useState(false);



  useEffect(() => {
    if (omoves >= 3){
      setomess('Three pieces are on the board. Abide by chorus lapilli rules!');
      setgame('chorus');
    }
  }, [omoves]);

  useEffect(() => {
    if(squares[4] !== current){
      setwin(null);
    }
    if((squares[4] !== null) && (canWin(squares, current)[0] === true) && (squares[4] === current) && (xmoves >=3 && omoves >=3)){
      setwinlock(true);
      setlock(false);
      setwin('Player ' + current + ', you are in the center. You can make the winning move or vacate the center.');
    } else if((squares[4] !== null) && (canWin(squares,current)[0] === false)&& (squares[4] === current && (xmoves >=3 && omoves >=3))){
      setlock(true);
      setwinlock(false);
      setwin('Player ' + current + ', you are occupying the center. Please vacate the center square since there are no possible winning moves for you at this time.');
    }else if(!squares[4]){setwin(null);}

  }, [squares, current, centerlock, winlock]);

  function handleClick(i){
    if(game === 'standard'){
      standard(i);
    } else if (game === 'chorus'){
      chorus(i);
    }
  }

  function standard(i) {
    if (calculateWinner(squares) || squares[i] || xmoves + omoves >= 6) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      setxmoves(xmoves +1);
      nextSquares[i] = 'X';
    } else {
      setomoves(omoves +1);

      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function chorus(i){
    if(calculateWinner(squares)){return;}
    if(select === null && moves === 0){
      if(centerlock === true){
        if(i!==4 && squares[4] === current){
          setlockmess("Invalid move. Please vacate the center square.");
          return;
        } else if(i===4 && squares[4] === current){
          setlock(false);
          setlockmess(null);
          setselect(4);
          setmoves(1);
          return;
        }
      }
      if(winlock === true){
        const mov = [4, canWin(squares,current)[1]];
        if((!mov.includes(i)) && squares[4] === current){
        //if((i!==4 || i !== movetowin) && squares[4] === current){
          setwinlockmess("Invalid move. Please make the winning move or vacate the center square.")
          return;
        } else if((mov.includes(i)) && squares[4] === current){
          setwinlock(false);
          setnf(true);
          setwinlockmess(null);
          setselect(i);
          setmoves(1);
          return;
        }
      }
    
      setselect(i);
      setmoves(1);
    }

    else if (i!=select && (squares[i] === null) && squares[select] === current && moves ==1 && canMove(select, i)){
      const nextSq = squares.slice();
      if (xIsNext) {
        if(nf==true){
          const smov = canWin(squares,current)[2];
          if(i!==smov){
            setwinlockmess("Invalid move. Please make the winning move or vacate the center square.");
            setmoves(0);
            return;
          }else if (i ==smov){
            setwinlockmess(null);
            setnf(false);
          }
        }
        setxmoves(xmoves +1);
        nextSq[i] = 'X';
        nextSq[select] = null;
      } else {
        if(nf==true){
          const smov = canWin(squares,current)[2];
          if(i!==smov){
            setwinlockmess("Invalid move. Please make the winning move or vacate the center square.");
            setmoves(0);
            return;
          }else if (i ==smov){
            setwinlockmess(null);
            setnf(false);
          }
        }
        nextSq[i] = 'O';
        nextSq[select] = null;
      }
      setSquares(nextSq);
      setXIsNext(!xIsNext);
      setselect(null);
      setmoves(0);
    } else{
      setselect(null);
      setmoves(0);
      return;
    }
  }


  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {/* <div className="xm">{xmoves}</div>
      <div className="om">{omoves}</div> */}
      <div className="xmess">{xmess}</div>
      <div className="omess">{omess}</div>

      <div className="locked">{locked}</div>
      <div className="winlockmess">{winlockmess}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      <div className="canwin">{canwin}</div>

    </>
  );

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

function canMove(src, dest){
  const moves = [
    [1,3,4],
    [0,2,3,4,5],
    [1,4,5],
    [0,1,4,6,7],
    [0,1,2,3,5,6,7,8],
    [1,2,4,7,8],
    [3,4,7],
    [6,3,4,5,8],
    [4,7,5]

  ];
  switch(src){
    case 0:
      if(moves[0].includes(dest)){return true}
      else {return false};
    case 1:
      if(moves[1].includes(dest)){return true}
      else {return false};
    case 2:
      if(moves[2].includes(dest)){return true}
      else {return false};
    case 3:
      if(moves[3].includes(dest)){return true}
      else {return false};
    case 4:
      if(moves[4].includes(dest)){return true}
      else {return false};
    case 5:
      if(moves[5].includes(dest)){return true}
      else {return false};
    case 6:
      if(moves[6].includes(dest)){return true}
      else {return false};
    case 7:
      if(moves[7].includes(dest)){return true}
      else {return false};
    case 8:
      if(moves[8].includes(dest)){return true}
      else {return false};
    default:
      return false;
  }
}




  function canWin(squares, turn) {
    if(((squares[0] === turn && squares[8] === null) && (squares[7] === turn || squares[5] === turn))){
      if (squares[7] === turn){
        return [true, 7, 8];
      }
      else if (squares[5] === turn){
        return [true,5, 8];
      } 
    }

    else if((squares[8] === turn && squares[0] === null) && (squares[1] === turn || squares[3] === turn)){
      if (squares[1] === turn){
        return [true,1,0];
      }
      else if (squares[3] === turn){
        return [true,3,0];
      } 
    }

    else if((squares[1] === turn && squares[7] === null)&& (squares[3] === turn || squares[6] === turn|| squares[5] === turn|| squares[8] === turn)){
      if (squares[3] === turn){
        return [true,3,7];
      }
      else if (squares[6] === turn){
        return [true,6,7];
      } 
      else if (squares[5] === turn){
        return [true,5,7];
      } 
      else if (squares[8] === turn){
        return [true,8,7];
      } 
    }
    else if((squares[7] === turn && squares[1] === null)&& (squares[0] === turn || squares[2] === turn|| squares[3] === turn|| squares[5] === turn)){
      if (squares[0] === turn){
        return [true,0,1];
      }
      else if (squares[2] === turn){
        return [true,2,1];
      } 
      else if (squares[3] === turn){
        return [true,3,1];
      } 
      else if (squares[5] === turn){
        return [true,5,1];
      } 
    }

    else if((squares[2] === turn && squares[6] === null)&& (squares[3] === turn || squares[7] === turn)){
      if (squares[3] === turn){
        return [true,3,6];
      }
      else if (squares[7] === turn){
        return [true,7,6];
      } 
    } 
    else if((squares[6] === turn && squares[2] === null)&& (squares[1] === turn || squares[5] === turn)){
      if (squares[1] === turn){
        return [true,1,2];
      }
      else if (squares[5] === turn){
        return [true,5,2];
      } 
    }
      

    else if((squares[3] === turn && squares[5] === null)&& (squares[1] === turn || squares[2] === turn|| squares[7] === turn|| squares[8] === turn)){
      if (squares[1] === turn){
        return [true,1,5];
      }
      else if (squares[2] === turn){
        return [true,2,5];
      } 
      else if (squares[7] === turn){
        return [true,7,5];
      } 
      else if (squares[8] === turn){
        return [true,8,5];
      } 
    }
    else if((squares[5] === turn && squares[3] === null)&& (squares[0] === turn || squares[1] === turn|| squares[6] === turn|| squares[7] === turn)){
      if (squares[0] === turn){
        return [true,0,3];
      }
      else if (squares[1] === turn){
        return [true,1,3];
      } 
      else if (squares[6] === turn){
        return [true,6,3];
      } 
      else if (squares[7] === turn){
        return [true,7,3];
      } 
    }
      

    else if
      ((squares[0] === turn && squares [2] === turn) && squares[1] === null){
        return [true,4,1];
      }
    else if 
      ((squares[2] === turn && squares [8] === turn) && squares[5] === null){
        return [true,4,5];
      }
    else if
      ((squares[6] === turn && squares [8] === turn) && squares[7] === null){
        return [true,4,7];
      }
    else if
      ((squares[0] === turn && squares [6] === turn) && squares[3] === null){
        return [true,4,3];
      }

    else if
    ((squares[0] === turn && squares [1] === turn) && squares[2] === null){
      return [true,4,2];
    }
    else if 
      ((squares[0] === turn && squares [3] === turn) && squares[6] === null){
        return [true,4,6];
      }
    else if
      ((squares[1] === turn && squares [2] === turn) && squares[0] === null){
        return [true,4,0];
      }
    else if
      ((squares[3] === turn && squares [6] === turn) && squares[0] === null){
        return [true,4,0];
      }

    else if
    ((squares[8] === turn && squares [7] === turn) && squares[6] === null){
      return [true,4,6];
    }
    else if 
      ((squares[6] === turn && squares [7] === turn) && squares[8] === null){
        return [true,4,8];
      }
    else if
      ((squares[2] === turn && squares [5] === turn) && squares[8] === null){
        return [true,4,8];
      }
    else if
      ((squares[8] === turn && squares [5] === turn) && squares[2] === null){
        return [true,4,2];
      }

    else{
      return [false, null, null];
    }
}