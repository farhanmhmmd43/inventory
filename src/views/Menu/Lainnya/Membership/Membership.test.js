import React from 'react';
import ReactDOM from 'react-dom';
import Motor from './Membership';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Membership />, div);
  ReactDOM.unmountComponentAtNode(div);
});
