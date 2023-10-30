import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const reportOptions = [
  { label: "Short (100 words)", value: "short", tokens: "1 Token" },
  { label: "Standard (200 words)", value: "standard", tokens: "2 Tokens" },
  { label: "Super (500 words)", value: "super", tokens: "4 Tokens" },
];

const IntelliReportLengthDropdown = ({ handleSelectedLength }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(reportOptions[0]); // Set Short as default

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleSelection = (option) => {
    console.log("handleSelection intellireportlenghtdropdown");
    setSelectedOption(option);
    console.log("handleSelectedLength");
    console.log(handleSelectedLength);
    handleSelectedLength(option.value);
  };

  return (
    <>
      <Dropdown
        style={{ width: "108px" }}
        isOpen={dropdownOpen}
        toggle={toggle}
      >
        <DropdownToggle caret>
          <span style={{ fontSize: "0.75em" }}>{selectedOption.label}</span>
        </DropdownToggle>
        <DropdownMenu>
          {reportOptions.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={() => handleSelection(option)}
            >
              <span style={{ fontSize: "0.75em" }}>
                <i className="bi bi-coin" /> {option.label} ({option.tokens})
              </span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default IntelliReportLengthDropdown;
