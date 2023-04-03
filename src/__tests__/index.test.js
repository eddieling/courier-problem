// __tests__/index.test.js

import { fireEvent, render, screen } from '@testing-library/react';
import Home from '../pages/index';
import '@testing-library/jest-dom';
let app = require("../pages/index");

describe('Render components correctly', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: 'Coding Challenge Courier Service',
    })

    expect(heading).toBeInTheDocument()
    expect(screen.getByTestId("submit")).toBeInTheDocument();
  })

  it('renders Problem 1 text fields', () => {
    render(<Home />)
    expect(screen.getByTestId("delivery-cost-text-field")).toBeInTheDocument();
    expect(screen.getByTestId("packages-text-field")).toBeInTheDocument();
    expect(screen.getByTestId("deliver-info-text-field")).toBeInTheDocument();
  })

  it('renders Problem 1 submit button', () => {
    render(<Home />)
    expect(screen.getByTestId("submit")).toBeInTheDocument();
  })

  it('renders Problem 2 text fields', () => {
    render(<Home />)
    const radio2 = screen.getByTestId("radio-2");
    fireEvent.click(radio2);
    expect(screen.getByTestId("delivery-cost-text-field-2")).toBeInTheDocument();
    expect(screen.getByTestId("packages-text-field-2")).toBeInTheDocument();
    expect(screen.getByTestId("deliver-info-text-field-2")).toBeInTheDocument();
  })

  it('renders Problem 2 submit button', () => {
    render(<Home />)
    const radio2 = screen.getByTestId("radio-2");
    fireEvent.click(radio2);
    expect(screen.getByTestId("submit-2")).toBeInTheDocument();
  })
});

describe('Calculates output correctly', () => {
  it("Calculates Problem 1 delivery info correctly", () => {
    render(<Home />);
    const deliveryCost = screen.getByTestId("delivery-cost-text-field");
    const noOfPackages = screen.getByTestId("packages-text-field");
    const deliverInfo = screen.getByTestId("deliver-info-text-field");
    const resultArea = screen.getByTestId("result");
    const submitButton = screen.getByTestId("submit");
    fireEvent.change(deliveryCost, { target: { value: 100 } });
    fireEvent.change(noOfPackages, { target: { value: 3 } });
    fireEvent.change(deliverInfo, {
      target: {
        value:
          `PKG1 5 5 OFR001
  PKG2 15 5 OFR002
  PKG3 10 100 OFR003` }
    });
    fireEvent.click(submitButton);
    expect(resultArea).toHaveTextContent(`Output:PKG1 0 175PKG2 0 275PKG3 35 665`);
  });

  it("Calculates Problem 2 delivery info correctly", () => {
    render(<Home />);
    const radio2 = screen.getByTestId("radio-2");
    fireEvent.click(radio2);
    const deliveryCost = screen.getByTestId("delivery-cost-text-field-2");
    const noOfPackages = screen.getByTestId("packages-text-field-2");
    const deliverInfo = screen.getByTestId("deliver-info-text-field-2");
    const noOfVehicles = screen.getByTestId("no-of-vehicles-text-field-2");
    const maxSpeed = screen.getByTestId("max-speed-text-field-2");
    const maxWeight = screen.getByTestId("max-weight-text-field-2");
    const resultArea = screen.getByTestId("result-2");
    const submitButton = screen.getByTestId("submit-2");
    fireEvent.change(deliveryCost, { target: { value: 100 } });
    fireEvent.change(noOfPackages, { target: { value: 5 } });
    fireEvent.change(deliverInfo, {
      target: {
        value:
          `PKG1 50 30 OFR001
        PKG2 75 125 OFR008
        PKG3 175 100 OFR003
        PKG4 110 60 OFR002
        PKG5 155 95 NA` }
    });
    fireEvent.change(noOfVehicles, { target: { value: 2 } });
    fireEvent.change(maxSpeed, { target: { value: 70 } });
    fireEvent.change(maxWeight, { target: { value: 200 } });

    fireEvent.click(submitButton);
    expect(resultArea).toHaveTextContent(`Output:PKG1 0 750 3.98PKG2 0 1475 1.78PKG3 0 2350 1.42PKG4 105 1395 0.85PKG5 0 2125 4.19`);
  });
});


describe('Problem 1 Text fields should be invalid when user enters non-numeric value', () => {

  it("Delivery Cost text field should be invalid", () => {
    render(<Home />);
    const deliveryCost = screen.getByTestId("delivery-cost-text-field");
    fireEvent.change(deliveryCost, { target: { value: 'abc' } });
    expect(deliveryCost).toBeInvalid();
  });
  it("No of Packages text field should be invalid", () => {
    render(<Home />);
    const noOfPackages = screen.getByTestId("packages-text-field");
    fireEvent.change(noOfPackages, { target: { value: 'abc' } });
    expect(noOfPackages).toBeInvalid();
  });
});

describe('Problem 2 Text fields should be invalid when user enters non-numeric value', () => {


  it("Delivery Cost 2 text field should be invalid", () => {
    render(<Home />);
    const radio2 = screen.getByTestId("radio-2");
    fireEvent.click(radio2);
    const deliveryCost2 = screen.getByTestId("delivery-cost-text-field-2");
    fireEvent.change(deliveryCost2, { target: { value: 'abc' } });
    expect(deliveryCost2).toBeInvalid();
  });
  it("No of Packages 2 text field should be invalid", () => {
    render(<Home />);
    const radio2 = screen.getByTestId("radio-2");
    fireEvent.click(radio2);
    const noOfPackages2 = screen.getByTestId("packages-text-field-2");
    fireEvent.change(noOfPackages2, { target: { value: 'abc' } });
    expect(noOfPackages2).toBeInvalid();
  });
  it("No of Vehicles text field should be invalid", () => {
    render(<Home />);
    const radio2 = screen.getByTestId("radio-2");
    fireEvent.click(radio2);
    const noOfVehicles = screen.getByTestId("no-of-vehicles-text-field-2");
    fireEvent.change(noOfVehicles, { target: { value: 'abc' } });
    expect(noOfVehicles).toBeInvalid();
  });
  it("Max Speed  text field should be invalid", () => {
    render(<Home />);
    const radio2 = screen.getByTestId("radio-2");
    fireEvent.click(radio2);
    const maxSpeed = screen.getByTestId("max-speed-text-field-2");
    fireEvent.change(maxSpeed, { target: { value: 'abc' } });
    expect(maxSpeed).toBeInvalid();
  });
  it("Max Weight text field should be invalid", () => {
    render(<Home />);
    const radio2 = screen.getByTestId("radio-2");
    fireEvent.click(radio2);
    const maxWeight = screen.getByTestId("max-weight-text-field-2");
    fireEvent.change(maxWeight, { target: { value: 'abc' } });
    expect(maxWeight).toBeInvalid();
  });
});

