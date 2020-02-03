import React from 'react';
import ReactDOM from 'react-dom';
import SukuCadang from './SukuCadang';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SukuCadang />, div);
  ReactDOM.unmountComponentAtNode(div);
});
