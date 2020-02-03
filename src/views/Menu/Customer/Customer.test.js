import React from 'react';
import ReactDOM from 'react-dom';
import Customer from './Customer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Customer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
