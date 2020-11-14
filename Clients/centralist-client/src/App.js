import React, { Component } from 'react';
import { register, send_alive } from '../../shared/actions/clientActions';
import { get_messages } from '../../shared/actions/chatActions';
import './App.css';

const ALIVE_INTERVAL = 60000; // 1 minute
const MESSAGE_INTERVAL = 1000; // 1 second  

class App extends Component {
  
  constructor(props) {
    super(props);
    
    
    // Entity ID and name for the specific client
    this.entity_id = 'a433296a52e4456aa5eae80d69dba8fe'
    this.client_name = 'CENTRALIST';
    this.state = {
    	messages: null,
    }
    
	 // Check if we assigned a client ID, otherwise register no    
    if (localStorage.getItem('clientId') == null) {
			// first time accessing browser
			register(this.entity_id);    
    }
    
    // Log the client ID	 
	 console.log('Current Client ID:');    
    this.client_id = localStorage.getItem('clientId');
    console.log(this.client_id);
    
    // Setup the alive and message timers
    this.timer_alive = setInterval(()=> send_alive(), ALIVE_INTERVAL);
    this.timer_message = setInterval(()=> get_messages(), MESSAGE_INTERVAL);
  }
  
  formatDate(string){
    var options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    return new Date(string).toLocaleDateString([],options);
  }

  render() {
      return (
          <div className="App">
              <nav class="navbar navbar-light bg-light p-3">
                  <div class="d-flex col-12 col-md-3 col-lg-2 mb-2 mb-lg-0 flex-wrap flex-md-nowrap justify-content-between">
                      <a class="navbar-brand" href="#">
                          <b>AcuteLink</b> General Practioner Dashboard
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
                          <p>This is the homepage of a simple general practioner interface...</p>
                          <div class="row">
                              <div class="col-12 col-md-6">
                                  <div class="card">
                                      <h5 class="card-header">Patient information</h5>
                                      <div class="card-body">
                                          <h5 class="card-title">345</h5>
                                          <p class="card-text">...</p>
                                          <p class="card-text text-success">18.2% increase since last month</p>
                                      </div>
                                  </div>
                              </div>
                              <div class="col-12 col-md-6">
                                  <div class="card">
                                      <h5 class="card-header">Capacity information</h5>
                                      <div class="card-body">
                                          <h5 class="card-title">...</h5>
                                          <p class="card-text">...</p>
                                          <p class="card-text text-success">....</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="row">
                              <div class="col-12 col-xl-8 mb-4 mb-lg-0">
                                  <div class="card">
                                      <h5 class="card-header">Chatbox</h5>
                                      <center><table style={{"width": "500px"}}>
												  {this.state.messages ? this.state.messages.map((k) => <tr><td>{this.formatDate(k['timestamp'])}</td> <td>{k['message']}</td></tr>): 'No messages yet' }     
												  </table> </center>                                
                                  </div>
                              </div>
                              <div class="col-12 col-xl-4">
                                  <div class="card">
                                      <h5 class="card-header">Online institutions</h5>
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
