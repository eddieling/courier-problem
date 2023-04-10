import React, { useState, useEffect } from "react";
import styles from '../../styles/Home.module.css'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
    getDeliveryCost,
    validateInput,
    validateDeliveryInfo
  } from '../../utils/utils';

const Problem1 = () => {
    const [baseDeliveryCost, setBaseDeliveryCost] = useState('');
    const [noOfPackages, setNoOfPackages] = useState('');
    const [userInputTextArea, setUserInputTextArea] = useState('');
    const [deliveryCostObject, setDeliveryCostObject] = useState(null);
    const [isError, setIsError] = useState(false);

    const handleSubmitProblem1 = () => {
        if (baseDeliveryCost === '' || noOfPackages === '' || userInputTextArea === '') {
            setIsError(true)
            return;
        } else {
            setIsError(false)
        }
        let inputArray = userInputTextArea.split(/\s+/);
        let deliveryObj = [];
        deliveryObj = getDeliveryCost(inputArray, noOfPackages, baseDeliveryCost, deliveryObj);
        setDeliveryCostObject(deliveryObj)
    }

    const results = () => {
        return (
          deliveryCostObject && (
            <div className={styles.output} >
              <p style={{ marginBottom: '5px' }}>Output:</p>
              {deliveryCostObject.map((obj, index) => (
                <div key={index}>
                  {obj.pkgId} {obj.totalDiscount} {obj.totalCost}
                </div>
              ))}
            </div>
          )
        )
      };

    return (
        <div>
            <p className={styles.heading}>Problem 01</p>
            <div className={styles.inputField}>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="deliver-cost"
                        label="Delivery Cost"
                        placeholder="Enter a number"
                        value={baseDeliveryCost}
                        onChange={(e) => setBaseDeliveryCost(e.target.value)}
                        error={validateInput(baseDeliveryCost)}
                        helperText={validateInput(baseDeliveryCost) ? "Enter positive number only" : ""}
                        inputProps={{ "data-testid": "delivery-cost-text-field" }}
                    />
                    <TextField
                        id="no-of-packages"
                        label="No of Packages"
                        placeholder="Enter a number"
                        value={noOfPackages}
                        onChange={(e) => setNoOfPackages(e.target.value)}
                        error={validateInput(noOfPackages)}
                        helperText={validateInput(noOfPackages) ? "Enter positive number only" : ""}
                        inputProps={{ "data-testid": "packages-text-field" }}
                    />
                </Box>
            </div>
            <div style={{ display: 'flex' }}>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '52ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="outlined-multiline-static"
                        label="Delivery info"
                        value={userInputTextArea}
                        onChange={(e) => setUserInputTextArea(e.target.value)}
                        multiline
                        rows={8}
                        error={validateDeliveryInfo(userInputTextArea, noOfPackages)}
                        placeholder="Enter package info..."
                        helperText={validateDeliveryInfo(userInputTextArea, noOfPackages) ? "Invalid format" : ""}
                        inputProps={{ "data-testid": "deliver-info-text-field" }}
                    />
                </Box>

                <div style={{ whiteSpace: "pre-line", marginLeft: 10, marginTop: 10 }}>
                    {' Sample input: \nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003'}
                </div>
            </div>
            <div className={styles.submitButton}>
                <Button style={{ width: 320 }} variant="contained" onClick={handleSubmitProblem1} data-testid="submit">Submit</Button>
                {isError && (
                    <p style={{ color: 'red' }} data-testid='error-message'>Please fill up all fields</p>
                )}
            </div>


            <div data-testid="result">
                {results()}
            </div>
        </div>
    )
}

export default Problem1;