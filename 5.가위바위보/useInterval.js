import { useRef, useEffect } from "react";

// const [isRunning, setRunning] = useState(true);
// useInterval(() => {console.log('hello')}, isRunning? 1000 : null);

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    // setInterval과 clearInterval을 할 때 약간의 delay가 발생하게 되는데, 최신 callback을 참조하게 하여 delay 발생하지 않도록 함
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);

  return savedCallback.current;
}

export default useInterval;
