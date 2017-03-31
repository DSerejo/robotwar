import React from 'react';
class SearchForOpponent extends React.Component{
	constructor(props){
		super(props);
		
	}
	onStartSearching(){
		window.game.startSearchingOpponent();
	}
	
	render(){
		return <button className="search-for-object" onClick={this.onStartSearching.bind(this)}>
			Search for opponent
		</button>
	}
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
export default SearchForOpponent;