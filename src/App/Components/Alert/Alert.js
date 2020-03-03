import React from 'react';
import './Alert.css';
class Alert extends React.Component{

  constructor(props){
    super(props);
    this.state={
      isClosing:false
    }
    this.onClose = this.onClose.bind(this);
  }

  onClose(){
    this.setState({
      isClosing:true
    },()=>{
      setTimeout(()=>{
        this.props.onClose();
        this.setState({isClosing:false})
      }, 350);
    })
  }

  render(){
    if(!this.props.show){return null}
    return(
      <div className="backdrop">
        <div className={"alert"+ (this.state.isClosing?" close":"")}>
          <span className="title">
          {
            this.props.type === "error"?
            "Oh No"
            :
            this.props.type === "success"?
            "Success"
            :
            "Info"
          }
          </span>
          <p>{this.props.message}</p>
          <button className="close-btn" onClick={this.onClose}>Close</button>
        </div>
      </div>
    )
  }
}

export default Alert;
