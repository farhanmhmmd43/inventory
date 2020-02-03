import React from 'react';
import ReactDOM from 'react-dom';
import Ahass from './Ahass';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Ahass />, div);
  ReactDOM.unmountComponentAtNode(div);
});
