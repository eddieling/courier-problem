import OfferCodes from "./../../config.json";

export const validateInput = (inputValue) => {
    if (isNaN(inputValue) || parseInt(inputValue) <= 0) {
        return true;
    } else {
        return false;
    }
}

const checkOfferCodeValididity = (offerCode) => {
    let isCodeValid = OfferCodes.offerCodes.find(code => code.id === offerCode);
    if (isCodeValid) {
        return true;
    }
    else return false
}

const getDiscountPercentage = (offerCode, deliveryDistance, packageWeight) => {
    let code = OfferCodes.offerCodes.find(code => code.id === offerCode);
    if (deliveryDistance <= code.maxDistanceAllowed
        && deliveryDistance >= code.minDistanceAllowed
        && packageWeight <= code.maxWeightAllowed
        && packageWeight >= code.minWeightAllowed
    ) {
        return code.discountPercentage;
    } else return 0;
}


export const validateDeliveryInfo = (userInputTextArea, noOfPackages) => {
    let textArray;
    if (userInputTextArea === '') {
        return false;
    }
    textArray = userInputTextArea.trim().split(/\s+/);

    if (textArray.length === noOfPackages * 4) { // check if user has input all necessary values
        for (let i = 0; i < noOfPackages; i++) {
            if (isNaN(textArray[i * 4 + 1]) || isNaN(textArray[i * 4 + 2])) { // check if package weight and distance values are numbers
                return true
            }
        }
        return false
    } else {
        return true
    }
}

export const getDeliveryCost = (inputArray, noOfPackages, baseDeliveryCost, deliveryObj) => {
    for (let i = 0; i < noOfPackages; i++) {
        let packageWeight = inputArray[i * 4 + 1];
        let deliveryDistance = inputArray[i * 4 + 2];
        let offerCode = inputArray[i * 4 + 3];
        let grossCost = parseInt(baseDeliveryCost) + packageWeight * 10 + deliveryDistance * 5;
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

export const getTotalDeliveryTime = (deliveryObj, maxSpeed) => {
    deliveryObj.deliveryTime = parseFloat((deliveryObj.deliveryDistance / maxSpeed).toFixed(3).slice(0, -1)) * 2;
    return deliveryObj;
};

export const getPackageDeliveryTime = (deliveryObj, currentTime, maxSpeed) => {
    return parseFloat((deliveryObj.deliveryDistance / maxSpeed).toFixed(3).slice(0, -1)) + currentTime;
};
