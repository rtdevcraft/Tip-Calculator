import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import App from './App';

describe('App', () => {
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
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('updates selected tip percentage when a button is clicked', () => {
      render(<App />);
      const tipButton = screen.getByText('15%');
      fireEvent.click(tipButton);
      expect(tipButton).toHaveClass('selected');

      const tipDisplay = screen.getByTestId('selected-tip');
      expect(tipDisplay).toHaveTextContent('15%');
    });
  });

  describe('Number of People Input', () => {
    it('updates number of people when input changes', () => {
      render(<App />);
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;
      fireEvent.change(peopleInput, { target: { value: '4' } });
      expect(peopleInput.value).toBe('4');
    });

    it('only allows numeric input for number of people', () => {
      render(<App />);
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;
      fireEvent.change(peopleInput, { target: { value: 'abc' } });
      expect(peopleInput.value).toBe('');
    });
  });

  describe('Tip Calculations', () => {
    it('calculates tip amount per person correctly', () => {
      render(<App />);
      const billInput = screen.getByLabelText('Bill') as HTMLInputElement;
      const tipButton = screen.getByText('15%');
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;

      fireEvent.change(billInput, { target: { value: '100' } });
      fireEvent.click(tipButton);
      fireEvent.change(peopleInput, { target: { value: '4' } });

      const tipAmountPerPerson = screen.getByText('$3.75');
      expect(tipAmountPerPerson).toBeInTheDocument();
    });

    it('calculates total amount per person correctly', () => {
      render(<App />);
      const billInput = screen.getByLabelText('Bill') as HTMLInputElement;
      const tipButton = screen.getByText('15%');
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;

      fireEvent.change(billInput, { target: { value: '100' } });
      fireEvent.click(tipButton);
      fireEvent.change(peopleInput, { target: { value: '4' } });

      const totalPerPerson = screen.getByText('$28.75');
      expect(totalPerPerson).toBeInTheDocument();
    });
  });

  describe('Custom Tip Input', () => {
    it('allows custom tip input', () => {
      render(<App />);
      const customTipInput = screen.getByPlaceholderText('Custom') as HTMLInputElement;
      fireEvent.change(customTipInput, { target: { value: '22' } });
      expect(customTipInput.value).toBe('22');
    });

    it('calculates tip correctly with custom tip', () => {
      render(<App />);
      const billInput = screen.getByLabelText('Bill') as HTMLInputElement;
      const customTipInput = screen.getByPlaceholderText('Custom') as HTMLInputElement;
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;

      fireEvent.change(billInput, { target: { value: '100' } });
      fireEvent.change(customTipInput, { target: { value: '22' } });
      fireEvent.change(peopleInput, { target: { value: '4' } });

      const tipAmountPerPerson = screen.getByText('$5.50');
      expect(tipAmountPerPerson).toBeInTheDocument();
    });
  });

  describe('Reset Functionality', () => {
    it('resets all inputs and calculations when reset button is clicked', () => {
      render(<App />);
      const billInput = screen.getByLabelText('Bill') as HTMLInputElement;
      const tipButton = screen.getByText('15%');
      const peopleInput = screen.getByLabelText('Number of People') as HTMLInputElement;
      const resetButton = screen.getByText('Reset');

      fireEvent.change(billInput, { target: { value: '100' } });
      fireEvent.click(tipButton);
      fireEvent.change(peopleInput, { target: { value: '4' } });
      fireEvent.click(resetButton);

      expect(billInput.value).toBe('');
      expect(peopleInput.value).toBe('');
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });
  });
});
