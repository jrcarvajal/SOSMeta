/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App.js';
import {name as appName} from './app.json';

console.disableYellowBox = true;  //Inactiva los mensajes de advertencia del sistema
AppRegistry.registerComponent(appName, () => App);
//export default App;