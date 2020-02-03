import React from 'react';
import ReactDOM from 'react-dom';
import SolutionCenter from './SolutionCenter';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SolutionCenter />, div);
  ReactDOM.unmountComponentAtNode(div);
});
