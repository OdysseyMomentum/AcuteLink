import React, { Component } from 'react';
import { register, send_alive } from '../../shared/actions/clientActions';
import { get_messages } from '../../shared/actions/chatActions';
import './App.css';
import { Navbar } from '../../shared/components/navbar';
import { Sidebar } from '../../shared/components/sidebar';
import { Card } from '../../shared/components/card';

const ALIVE_INTERVAL = 60000; // 1 minute
const MESSAGE_INTERVAL = 1000; // 1 second  

class App extends Component {
  constructor(props) {
    super(props);
    
    // hardcoded for now
    this.entity_id = '210f24c9cb5d49478cfc265def05626f'
    this.client_name = 'General Practioneer 1';
    this.state = {
    	messages: null,
    }
    
	 // Check if we assigned a client ID, otherwise register one    
    if (localStorage.getItem('clientId') == null) {
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
              <Navbar clientName="General Practioner Dashboard" userName="Hello, Dr. Mary Jane" />
              <div class="container-fluid">
                  <div class="row">
                      <Sidebar />
                      <main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
                          <nav aria-label="breadcrumb">
                              <ol class="breadcrumb">
                                  <li class="breadcrumb-item"><a href="#">Home</a></li>
                                  <li class="breadcrumb-item active" aria-current="page">Overview</li>
                              </ol>
                          </nav>
                          <h1 class="h2">Dashboard</h1>
                          <p>This is the homepage of a simple general practioner interface...</p>
                          <div class="row my-4">
                              <Card header="Patients" title="345" text="..." hightlight="18.2% increase since last month" />
                              <Card header="Column B" title="..." text="..." hightlight="..." />
                              <Card header="Column C" title="..." text="..." hightlight="..." />
                              <Card header="Column D" title="..." text="..." hightlight=".." />
                          </div>
                          <div class="row">
                              <div class="col-12 col-xl-8 mb-4 mb-lg-0">
                                  <div class="card">
                                      <h5 class="card-header">Latest messages</h5>
                                      <center><table style={{"width": "500px"}}>
												  {this.state.messages ? this.state.messages.map((k) => <tr><td>{this.formatDate(k['timestamp'])}</td> <td>{k['message']}</td></tr>): 'No messages yet' }     
												  </table> </center>                                
                                  </div>
                              </div>
                              <div class="col-12 col-xl-4">
                                  <div class="card">
                                      <h5 class="card-header">Traffic last 6 months</h5>
                                      <div class="card-body">
                                          <div id="traffic-chart"></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <Footer />
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
