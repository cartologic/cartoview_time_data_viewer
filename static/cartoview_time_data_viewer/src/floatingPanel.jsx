import React from 'react';
import Paper from 'material-ui/Paper';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import {cyanA200, cyanA400, tealA200, black,lightBlue100} from 'material-ui/styles/colors';
const styles = {
  chip: {
    margin: 4,
    textAlign: 'center'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  }
};
export default class FloatingPanel extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let loadingItem = <Chip backgroundColor={tealA200} style={styles.chip}>
      <Avatar size={32} color={black} backgroundColor={cyanA400}>
        <i className="fa fa-circle-o-notch fa-spin" style={{
          fontSize: 24
        }}></i>
      </Avatar>
      Processing
    </Chip>;
    let sorted_data= this.props.data.sort(function(a,b){
      return a.id - b.id
    });
    let itemChips = sorted_data.map((item, i) => {
      return <Chip key={i} backgroundColor={lightBlue100
} style={styles.chip}>
        <span>{item.title}</span>
        <hr style={{borderColor: 'cyan'}}></hr>
        <span>{item.value}</span>
      </Chip>

    })
    let final_items = this.props.loading
      ? loadingItem
      : itemChips;
    return (
      <div className="bottom-chips">
        <span className="chipsWrap">
          {final_items}
        </span>

      </div>

    )
  }
}
