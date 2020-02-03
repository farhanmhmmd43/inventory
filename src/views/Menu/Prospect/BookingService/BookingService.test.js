import React from 'react';
import ReactDOM from 'react-dom';
import BookingService from './BookingService';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BookingService />, div);
  ReactDOM.unmountComponentAtNode(div);
});
