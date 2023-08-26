import React, { useEffect, useReducer, useCallback } from 'react';
import Table from './Table';
// TicTacToe -> Table-> Tr -> Td 로 데이터와 액션을 넘겨주어야 하는데, 이 과정이 번거로우므로
// context api를 활용하면 TicTacToe -> Td로 바로 넘길 수 있음

const initialState = {
  winner: '',
  turn: 'O',
  tableData: [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ],
  recentCell: [-1, -1],
};

// action의 이름은 대문자로 만드는 것이 규칙임
export const SET_WINNER = 'SET_WINNER';
export const CLICK_CELL = 'CLICK_CELL';
export const CHANGE_TURN = 'CHANGE_TURN';
export const RESET_GAME = 'RESET_GAME';

// reducer은 함수임
const reducer = (state, action) => {
  switch (action.type) {
    case SET_WINNER:
      // state.winner = action.winner; 이렇게 하면 안됨.
      // 새로운 객체를 만들어서 바뀐 값만 바꾸어주어야 함, spread 문법
      return {
        ...state,
        winner: action.winner,
      };
    case CLICK_CELL: {
      // tableData를 얕은 복사를 해주어야 함
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]]; // immer라는 라이브러리로 가독성 해결
      tableData[action.row][action.cell] = state.turn;
      return {
        ...state,
        tableData,
        recentCell: [action.row, action.cell],
      };
    }
    case CHANGE_TURN: {
      return {
        ...state,
        turn: state.turn === 'O' ? 'X' : 'O',
      };
    }
    case RESET_GAME: {
      return {
        ...state,
        turn: 'O',
        tableData: [
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
        ],
        recentCell: [-1, -1],
      };
    }
    default:
      return state;
  }
};

const TicTacToe = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, turn, winner, recentCell } = state;
  // const [winner, setWinner] = useState('');
  // const [turn, setTurn] = useState('O');
  // const [tableData, setTableData] = useState([['', '', ''], ['', '', ''], ['', '', '']]);

  // dispatch는 액션을 실행하는 것, dispatch 내부의 객체는 실행할 액션 객체
  // 컴포넌트 emit되는 이벤트는 useCallback을 써주어야 함
  const onClickTable = useCallback(() => {
    dispatch({ type: SET_WINNER, winner: 'O' });
  }, []);

  useEffect(() => {
    const [row, cell] = recentCell;
    if (row < 0) {
      return;
    }
    let win = false;
    // 가로줄 검사
    if (tableData[row][0] === turn && tableData[row][1] === turn && tableData[row][2] === turn) {
      win = true;
    }
    // 세로줄 검사
    if (tableData[0][cell] === turn && tableData[1][cell] === turn && tableData[2][cell] === turn) {
      win = true;
    }
    // 오른쪽 아래로 내려가는 대각선 검사
    if (tableData[0][0] === turn && tableData[1][1] === turn && tableData[2][2] === turn) {
      win = true;
    }
    // 왼쪽 아래로 내려가는 대각선 검사
    if (tableData[0][2] === turn && tableData[1][1] === turn && tableData[2][0] === turn) {
      win = true;
    }
    console.log(win, row, cell, tableData, turn);
    if (win) { // 승리시
      dispatch({ type: SET_WINNER, winner: turn });
      dispatch({ type: RESET_GAME });
    } else {
      let all = true; // 칸이 다 차있다면, all이 true면 무승부라는 뜻
      tableData.forEach((row) => { // 무승부 검사
        row.forEach((cell) => {
          if (!cell) {
            all = false;
          }
        });
      });
      if (all) {
        dispatch({ type: SET_WINNER, winner: null });
        dispatch({ type: RESET_GAME });
      } else {
        dispatch({ type: CHANGE_TURN });
      }
    }
  }, [recentCell]);

  return (
    <>
      <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch} />
      {winner && <div>{winner}님의 승리</div>}
    </>
  )
};

export default TicTacToe;
