import React from 'react';
import ReactDOM from 'react-dom';
import Teknologi from './Teknologi';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Teknologi />, div);
  ReactDOM.unmountComponentAtNode(div);
});
