import React from 'react';
import ReactDOM from 'react-dom';
import SharedComponent from './src/SharedComponent';

const App = () => (
  <div>
    <SharedComponent />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
