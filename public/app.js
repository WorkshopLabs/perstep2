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
  	saveContacts: function(results){
  		var register =  {fileName: this.state.file.name, contacts: results.data};
		this.firebaseRefs["registers"].push(register);
    	request.post("/documents")    
        	.attach("image-file", this.state.file, this.state.file.name)
            	.end(function(err, res){
     					if (err || !res.ok) {
      					 console.log('Oh no! error');
     					} else {
      					 console.log('yay got ' + JSON.stringify(res.body));
    					}
    				});
  	},
  	askUserBeforeAdding: function(results){
  		if (confirm('Do you want to add these '+results.data.length+' contacts?')) {
				this.saveContacts(results);
				alert("Your register was saved successfully");
		}
  	},
	askUserForFields: function(results) {
        if (confirm('Are these fields correct?: '+results.meta.fields.toString())) {
    		this.askUserBeforeAdding(results);
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
				<div className="jumbotron container span12">
  					<h1>Contacts App</h1>
  					<p>Choose your file to save your contacts</p>		
					
  						<div className="form-group">

   							<span className='btn btn-default btn-file'>
    							Choose a file 
    							<input type='file'   onChange={this.handleFileChange} accept='.csv'/>
							</span>
  						</div>
  						<br/>
  						<button type="button" className="btn btn-primary" onClick={this.handleVerify}>Ok</button>

				</div>
			</div>
			);
	}
});

ReactDOM.render(
  <UploadFileBox/>,
  document.getElementById('content')
);