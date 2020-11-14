import React, { Component } from 'react';
import { register, send_alive } from '../../shared/actions/clientActions';
import { get_messages } from '../../shared/actions/chatActions';
import { RequestList } from '../../shared/components/request';
import './App.css';
import { AppComponent } from './AppComponent';

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
          <AppComponent/>
      );
  }
}

export default App;
