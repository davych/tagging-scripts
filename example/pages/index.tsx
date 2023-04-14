
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from '@mui/material';
import '../../src';
const App = () => {

  return (
    <div>
      <Button id="domid">hello</Button>
    </div>
  )
};



ReactDOM.render(<App />, document.getElementById('root'));
