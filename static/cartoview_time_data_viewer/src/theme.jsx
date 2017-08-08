import {
  cyan900,
  lightBlack,
  pinkA200,
  grey100,
  grey500,
  darkBlack,
  white,
  grey300,
  lightBlue600,
  lightBlueA100,
  blue900,
  black,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import zIndex from 'material-ui/styles/zIndex';
import spacing from 'material-ui/styles/spacing';

export default {
  spacing : spacing,
  zIndex : zIndex,
  fontFamily : 'Roboto, sans-serif',
  palette : {
    primary1Color: blue900,
    primary2Color: lightBlueA100,
    textColor: darkBlack,
    alternateTextColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: lightBlueA100
  }
};
