import React from 'react';
import Svg, { Path } from 'react-native-svg';

function Plus({ size = 24, color = 'black', ...props }) {
  return (
    <Svg height={size} viewBox="0 0 24 24" width={size} {...props}>
      <Path d="M0 0h24v24H0z" fill="none" />
      <Path fill={color} d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </Svg>
  );
}

export default Plus;
