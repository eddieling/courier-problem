import React, { useState, useEffect } from "react";
import styles from '../../styles/Home.module.css'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
    getDeliveryCost,
    validateInput,
    validateDeliveryInfo,
    getTotalDeliveryTime,
    getPackageDeliveryTime
} from '../../utils/utils';

const Problem2 = () => {
    const [baseDeliveryCost2, setBaseDeliveryCost2] = useState('');
    const [noOfPackages2, setNoOfPackages2] = useState('');
    const [userInputTextArea2, setUserInputTextArea2] = useState('');
    const [deliveryCostObject2, setDeliveryCostObject2] = useState(null);
    const [noOfVehicles, setNoOfVehicles] = useState('');
    const [maxSpeed, setMaxSpeed] = useState('');
    const [maxWeight, setMaxWeight] = useState('');
    const [isError, setIsError] = useState(false);


    // will return unique combinations of packages
    const powerSet = function (arr) {
        // the power set of [] is [[]]
        if (arr.length === 0) {
            return [[]];
        }

        // remove and remember the last element of the array
        let lastElement = arr.pop();

        // take the powerset of the rest of the array
        let restPowerset = powerSet(arr);

        // for each set in the power set of arr minus its last element,
        // include that set in the powerset of arr both with and without
        // the last element of arr
        let powerset = [];
        for (let i = 0; i < restPowerset.length; i++) {
            let set = restPowerset[i];

            // without last element
            powerset.push(set);

            // with last element
            set = set.slice(); // create a new array that's a copy of set
            set.push(lastElement);
            powerset.push(set);
        }
        return powerset;
    };

    // will return all combinations of packages that will have total weight less than the given value
    const subsetsLessThan = function (arr, number) {

        // all subsets of arr
        let powerset = powerSet(arr);

        // subsets summing less than or equal to number
        let subsets = [];
        for (let i = 0; i < powerset.length; i++) {
            let subset = powerset[i];
            let sum = 0;
            let maxDeliveryDistance = 0;
            for (let j = 0; j < subset.length; j++) {
                sum += subset[j].packageWeight;
                if (subset[j].deliveryDistance > maxDeliveryDistance) {
                    maxDeliveryDistance = subset[j].deliveryDistance
                }
            }
            if (sum <= number) {
                subset.totalWeight = sum;
                subset.deliveryDistance = maxDeliveryDistance;
                subsets.push(subset);
            }
        }
        return subsets;
    };


    // will return all eligible combinations of packages
    const getDeliverySubsets = (deliveryObj) => {
        let deliverySubsets = subsetsLessThan(deliveryObj, maxWeight)

        //sort by total weight
        let sortedDeliverySubsetByWeight = deliverySubsets.sort((a, b) => b.totalWeight - a.totalWeight);
        
        //sort by num of packages
        let sortedDeliverySubsetByNoOfPackages = sortedDeliverySubsetByWeight.sort((a, b) => b.length - a.length);
        sortedDeliverySubsetByNoOfPackages.forEach(subset => {
            getTotalDeliveryTime(subset, maxSpeed)
        })
        return sortedDeliverySubsetByNoOfPackages;
    };

    const handleSubmitProblem2 = () => {
        if (baseDeliveryCost2 === '' 
        || noOfPackages2 === '' 
        || userInputTextArea2 === ''
        || noOfVehicles === ''
        || maxSpeed === ''
        || maxWeight === ''
         ) {
            setIsError(true)
            return;
        } else {
            setIsError(false)
        }
        let inputArray = userInputTextArea2.split(/\s+/);
        let remainingDeliveries = [];
        remainingDeliveries = getDeliveryCost(inputArray, noOfPackages2, baseDeliveryCost2, remainingDeliveries);

        for (let i = 0; i < noOfPackages2; i++) {
            let pkgId = inputArray[i * 4];
            remainingDeliveries.find(del => {
                if (del.pkgId === pkgId) {
                    del.packageWeight = parseInt(inputArray[i * 4 + 1]);
                    del.deliveryDistance = parseInt(inputArray[i * 4 + 2]);
                }
            });
        }

        let deliveryObj = JSON.parse(JSON.stringify(remainingDeliveries));
        let newDeliverySubsetObj;
        let finalDelivery = [];
        let availableVehicle = noOfVehicles;
        let currentTime = 0;
        let currentVehicleTime = Array(parseInt(noOfVehicles)).fill(0); // set start time for all vehicles at 0
        while (remainingDeliveries.length > 0) {
            deliveryObj = JSON.parse(JSON.stringify(remainingDeliveries));

            if (!availableVehicle) {
                currentTime = currentTime;
            }
            newDeliverySubsetObj = getDeliverySubsets(deliveryObj)

            let lowestValueIndex = currentVehicleTime.indexOf(Math.min(...currentVehicleTime));
            currentTime = currentVehicleTime[lowestValueIndex];
            currentVehicleTime[lowestValueIndex] += newDeliverySubsetObj[0].deliveryTime;

            if (newDeliverySubsetObj.length > 0) {

                newDeliverySubsetObj[0].forEach(obj => {
                    if (obj.pkgId) {
                        let found = remainingDeliveries.findIndex(obj2 => obj2.pkgId === obj.pkgId)
                        if (found > -1) {
                            remainingDeliveries[found].deliveryTime = getPackageDeliveryTime(remainingDeliveries[found], currentTime, maxSpeed).toFixed(2);
                            finalDelivery.push(remainingDeliveries[found])
                            remainingDeliveries.splice(found, 1)
                        }
                    }
                })
                availableVehicle -= 1;
            }
        }
        // sort package by id
        finalDelivery.sort((a, b) => (a.pkgId > b.pkgId) ? 1 : ((b.pkgId > a.pkgId) ? -1 : 0))
        setDeliveryCostObject2(finalDelivery)
    }

    const results = () => {
        return (
          deliveryCostObject2 && (
            <div className={styles.output} >
              <p style={{ marginBottom: '5px', marginTop: 0, marginLeft: 8 }}>Output:</p>
              {deliveryCostObject2.map((obj, index) => (
                <div key={index} style={{ marginLeft: 8 }}>
                  {obj.pkgId} {obj.totalDiscount} {obj.totalCost} {obj.deliveryTime}
                </div>
              ))}
            </div>
          )
        )
      };

    return (
        < div >
              <p className={styles.heading}>Problem 02</p>
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
                    value={baseDeliveryCost2}
                    onChange={(e) => setBaseDeliveryCost2(e.target.value)}
                    error={validateInput(baseDeliveryCost2)}
                    helperText={validateInput(baseDeliveryCost2) ? "Enter positive number only" : ""}
                    inputProps={{ "data-testid": "delivery-cost-text-field-2" }}
                  />
                  <TextField
                    id="no-of-packages"
                    label="No of Packages"
                    placeholder="Enter a number"
                    value={noOfPackages2}
                    onChange={(e) => setNoOfPackages2(e.target.value)}
                    error={validateInput(noOfPackages2)}
                    helperText={validateInput(noOfPackages2) ? "Enter positive number only" : ""}
                    inputProps={{ "data-testid": "packages-text-field-2" }}
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
                    value={userInputTextArea2}
                    onChange={(e) => setUserInputTextArea2(e.target.value)}
                    multiline
                    rows={8}
                    error={validateDeliveryInfo(userInputTextArea2, noOfPackages2)}
                    placeholder="Enter package info..."
                    helperText={validateDeliveryInfo(userInputTextArea2, noOfPackages2) ? "Invalid format" : ""}
                    inputProps={{ "data-testid": "deliver-info-text-field-2" }}
                  />
                </Box>
                <div style={{ whiteSpace: "pre-line", marginLeft: 10, marginTop: 10 }}>
                  {' Sample input: \nPKG1 50 30 OFR001\nPKG2 75 125 OFR002\nPKG3 175 100 OFR003\nPKG4 110 60 OFR002\nPKG5 155 95 NA'}
                </div>
              </div>

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
                    id="no-of-vehicles"
                    label="No of Vehicles"
                    placeholder="Enter a number"
                    value={noOfVehicles}
                    onChange={(e) => setNoOfVehicles(e.target.value)}
                    error={validateInput(noOfVehicles)}
                    helperText={validateInput(noOfVehicles)  ? "Enter positive number only" : ""}
                    inputProps={{ "data-testid": "no-of-vehicles-text-field-2" }}
                  />
                  <TextField
                    id="max-speed"
                    label="Max Speed (km/hr)"
                    placeholder="Enter a number"
                    value={maxSpeed}
                    onChange={(e) => setMaxSpeed(e.target.value)}
                    error={validateInput(maxSpeed)}
                    helperText={validateInput(maxSpeed) ? "Enter positive number only" : ""}
                    inputProps={{ "data-testid": "max-speed-text-field-2" }}
                  />
                  <TextField
                    id="max-weight"
                    label="Max Weight"
                    placeholder="Enter a number"
                    value={maxWeight}
                    onChange={(e) => setMaxWeight(e.target.value)}
                    error={validateInput(maxWeight)}
                    helperText={validateInput(maxWeight) ? "Enter positive number only" : ""}
                    inputProps={{ "data-testid": "max-weight-text-field-2" }}
                  />
                </Box>
              </div>

              <div className={styles.submitButton}>
                <Button style={{ width: 320 }} variant="contained" onClick={handleSubmitProblem2} data-testid="submit-2">Submit</Button>
                {isError && (
                  <p style={{color: 'red'}} data-testid='error-message-2'>Please fill up all fields</p>
                )}
              </div>

              <div data-testid="result-2">
                {results()}
              </div>

            </div>
    )
}

export default Problem2;