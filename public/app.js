/*
var data = [
	{id: 1, author: "Pete Hunt", text: "I have some problems with this! help"},
	{id: 2, author: "Andrea Soria", text: "No problem, this is just a bug with de API"},
	{id: 3, author: "Pete Hunt", text: "I posted it in stackoverflow, and they say its a hack"}
];

var CommentBox = React.createClass({
	handleCommentSubmit: function(comment){
		this.state.comments.push(comment);
	},
	getInitialState: function(){
		return {comments:data};
	},
	render: function(){
		return (
			<div className="commentBox">
				<UploadFileBox/>
				<CommentForm onCommentSubmit={this.handleCommentSubmit}/>
				<CommentList comments={this.state.comments}/>
			</div>
			);
	}
});

var CommentList = React.createClass({
	render: function(){
		var commentsNodes = this.props.comments.map(function(commnent){
			return (
				<Comment author={commnent.author} key={commnent.id}>{commnent.text}</Comment>
				);
		});
		return (
			<div className="commnentList">
				<h1>Comment List</h1>
				{commentsNodes}
			</div>
			);
	}
});

var CommentForm = React.createClass({
	getInitialState: function(){
		return {author:'', text:''};
	},
	handleAuthorChange: function(e){
		this.setState({author:e.target.value});
	},
	handleTextChange: function(e){
		this.setState({text:e.target.value});
	},
	handleSubmit: function(e){
		e.preventDefault();
		var author = this.state.author.trim();
		var text = this.state.text.trim();
		if(!author || !text) return;
		alert("Sending data to server");
		this.props.onCommentSubmit({author: author,text: text});
	},
	render: function(){
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input 
					type="text" 
					placeholder="Your name" 
					value={this.state.author} 
					onChange={this.handleAuthorChange}/>
				<input 
					type="text" 
					placeholder="Your comment" 
					value={this.state.text} 
					onChange={this.handleTextChange}/>
				<input type="submit"/>
			</form>
			);
	}
});

var Comment = React.createClass({
	render: function(){
		return (
			<div className="comment">
				<h3 className="commentAuthor">
				 	{this.props.author}:
				 </h3>
				 {this.props.children}
			</div>
			);

	}
});
*/

var React = require('react');
var ReactDOM = require('react-dom');
var Firebase = require('firebase');
var Papa = require('papaparse');
var ReactFire = require ('reactfire');
var request = require('superagent');
var firebaseUrl = "https://contactslistfromdoc.firebaseio.com/";


var UploadFileBox = React.createClass({
	mixins: [ReactFireMixin],
	getInitialState: function(){
		return {file:null, registers:[]};
	},
	componentWillMount: function() {
    	this.bindAsArray(new Firebase(firebaseUrl + "documents"), "registers");
  	},
	askUserForFields: function(results) {
        if (confirm('Are these fields correct?: '+results.meta.fields.toString())) {
    		if (confirm('Do you want to add these '+results.data.length+' contacts?')) {
				var register =  {fileName: this.state.file.name, contacts: results.data};
				this.firebaseRefs["registers"].push(register);
    				 request.post("/documents")    
            			.attach("image-file", this.state.file, this.state.file.name)
            			.end(function(res){
               				 console.log(res);
            			});
				alert("Your register was saved successfully");
			}
		}
	},
	handleVerify: function(){
		Papa.parse(this.state.file, {
      		header: true,
      		dynamicTyping: true,
      		complete: this.askUserForFields
    	});
	},
	handleFileChange: function(e){
		this.setState({file: e.target.files[0]});
	},
	render: function(){
		return (
			<div className='uploadFileBox'>
					<span className='btn btn-default btn-file'>
    					Browse 
    					<input type='file'  onChange={this.handleFileChange} accept='.csv'/>
					</span>
					<button type='button' className='btn btn-primary' onClick={this.handleVerify}>Next</button>
			</div>
			);
	}
});

ReactDOM.render(
  <UploadFileBox/>,
  document.getElementById('content')
);