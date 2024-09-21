

import React, { useState } from 'react';
import Modal from 'react-modal'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

const DateRangePicker = ({ isOpen, onRequestClose, onSubmit }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = () => {
    if (startDate && endDate && startDate <= endDate) {
      onSubmit(startDate, endDate);
      setStartDate(null);
      setEndDate(null);
      onRequestClose(); 
    } else {
      alert('Please select a valid date range.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Select Date Range"
      className="date-range-modal"
      overlayClassName="date-range-overlay"
      ariaHideApp={false} 
    >
      <h2>Select Date Range</h2>
      <div className="date-picker-container">
        <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
          <label htmlFor="start-date">From:</label>
          <DatePicker
            id="start-date"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={new Date()}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select start date"
            className="range-picker"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
          <label htmlFor="end-date">To:</label>
          <DatePicker
            id="end-date"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={new Date()}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select end date"
            className="range-picker"
          />
        </div>
      </div>
      <div className="modal-buttons">
        <button
          onClick={handleSubmit}
          disabled={!startDate || !endDate}
          className="submit-button"
        >
          Submit
        </button>
        <button
          onClick={onRequestClose}
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DateRangePicker;
