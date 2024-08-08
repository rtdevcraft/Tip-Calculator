import React, { useState, useEffect, useRef } from 'react';
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

  const billInputRef = useRef<HTMLInputElement>(null);
  const customTipInputRef = useRef<HTMLInputElement>(null);
  const peopleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supportsInputMode = 'inputMode' in document.createElement('input');

    if (supportsInputMode) {
      if (billInputRef.current) {
        billInputRef.current.inputMode = 'decimal';
      }
      if (customTipInputRef.current) {
        customTipInputRef.current.inputMode = 'decimal';
      }
      if (peopleInputRef.current) {
        peopleInputRef.current.inputMode = 'numeric';
      }
    } else {
      // Fallback for browsers that don't support inputMode
      if (billInputRef.current) {
        billInputRef.current.setAttribute('pattern', '[0-9]*');
        billInputRef.current.setAttribute('type', 'text');
      }
      if (customTipInputRef.current) {
        customTipInputRef.current.setAttribute('pattern', '[0-9]*');
        customTipInputRef.current.setAttribute('type', 'text');
      }
      if (peopleInputRef.current) {
        peopleInputRef.current.setAttribute('pattern', '[0-9]*');
        peopleInputRef.current.setAttribute('type', 'text');
      }
    }
  }, []);

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBillAmount(value);
    }
  };

  const handleTipSelect = (percentage: number | null) => {
    setTipPercentage(percentage);
    setCustomTip('');
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomTip(value);
      setTipPercentage(parseFloat(value) || null);
    }
  };

  const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setNumberOfPeople(value);
      setIsZeroPeople(value === '0');
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
    const bill = parseFloat(billAmount) || 0;
    const tip = tipPercentage || 0;
    const people = parseInt(numberOfPeople) || 1;

    if (bill > 0 && people > 0) {
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
                ref={billInputRef}
                id="bill-input"
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                value={billAmount}
                onChange={handleBillChange}
                placeholder="0"
                aria-describedby="bill-description"
              />
              <img src={dollarSign} alt="" className="input-icon" aria-hidden="true" />
            </div>
            <p id="bill-description" className="visually-hidden">
              Enter the total bill amount
            </p>
          </div>

          <div className="tip-section">
            <p className="input-label">Select Tip %</p>
            <div className="tip-buttons-container">
              {[5, 10, 15, 25, 50].map((percentage) => (
                <button
                  key={percentage}
                  type="button"
                  onClick={() => handleTipSelect(percentage)}
                  className={tipPercentage === percentage ? 'selected' : ''}
                >
                  {percentage}%
                </button>
              ))}
              <input
                ref={customTipInputRef}
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                value={customTip}
                onChange={handleCustomTipChange}
                placeholder="Custom"
                className={`custom-tip-input ${customTip ? 'active' : ''}`}
                aria-label="Custom tip percentage"
              />
            </div>
          </div>

          <div className="input-wrapper">
            <label htmlFor="people-input" className="input-label">
              Number of People
            </label>
            <div className={`input-w-icon ${isZeroPeople ? 'error' : ''}`}>
              <input
                ref={peopleInputRef}
                id="people-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={numberOfPeople}
                onChange={handlePeopleChange}
                placeholder="1"
                aria-invalid={isZeroPeople}
                aria-describedby={isZeroPeople ? 'people-error' : 'people-description'}
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
