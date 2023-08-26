import React, { useState, useRef, useCallback, useMemo } from 'react';

const ResponseCheck = () => {
  const [state, setState] = useState('waiting');
  const [message, setMessage] = useState('클릭해서 시작하세요.');
  const [result, setResult] = useState([]);
  const timeout = useRef(null);
  const startTime = useRef(0);
  const endTime = useRef(0);
// state는 값이 바뀌면 return 부분이 다시 실행되는 리렌더링이 되지만, ref는 값이 바뀔 때 return 부분이 다시 렌더링 되지 않음
  const onClickScreen = useCallback(() => {
    if (state === 'waiting') {
      timeout.current = setTimeout(() => {
        setState('now');
        setMessage('지금 클릭');
        startTime.current = new Date();
      }, Math.floor(Math.random() * 1000) + 2000); // 2초~3초 랜덤
      setState('ready');
      setMessage('초록색이 되면 클릭하세요.');
    } else if (state === 'ready') { // 성급하게 클릭
      clearTimeout(timeout.current);
      setState('waiting');
      setMessage('너무 성급하시군요! 초록색이 된 후에 클릭하세요.');
    } else if (state === 'now') { // 반응속도 체크
      endTime.current = new Date();
      setState('waiting');
      setMessage('클릭해서 시작하세요.');
      setResult((prevResult) => {
        return [...prevResult, endTime.current - startTime.current];
      });
    }
  }, [state]);
  const onReset = useCallback(() => {
    setResult([]);
  }, []);

  const renderAverage = () => {
    // jsx에서 빈값을 나타낼때는 null 으로 표현 
    // jsx에서는 for과 if를 사용할 수 없음, 때문에 삼항연산자 또는 ??을 통해 표현
    return result.length === 0
      ? null 
      : <>
        <div>평균 시간: {result.reduce((a, c) => a + c) / result.length}ms</div>
        <button onClick={onReset}>리셋</button>
      </>
  };

  return (
    <>
      <div
        id="screen"
        className={state}
        onClick={onClickScreen}
      >
        {message}
      </div>
      {renderAverage()}
    </>
  );
};

export default ResponseCheck;
