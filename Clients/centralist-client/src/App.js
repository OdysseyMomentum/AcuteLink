import React, { Component } from 'react';
import { register, send_alive } from '../../shared/actions/clientActions';
import { get_messages } from '../../shared/actions/chatActions';
import { RequestList } from '../../shared/components/request';
import './App.css';
import { AppComponent } from './AppComponent';
import { setupApp } from '../../shared/utils/utils';

const ALIVE_INTERVAL = 60000; // 1 minute
const MESSAGE_INTERVAL = 1000; // 1 second  

class App extends Component {
  
  constructor(props) {
    super(props);
    setupApp('a433296a52e4456aa5eae80d69dba8fe');
    
    this.client_name = 'CENTRALIST';
    this.state = {
    	messages: null,
    }
  }

  render() {
      return (
          <AppComponent messages={ this.state.messages } />
      );
  }
}

export default App;
