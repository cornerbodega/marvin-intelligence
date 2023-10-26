import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const reportOptions = [
  { label: "Short (200 words)", value: 1, tokens: "1 Token" },
  { label: "Standard (400 words)", value: 2, tokens: "2 Tokens" },
  { label: "Super (800 words)", value: 4, tokens: "4 Tokens" },
];

const IntelliReportLengthDropdown = ({ handleSelectedLength }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(reportOptions[0]); // Set Short as default

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleSelection = (option) => {
    setSelectedOption(option);
    handleSelectedLength(option.value);
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>{selectedOption.label}</DropdownToggle>
      <DropdownMenu>
        {reportOptions.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => handleSelection(option)}
          >
            <i className="bi bi-coin" /> {option.label} ({option.tokens})
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default IntelliReportLengthDropdown;
