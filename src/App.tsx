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
    const bill = parseFloat(billAmount) || 0;
    const tip = tipPercentage || 0;
    const people = parseInt(numberOfPeople) || 1;

    const tipAmount = (bill * tip) / 100;
    const totalAmount = bill + tipAmount;

    setTipPerPerson(tipAmount / people);
    setTotalPerPerson(totalAmount / people);
  }, [billAmount, tipPercentage, numberOfPeople]);

  const displayAmount = (amount: number): string => {
    return isZeroPeople || numberOfPeople === '' ? '0.00' : amount.toFixed(2);
  };

  return (
    <div className="app-wrapper">
      <header>
        <h1 className="visually-hidden">Tip Splitter</h1>
        <img src={logo} alt="Tip Splitter Logo" />
      </header>
      <main>
        <div className="inputs-container">
          <div className="input-wrapper">
            <label htmlFor="bill-input">
              <h2>Bill</h2>
            </label>
            <div className="input-w-icon">
              <input
                id="bill-input"
                type="text"
                value={billAmount}
                onChange={handleBillChange}
                placeholder="0"
              />
              <img src={dollarSign} alt="" className="input-icon" aria-hidden="true" />
            </div>
          </div>

          <div className="tip-section">
            <h2 id="tip-label">Select Tip %</h2>
            <div className="tip-buttons-container" role="group" aria-labelledby="tip-label">
              {[5, 10, 15, 25, 50].map((percentage) => (
                <button
                  key={percentage}
                  onClick={() => handleTipSelect(percentage)}
                  className={tipPercentage === percentage ? 'selected' : ''}
                  aria-pressed={tipPercentage === percentage}
                >
                  {percentage}%
                </button>
              ))}
              <input
                type="text"
                value={customTip}
                onChange={handleCustomTipChange}
                placeholder="Custom"
                className={`custom-tip-input ${customTip ? 'active' : ''}`}
                aria-label="Custom tip percentage"
              />
            </div>
          </div>
          <div className="input-wrapper">
            <div className="label-wrapper">
              <label htmlFor="people-input">
                <h2>Number of People</h2>
              </label>
              {isZeroPeople && (
                <span className="error-message" id="people-error">
                  Can't be zero
                </span>
              )}
            </div>
            <div className={`input-w-icon ${isZeroPeople ? 'error' : ''}`}>
              <input
                id="people-input"
                type="text"
                value={numberOfPeople}
                onChange={handlePeopleChange}
                placeholder="1"
                aria-invalid={isZeroPeople}
                aria-describedby={isZeroPeople ? 'people-error' : undefined}
              />
              <img src={personIcon} alt="" className="input-icon" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="outputs-container">
          <div className="output">
            <h2>
              Tip Amount <span className="per-person">/ person</span>
            </h2>
            <p className="amount">${displayAmount(tipPerPerson)}</p>
          </div>
          <div className="output">
            <h2>
              Total <span className="per-person">/ person</span>
            </h2>
            <p className="amount">${displayAmount(totalPerPerson)}</p>
          </div>
          <button className="reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
