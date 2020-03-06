import React from 'react';

class Section extends React.Component{
  render(){
    return(
      <div className="section">
        <span className="title">{this.props.title}</span>
        {this.props.children}
      </div>
    )
  }
}

export default Section;
