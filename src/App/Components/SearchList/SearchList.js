import React from 'react';

class SearchList extends React.Component{
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render(){
    const results = this.props.list.map((v,i)=>{
      return(
        <button key={i} className="result-row" onClick={()=>{this.props.onResultClick(v)}}>
          <span className="place_name">{v.name}</span>
          <span className="place_type">{this.capitalizeFirstLetter(v.category.name.replace("_", " "))}</span>
        </button>
      )
    })

    return(
      <div className="list-container">
        {results}
      </div>
    )
  }

}
export default SearchList;
