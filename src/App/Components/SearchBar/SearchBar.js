import React from 'react';
import queryString from 'query-string';
import {withRouter} from 'react-router-dom';

class SearchBar extends React.Component{
  constructor(props){
    super(props);

    let qString = queryString.parse(props.location.search);

    this.state={
      query:qString.q ?? "",
    }

    this.lastQuery = qString.q ?? "";

    this.onSubmit = this.onSubmit.bind(this);
    this.addToPreviousSearches = this.addToPreviousSearches.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }

  onSubmit(e){
    if((this.props.location.pathname !== "/" && this.state.query === this.lastQuery) || queryString.parse(this.props.location.search).q === ""){
      this.setState({
        query:""
      })
      this.props.history.push("/");
      e.preventDefault()
      return;
    }

    const query = queryString.stringify( {q:this.state.query} );
    let url = "/search?"+query;
    this.lastQuery = this.state.query;

    this.addToPreviousSearches();

    this.props.history.push(url);
    e.preventDefault()
  }
  addToPreviousSearches(){
    let previous_searches = [];
    if(window.localStorage.getItem("recent-searches") !== null){
      try{
        previous_searches = JSON.parse(window.localStorage.getItem("recent-searches"));
      }catch(ex){
        console.error("Invalid previous searches, resetting.")
        previous_searches = [];
      }
    }

    // Search already exists.
    if(previous_searches.indexOf(this.state.query) !== -1){
      return;
    }
    // If empty query.
    if(this.state.query === ""){
      return;
    }

    // If list is longer than 10
    if(previous_searches.length > 10){
      previous_searches.pop();
    }

    previous_searches.push(this.state.query);
    window.localStorage.setItem("recent-searches", JSON.stringify(previous_searches));
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
    // if(this.props.location.pathname === "/directions"){return null;}
    return(
        <form action="/search" method="GET" onSubmit={this.onSubmit} className="d-flex search-form">
          <input type="text" className="search-bar" name="query" autoComplete="off" placeholder="Search" value={this.state.query} onChange={this.onTextChange}/>
          <button className="search-button"><i className="material-icons">{this.props.location.pathname !== "/" ?"close":"search"}</i></button>
        </form>
    )
  }
}

export default withRouter(SearchBar);
