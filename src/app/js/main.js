
/*
  Function that show/hide bottom menu on click
  of button 'show more options'
*/
function toggleSideMenu(){
  $( '.side-menu' ).toggleClass( "highlight" );
  var menu = document.getElementById('side-menu');
  var button = document.getElementById('button-footer');
 
  if(menu.classList.contains('highlight')){
    button.firstChild.data = 'More actions...';
  } else {
    button.firstChild.data = 'Show less...'
  }

  $(this).css('bottom', '0');
  $('.footer').toggleClass( "highlight" );
  // console.log($('.footer').attr('class'));
  var activeClasses = $('.footer').attr('class');

  if (activeClasses !== undefined && activeClasses.lastIndexOf('highlight') !== -1) {
    $('.footer').css({"bottom":"0", "height":$('#side-menu').height()}); 
  } else {
    $('.footer').css({"bottom":"0", "height":"0"}); 
  }
}


/*
  Lateral scrolling on system overview page
*/
$(function(){
  $("#subSystems-list-block").mousewheel(function(event, delta){
    // console.log(document.getElementsByClassName('modal-backdrop fade in').length);
    if(document.getElementsByClassName('modal-backdrop fade in').length == 0){
      document.getElementById('scroller').scrollLeft -= (delta * 30);
      event.preventDefault();
    }
  }); 
});
    

/*
  Enable tooltip function
*/
$(document).on('mouseover','[data-toggle="tooltip"]',function(){ 
  $(this).tooltip('show');
});

/*
  Function that fixs breadcrumbs on top of page
  on its scrolling
*/
$(window).scroll(function(){
  if($(this).scrollTop() > $('.head-main-top').height() + 40){
    $('.breadcrumbs-pag').addClass('fixed-top-div');
    fixRecipeButton(true);
  } else {
    $('.breadcrumbs-pag').removeClass('fixed-top-div');
    fixRecipeButton(false);
  }
});

function fixRecipeButton(fixDiv) {
  var ind = window.location.toString();
  if ((ind.lastIndexOf('skillRecipeView') !== -1)) {
    if (fixDiv && ($('#breadcrumbs-div').hasClass('fixed-top-div'))) {
      // console.log('Dettaglio recipe');
      var brHeight = document.getElementById('breadcrumbs-div').offsetHeight;
      var btnWidth = document.getElementById('recipes-buttons').offsetWidth;
      // console.log('btn_w: ' + btnWidth);
      var titleHeight = document.getElementById('recipe-detail-title').offsetHeight;
    
      document.getElementById('recipes-buttons').style.width = '' + btnWidth + 'px';
      document.getElementById('recipes-buttons').style.position = 'fixed';
      document.getElementById('recipes-buttons').style.top = '' + (titleHeight + brHeight + 50) + 'px';
      document.getElementById('values-div').style.left = '' + btnWidth + 'px';
    } else {
      document.getElementById('recipes-buttons').style = '';
      document.getElementById('values-div').style = '';
    }
  }
}

function highlightRow(e){
  // console.log(e);
  $(e).addClass('td-highlight');
  setTimeout(function(){
    $(e).removeClass('td-highlight');
    // console.log(e);
  }, 200);
}

/*
  Function that active/remove tooltip 
  properties on accept conditions div
  on each form
*/
function acceptCheckboxForm(e) {
  var div = $(e).parents().siblings('.confirm-div-button');
  var button = $(div).find('[button-type="confirm"]'); 
  // console.log(div);
  // console.log(button);
  if ($(e).is(':checked')) {
    $(div).attr('data-toggle', null);
    $(div).tooltip('destroy');
    $(button).prop('disabled', false);
  } else {
    $(div).attr('data-toggle', 'tooltip');
    $(button).prop('disabled', true);
  }
}

/*
$(document).on('click','[button-type="confirm"]',function(){
  $(this).prop('disabled', true);
});
*/

/*
  Function that splits screen on two 'part'
  during new order insert if user try to
  insert new product AML definition
*/
function splitScreen(e) {
  var value = $(e).val();
  
  if(value === 'null'){
    $('#main-container').toggleClass('col-sm-12 col-sm-3');
    $('#add-new-prod').toggleClass('col-sm-0 col-sm-9');
    $('#overlay').show();
    $(e).val(null);
  }

  if(value === 'hide'){
    $('#main-container').toggleClass('col-sm-12 col-sm-3');
    $('#add-new-prod').toggleClass('col-sm-0 col-sm-9');
    $('#overlay').hide();
    $('#new-insert-product').click();
  }
}

function removeOverlay() {  
  $('#main-container').toggleClass('col-sm-12 col-sm-3');
  $('#add-new-prod').toggleClass('col-sm-0 col-sm-9');
  $('#overlay').hide();
}


/*
  Function that close every modal open
  in a page
*/
function closeModals() {
  $('.modal').modal('hide');
}


/*
  Function thah adds error message on insert new 
  Observation row if there are some empty fields
*/
function checkObservationInput(e) {
  var showError = false;
  var divs = $(e).parent().siblings();
  sessionStorage.setItem('INSERT_OBS', false);

  if (divs != null) {
    for (var i = 0; i < divs.length; i++) {
      var inputField = $(divs[i]).children()[1];
      if (inputField !== null) {
        if (inputField.value === '') {
          $(inputField).addClass('error-input');
          showError = showError || (inputField.value === '');
        } else {
          $(inputField).removeClass('error-input');
        }
      } 
    }
  }

  var errorMessage = $(e).siblings()[0];
  if (errorMessage != null) {
    if (showError) {
      $(errorMessage).show();
    } else {
      $(errorMessage).hide();
    }
  }
  sessionStorage.setItem('INSERT_OBS', !showError);
}

/* 
  Function that removes error segnalations on changing tab
  on new Observation insert
*/
function checkObservationTab(e) {
  var elementClass = $($(e).parent()).attr('class');
  if (elementClass.lastIndexOf('active') === -1) {
    var elementHref = e.href;
    var idIndex = elementHref.lastIndexOf('#');
    var divId = elementHref.substring(idIndex);    
    var inputsElements = $(divId + ' :input');
    for (var i = 0; i < inputsElements.length; i++) {
      $(inputsElements[i]).removeClass('error-input');
      inputsElements[i].value = '';
    }
    $($(divId).find('span')[0]).hide();
  }
}

/*
  Function that checks for empty fields on new 
  execution table row insert
*/
function checkNewExecutionTableRow(e) {
  var showError = false;
  var x = $('#recipe-id')[0];
  var z = $('#prod-id')[0];

  if ((x.value === undefined || x.value === '')) {
    $(x).addClass('error-input');
    console.log("x indefinito o vuoto");
  } else {
    $(x).removeClass('error-input');
  }

  if (z.value === undefined || z.value === '') {
    $(z).addClass('error-input');
    console.log("z indefinito o vuoto");
  } else {
    $(z).removeClass('error-input');
  }

  showError = showError || (x.value === undefined || x.value === '')
    || (z.value === undefined || z.value === '');
  
  if (showError) {
    $('#error-span').show();
    $('#cancel-row-insert').addClass('execution-table-cancel-btn');
  } else {
    $('#error-span').hide();
    $('#cancel-row-insert').removeClass('execution-table-cancel-btn');
  }
  sessionStorage.setItem('INSERT_ET_ROW', !showError);
  //console.log('JS: ' + sessionStorage.getItem('INSERT_ET_ROW'));
  //console.log('SHOW: ' + showError);
}



/* NOT USED
function assessmentScreenSplit() {
  $('#assessment-main-container').toggleClass('col-sm-12 col-sm-3');
  $('#add-new-observation').toggleClass('col-sm-0 col-sm-9');
  
  // $('#overlay').isHidden();
  console.log($('#overlay').is(":visible"));
  if ($('#overlay').is(":visible")) {
    $('#overlay').hide();
  } else {
    $('#overlay').show();
  }
}
*/


/**/
function prova(e) {
  var elementPosition = e.getBoundingClientRect();
  //console.log(elementPosition.top);
  var divHeight = $('#execution-table-info').height() + 
      parseInt($('#execution-table-info').css('padding').replace(/[^-\d\.]/g, ''), 10);
  //console.log(divHeight);
  if (elementPosition.top < divHeight) {
    $(window).scrollTop(165);
  }
  
  $('#execution-table-info').show();
  setTimeout(
    function(){ 
      $('#execution-table-info').hide(); 
    }, 3500);
}


function resizeRecipeView(e) {
  fixRecipeButton(false);
  var buttons = $('#recipes-buttons');
  var values = $('#values-div');

  $(buttons).toggleClass('col-sm-3 col-sm-1');
  $(values).toggleClass('col-sm-9 col-sm-11');
  $(e).toggleClass('glyphicon-circle-arrow-left glyphicon-circle-arrow-right');

  fixRecipeButton(true);

  var showShortText = $('#recipes-buttons').hasClass('col-sm-1');

  var buttonsList = $('#recipes-buttons').find('button');
  for(let i = 0; i < buttonsList.length; i++) {
    var btn = buttonsList[i];
    if (showShortText) {
      // console.log(btn.getAttribute('short-text'));
      $(btn).html(btn.getAttribute('short-text'));
    } else {
      // console.log(btn.getAttribute('full-text'));
      $(btn).html(btn.getAttribute('full-text'));
    }
  } 
}
