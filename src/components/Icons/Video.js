import React from 'react';
import Svg, { Path } from 'react-native-svg';

function Video({ size = 24, color = 'white', ...props }) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 0 24 24"
      {...props}>
      <Path d="M0 0h24v24H0z" fill="none" />
      <Path
        fill={color}
        d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
      />
    </Svg>
  );
}

export default Video;
