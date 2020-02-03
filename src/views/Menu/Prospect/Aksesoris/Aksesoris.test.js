import React from 'react';
import ReactDOM from 'react-dom';
import Aksesoris from './Aksesoris';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Aksesoris />, div);
  ReactDOM.unmountComponentAtNode(div);
});
