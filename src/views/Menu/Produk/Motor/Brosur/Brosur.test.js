import React from 'react';
import ReactDOM from 'react-dom';
import Brosur from './Brosur';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Brosur />, div);
  ReactDOM.unmountComponentAtNode(div);
});
