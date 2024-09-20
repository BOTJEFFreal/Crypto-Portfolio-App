import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

Modal.setAppElement('#root');

const DateRangePicker = ({ isOpen, onRequestClose, onSubmit }) => {
  const [dateRange, setDateRange] = useState([null, null]); 
  const [startDate, endDate] = dateRange;

  const handleChange = (update) => {
    setDateRange(update); // Update the date range
  };

  const handleSubmit = () => {
    if (startDate && endDate) {
      onSubmit(startDate, endDate); // Submit the selected date range
      onRequestClose(); // Close the modal
    } else {
      alert('Please select both start and end dates.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Select Date Range"
      className="date-range-modal"
      overlayClassName="date-range-overlay"
    >
      <h2>Select Custom Date Range</h2>
      <div className="date-picker-container">
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={handleChange}
          maxDate={new Date()}
          isClearable={true}
          placeholderText="Select a date range"
          className="range-picker"
        />
      </div>
      <div className="modal-buttons">
        <button onClick={handleSubmit} className="submit-button">
          Submit
        </button>
        <button onClick={onRequestClose} className="cancel-button">
          Cancel
        </button>
      </div>
    </Modal>
  );
};

DateRangePicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DateRangePicker;
