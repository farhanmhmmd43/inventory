import React from 'react';
import ReactDOM from 'react-dom';
import ChatHistory from './ChatHistory';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ChatHistory />, div);
  ReactDOM.unmountComponentAtNode(div);
});
