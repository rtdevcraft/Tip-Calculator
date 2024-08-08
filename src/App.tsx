import React, { useState, useEffect } from 'react';
import logo from './assets/images/logo.svg';
import dollarSign from './assets/images/icon-dollar.svg';
import personIcon from './assets/images/icon-person.svg';
import './App.css';

const App: React.FC = () => {
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState<string>('');
  const [numberOfPeople, setNumberOfPeople] = useState<string>('');
  const [tipPerPerson, setTipPerPerson] = useState<number>(0);
  const [totalPerPerson, setTotalPerPerson] = useState<number>(0);
  const [isZeroPeople, setIsZeroPeople] = useState<boolean>(false);

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d*)?$/.test(value)) {
      setBillAmount(value);
    }
  };

  const handleTipSelect = (percentage: number | null) => {
    setTipPercentage(percentage);
    setCustomTip('');
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d*)?$/.test(value)) {
      setCustomTip(value);
      setTipPercentage(parseFloat(value) || null);
    }
  };

  const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setNumberOfPeople('');
      setIsZeroPeople(false);
    } else if (value === '0') {
      setNumberOfPeople('0');
      setIsZeroPeople(true);
    } else if (/^[1-9]\d*$/.test(value)) {
      setNumberOfPeople(value);
      setIsZeroPeople(false);
    }
  };

  const handleReset = () => {
    setBillAmount('');
    setTipPercentage(null);
    setNumberOfPeople('');
    setTipPerPerson(0);
    setTotalPerPerson(0);
    setIsZeroPeople(false);
  };

  useEffect(() => {
    if (billAmount && tipPercentage !== null && numberOfPeople && parseInt(numberOfPeople) > 0) {
      const bill = parseFloat(billAmount);
      const tip = tipPercentage;
      const people = parseInt(numberOfPeople);

      const tipAmount = (bill * tip) / 100;
      const totalAmount = bill + tipAmount;

      setTipPerPerson(tipAmount / people);
      setTotalPerPerson(totalAmount / people);
    } else {
      setTipPerPerson(0);
      setTotalPerPerson(0);
    }
  }, [billAmount, tipPercentage, numberOfPeople]);

  const displayAmount = (amount: number): string => {
    return amount.toFixed(2);
  };

  return (
    <div className="app-wrapper">
      <header>
        <h1 className="visually-hidden">Tip Splitter</h1>
        <img src={logo} alt="Tip Splitter Logo" />
      </header>
      <main>
        <form className="inputs-container" onSubmit={(e) => e.preventDefault()}>
          <div className="input-wrapper">
            <label htmlFor="bill-input" className="input-label">
              Bill
            </label>
            <div className="input-w-icon">
              <input
                id="bill-input"
                type="number"
                inputMode="decimal"
                value={billAmount}
                onChange={handleBillChange}
                placeholder="0"
                aria-describedby="bill-description"
                step="0.01"
                min="0"
              />
              <img src={dollarSign} alt="" className="input-icon" aria-hidden="true" />
            </div>
            <p id="bill-description" className="visually-hidden">
              Enter the total bill amount
            </p>
          </div>

          <fieldset className="tip-section">
            <legend id="tip-label" className="input-label">
              Select Tip %
            </legend>
            <div className="tip-buttons-container" role="group" aria-labelledby="tip-label">
              {[5, 10, 15, 25, 50].map((percentage) => (
                <button
                  key={percentage}
                  type="button"
                  onClick={() => handleTipSelect(percentage)}
                  className={tipPercentage === percentage ? 'selected' : ''}
                  aria-pressed={tipPercentage === percentage}
                >
                  {percentage}%
                </button>
              ))}
              <input
                type="number"
                inputMode="decimal"
                value={customTip}
                onChange={handleCustomTipChange}
                placeholder="Custom"
                className={`custom-tip-input ${customTip ? 'active' : ''}`}
                aria-label="Custom tip percentage"
                step="0.1"
                min="0"
              />
            </div>
          </fieldset>

          <div className="input-wrapper">
            <label htmlFor="people-input" className="input-label">
              Number of People
            </label>
            <div className={`input-w-icon ${isZeroPeople ? 'error' : ''}`}>
              <input
                id="people-input"
                type="number"
                inputMode="numeric"
                value={numberOfPeople}
                onChange={handlePeopleChange}
                placeholder="1"
                aria-invalid={isZeroPeople}
                aria-describedby={isZeroPeople ? 'people-error' : 'people-description'}
                min="1"
              />
              <img src={personIcon} alt="" className="input-icon" aria-hidden="true" />
            </div>
            {isZeroPeople && (
              <p id="people-error" className="error-message">
                Can't be zero
              </p>
            )}
            <p id="people-description" className="visually-hidden">
              Enter the number of people splitting the bill
            </p>
          </div>
        </form>

        <div className="outputs-container" aria-live="polite">
          <div className="outputs">
            <div className="output">
              <h2>
                Tip Amount <span className="per-person">/ person</span>
              </h2>
              <p className="amount" data-testid="tip-amount">
                ${displayAmount(tipPerPerson)}
              </p>
            </div>
            <div className="output">
              <h2>
                Total <span className="per-person">/ person</span>
              </h2>
              <p className="amount" data-testid="total-amount">
                ${displayAmount(totalPerPerson)}
              </p>
            </div>
          </div>
          <div className="reset-button">
            <button className="reset" onClick={handleReset} type="button">
              Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
