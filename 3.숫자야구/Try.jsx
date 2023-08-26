import React, { memo } from "react";
// PureComponent : state가 달라졌을 때, rerendering 됨
// rendering은 state, props가 바뀌었을 때 됨, 단 자식 컴포넌트는 부모 컴포넌트가 rerendering될 때 무조건 rerendering 되게 되어있음
// memo는 부모 컴포넌트가 rerendering 되었다고 해서 자식 컴포넌트가 rerendering 되지 않도록 막아줌, 단, Try 컴포넌트 내부에 state와 props가 바뀌면 rerendering 되도록 함
// 함수 컴포넌트는 PureComponent를 사용할 수 없기 때문에 memo 사용
const Try = memo(({ tryInfo }) => {
  return (
    <li>
      <div>{tryInfo.try}</div>
      <div>{tryInfo.result}</div>
    </li>
  );
});

// 만약, 부모로부터 받은 tryInfo의 값을 바꾸고 싶다면 state로 만들어서 바꾸어야 함
// const [result, setResult] = useState(tryInfo.result)
// const onClick = () => {setResult('1')}

export default Try;
