import React from 'react';
import Main from './Main';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Main} />
        {
          // <Route path="/details" render={(props) => <Details {...props} />} />
        }
      </div>
    </Router>
  );
}

export default App;