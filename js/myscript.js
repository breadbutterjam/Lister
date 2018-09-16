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
}


function bodyLoaded()
{
    initializeToDefault();

    loadData();

    addEventListeners();

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

}


/* 

check answers

*/
function checkClicked(event)
{

}




/* 

handler for clicking on reset button

*/
function resetClicked()
{
    console.log("reset clicked");

    emptyListContainer();

    removeResetButton();
    
    if (isListPredefined)
    removeCheckButton();

    initializeToDefault();

    $('select').val("custom");
    selectOptionChanged();

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