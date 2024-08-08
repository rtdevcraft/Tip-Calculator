import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import App from './App';

describe('Tip Calculator', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders the logo', () => {
    const logoElement = screen.getByAltText('Tip Splitter Logo');
    expect(logoElement).toBeInTheDocument();
  });

  describe('Bill Input', () => {
    it('updates bill amount when input changes', () => {
      const billInput = screen.getByLabelText('Bill') as HTMLInputElement;
      fireEvent.change(billInput, { target: { value: '100.50' } });
      expect(billInput.value).toBe('100.50');
    });

    it('only allows numeric input with one decimal point for bill amount', () => {
      const billInput = screen.getByLabelText('Bill') as HTMLInputElement;
      fireEvent.change(billInput, { target: { value: 'abc' } });
      expect(billInput.value).toBe('');
      fireEvent.change(billInput, { target: { value: '100.50' } });
      expect(billInput.value).toBe('100.50');
      fireEvent.change(billInput, { target: { value: '100.50.25' } });
      expect(billInput.value).toBe('100.50');
    });
  });

  describe('Tip Percentage Buttons', () => {
    it('renders all tip percentage buttons', () => {
      [5, 10, 15, 25, 50].forEach((percentage) => {
        expect(screen.getByText(`${percentage}%`)).toBeInTheDocument();
      });
    });

    it('updates selected tip percentage when a button is clicked', () => {
      const tipButton = screen.getByText('15%');
      fireEvent.click(tipButton);
      expect(tipButton).toHaveClass('selected');
    });
  });

  describe('Custom Tip Input', () => {
    it('allows custom tip input', () => {
      const customTipInput = screen.getByPlaceholderText('Custom') as HTMLInputElement;
      fireEvent.change(customTipInput, { target: { value: '22.5' } });
      expect(customTipInput.value).toBe('22.5');
    });

    it('clears custom tip when a percentage button is clicked', () => {
      const customTipInput = screen.getByPlaceholderText('Custom') as HTMLInputElement;
      fireEvent.change(customTipInput, { target: { value: '22' } });
      const tipButton = screen.getByText('15%');
      fireEvent.click(tipButton);
      expect(customTipInput.value).toBe('');
    });
  });

  describe('Number of People Input', () => {
    it('updates number of people when input changes', () => {
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;
      fireEvent.change(peopleInput, { target: { value: '4' } });
      expect(peopleInput.value).toBe('4');
    });

    it('shows error when number of people is zero', () => {
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;
      fireEvent.change(peopleInput, { target: { value: '0' } });
      expect(screen.getByText("Can't be zero")).toBeInTheDocument();
      expect(peopleInput.closest('.input-w-icon')).toHaveClass('error');
    });

    it('only allows integer input for number of people', () => {
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;
      fireEvent.change(peopleInput, { target: { value: '4.5' } });
      expect(peopleInput.value).toBe('');
    });
  });

  describe('Reset Functionality', () => {
    it('resets all inputs and calculations when reset button is clicked', () => {
      const billInput = screen.getByLabelText('Bill') as HTMLInputElement;
      const tipButton = screen.getByText('15%');
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;
      const resetButton = screen.getByText('Reset');

      fireEvent.change(billInput, { target: { value: '100' } });
      fireEvent.click(tipButton);
      fireEvent.change(peopleInput, { target: { value: '2' } });
      fireEvent.click(resetButton);

      expect(billInput.value).toBe('');
      expect(peopleInput.value).toBe('');

      const tipAmount = screen.getByTestId('tip-amount');
      const totalAmount = screen.getByTestId('total-amount');

      expect(tipAmount).toHaveTextContent('$0.00');
      expect(totalAmount).toHaveTextContent('$0.00');

      expect(tipButton).not.toHaveClass('selected');
    });
  });
});
