import React from 'react';
import ReactDOM from 'react-dom';
import Dealer from './Dealer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Dealer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
