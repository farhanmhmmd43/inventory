import React from 'react';
import ReactDOM from 'react-dom';
import Harga from './Harga';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Harga />, div);
  ReactDOM.unmountComponentAtNode(div);
});
