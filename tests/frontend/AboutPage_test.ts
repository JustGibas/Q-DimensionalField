import { render, screen } from '@testing-library/react';
import AboutPage from '../../src/pages/AboutPage';

describe('AboutPage', () => {
  test('renders about us heading', () => {
    render(<AboutPage />);
    const heading = screen.getByText(/About Us/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders about page description', () => {
    render(<AboutPage />);
    const description = screen.getByText(/This is the about page of the application/i);
    expect(description).toBeInTheDocument();
  });
});
