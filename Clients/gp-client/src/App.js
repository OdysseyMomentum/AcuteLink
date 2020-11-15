// Imports
import React, { Component } from 'react';
import './App.css';
import logo from './Logo.png'; // with import
import patient from './Patient.png';


const ALIVE_INTERVAL = 60000; // 1 minute
const MESSAGE_INTERVAL = 2000; // 1 second  
const CLIENT_INTERVAL = 10000;

class App extends Component {
  constructor(props) {
    super(props);
    
    // hardcoded for now
    this.entity_id = '210f24c9cb5d49478cfc265def05626f'
    this.client_name = 'Dr. Hulsberg (GP)';
	 // the state functions weird    
    this.state = {
    	in_messages: [],
    	out_messages: [],
    	sorted_messages: [],
    	online_list: [],
    	message: "",
    	referral_done: false,
    	referral_msg: "Patient not referred yet",
    }
    
	 // Check if we assigned a client ID, otherwise register one
	 // VERY IMPORTANT: WE SHOULD use localStorage.clear() [in the browser] once we restart the database    
    if (localStorage.getItem('clientId') == null) {
			// first time accessing browser
			this.register();    
    }
    
    // Log the client ID	 
	 console.log('Current Client ID:');    
    this.client_id = localStorage.getItem('clientId');
    console.log(this.client_id);
    
    // Look for centralist
    this.find_centralist();
	}
  
  componentDidMount() {
    // Setup the alive and message timers
	 this.get_messages();    
	 this.sort_messages(); 
	 this.get_clients();
    
    this.timer_alive = setInterval(()=> this.send_alive(), ALIVE_INTERVAL);
    this.timer_message = setInterval(()=> this.get_messages(), MESSAGE_INTERVAL);
    this.timer_message_sort = setInterval(() => this.sort_messages(), MESSAGE_INTERVAL);
    this.timer_clients = setInterval(() => this.get_clients(), CLIENT_INTERVAL);
  }
  
	  
  get_clients() {
      fetch('https://acutelinkapi.azurewebsites.net/api/client/clients', {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin'
    }).then(response => response.json())
      .then((jsonData) => {
        console.log(jsonData);
        this.setState({online_list: jsonData.map(x => ({'id': x['id'], 'name': x['name']}))});
    }).catch((error) => {
        console.error(error);
    })
  }

   // register method to shoot when making a new ID    
  register() {
    fetch('https://acutelinkapi.azurewebsites.net/api/client/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
         'Accept': 'text/plain',
         'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            entityId: this.entity_id, 
            name: this.client_name,
        })
    	}).then(response => response.json())
      .then((jsonData) => {
          console.log(jsonData); // log the json response
          localStorage.setItem('clientId', jsonData['id']); // save the ID
      }).catch((error) => {
    	   // handle errors here
    	   console.error(error);
    	})
  }

  find_centralist() {
      fetch('https://acutelinkapi.azurewebsites.net/api/client/clients?entityId=a433296a52e4456aa5eae80d69dba8fe', {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin'
    }).then(response => response.json())
      .then((jsonData) => {
        // jsonData is parsed json object received from url
        console.log('Centralist:');
        this.centralist_id = jsonData[0]['id'];
    }).catch((error) => {
        // handle errors here
        console.error(error);
    })
  }
  
  get_messages() {
    fetch('https://acutelinkapi.azurewebsites.net/api/chat/receive?clientId=' + this.centralist_id, {
        method: 'GET',
        mode: 'cors',
        headers: {
         'Accept': 'text/plain',
         'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
    	}).then((response) => {
          console.log(response); // log data
			 if (response['statusText'] == 'OK') {
				// we have data
				response.json().then((jsonData) => {
					console.log('Message OUT');
					if (jsonData.length > 0) {
						console.log('Adding OUT messages');
						console.log(jsonData[0]['messages']);
						this.setState({in_messages: jsonData[0]['messages'].map(x => ({'name': this.client_name, 'message': x['message'], 'timestamp': x['timestamp']}))});		
						this.sort_messages();					
					}				
				})
			 }          
      })
    	.catch((error) => {
    	   // handle errors here
    	   console.error(error);
    	})
    	
    	fetch('https://acutelinkapi.azurewebsites.net/api/chat/receive?clientId=' + this.client_id, {
        method: 'GET',
        mode: 'cors',
        headers: {
         'Accept': 'text/plain',
         'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
    	}).then((response) => {
          console.log(response); // log data
			 if (response['statusText'] == 'OK') {
				// we have data
				response.json().then((jsonData) => {
					console.log('Message IN');
					if (jsonData.length > 0) {
						console.log(jsonData[0]['messages']);
					
						console.log('Adding IN messages: ');
						console.log(this.state.messages);
						this.setState({out_messages: jsonData[0]['messages'].map(x => ({'name': 'Centralist', 'message': x['message'], 'timestamp': x['timestamp']}))});
						this.sort_messages();					
					}
				})
			 }          
      })
    	.catch((error) => {
    	   // handle errors here
    	   console.error(error);
    	})
    	this.sort_messages();
  }
  
  sort_messages() {
		console.log('Sorting');
		var total_msg = this.state.in_messages.concat(this.state.out_messages);
		console.log(total_msg.length)  		
  		if (total_msg.length > 0 && total_msg.length > this.state.sorted_messages.length) {    	
			console.log(total_msg.sort(function compare(a, b) {
  				var dateA = new Date(a['timestamp']);
  				var dateB = new Date(b['timestamp']);
  				return dateA - dateB;
			}));
					
    		
    		this.setState({sorted_messages: total_msg.sort(function compare(a, b) {
  				var dateA = new Date(a['timestamp']);
  				var dateB = new Date(b['timestamp']);
  				return dateA - dateB;
			})});
		}
		
		console.log('Looking for last referral');
		var local_msg = this.state.sorted_messages.slice().reverse()		
		for (var i = 0; i < local_msg.length; i++) {
        if (local_msg[i]['message'].includes("[referral]")) {
        		console.log('Found referral');
        		this.setState({referral_done: true});
        		this.setState({referral_msg: local_msg[i]['message'].replace("[referral]","")});
        		console.log(this.state.referral_msg);
        		console.log(this.state.referral_done);
        		break;
        }
      }	
  }
  
  async send_alive(){
      console.log(JSON.stringify({
            id: this.id,
        }));
      fetch('https://acutelinkapi.azurewebsites.net/api/client/alive', {
        method: 'POST',
        mode: 'cors',
        headers: {
         'Accept': 'text/plain',
         'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            id: this.id,
        })
    }).then((response) => {
    // we just log the respons for now
    console.log(response)})
    .catch((error) => {
    // handle your errors here
    console.error(error)
    })
  }
  
  formatDate(string){
    var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    return new Date(string).toLocaleDateString([],options);
  }
  
  handleMsgBoxChange = (e) => {
   this.setState({message: e.target.value});
  }
  
  sendMessage = (e) => {
  	console.log('Sending message!!');
  	console.log(this.state.partnerId);
  	console.log(this.state.message);
  	
  	fetch('https://acutelinkapi.azurewebsites.net/api/chat/send', {
        method: 'POST',
        mode: 'cors',
        headers: {
         'Accept': 'text/plain',
         'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            message: this.state.message,
            receiverId: this.centralist_id,           
            senderId: this.client_id, 
        })
    	}).then((response) => {
        // we just log the respons for now
        console.log(response);
      }).catch((error) => {
        // handle errors here
        console.error(error);
      })

	this.setState({message: ""});
	e.target.reset();	
	e.preventDefault();  
  }

  render() {
      return (
          <div className="App">
              <nav class="navbar navbar-light bg-light p-3">
                  <div class="d-flex col-12 col-md-3 col-lg-2 mb-2 mb-lg-0 flex-wrap flex-md-nowrap justify-content-between">
                      <a class="navbar-brand" href="#">
                      <div className="logo">
          					<img src={logo} width="80"/>
        					 <b>General Practioner</b> Dashboard
        					 <br></br>
                      </div>
                      </a>
                      <button class="navbar-toggler d-md-none collapsed mb-3" type="button" data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
                          <span class="navbar-toggler-icon"></span>
                      </button>
                  </div>
                  <div class="col-12 col-md-5 col-lg-8 d-flex align-items-center justify-content-md-end mt-3 mt-md-0">
                      <div class="dropdown">
                          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
                              Hello, Dr. Hulsberg
                          </button>
                          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                              <li><a class="dropdown-item" href="#">Settings</a></li>
                              <li><a class="dropdown-item" href="#">Messages</a></li>
                              <li><a class="dropdown-item" href="#">Sign out</a></li>
                          </ul>
                      </div>
                  </div>
              </nav>
              <div class="container-fluid">
                  <div class="row">
                      <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
							     <br></br>                          		
                          <input class="form-control" type="text" placeholder="Search.." name="search"></input>  <br></br>
                                                        
                          <div class="position-sticky">
                              <ul class="nav flex-column">
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            				<span class="ml-2">Delhaas, 11-06-1932</span> 
                                      </a> 34893498
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            				<span class="ml-2">van der Beek, 01-08-1988</span> 
                                      </a> 82239018
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            				<span class="ml-2">Ter Stegen, 12-07-1950</span> 
                                      </a> 78348932
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            				<span class="ml-2">Hulshof, 12-10-2001</span> 
                                      </a> 32312381
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            				<span class="ml-2">van Zoggel, 10-02-1987</span> 
                                      </a> 13278328
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            				<span class="ml-2">van Breggen, 05-05-1992</span> 
                                      </a> 90347348
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            				<span class="ml-2">Meex, 11-07-1948</span> 
                                      </a> 52378123
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            				<span class="ml-2">Vroemen, 08-07-2008</span> 
                                      </a> 23127388
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            				<span class="ml-2">Stokkepijd, 01-05-1941</span> 
                                      </a> 10218929
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            				<span class="ml-2">Dierbaar, 05-08-1942</span> 
                                      </a> 39083498
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            				<span class="ml-2">Faas, 18-06-1932</span> 
                                      </a> 34878839
                                  </li>

                                  
                                  
                              </ul>
                          </div>
                      </nav>
                      <main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
                          <nav aria-label="breadcrumb">
                              <ol class="breadcrumb">
                                  <li class="breadcrumb-item"><a href="#">Home</a></li>
                                  <li class="breadcrumb-item active" aria-current="page">Overview</li>
                              </ol>
                          </nav>
                          <div class="row">
                              <div class="col-12 col-md-6">
                                  <div class="card">
                                      <h5 class="card-header">Patient information</h5>
                                      <div class="card-body">
                                      		<div class="content">
    													<img src={patient} alt="" ></img>
    													<div class="content2"><b>Ellen Ter Stegen</b>
    													<p>June 2, 12-07-1950 (70 years) <br></br>Female</p>
    													</div></div>
														
														<p><i>Medical History </i><li>Diabetes</li><li>Cardiovascular Disease</li><br></br>
														<i>Medications </i><li>Aspirin</li><li>Simvastatin</li><br></br>
														<i>Allergies </i><li>None</li><br></br>
														<i>Advanced care planning </i><li>No resuscitation</li></p>
													</div>                                  
                                  </div>
                              </div>
                              <div class="col-12 col-md-6">
                                  <div class="card">
                                      <h5 class="card-header">Referral information</h5>
                                      <div class="card-body">
                                          <b>Submit Information </b>
														<form class="form-group" onSubmit={e => e.preventDefault()}>
  														<input type="checkbox"/>
  														<label for="x1">  Medical history</label> <br/>
  														<input type="checkbox"/>
  														<label for="x1">  Medications</label> <br/>
  														<input type="checkbox"/>
  														<label for="x1">  Allergies</label> <br/>
  														<input type="checkbox"/>
  														<label for="x1">  Advanced care planning</label> <br/>
  														<input class="btn btn-primary" type="submit" value="Send"/>
														</form>                              
                                                                                       
      												<br/><b>Referall information</b><br></br>
      												<div class="md-form">
  														<textarea id="form7" rows="9" class="md-textarea form-control" value={this.state.referral_msg}>
      												</textarea>  
      												</div>
                                      </div>
                                  </div>
                              </div>
                          </div>
								  <br></br>                          
                          <div class="row">
                              <div class="col-12 col-xl-8 mb-4 mb-lg-0">
                                  <div class="card">
                                      <h5 class="card-header">Chatbox</h5>
                                  
                                  <div id="chatbox">
                                  <table width="710px" border="0" class="table table-striped">
                                  <tbody>
											 {this.state.sorted_messages.length > 0 ? this.state.sorted_messages.map((k) => <tr><td class="chattd" width='170px'>{this.formatDate(k['timestamp'])}</td> <td class='chattd' width='140px'> <b> {k['name']} </b> </td> <td class='chattd' width='400px'>{k['message']}</td></tr>): 'No messages yet' }                                      
										    </tbody>										    
										    </table>                                  
                                  </div>
     
    										 <form class="form-group" name="message" onSubmit={this.sendMessage}>
       									  <input name="usermsg"
       										   size="63" height="200"
       										   value={this.state.message} onChange={this.handleMsgBoxChange} />
        									   <input class="btn btn-primary" name="submitmsg" type="submit"/>
    										 </form>                           
                                  </div>
                              </div>
                              <div class="col-12 col-xl-4 onlinelist">
                                  <div class="card">
                                      <h5 class="card-header">Who is online?</h5>
												  <select name="olist" id="onlinelist" class="form-control selectonline" multiple>
                                      {this.state.online_list.map(key => (
                                      <option value={key['id']}>• {key['name']}</option>))};
                                      <p>hi</p>
                                      </select>                                   
                                      <div class="card-body">
                                          <div id="traffic-chart"></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <footer class="pt-5 d-flex justify-content-between">
                              <ul class="nav m-0">
                                  <li class="nav-item">
                                      <a class="nav-link text-secondary" aria-current="page" href="#">Privacy Policy</a>
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link text-secondary" href="#">Terms and conditions</a>
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link text-secondary" href="#">Contact</a>
                                  </li>
                              </ul>
                          </footer>
                      </main>
                  </div>
              </div>
              <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
              <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js" integrity="sha384-oesi62hOLfzrys4LxRF63OJCXdXDipiYWBnvTl9Y9/TRlw5xlKIEHpNyvvDShgf/" crossorigin="anonymous"></script>
              <script src="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
          </div>
      );
  }
}

export default App;
