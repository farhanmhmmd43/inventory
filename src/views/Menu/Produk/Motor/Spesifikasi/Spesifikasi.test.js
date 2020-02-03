import React from 'react';
import ReactDOM from 'react-dom';
import Spesifikasi from './Spesifikasi';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Spesifikasi />, div);
  ReactDOM.unmountComponentAtNode(div);
});
