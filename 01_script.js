const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//Default Case
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");

//Set Password Length
function handleSlider() {
  //Its usecase is to reflect the password length to UI
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow :HW
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 122));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 90));
}

function generateSymbol() {
  let rndIndex = getRndInteger(0, symbols.length - 1);
  return symbols.charAt(randIndex);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasUpper || hasLower) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied!";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }

  //To make copy - span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  //Special Edge Case:
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // Regenerate password after checkbox change
  generatePassword();
}

function shufflePassword(arr) {
  //Fisher Yates Method

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  let str = "";
  arr.forEach((el) => (str += el));
  return str;
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
  generatePassword();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  //None of the checkboxes are selected
  if (checkCount == 0) return;

  //Special Case
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //New Password Generation
  console.log("Starting the Journey");
  //Remove old password
  password = "";

  //Include the stuff mentioned by checkboxes : Naive Approach - firstly we will add all necessary checked chars to password and after that will randomly put anything

  // if (uppercaseCheck.checked) {
  //   password += generateUpperCase();
  // }

  // if (lowercaseCheck.checked) {
  //   password += generateLowerCase();
  // }

  // if (numbersCheck.checked) {
  //   password += generateRandomNumber();
  // }

  // if (symbolsCheck.checked) {
  //   password += generateSymbol();
  // }

  let funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }

  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }

  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }

  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("COmpulsory adddition done");

  //Remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length - 1);
    password += funcArr[randIndex]();
  }
  console.log("Remaining adddition done");

  //Shuffling chars in password
  password = shufflePassword(Array.from(password));
  console.log("Shuffling done");

  //show in UI
  passwordDisplay.value = password;
  console.log("UI adddition done");

  //Show Strength
  calcStrength();
});
