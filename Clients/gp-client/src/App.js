import React, { Component } from 'react';
import { register, send_alive } from '../../shared/actions/clientActions';
import { get_messages } from '../../shared/actions/chatActions';
import './App.css';
import { AppComponent } from './AppComponent';
import { setupApp } from '../../shared/utils/utils';


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

    setupApp();
  }

  render() {
      return (
          <AppComponent messages={ this.state.messages } />
      );
  }
}

export default App;
