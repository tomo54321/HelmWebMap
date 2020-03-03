import React from 'react';
import queryString from 'query-string';
import {withRouter} from 'react-router-dom';

import './SearchBar.css';

class SearchBar extends React.Component{
  constructor(props){
    super(props);

    let qString = queryString.parse(props.location.search);

    this.state={
      query:qString.q ?? "",
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }

  onSubmit(e){
    const query = queryString.stringify( {q:this.state.query} );
    let url = "/search?"+query;
    this.props.history.push(url);
    e.preventDefault()
  }
  onTextChange(e){
    if(this.props.location.pathname === "/search"){
      this.props.history.push("/");
    }
    
    this.setState({
      [e.target.name]:e.target.value
    })
  }

  render(){
    return(
      <form action="/search" method="GET" onSubmit={this.onSubmit}>
        <input type="text" className="search-bar shadow-map" name="query" autoComplete="off" placeholder="Search" value={this.state.query} onChange={this.onTextChange}/>
      </form>
    )
  }
}

export default withRouter(SearchBar);
