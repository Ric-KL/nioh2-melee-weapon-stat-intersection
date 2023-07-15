import data from './Nioh2WeaponStats.json' assert { type: 'json' }; //change to personal json for your own compare program. source:https://www.freecodecamp.org/news/how-to-read-json-file-in-javascript/

let keyNames = Object.keys(data);
let selectionContainer = document.querySelector("#checkbox-container");
let compareButton = document.querySelector("#checkStats");
let outputSection = document.querySelector("#outputsContainer");
let selectionName1 = document.querySelector("#entry1Name");
let selectionData1 = document.querySelector("#entry1Data");
let selectionName2 = document.querySelector("#entry2Name");
let selectionData2 = document.querySelector("#entry2Data");
let outputIntersection = document.querySelector("#intersectionOutput");
let outputDifference = document.querySelector("#differenceOutput");

function writeEntry(entryName, insertTarget) { //fires on page load via initialize function, taking from the json keys
    let newEntryDiv = document.createElement("div");
    newEntryDiv.classList.add("col-5");
    newEntryDiv.classList.add("mb-4");
    newEntryDiv.classList.add("entry-container");
    
    let newEntryCheck = document.createElement("input")
    newEntryCheck.setAttribute("type","checkbox");
    newEntryCheck.classList.add("entry-button");
    newEntryCheck.setAttribute("id",entryName)
    
    newEntryDiv.appendChild(newEntryCheck);
    insertTarget.appendChild(newEntryDiv);
    newEntryDiv.appendChild(document.createTextNode(entryName))
}

function fetchSelection() { //fires on button press, grabs any checkboxes that are clicked and adds their id to the array
    let selectionsArray = [];
    let scanList = document.querySelectorAll(".entry-button");
    for (let i = 0 ; i < scanList.length ; i++) {
        if (scanList[i].checked) {
            selectionsArray.push(scanList[i].id);
        }
    }
    return selectionsArray
}

function CheckSelectionNumber(numLimit, array) { //helper function for run program, enforces a limit on how many entries can be selected
    return array.length == numLimit;
}

function intersectionCheck(keyArray) { //takes an array of keys and find the intersection and symmetrical difference of all entries
    let intersectionSet = new Set();
    let differenceSet = new Set();
    for (let i = 0 ; i < keyArray.length-1 ; i++){ //iterates the main array whose values are used for indexOf
        let currentArray = data[keyArray[i]];
        for (let k = i+1 ; k < keyArray.length ; k++) {//iterates ahead of the main array for the target of indexOf
            let searchArray = data[keyArray[k]];
                for (let m = 0 ; m < currentArray.length ; m++) {//iterates through the main array values to be used as references for indexOf
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
    let finalkey = keyArray.length-1;
    data[keyArray[finalkey]].forEach(x => {if(!intersectionSet.has(x)){differenceSet.add(x)}});
    return [intersectionSet,differenceSet];
}

function writeOutput() { //writes the results to the specified html ids
}

function runProgram() {
    let selectionArr = fetchSelection();
    if(!CheckSelectionNumber(2,selectionArr)) {
        alert("Incorrect number of entries selected. Please select 2 options.")
        return
    }
    else {
        outputSection.classList.remove("d-none")
        let statsData = intersectionCheck(selectionArr);
        selectionName1.innerHTML = selectionArr[0];
        selectionData1.innerHTML = data[selectionArr[0]];
        selectionName2.innerHTML = selectionArr[1];
        selectionData2.innerHTML = data[selectionArr[1]];
        //array to set solution source: https://www.geeksforgeeks.org/how-to-convert-set-to-array-in-javascript/
        outputIntersection.innerHTML = Array.from(statsData[0]);
        outputDifference.innerHTML = Array.from(statsData[1]);
    }
}

//Running Code

function initialize () {
    keyNames.forEach(x => writeEntry(x,selectionContainer))
    compareButton.addEventListener("click",runProgram)
}

initialize()