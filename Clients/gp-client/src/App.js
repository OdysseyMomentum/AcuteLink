import React, { Component } from 'react';
import './App.css';
import { AppComponent } from './AppComponent';
import { setupApp } from '../../shared/utils/utils';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	messages: null,
    }
    
    setupApp('210f24c9cb5d49478cfc265def05626f');
  }

  render() {
      return (
          <AppComponent messages={ this.state.messages } />
      );
  }
}

export default App;
