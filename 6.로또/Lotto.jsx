import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Ball from './Ball';
// useCallback은 함수 그 자체를 기억하고 있는 것이고, useMemo는 함수의 리턴값을 기억하고 있는 것
function getWinNumbers() {
  console.log('getWinNumbers');
  const candidate = Array(45).fill().map((v, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0) {
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  return [...winNumbers, bonusNumber];
}

const Lotto = () => {
  // hooks는 선언하는 순서가 중요함, 또한 hooks는 조건문 또는 함수, 반복문 안에 넣지 않아야함
  // useMemo는 배열안의 값이 바뀌기 전까지 값을 기억함
  const lottoNumbers = useMemo(() => getWinNumbers(), []);
  const [winNumbers, setWinNumbers] = useState(lottoNumbers);
  const [winBalls, setWinBalls] = useState([]);
  const [bonus, setBonus] = useState(null);
  const [redo, setRedo] = useState(false);
  const timeouts = useRef([]);
// useEffect는 timeouts.current가 바뀔 때, 내부의 함수를 실행함
  useEffect(() => {
    console.log('useEffect');
    for (let i = 0; i < winNumbers.length - 1; i++) {
      timeouts.current[i] = setTimeout(() => {
        setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]);
      }, (i + 1) * 1000);
    }
    timeouts.current[6] = setTimeout(() => {
      setBonus(winNumbers[6]);
      setRedo(true);
    }, 7000);
    return () => {
      timeouts.current.forEach((v) => {
        clearTimeout(v);
      });
    };
  }, [timeouts.current]); // 빈 배열이면 componentDidMount와 동일
  // 배열에 요소가 있으면 componentDidMount랑 componentDidUpdate 둘 다 수행

  useEffect(() => {
    console.log('로또 숫자를 생성합니다.');
  }, [winNumbers]);

  // 만약에 ajax를 componentDidUpdated에서만 실행하고, componentDidMount에서는 실행하지 않게 하고 싶을 때의 방법
  // const mounted = useRef(false);
  // useEffect(() => {
  //  if(!mounted.current) {
  //     mouted.current = true;
  //  } else {
  //    ajax
  //  }
  // }, [바뀌는 값])

  
  // useCallback은 [] 배열 안의 winNumbers가 바뀔 때 까지 함수 자체를 기억함
  const onClickRedo = useCallback(() => {
    console.log('onClickRedo');
    console.log(winNumbers);
    setWinNumbers(getWinNumbers());
    setWinBalls([]);
    setBonus(null);
    setRedo(false);
    timeouts.current = [];
  }, [winNumbers]);

  return (
    <>
      <div>당첨 숫자</div>
      <div id="결과창">
        {winBalls.map((v) => <Ball key={v} number={v} />)}
      </div>
      <div>보너스!</div>
      {bonus && <Ball number={bonus} onClick={onClickRedo} />}
      {redo && <button onClick={onClickRedo}>한 번 더!</button>}
    </>
  );
};

export default Lotto;
