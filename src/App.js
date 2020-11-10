import React from 'react';
import Dashboard from './Dashboard';
import Login from './Login';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Login} />
        <Route path="/dashboard" render={(props) => <Dashboard {...props} />} />
      </div>
    </Router>
  );
}

export default App;