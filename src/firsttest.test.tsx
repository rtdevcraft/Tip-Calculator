import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import App from './App';

describe('Tip Calculator', () => {
  it('renders the logo', () => {
    render(<App />);
    const logoElement = screen.getByAltText('Tip Splitter Logo');
    expect(logoElement).toBeInTheDocument();
  });

  describe('Bill Input', () => {
    it('updates bill amount when input changes', () => {
      render(<App />);
      const billInput = screen.getByLabelText('Bill') as HTMLInputElement;
      fireEvent.change(billInput, { target: { value: '100' } });
      expect(billInput.value).toBe('100');
    });

    it('only allows numeric input for bill amount', () => {
      render(<App />);
      const billInput = screen.getByLabelText('Bill') as HTMLInputElement;
      fireEvent.change(billInput, { target: { value: 'abc' } });
      expect(billInput.value).toBe('');
    });
  });

  describe('Tip Percentage Buttons', () => {
    it('renders all tip percentage buttons', () => {
      render(<App />);
      expect(screen.getByText('5%')).toBeInTheDocument();
      expect(screen.getByText('10%')).toBeInTheDocument();
      expect(screen.getByText('15%')).toBeInTheDocument();
      expect(screen.getByText('25%')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('updates selected tip percentage when a button is clicked', () => {
      render(<App />);
      const tipButton = screen.getByText('15%');
      fireEvent.click(tipButton);
      expect(tipButton).toHaveClass('selected');
    });
  });

  describe('Custom Tip Input', () => {
    it('allows custom tip input', () => {
      render(<App />);
      const customTipInput = screen.getByPlaceholderText('Custom') as HTMLInputElement;
      fireEvent.change(customTipInput, { target: { value: '22' } });
      expect(customTipInput.value).toBe('22');
    });

    it('clears custom tip when a percentage button is clicked', () => {
      render(<App />);
      const customTipInput = screen.getByPlaceholderText('Custom') as HTMLInputElement;
      fireEvent.change(customTipInput, { target: { value: '22' } });
      const tipButton = screen.getByText('15%');
      fireEvent.click(tipButton);
      expect(customTipInput.value).toBe('');
    });
  });

  describe('Number of People Input', () => {
    it('updates number of people when input changes', () => {
      render(<App />);
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;
      fireEvent.change(peopleInput, { target: { value: '4' } });
      expect(peopleInput.value).toBe('4');
    });

    it('shows error when number of people is zero', () => {
      render(<App />);
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;
      fireEvent.change(peopleInput, { target: { value: '0' } });
      expect(screen.getByText("Can't be zero")).toBeInTheDocument();
      expect(peopleInput.closest('.input-w-icon')).toHaveClass('error');
    });
  });

  describe('Reset Functionality', () => {
    it('resets all inputs and calculations when reset button is clicked', () => {
      render(<App />);
      const billInput = screen.getByLabelText('Bill') as HTMLInputElement;
      const tipButton = screen.getByText('15%');
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;
      const resetButton = screen.getByText('Reset');

      // Set initial values
      fireEvent.change(billInput, { target: { value: '100' } });
      fireEvent.click(tipButton);
      fireEvent.change(peopleInput, { target: { value: '2' } });

      // Perform reset
      fireEvent.click(resetButton);

      // Check inputs are reset
      expect(billInput.value).toBe('');
      expect(peopleInput.value).toBe('');

      // Check both amount displays are reset
      const amountElements = screen.getAllByText(/^\$0\.00$/, { selector: '.amount' });
      expect(amountElements).toHaveLength(2);
      amountElements.forEach((element) => {
        expect(element).toHaveTextContent('$0.00');
      });

      // Check that the tip button is no longer selected
      expect(tipButton).not.toHaveClass('selected');
    });
  });
});
