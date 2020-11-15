import React, { Component } from 'react';
import './App.css';
import logo from './Logo.png'; // with import

const ALIVE_INTERVAL = 60000; // 1 minute
const MESSAGE_INTERVAL = 2000; // 1 second  

class App extends Component {
  
  constructor(props) {
    super(props);
    
    // Entity ID and name for the specific client
    this.entity_id = 'a433296a52e4456aa5eae80d69dba8fe' 
    this.client_name = 'CENTRALIST';
    this.state = {
    	message: "",
    	destmessage: "",
    	partnerId: "",
    	partnerKey: "",
    	in_messages: [],
    	out_messages: [],
    	sorted_messages: [],
    	online_list: [],
    	destination_list: [{'name': 'Please select a destination from the list.', 'beds': '0', 'distance': ''}],
    	selectedRow: -1, 
    	selected_destination: "",
    }
    this.destinations = ['ELV', 'Hospital', 'Ambulance', 'Home'];
    this.mockup = [{'name': 'xx', 'boo': 'lol'}, {'name': 'second', 'boo': 'asdasd'}];
    
	 // Check if we assigned a client ID, otherwise register no    
    if (localStorage.getItem('clientId') == null) {
			// first time accessing browser
			this.register();    
    }
    
    // Log the client ID	 
	 console.log('Current Client ID:');    
    this.client_id = localStorage.getItem('clientId');
    console.log(this.client_id);
    
    this.get_clients();
  }
  
  componentDidMount() {
    // Setup the alive and message timers
	 this.get_messages();    
	 this.sort_messages(); 
    
    this.timer_alive = setInterval(()=> this.send_alive(), ALIVE_INTERVAL);
    this.timer_message = setInterval(()=> this.get_messages(), MESSAGE_INTERVAL);
    this.timer_message_sort = setInterval(()=> this.sort_messages(), MESSAGE_INTERVAL);
  }

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
          console.log(jsonData); // log data
          localStorage.setItem('clientId', jsonData['id']);
      })
    	.catch((error) => {
    		 // handle errors here
    		 console.error(error)
    	})
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
  
  async get_messages() {
	 if (this.state.partnerId != "") {    
        fetch('https://acutelinkapi.azurewebsites.net/api/chat/receive?clientId=' + this.state.partnerId, {
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
					
						//console.log('Adding IN messages to: ');
						//console.log(this.state.messages);
						this.setState({out_messages: jsonData[0]['messages'].map(x => ({'name': this.state.partnerKey, 'message': x['message'], 'timestamp': x['timestamp']}))});			
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
        console.log(response);
    }).catch((error) => {
        // handle errors here
        console.error(error);
    })
  }
  
  formatDate(string){
    var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'};
    return new Date(string).toLocaleDateString([],options);
  }
  
  selectPartner = (e) => {
	 this.setState({partnerId:e.target.value});
    this.setState({partnerKey:e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text});
    console.log('Changed value');
    console.log(e.nativeEvent.target[e.nativeEvent.target.selectedIndex]);
    //console.log(this.state.partnerKey);
  }
  
  selectDest = (e) => {
  	this.setState({selected_destination:e.target.value});
  	this.fetch_destinations(e.target.value);  
  }
  
  fetch_destinations(target) {
    fetch('https://acutelinkapi.azurewebsites.net/api/capacity?type=' + target, {
        method: 'GET',
        mode: 'cors',
        headers: {
         'Accept': 'text/plain',
         'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
    	}).then(response => response.json())
      .then((jsonData) => {
			 console.log('Destination data log:');          
          console.log(jsonData); // log data
          this.setState({destination_list: jsonData.map(x => ({'name': x['entityName'], 'beds': x['freeBeds'], 'distance': (x['distance']/1000).toFixed(2)}))});
      })
    	.catch((error) => {
    		 // handle errors here
    		 console.error(error)
    	})
  }
  
  handleMsgBoxChange = (e) => {
   this.setState({message: e.target.value});
  }
  
  handleDestBoxChange = (e) => {
   this.setState({destmessage: e.target.value});
   console.log(e.target.value);
  }
  
  sendDestMessage = (e) => {
  	console.log('Sending message!!');
  	console.log(this.state.partnerId);
  	console.log(this.state.message);
  	console.log(this.client_id);
  	
	var selectedRow = this.state.selectedRow;  	
  	var msg = 'Hi there ' + this.state.partnerKey + ', I just sent patient <X> to ' + this.state.destination_list[selectedRow]['name'];
  	var msg = msg + '. This center has ' + this.state.destination_list[selectedRow]['beds'] + ' free beds and is ';
  	var msg = msg + this.state.destination_list[selectedRow]['distance'] + ' kms away. Also, I have some additional information: ' + this.state.destmessage;
  	
  	fetch('https://acutelinkapi.azurewebsites.net/api/chat/send', {
        method: 'POST',
        mode: 'cors',
        headers: {
         'Accept': 'text/plain',
         'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            message: msg, 
            receiverId: this.state.partnerId,            
            senderId: this.client_id, 
        })
    	}).then((response) => {
        // we just log the respons for now
        console.log('response of message');
        console.log(response);
      }).catch((error) => {
        // handle errors here
        console.error(error);
      })

	this.setState({destmessage: ""});
	e.target.reset();	
	e.preventDefault();  
  }
    
  sendMessage = (e) => {
  	console.log('Sending message!!');
  	console.log(this.state.partnerId);
  	console.log(this.state.message);
  	console.log(this.client_id);
  	
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
            receiverId: this.state.partnerId,            
            senderId: this.client_id, 
        })
    	}).then((response) => {
        // we just log the respons for now
        console.log('response of message');
        console.log(response);
      }).catch((error) => {
        // handle errors here
        console.error(error);
      })

	this.setState({message: ""});
	e.target.reset();	
	e.preventDefault();  
  }
  
  changeColor = selectedRow => e => {
    if (selectedRow !== undefined) {
      this.setState({ selectedRow  });
    }
    console.log(this.state.destination_list[selectedRow]);
  };
  
  render() {
      return (
          <div className="App">
              <nav class="navbar navbar-light bg-light p-3">
                  <div class="d-flex col-12 col-md-3 col-lg-2 mb-2 mb-lg-0 flex-wrap flex-md-nowrap justify-content-between">
                      <a class="navbar-brand" href="#">
                      <div className="logo">
          					<img src={logo} width="80"/>
        					 <b>Centralist</b> Dashboard
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
                          <div class="position-sticky">
									   <br></br>                          		
                          		<input type="text" placeholder="Search.." name="search"></input>  <br></br>
                          		<br></br>
                              <ul class="nav flex-column">					                                       
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" 
                                          width="24" height="24" viewBox="0 0 24 24" 
                                          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                          stroke-linejoin="round" class="feather feather-bar-chart-2">
                                          <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4">
                                          </line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                          <span class="ml-2">REQUEST AZC</span> 
                                      </a> Received: 4h ago
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" 
                                          width="24" height="24" viewBox="0 0 24 24" 
                                          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                          stroke-linejoin="round" class="feather feather-bar-chart-2">
                                          <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4">
                                          </line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                          <span class="ml-2">REQUEST AZC</span> 
                                      </a> Received: 4h ago
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" 
                                          width="24" height="24" viewBox="0 0 24 24" 
                                          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                          stroke-linejoin="round" class="feather feather-bar-chart-2">
                                          <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4">
                                          </line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                          <span class="ml-2">REQUEST AZC</span> 
                                      </a> Received: 4h ago
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" 
                                          width="24" height="24" viewBox="0 0 24 24" 
                                          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                          stroke-linejoin="round" class="feather feather-bar-chart-2">
                                          <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4">
                                          </line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                          <span class="ml-2">REQUEST AZC</span> 
                                      </a> Received: 4h ago
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                      		<svg xmlns="http://www.w3.org/2000/svg" 
                                          width="24" height="24" viewBox="0 0 24 24" 
                                          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                          stroke-linejoin="round" class="feather feather-bar-chart-2">
                                          <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4">
                                          </line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                          <span class="ml-2">REQUEST AZC</span> 
                                      </a> Received: 4h ago
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
                                          <svg xmlns="http://www.w3.org/2000/svg" 
                                          width="24" height="24" viewBox="0 0 24 24" 
                                          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                          stroke-linejoin="round" class="feather feather-bar-chart-2">
                                          <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4">
                                          </line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                          <span class="ml-2">Reports</span>
                                      </a> Received: 4h ago
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
														<svg xmlns="http://www.w3.org/2000/svg" 
                                          width="24" height="24" viewBox="0 0 24 24" 
                                          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                          stroke-linejoin="round" class="feather feather-bar-chart-2">
                                          <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4">
                                          </line><line x1="6" y1="20" x2="6" y2="14"></line></svg>                                          
                                          <span class="ml-2">REQUEST AZC</span> 
                                      </a> Received: 4h ago
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
														<svg xmlns="http://www.w3.org/2000/svg" 
                                          width="24" height="24" viewBox="0 0 24 24" 
                                          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                          stroke-linejoin="round" class="feather feather-bar-chart-2">
                                          <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4">
                                          </line><line x1="6" y1="20" x2="6" y2="14"></line></svg>                                          
                                          <span class="ml-2">REQUEST AZC</span> 
                                      </a> Received: 4h ago
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link" href="#">
														<svg xmlns="http://www.w3.org/2000/svg" 
                                          width="24" height="24" viewBox="0 0 24 24" 
                                          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                          stroke-linejoin="round" class="feather feather-bar-chart-2">
                                          <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4">
                                          </line><line x1="6" y1="20" x2="6" y2="14"></line></svg>                                          
                                          <span class="ml-2">REQUEST 1 HELOOOO</span> 
                                      </a> Received: 4h ago
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
                          <h1 class="h2">Dashboard</h1>
                          <div class="row">
                              <div class="col-12 col-md-6">
                                  <div class="card">
                                      <h5 class="card-header">Patient information</h5>
                                      <div class="card-body">
                                          <h5 class="card-title">345</h5>
                                          <p class="card-text">...</p>
                                          <p class="card-text text-success">18.2% increase since last month</p>
                                          <p class="card-text text-success">18.2% increase since last month</p>
                                          <p class="card-text text-success">18.2% increase since last month</p>
                                          <p class="card-text text-success">18.2% increase since last month</p>
                                          <p class="card-text text-success">18.2% increase since last month</p>
                                          <p class="card-text text-success">18.2% increase since last month</p>

                                      </div>
                                  </div>
                              </div>
                              <div class="col-12 col-md-6">
                                  <div class="card">
                                      <h5 class="card-header">Capacity information</h5>
                                      <div class="card-body">
                                          <b>Select destination </b><select name="dlist" onChange={this.selectDest}>
														<option value="none" selected disabled hidden> 
            										</option>                                           
                                          {this.destinations.map(x => (<option value={x}>{x}</option>))}
                                          </select>
                                          <table class="table">
        												<thead>
          											<tr>
            										<th scope="col">Name</th>
            										<th scope="col">Beds</th>
            										<th scope="col">Distance (kilometers)</th>
          											</tr>
        												</thead>
        												<tbody className="tableHover">
          											{this.state.destination_list.map((item, i) => {
            									 	 return (
              										 <tr key={i} onClick={this.changeColor(i)} className={this.state.selectedRow === i ? "tableSelected" : "" }>
                									 <td>{item.name}</td>
                									 <td>{item.beds}</td>
                									 <td>{item.distance}</td>
              										  </tr>
            										  );
            										  })}
        												</tbody>
      												</table>
      												
      												<b>Additional information</b>
      												<form name="message" onSubmit={this.sendDestMessage}>
											         <textarea name="dest_text" cols="40" rows="5"
											         value={this.state.destmessage} onChange={this.handleDestBoxChange}></textarea> <br></br>  									  			
        									   		<input name="submitmsg" type="submit"/>
    										 			</form> 
                                          
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
     
    										 <form name="message" onSubmit={this.sendMessage}>
       									  <input name="usermsg"
       										   size="63" height="200"
       										   value={this.state.message} onChange={this.handleMsgBoxChange} />
        									   <input name="submitmsg" type="submit"/>
    										 </form>                           
                                  </div>
                              </div>
                              <div class="col-12 col-xl-4 onlinelist">
                                  <div class="card">
                                      <h5 class="card-header">Online institutions</h5>
												  <select name="olist" id="onlinelist" class="selectonline" onChange={this.selectPartner} multiple>
                                      {this.state.online_list.map(key => (
                                      <option value={key['id']}>• {key['name']}</option>))};
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
