import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ArrowDown({ size = 24, color = 'black', ...props }) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 0 24 24"
      {...props}>
      <Path d="M0 0h24v24H0z" fill="none" />
      <Path fill={color} d="M7 10l5 5 5-5z" />
    </Svg>
  );
}

export default ArrowDown;
