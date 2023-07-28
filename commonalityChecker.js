import dataMain from './Nioh2WeaponStats.json' assert { type: 'json' }; //change to personal json for your own compare program. source:https://www.freecodecamp.org/news/how-to-read-json-file-in-javascript/
let dataReverse = {};

//Global Vars
let keyNames = Object.keys(dataMain);
let reverseKeyNames = [];
let reverseMode = false;

//DOM targets
let selectionContainer = document.querySelector("#checkbox-container");
let compareButton = document.querySelector("#checkStats");
let outputSection = document.querySelector("#outputsContainer");
let choices1Section = document.querySelector("#choices1Container");
let choices2Section = document.querySelector("#choices2Container");
let selectionName1 = document.querySelector("#entry1Name");
let selectionData1 = document.querySelector("#entry1Data");
let selectionName2 = document.querySelector("#entry2Name");
let selectionData2 = document.querySelector("#entry2Data");
let outputIntersection = document.querySelector("#intersectionOutput");
let outputDifference = document.querySelector("#differenceOutput");
let reverseSelector = document.querySelector("#reverseToggle");

function reverseObject(objTarget) {
    let objReverse = {};
    let reverseKeysSet = new Set;
    let forwardKeys = Object.keys(objTarget);
    //generates a set of keys from values of original objects
    for (let i = 0; i < forwardKeys.length; i++) {
        let currentArr = objTarget[forwardKeys[i]];
        currentArr.forEach(x => reverseKeysSet.add(x))
    };
    let reverseKeys = Array.from(reverseKeysSet);
    reverseKeyNames = reverseKeys;
    //assigns a key name from the original object as a value if it contains one of the values from the reversed keys.
    for (let q = 0; q < reverseKeys.length; q++) {
        objReverse[reverseKeys[q]] = [];
        for (let a = 0; a < forwardKeys.length; a++) {
            if (objTarget[forwardKeys[a]].indexOf(reverseKeys[q]) != -1) {
                objReverse[reverseKeys[q]].push(forwardKeys[a])
            }
        }
    }
    return objReverse;
}

function writeEntry(entryName, insertTarget) { //fires on page load via initialize function, taking from the json keys
    let newEntryDiv = document.createElement("div");
    newEntryDiv.classList.add("col-5");
    newEntryDiv.classList.add("mb-4");
    newEntryDiv.classList.add("entry-container");

    let newEntryCheck = document.createElement("input")
    newEntryCheck.setAttribute("type", "checkbox");
    newEntryCheck.classList.add("entry-button");
    newEntryCheck.setAttribute("id", entryName)

    newEntryDiv.appendChild(newEntryCheck);
    insertTarget.appendChild(newEntryDiv);
    newEntryDiv.appendChild(document.createTextNode(entryName))
}

function fetchSelection() { //fires on button press, grabs any checkboxes that are clicked and adds their id to the array
    let selectionsArray = [];
    let scanList = document.querySelectorAll(".entry-button");
    for (let i = 0; i < scanList.length; i++) {
        if (scanList[i].checked) {
            selectionsArray.push(scanList[i].id);
        }
    }
    return selectionsArray
}

function CheckSelectionNumber(numLimit, array, on) { //helper function for run program, enforces a limit on how many entries can be selected
    if (on) {
        return array.length == numLimit;
    }
    return true;
}
function intersectionCheck(keyArray, data) { //takes an array of keys and find the intersection and symmetrical difference of all entries
    let intersectionSet = new Set();
    let differenceSet = new Set();
    if (keyArray.length > 1) {
        for (let i = 0; i < keyArray.length - 1; i++) { //iterates the main array whose values are used for indexOf
            let currentArray = data[keyArray[i]];
            for (let k = i + 1; k < keyArray.length; k++) {//iterates ahead of the main array for the target of indexOf
                let searchArray = data[keyArray[k]];
                for (let m = 0; m < currentArray.length; m++) {//iterates through the main array values to be used as references for indexOf
                    if (searchArray.indexOf(currentArray[m]) == -1 && intersectionSet.has(currentArray[m])) { //moves item from intersection to difference if found that it was not in all arrays
                        intersectionSet.delete(currentArray[m]);
                        differenceSet.add(currentArray[m]);
                    }
                    else if (searchArray.indexOf(currentArray[m]) != -1) {//adds to intersection set if match is found in the next key's array
                        intersectionSet.add(currentArray[m]);
                    }
                    else { //adds to difference set if no other conditions apply
                        differenceSet.add(currentArray[m]);
                    }
                }
            }
        }
    }
    let finalkey = 0;
    if (keyArray.length > 1) {
        finalkey = keyArray.length - 1;
    }
    data[keyArray[finalkey]].forEach(x => { if (!intersectionSet.has(x)) { differenceSet.add(x) } });
    return [intersectionSet, differenceSet];
}

function runProgram(selectLimit, useLimit, data) {
    let selectionArr = fetchSelection();
    console.log(CheckSelectionNumber(selectLimit, selectionArr, useLimit))
    if (!CheckSelectionNumber(selectLimit, selectionArr, useLimit)) {
        alert(`Incorrect number of entries selected. Please select ${selectLimit} entries.`)
        return
    }
    else {
        outputSection.classList.remove("d-none")
        if (!reverseMode) {
            choices1Section.classList.remove("d-none")
            choices2Section.classList.remove("d-none")
        }
        let statsData = intersectionCheck(selectionArr, data);
        //array to set solution source: https://www.geeksforgeeks.org/how-to-convert-set-to-array-in-javascript/
        let intersectionArr = Array.from(statsData[0]).toString();
        let differenceArr = Array.from(statsData[1]).toString();
        outputIntersection.innerHTML = intersectionArr.replace(/,/g, " / "); //solution: https://www.w3schools.com/jsref/jsref_replace.asp
        outputDifference.innerHTML = differenceArr.replace(/,/g, " / ");
        if (!reverseMode) {
            selectionName1.innerHTML = selectionArr[0];
            selectionData1.innerHTML = data[selectionArr[0]];
            selectionName2.innerHTML = selectionArr[1];
            selectionData2.innerHTML = data[selectionArr[1]];
        };
    }
}

function selectionHalt(limit) {
    let currentSelected = 0;
    let scanList = document.querySelectorAll(".entry-button");
    scanList.forEach(x => x.classList.remove("no-click"));
    scanList.forEach(x => x.parentElement.classList.remove("greyout"));
    for (let i = 0; i < scanList.length; i++) {
        if (scanList[i].checked) {
            currentSelected++;
        }
    }
    if (currentSelected >= limit) {
        for (let k = 0; k < scanList.length; k++) {
            if (!scanList[k].checked) {
                scanList[k].classList.add("no-click");
                scanList[k].parentElement.classList.add("greyout");
            }
        }
    }
}

function reverseToggle() { //Switches the toggle mode and resets all event listeners and entries for passing new params
    outputSection.classList.add("d-none");
    choices1Section.classList.add("d-none");
    choices2Section.classList.add("d-none");
    if (reverseMode == true) {
        reverseMode = false;
    }
    else {
        reverseMode = true;
    }
    compareButton.removeEventListener("click", compareR);
    selectionContainer.removeEventListener("click", haltR);
    reverseSelector.removeEventListener("click", reverseToggle);
    compareButton.removeEventListener("click", compare);
    selectionContainer.removeEventListener("click", halt);
    reverseSelector.removeEventListener("click", reverseToggle);
    let entryList = document.querySelectorAll(".entry-container");
    entryList.forEach(x => x.remove())
    initialize(reverseMode);
}

function compare() {
    runProgram(2, true, dataMain);
}

function halt() {
    selectionHalt(2);
}

function compareR() {
    runProgram(100, false, reverseObject(dataMain));
}

function haltR() {
    selectionHalt(100);
}



//Running Code

function initialize(mode) {
    dataReverse = reverseObject(dataMain);
    if (mode == false) {
        keyNames.forEach(x => writeEntry(x, selectionContainer));
        compareButton.addEventListener("click", compare);
        selectionContainer.addEventListener("click", halt); //source: https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
        reverseSelector.addEventListener("click", reverseToggle);
    }
    else if (mode == true) {
        reverseKeyNames.forEach(x => writeEntry(x, selectionContainer));
        compareButton.addEventListener("click", compareR);
        selectionContainer.addEventListener("click", haltR); //source: https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
        reverseSelector.addEventListener("click", reverseToggle);
    }
};
initialize(reverseMode);