import { render, screen } from '@testing-library/react';
import HomePage from '../../src/pages/HomePage';

describe('HomePage', () => {
  test('renders welcome message', () => {
    render(<HomePage />);
    const welcomeMessage = screen.getByText(/Welcome to the Home Page/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('renders home page description', () => {
    render(<HomePage />);
    const description = screen.getByText(/This is the home page of the application/i);
    expect(description).toBeInTheDocument();
  });
});
