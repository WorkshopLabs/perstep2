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