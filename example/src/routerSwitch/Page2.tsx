import { Button } from '@mui/material';
import * as React from 'react';
import { updateDynamicData } from '../../../src/helpers';

export default function Page2() {
  React.useEffect(() => {
    updateDynamicData({
      title: 'page2',
      aaa: 'bbb'
    });
  }, []);
  return (
    <div>
      <h1>hello, this is page2</h1>

      <Button id='domid' data-cardname="hello">hello</Button>
    </div>
  )
}