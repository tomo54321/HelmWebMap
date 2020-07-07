import React from 'react';
import Section from '../Section/Section'

class SearchList extends React.Component{
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render(){
    const results = this.props.list.map((v,i)=>{
      return(
        <li key={"search_result_" + i}>
          <a href={"/place/" + v.id} onClick={(e) => {this.props.onResultClick(v);e.preventDefault();}}>
            <span className="name">{v.name}</span>
            <span className="type">{this.capitalizeFirstLetter(v.category.name.replace("_", " "))}</span>
          </a>
        </li>
      )
    })

    return(
      <Section title="Search Results">
        {this.props.list.length === 0? 
        <center><span className="d-block">No results found</span></center>
        : <ul className="link-list">{results}</ul>}
      </Section>
    )
  }

}
export default SearchList;
