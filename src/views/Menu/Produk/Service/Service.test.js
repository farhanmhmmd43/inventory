  import React from 'react';
import ReactDOM from 'react-dom';
import Service from './Service';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Service />, div);
  ReactDOM.unmountComponentAtNode(div);
});
