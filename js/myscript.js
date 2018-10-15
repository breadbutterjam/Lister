// function ocistly()
// {
//     console.log("All systems are GO")
// }

//DEFAULTS 
let def_rowsList = 1;
let def_columnsList = 1;

let isListPredefined = false;

//number of rows in the list
let rowsList;


//number of columns in the list. by default it will be 1. 
let columnsList;

//boolean used to check if all answer options are correct. 
let isAllCorrect = true;

/* 

initialize variables to default values

*/
function initializeToDefault()
{
    rowsList = def_rowsList;
    columnsList = def_columnsList;

    $("#listCountInputField").val("");
    $("#listCountInputField").focus();

    isListPredefined = false;

    isAllCorrect = true;
}


function bodyLoaded()
{
    initializeToDefault();

    loadData();

    addEventListeners();

    initModals();

}


/* 

function initializes modals

*/
let elems; 
let instances;
function initModals()
{
    elems = document.querySelectorAll('.modal');
    instances = M.Modal.init(elems);
}



/* function adds eventlisteners */
function addEventListeners()
{
    $("#btnCreateList").on("click", createListClicked);

    $("#listCountInputField").change(listCountInputFieldChanged);


}

/* function used to handle click on create list button */
function createListClicked(event)
{
    // console.log("create button clicked")
      
    /* all of this code will go into custom lists.
    for predefined lists the number will be prepopulated from the data json  */
   
    if (isListPredefined)
    {
        //get the number of rows to be created from the data object
        let selectedValue = $('select').val();
        rowsList = data.optionData[selectedValue].rows;

    }
    else
    {
        //save the number of rows to be created for the list
        rowsList = Number($("#listCountInputField").val());

    }

    
    // columnsList = 1;

    let listHTML = getListHTML();
    $('.listContainer')[0].innerHTML = listHTML;

    if (isListPredefined)
    {
        addCheckButton();
    }
    

    addResetButton();

    addResetOptionButton();

    // disable drop down
    $('select').prop("disabled", true);

    setFocusToFirstField();

    enableCreateListButton(false);
}

/* 

function sets focus to first input field

*/
function setFocusToFirstField()
{
    $($('.bottom-borderless-input')[0]).focus();
}



/* 

check answers

*/
function checkClicked(event)
{
    
    let selectedValue = $('select').val();
    let correctOptions = data.optionData[selectedValue].data;

    let correctOptionsWithoutCase = ConvertAllToLowerCase(correctOptions)

    let enteredOptions = [];
    let currOption;
    let currInputField;
    for (let i=0; i<$('.bottom-borderless-input').length; i++)
    {
        
        currInputField = $('.bottom-borderless-input')[i] 
        currOption = currInputField.value.trim();
        
        //currently not considering case
        currOption = currOption.toLowerCase();
        
        if (currOption === "")
        {
            //if no value is entered. 
            markIncorrect(currInputField)
        }
        else
        {
            enteredOptions.push(currInputField)
        }

    }

    // stores number of filled options
    let filledOptions = enteredOptions.length;

    let markedCorrect = [];

    // console.log({enteredOptions})

    let currListItemString;
    //loop through filled options and check if filled option is correct. 
    for (i=0; i<filledOptions; i++)
    {
        
        currListItemString = enteredOptions[i].value.toLowerCase();
        if (correctOptionsWithoutCase.indexOf(currListItemString) > -1 && markedCorrect.indexOf(currListItemString) === -1)
        {
            //if answer option is correct
            markCorrect(enteredOptions[i]);
            markedCorrect.push(currListItemString)
        }
        else
        {
            markIncorrect(enteredOptions[i]);
        }
    }


    if (isAllCorrect)
    {
        AllAnswersCorrectPopup();

    }
    else
    {
        SomeAnswersIncorrect();
    }


    // console.log({correctOptions})
    // console.log({enteredOptions})
    enableCheckButton(false);

}

/* 

function used to enable check button;
pass parameter 

*/
function enableCheckButton(enableButton)
{
    if (enableButton)
    {
        $("#btnCheck").removeClass("disabled");
    }
    else
    {
        $("#btnCheck").addClass("disabled");
    }
    
}


/* 

function launches the correct popup

*/
function AllAnswersCorrectPopup()
{
    $('#congratulation_modal').modal('open');
}


/* 

function launches the incorrect popup

*/
function SomeAnswersIncorrect()
{
    $('#oops_modal').modal('open');
}


/* 

function takes input field as parameter and marks it as incorrect. 

*/
function markIncorrect(inputField)
{
    isAllCorrect = false;
    $(inputField).parent().addClass('incorrect-answer');
    $($(inputField).parent().parent().children()[0]).removeClass("cyan").addClass("red")

}

/* 

function takes input field as parameter and marks it as correct. 

*/
function markCorrect(inputField)
{
    $(inputField).parent().addClass('correct-answer');
    $($(inputField).parent().parent().children()[0]).removeClass("cyan").addClass("green")

}


/* 

function returns array with all options in lower case. 
This will be used to check for correct answer if case sensitivity is not to be considered. 

*/
function ConvertAllToLowerCase(arrParam)
{
    let arrToRet = [];
    for (let i=0; i<arrParam.length; i++)
    {
        arrToRet.push(arrParam[i].toLowerCase());
    }

    return arrToRet;
}

/* 

handler for clicking on reset options button

*/
function resetOptionsClicked(event)
{
    $('.bottom-borderless-input').val("");

    enableCheckButton(true);
    
    resetCorrectIncorrectMarkings();

    isAllCorrect = true;

    setFocusToFirstField();
}

/* 

funtion removes all correct incorrect markings

*/
function resetCorrectIncorrectMarkings()
{
    $('.red').addClass('cyan').removeClass('red');
    $('.green').addClass('cyan').removeClass('green');

    $('.correct-answer').removeClass('correct-answer');
    $('.incorrect-answer').removeClass('incorrect-answer');
}


/* 

handler for clicking on reset button

*/
function resetClicked()
{
    // console.log("reset clicked");

    emptyListContainer();

    removeResetButton();
    
    if (isListPredefined)
    {
        removeCheckButton();
        removeResetOptionsButton();
    }
    

    initializeToDefault();

    $('select').val("custom");
    selectOptionChanged();

    $('select').prop("disabled", false);

    
}


/* 

remove reset button

*/
function removeResetButton()
{
    //remove handler
    $("#btnReset").off("click", resetClicked)

    //remove reset button
    $('.reset-button').remove();
}

/* 

removes check button

*/
function removeCheckButton()
{
    //remove handler
    $("#btnCheck").off("click", checkClicked)

    //remove reset button
    $('.check-button').remove();
}

/* 

removes reset options button

*/
function removeResetOptionsButton()
{
    //remove handler
    $("#btnResetOptions").off("click", resetOptionsClicked)

    //remove reset button
    $('.reset-options-button').remove();
}

/* 

function empties list container

*/
function emptyListContainer()
{
    $('.listContainer')[0].innerHTML = "";
}



/* function returs corresponding HTML based on the number of rows and columns specified at global level*/
function getListHTML()
{
     /* 
    working HTML. for 1 row, 1 column. 
    <div class="row">
        <div class="col s3"></div> <!-- remove this three column to left align the input fields -->
        <div class="col s1 fixed-ht cyan lighten-3">
            <h5 class="vertical-align center-align">2</h5>
        </div>
        <div class="input-field-holder-border col fixed-ht s5">
            <input class="bottom-borderless-input" placeholder="" id="input_field_2" type="text">
        </div>
    </div>
    
    */

    let retHTML = '';

    // this html has a three column gap on the left. it makes the input field seem center aligned. 
    // let a_HTML = '<div class="row"><div class="col s3"></div><div class="col s1 fixed-ht cyan lighten-3"><h5 class="vertical-align center-align">'
    
    //this html does NOT have a three column gap on the left, the input field is left aligned. 
    let a_HTML = '<div class="row"><div class="col s1 fixed-ht cyan lighten-3"><h5 class="vertical-align center-align">'
    let b_HTML = '</h5></div><div class="input-field-holder-border col fixed-ht s5"><input class="bottom-borderless-input" placeholder="" id="input_field_'
    let c_HTML = '" type="text"></div></div>'

    let rowHTML = "";
    let countString = "";
    for (let i=1; i<=rowsList; i++)
    {
        countString = String(i).trim();
        rowHTML = a_HTML + countString + b_HTML + countString + c_HTML;
        retHTML += rowHTML;
    }

    return retHTML;

}

/* function used to handle change event on input field used to specify number of list items */
function listCountInputFieldChanged(event)
{
    // console.log("listCountInputFieldChanged :: 1")

    let rowValue = $("#listCountInputField").val();
    if (rowValue === "")
    {
        enableCreateListButton(false);
    }
    else
    {
        enableCreateListButton(true);
    }
}


/* function used to enable / disable the create list button */
function enableCreateListButton(enableButton)
{
    if (enableButton)
    {
        $("#btnCreateList").removeClass("disabled");
    }
    else
    {
        $("#btnCreateList").addClass("disabled")
    }
}



/* 

function adds predefined option to select box

*/
function loadData()
{
    let numOfPredefOptions = data.options.length;
    
    let predefKeys = data.options;
    
    $('.predef-options-holder')[0].innerHTML = getSelectHTML(predefKeys);

    $('.predef-options-holder select').on("change", selectOptionChanged);

}


/* 

function to handle select change

*/
function selectOptionChanged(event)
{
    let selectedValue = $('select').val();
    if (selectedValue === "custom")
    {
        $("#listCountInputField").prop("disabled", false)
        enableCreateListButton(false);
        isListPredefined = false;
    }
    else
    {
        $("#listCountInputField").prop("disabled", true)

        isListPredefined = true;

        enableCreateListButton(true);
    }
}


/* 

function returns html for select option. 
It should be provided an array with value of keys, the global data object is referenced to extract the labels   

*/
function getSelectHTML(arrKeys)
{
    let numOfPredefOptions = arrKeys.length;
    let selectHTMLStart = '<select class="browser-default"><option value="custom">Select option</option>';
    let seelctOption = '';
    let selectHTMLEnd = '</select>'

    let currLabel = '';
    let currId = '';
    for (let i=0; i<numOfPredefOptions; i++)
    {
        currId = arrKeys[i];
        currLabel = data.optionData[currId].label;
        seelctOption += '<option value="' + currId + '">' + currLabel + '</option>'
    }

    let retHTML = selectHTMLStart + seelctOption + selectHTMLEnd;

    return retHTML;
}


/* 

function will return button html based on the parameters supplied

*/
function getButtonHTML(classes, btnID, label)
{
    let classString = "";
    for (let i=0; i<classes.length; i++)
    {
        classString += String(classes[i]);
        classString += " ";
    }

    let btnHTML = '<div class="'+ classString +'"><a id="'+ btnID +'" class="waves-effect waves-light btn">'+ label +'</a></div>';

    return btnHTML;
}


/* 

function adds a reset options button. 
clicking this button will reset the list back to its initial state with all fields emtpy. 

*/
function addResetOptionButton()
{

    let resetOptionsHTML = getButtonHTML(['reset-options-button', 'footer-buttons'], 'btnResetOptions', 'Reset Options')

    $('.footerButtonContainer').append(resetOptionsHTML);

    $("#btnResetOptions").on("click", resetOptionsClicked)

}



/* 

function adds a reset button. This is used after creating a list. 

*/
function addResetButton()
{
    // let resetHTML = '<div class="reset-button center-align"><a id="btnReset" class="waves-effect waves-light btn">Reset</a></div>'

    let resetHTML = getButtonHTML(['reset-button', 'footer-buttons'], 'btnReset', 'Reset')

    $('.footerButtonContainer').append(resetHTML);

    $("#btnReset").on("click", resetClicked)
}

/* 

funciton adds a check button

*/
function addCheckButton()
{
    // let checkHTML = '<div class="check-button center-align"><a id="btnCheck" class="waves-effect waves-light btn">Check</a></div>'

    let checkHTML = getButtonHTML(['check-button', 'footer-buttons'], 'btnCheck', 'Check')

    $('.footerButtonContainer').append(checkHTML);

    $("#btnCheck").on("click", checkClicked)
}


/* 

function returns random number between min and max. 
If only one is specified, min is assumed 0
max is assumed infinity. 

*/
function getRandomBetween(min, max)
{
    let rand = Math.random();
    let diff = max - min; 

    let num = min + Math.round(rand * diff);
    return num; 
}

function check(min, max)
{
    let randomNumber; 
    let count = 0; 
    do 
    {
        randomNumber = getRandomBetween(min, max);
        count++
        console.log(count, " - ", randomNumber)
    }while (count < 500 && randomNumber < max)
}