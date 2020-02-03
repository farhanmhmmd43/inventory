import React from 'react';
import ReactDOM from 'react-dom';
import Motor from './Komunitas';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Komunitas />, div);
  ReactDOM.unmountComponentAtNode(div);
});
