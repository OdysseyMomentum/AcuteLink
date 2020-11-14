import React, { Component } from 'react';
import './App.css';
import { AppComponent } from './AppComponent';
import { setupApp } from '../../shared/utils/utils';

class App extends Component {
  
  constructor(props) {
    super(props);
    setupApp('a433296a52e4456aa5eae80d69dba8fe');
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
