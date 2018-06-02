

$(document).ready(function() {

// CONSTANT variables ------------------------------

  // array for tracking input for all signup form fields
  const signUpRegistration = [];

  // array for selected activities object
  const selectedActivities = [];

  // select input field, #name
  const $nameInput = $('#name');

  // select shirt color options, #color
  const $colorOptions = $('#color');

  // build other Job Role input field
  const otherJobRoleInput = document.createElement("input");
  otherJobRoleInput.type = "text";
  otherJobRoleInput.id = "other-title";
  otherJobRoleInput.placeholder = "Your Job Role";

  // build shirt color opt groups
  const jsPunsOptGrp = document.createElement('optgroup');
  jsPunsOptGrp.id = 'js_puns';
  const jsShirtOnlyOptGrp = document.createElement('optgroup');
  jsShirtOnlyOptGrp.id = 'heart_js';
  const blankOptGrp = document.createElement('optgroup');
  blankOptGrp.id = "blank";
  const blankOption = document.createElement('option');
  blankOption.value = "notheme";
  blankOption.textContent = "<--- Please select a theme";
  blankOptGrp.append(blankOption);

  // const vars for payment option html nodes
  const paymentFieldset = document.getElementById('payment').parentNode.children;
  const paymentOptions = document.createElement('div');

  // total amt of activities signing up for
  let totalAmt = 0;
  // build a legend element to display total
  const total = document.createElement('legend');
  total.id = "total";

// FUNCTIONS declarations-----------------------------------

  // function to put focus on the first form field, name, input field
  const focusOnFirstField = function($node) {
    $node.focus();
  }; // end focusOnFirstField function

  // function to move shirt color options under 2 const html node opt groups
  const getOptElements = function(){
    $('#color').children().each(function(i){
        if ($(this)[0].textContent.includes('JS Puns')) {
          let optionValue = $(this)[0].value;
          $(this)[0].class = 'js_puns';
          $(this)[0].textContent = optionValue;
          jsPunsOptGrp.append($(this)[0]);
        }
        if ($(this)[0].textContent.includes('JS shirt only')){
          let optionValue = $(this)[0].value;
          $(this)[0].class = 'js_shirt_only';
          $(this)[0].textContent = optionValue;
          jsShirtOnlyOptGrp.append($(this)[0]);
        }
      }); // end $()each

  }; // end getOptElements function

  // function to add shirt color optGroups to #color <select> element
   // if matching shirt theme is selected
    // triggered by change on design <select> element
  const displayColorOptGroups = function($node, shirtThemeOption){

    // getting shirt theme that was selected
    let optFlag = "";
    if (shirtThemeOption){
      optFlag = shirtThemeOption;
    }

    // before displaying colors that match selected design theme
      // making sure shirt current displayed color options are stored in matching optgroups
    if ( $('#color option')[0].value === 'notheme' ){
      $('#color').children().each(function(){
        blankOptGrp.append($(this)[0]);
      });
    } else if ( $('#color option')[0].class === 'js_puns' ){
      $('#color').children().each(function(){
        jsPunsOptGrp.append($(this)[0]);
      });
    } else if ( $('#color option')[0].class === 'js_shirt_only' ){
      $('#color').children().each(function(){
        jsShirtOnlyOptGrp.append($(this)[0]);
      });
    }

    // read shirt color options from matching optgroup
      // display color options as child element of #color element
    if (optFlag === 'js puns'){
          $node.append(jsPunsOptGrp.children);
    } else if (optFlag === 'heart js'){
          $node.append(jsShirtOnlyOptGrp.children);
    } else if (optFlag === 'notheme'){
          $node.append(blankOptGrp.children);
    }

  }; // end addColorOptGroups function

  // simple function to display total cost of activites
  const displayTotal = function(totalAmt){
    total.textContent = `Total: $${totalAmt}`;
    $('.activities').append(total);
  } // end displayTotal() function

  // display only selected payment option
  const displayPaymentOptions = function($optionValue){
    $('#payment option:selected').each(function(){
      if ($optionValue === 'credit card') {
        $('#payment').parent()[0].append(paymentOptions.children.namedItem('credit-card'));
      } else if ($optionValue === 'paypal') {
        $('#payment').parent()[0].append(paymentOptions.children.namedItem('paypal'));
      } else if ($optionValue === 'bitcoin') {
        $('#payment').parent()[0].append(paymentOptions.children.namedItem('bitcoin'));
      } // end if
    }); // end each function
  } // end displayPaymentOptions function

  // function to move each payment options elements into separate const html nodes
  const getPayOptions = function(){

    $('#payment').children().each(function(){
      paymentOptions.append(paymentFieldset[5]);
      paymentOptions.children[0].setAttribute('id', 'bitcoin')
      paymentOptions.append(paymentFieldset[4]);
      paymentOptions.children[1].setAttribute('id', 'paypal')
      paymentOptions.append(paymentFieldset[3]);
    }); // end each function

    //display credit card as payment option selected
    $('#payment').parent().children()[2].value = "credit card";
    // display credit card input fields
    displayPaymentOptions("credit card");
  };

  // track activities selected. parse details, like cost and day/time scheduled
  const trackSelectedActivities = function(){

       // used to track selected activiies,
         // scoped to activities label input function
       const selection = {};

       return function(){
         // each activity label/input gets it's own event listener

           const selectedActivity = this.parentNode;
           // for matching and parsing dollar amt from activity description string
           let amtString = '';
           let dollarAmt = 0;

           // for matching and parsing time of day and day of week
           let timeOfDayString = '';
           const timeOfDayFilter = /\d\w*-\w*/;
           let dayString = '';
           const dayofWeekFilter = /\w*day\b/;

           // const var used to test if duplicate selected , (means already selected once, so deselected)
           let duplicate = false;
           let dupItemIndex = 0;

           // get dollarAmt of activity from activity description
                 // match part of string starting with '$' followed by numbers
           const dollarAmtFilter = /\$\d+/;
           let dollarAmtString = selectedActivity.textContent.match(dollarAmtFilter);
           // assign to selection array, key value of cost
             if (dollarAmtString) {
               amtString = dollarAmtString[0].slice(1);
               dollarAmt = parseInt(amtString);
               selection.cost = dollarAmt;
             }

           selectedActivities.forEach(function(item, index){
             if (selectedActivity.textContent === item.activity) { // if duplicate, then..
               duplicate = true;       // set duplicate bolean to true
               dupItemIndex = index;   // save index of duplicate item
             }
           });

           if (duplicate){ // if item being de-selected
             // re-enable activity that was de-selected
             $('.activities label').each(function(index, item){
                 if (index !== 0 && selection.day === selectedActivity.textContent.match(dayofWeekFilter)[0] ){
                   if (selection.time === this.textContent.match(timeOfDayFilter)[0] ){
                     $('.activities label')[index].removeAttribute('style', 'color:grey;background-color:silver;');
                     $('.activities input')[index].disabled = false;
                   }
                 }
             });
               // subtract cost of activity from total
                 totalAmt -= dollarAmt;
               // display updated total
                 displayTotal(totalAmt);

                 selectedActivities.splice(dupItemIndex, 1);

             } else {  // else item is being selected

               // get day of week for activity selected
               // match part of string ending in day and a word boundary
                 // assing to array selection, key value of day
                 dayString = selectedActivity.textContent.match(dayofWeekFilter);
               if (dayString){
                 selection.day = dayString[0];
               }

               // get time period for activity selected
                 // match part of string that begins with a number 0-9, all alphanumerical a dash then alphanumerical up to word boundary
                   // assing to array selection, key value of time
                 timeOfDayString = selectedActivity.textContent.match(timeOfDayFilter);
               if (timeOfDayString) {
                 selection.time = timeOfDayString[0];
               }

               // add activity description to selection array
                 selection.activity = selectedActivity.textContent;

               // add activity to array
                 selectedActivities.push(selection);

               // add cost of activity to total
                 totalAmt += dollarAmt;
               // display updated total
                 displayTotal(totalAmt);

               // disable activites that conflict with current selected activity
               // make sure to enable any that no longer conflict
               $('.activities label').each(function(index, item){
                 if (index !== 0 && selection.activity !== item.textContent ) {
                   if (selection.day === item.textContent.match(dayofWeekFilter)[0] ){
                     if (selection.time === item.textContent.match(timeOfDayFilter)[0] ){
                       $('.activities label')[index].setAttribute('style', 'color:grey;background-color:silver;');
                       $('.activities input')[index].disabled = true;
                     } // end if matches timeOfDayFilter
                   } // end if matched dayofWeekFilter
                 } // end if selecting actvity with day and time schedule
               }); // end activities label each loop

             } // end if/else : handling deseleciton or selection of activiies

             // read actvities selection to signUpRegistration object
             signUpRegistration.activties = selectedActivities;

       }; // end return addEventListener

  };// end trackSelectedActivities function

// EVENT LISTENERS ----------------------------

  // event listener for name field input
    $('#name').change(function(){
      signUpRegistration.name = document.getElementById('name').value;
    });

  // event listener for email field input
    $('#mail').change(function(){
      signUpRegistration.mail = document.getElementById('mail').value;
    });

  // event listener for job title select value change
    // if job title changed to 'other' display other Job Role input field
    $('#title').change(function() {
      if ($(this).val() === 'other') {
        document.getElementById('title').parentNode.append(otherJobRoleInput);
        // event listener for other-title field input
          // captures as text input to field changes
          $('#other-title').change(function(){
          signUpRegistration.title = document.getElementById('other-title').value;
        });
      } else {
        signUpRegistration.title = document.getElementById('title').val();
      }
    });  // end job title addEventListener

  // event listener for change in shirt design value
    // displaying only shirt colors that go with Shirt design theme
    $('#design').change(function() {
      $('#design option:selected').each(function(){
        if ($(this).val() === 'heart js') {
          displayColorOptGroups( $colorOptions, $(this).val() );
        } else if ($(this).val() === 'js puns') {
          displayColorOptGroups( $colorOptions, $(this).val() );
        } else {
          displayColorOptGroups( $colorOptions, 'notheme' );
        }  // end if ('js puns')
      }); // end #design options
    }) // end shirt design addEventListener

  // event listener for shirt color value
    // capture shirt size, design and color
    $('#color').change(function(){
      signUpRegistration.shirtSize = document.getElementById('size').value;
      signUpRegistration.shirtDesign = document.getElementById('design').value;
      signUpRegistration.shirtColor = document.getElementById('color').value;
    });

  // event listener for activities input
    $('.activities input').click(trackSelectedActivities(event));

  // event listener for change in shirt design value
    // displaying only shirt colors that go with Shirt design theme
    $('#payment').change(function() {

      // move current payment method back to paymentOptions html collection node
        paymentOptions.append( $('#payment').parent().children()[3] );

      // move selected payment option from paymentOptions
        displayPaymentOptions( $(this).val() );

    }); // end #payment addEventListener

// FUNCTION CALLS

  // move payment options to paymentOptions html node
    getPayOptions();

  // move Shirt Color Option Elements to shirt color optgroups
    getOptElements();

  // display ONLY the blank option opt Group
    $colorOptions.append(blankOptGrp.children);

  // set focus on first element field
    focusOnFirstField($nameInput);

});
