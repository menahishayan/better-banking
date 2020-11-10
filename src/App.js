import React from 'react';
import Main from './Main';
import Login from './Login';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Login} />
        <Route path="/home" render={(props) => <Main {...props} />} />
      </div>
    </Router>
  );
}

export default App;