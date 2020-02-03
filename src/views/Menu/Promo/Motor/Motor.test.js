import React from 'react';
import ReactDOM from 'react-dom';
import Motor from './Motor';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Motor />, div);
  ReactDOM.unmountComponentAtNode(div);
});
