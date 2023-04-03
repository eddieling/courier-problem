import React, { useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function Home() {
  const [baseDeliverCost, setBaseDeliveryCost] = useState('');
  const [noOfPackages, setNoOfPackages] = useState('');
  const [userInputTextArea, setUserInputTextArea] = useState('');
  const [deliveryCostObject, setDeliveryCostObject] = useState(null);

  const [baseDeliverCost2, setBaseDeliveryCost2] = useState('100');
  const [noOfPackages2, setNoOfPackages2] = useState('5');
  const [userInputTextArea2, setUserInputTextArea2] = useState(`PKG1 50 30 OFR001
  PKG2 75 125 OFR008
  PKG3 175 100 OFR003
  PKG4 110 60 OFR002
  PKG5 155 95 NA`);
  const [deliveryCostObject2, setDeliveryCostObject2] = useState(null);
  const [noOfVehicles, setNoOfVehicles] = useState('2');
  const [maxSpeed, setMaxSpeed] = useState('70');
  const [maxWeight, setMaxWeight] = useState('200');
  const [selectedProblem, setSelectedProblem] = useState('1');

  const validateDeliveryInfo = (problemNo) => {
    let textArray, noOfPackage;
    if (problemNo === '1') {
      textArray = userInputTextArea.trim().split(/\s+/);
      noOfPackage = noOfPackages
    } else {
      textArray = userInputTextArea2.trim().split(/\s+/);
      noOfPackage = noOfPackages2
    }

    if (textArray.length === noOfPackage * 4) { // check if user has input all necessary values
      for (let i = 0; i < noOfPackage; i++) {
        if (isNaN(textArray[i * 4 + 1]) || isNaN(textArray[i * 4 + 2])) { // check if package weight and distance values are numbers
          return true
        }
      }
      return false
    } else {
      return true
    }
  }

  const checkOfferCodeValididity = (offerCode) => {
    if (offerCode === 'OFR001' || offerCode === 'OFR002' || offerCode === 'OFR003')
      return true
    else return false
  }

  const getDiscountPercentage = (offerCode, deliveryDistance, packageWeight) => {
    switch (offerCode) {
      case 'OFR001':
        if (deliveryDistance < 200 && packageWeight >= 70 && packageWeight <= 200) {
          return 10;
        } else return 0;
      case 'OFR002':
        if (deliveryDistance >= 50 && deliveryDistance <= 150 && packageWeight >= 100 && packageWeight <= 250) {
          return 7;
        } else return 0;
      case 'OFR003':
        if (deliveryDistance >= 50 && deliveryDistance <= 250 && packageWeight >= 10 && packageWeight <= 150) {
          return 5;
        } else return 0;
      default:
        return 0;
    }
  }


  const getDeliveryCost = (inputArray, noOfPackages, baseDeliverCost, deliveryObj) => {
    for (let i = 0; i < noOfPackages; i++) {
      let packageWeight = inputArray[i * 4 + 1];
      let deliveryDistance = inputArray[i * 4 + 2];
      let offerCode = inputArray[i * 4 + 3];
      let grossCost = parseInt(baseDeliverCost) + packageWeight * 10 + deliveryDistance * 5;
      let finalDeliveryCost;
      let totalDiscount = 0;

      if (checkOfferCodeValididity(offerCode)) {
        let discountPercentage = getDiscountPercentage(offerCode, deliveryDistance, packageWeight)
        if (discountPercentage != 0) {
          totalDiscount = grossCost * discountPercentage / 100;
          finalDeliveryCost = grossCost - totalDiscount;
        }
        else finalDeliveryCost = grossCost;
      } else {
        finalDeliveryCost = grossCost;
      }

      let tempObj = {
        pkgId: inputArray[i * 4],
        totalDiscount: totalDiscount,
        totalCost: finalDeliveryCost
      }
      deliveryObj.push(tempObj)
    }
    return deliveryObj;
  }

  const handleSubmitProblem1 = () => {
    let inputArray = userInputTextArea.split(/\s+/);
    let deliveryObj = [];
    deliveryObj = getDeliveryCost(inputArray, noOfPackages, baseDeliverCost, deliveryObj);
    setDeliveryCostObject(deliveryObj)
  }

  const powerSet = function (arr) {
    // the power set of [] is [[]]
    if (arr.length === 0) {
      return [[]];
    }

    // remove and remember the last element of the array
    let lastElement = arr.pop();

    // take the powerset of the rest of the array
    let restPowerset = powerSet(arr);

    // console.log('restPowerset', restPowerset)


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

  const getDeliverySubsets = (deliveryObj) => {
    let deliverySubsets = subsetsLessThan(deliveryObj, maxWeight)
    let sortedDeliverySubset = deliverySubsets.sort((a, b) => b.totalWeight - a.totalWeight);
    sortedDeliverySubset.forEach(subset => {
      getTotalDeliveryTime(subset)
    })
    return sortedDeliverySubset;
  };

  const getTotalDeliveryTime = (deliveryObj) => {
    deliveryObj.deliveryTime = parseFloat((deliveryObj.deliveryDistance / maxSpeed).toFixed(3).slice(0, -1)) * 2;
    return deliveryObj;
  };

  const getPackageDeliveryTime = (deliveryObj, currentTime) => {
    return parseFloat((deliveryObj.deliveryDistance / maxSpeed).toFixed(3).slice(0, -1)) + currentTime;
  };


  const handleSubmitProblem2 = () => {
    let inputArray = userInputTextArea2.split(/\s+/);
    let remainingDeliveries = [];
    remainingDeliveries = getDeliveryCost(inputArray, noOfPackages2, baseDeliverCost2, remainingDeliveries);

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
    let count = 1
    while (remainingDeliveries.length > 0) {
      count += 1
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
              console.log('REMOVING ' + remainingDeliveries[found].pkgId)
              remainingDeliveries[found].deliveryTime = getPackageDeliveryTime(remainingDeliveries[found], currentTime).toFixed(2);
              console.log('remainingDeliveries[found].deliveryTime', remainingDeliveries[found].deliveryTime)
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


  const handleSelectProblem = (problemNum) => {
    setSelectedProblem(problemNum)
  };

  const results = () => {
    return (
      deliveryCostObject && (
        <div className={styles.output} >
          <p style={{ marginBottom: '5px' }}>Output:</p>
          {deliveryCostObject.map(obj => (
            <div >
              {obj.pkgId} {obj.totalDiscount} {obj.totalCost}
            </div>
          ))}
        </div>
      )
    )
  };

  const results2 = () => {
    return (
      deliveryCostObject2 && (
        <div className={styles.output} >
          <p style={{ marginBottom: '5px', marginTop: 0, marginLeft: 8 }}>Output:</p>
          {deliveryCostObject2.map(obj => (
            <div style={{ marginLeft: 8 }}>
              {obj.pkgId} {obj.totalDiscount} {obj.totalCost} {obj.deliveryTime}
            </div>
          ))}
        </div>
      )
    )
  };

  return (
    <>
      <Head>
        <title>Courier Challenge</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Coding Challenge Courier Service
        </h1>
        <p className={styles.centerContainer} style={{ fontSize: 24 }} data-testid='radio'>Select problem:</p>
        <FormControl className={styles.centerContainer}>
          <RadioGroup
            row
            aria-labelledby="demo-form-control-label-placement"
            name="position"
            defaultValue="top"
          >
            <FormControlLabel
              value="top"
              control={<Radio onClick={() => { handleSelectProblem('1') }} inputProps={{ "data-testid": "radio-1" }} />}
              label="Problem 1"

            />
            <FormControlLabel
              value="start"
              control={<Radio onClick={() => { handleSelectProblem('2') }} inputProps={{ "data-testid": "radio-2" }} />}
              label="Problem 2"

            />
          </RadioGroup>
        </FormControl>

        <div className={styles.centerContainer}>
          {/* Problem 01 */}
          {selectedProblem === '1' && (
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
                    value={baseDeliverCost}
                    onChange={(e) => setBaseDeliveryCost(e.target.value)}
                    error={isNaN(baseDeliverCost)}
                    helperText={isNaN(baseDeliverCost) ? "Enter number only" : "" }
                    inputProps={{ "data-testid": "delivery-cost-text-field" }}
                  />
                  <TextField
                    id="no-of-packages"
                    label="No of Packages"
                    placeholder="Enter a number"
                    value={noOfPackages}
                    onChange={(e) => setNoOfPackages(e.target.value)}
                    error={isNaN(noOfPackages)}
                    helperText={isNaN(noOfPackages) ? "Enter number only" : "" }
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
                    error={validateDeliveryInfo('1')}
                    placeholder="'Enter package info..."
                    inputProps={{ "data-testid": "deliver-info-text-field" }}
                  />
                </Box>

                <div style={{ whiteSpace: "pre-line", marginLeft: 10, marginTop: 10 }}>
                  {' Sample input: \nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003'}
                </div>
              </div>

              <Button className={styles.submitButton} variant="contained" onClick={handleSubmitProblem1} data-testid="submit">Submit</Button>

              <div data-testid="result">
                {results()}
              </div>
            </div>

          )}
          {/* End of Problem 01 */}


          {/* Problem 02 */}
          {selectedProblem === '2' && (
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
                    value={baseDeliverCost2}
                    onChange={(e) => setBaseDeliveryCost2(e.target.value)}
                    error={isNaN(baseDeliverCost2)}
                    helperText={isNaN(baseDeliverCost2) ? "Enter number only" : "" }
                    inputProps={{ "data-testid": "delivery-cost-text-field-2" }}
                  />
                  <TextField
                    id="no-of-packages"
                    label="No of Packages"
                    placeholder="Enter a number"
                    value={noOfPackages2}
                    onChange={(e) => setNoOfPackages2(e.target.value)}
                    error={isNaN(noOfPackages2)}
                    helperText={isNaN(noOfPackages2) ? "Enter number only" : "" }
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
                    error={validateDeliveryInfo('2')}
                    placeholder="'Enter package info..."
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
                    error={isNaN(noOfVehicles)}
                    helperText={isNaN(noOfVehicles) ? "Enter number only" : "" }
                    inputProps={{ "data-testid": "no-of-vehicles-text-field-2" }}
                  />
                  <TextField
                    id="max-speed"
                    label="Max Speed (km/hr)"
                    placeholder="Enter a number"
                    value={maxSpeed}
                    onChange={(e) => setMaxSpeed(e.target.value)}
                    error={isNaN(maxSpeed)}
                    helperText={isNaN(maxSpeed) ? "Enter number only" : "" }
                    inputProps={{ "data-testid": "max-speed-text-field-2" }}
                  />
                  <TextField
                    id="max-weight"
                    label="Max Weight"
                    placeholder="Enter a number"
                    value={maxWeight}
                    onChange={(e) => setMaxWeight(e.target.value)}
                    error={isNaN(maxWeight)}
                    helperText={isNaN(maxWeight) ? "Enter number only" : "" }
                    inputProps={{ "data-testid": "max-weight-text-field-2" }}
                  />
                </Box>
              </div>

              <Button className={styles.submitButton} variant="contained" onClick={handleSubmitProblem2} data-testid="submit-2">Submit</Button>
              <div data-testid="result-2">
                {results2()}
              </div>

            </div>
          )}
          {/* End of Problem 02 */}

        </div>
      </main>
    </>
  )
}