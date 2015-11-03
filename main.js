(function($){
'use strict'

  $(document).ready(init);

  let contactsData = localStorage.contactsData ? JSON.parse(localStorage.contactsData) : [];

  function init() {

    //  $('[data-toggle="popover"]').popover();

    populateTable();

    $('#addressInput').click(clearAddressBox);
    $('#addToContactsButton').click(addToContacts);
    $('tbody').on('click', '.deleteCheckBox', updateDeleteContactsLists);
    $('#deleteContactsButton').click(deleteContacts);
    $('tbody').on('click', '.editModeButton', editContacts);


  }

  function clearAddressBox() {
    $('#addressInput').text('');
  }

  function editContacts(event) {
    let $contactToEdit = $(event.target).closest('tr');
    let contactToEditIndex = $contactToEdit.index();
    let $editButton = $contactToEdit.find('.editModeButton');
    // console.log('here', $editButton.text())
    if ($editButton.text() === 'Edit') {
      // change all tds to an input and include value of text of td
      for (let i = 1; i <= 4; i++) {

        let $contactInfo = $contactToEdit.find('td:nth-child(' + i.toString() + ')');
        let $newInput = $('<input>').attr({
                                            type: 'text',
                                            value: $contactInfo.text()
                                          });
        $contactInfo.text('');
        $contactInfo.append($newInput);
      }
      $editButton.text('Confirm');
    } else {
      let newName = $contactToEdit.find('td:nth-child(1) input').val();
      let newEmail = $contactToEdit.find('td:nth-child(2) input').val();
      let newPhoneNumber = $contactToEdit.find('td:nth-child(3) input').val();
      let newAddress = $contactToEdit.find('td:nth-child(4) input').val();

      contactsData[contactToEditIndex].name = newName;
      contactsData[contactToEditIndex].email = newEmail;
      contactsData[contactToEditIndex].phoneNumber = newPhoneNumber;
      contactsData[contactToEditIndex].address = newAddress;

      updateLocalStorage();

      for (let i = 1; i <= 4; i++) {
        let $contactInfo = $contactToEdit.find('td:nth-child(' + i.toString() + ')');
        let newValue = $contactInfo.children('input').val();
        $contactInfo.empty();
        $contactInfo.text(newValue);
      }

      $editButton.text('Edit');

    }

  }

  function deleteContacts() {

    //splice makes length shorter so skips 2 in a row
    contactsData = contactsData.filter(function(contact){
      if (contact.delete === false){
        return contact;
      }
    });

    updateLocalStorage();
    populateTable();
  }

  function updateDeleteContactsLists(event) {
    let clickedRow = $(event.target).closest('tr').index();

    //ternary expression can be used here I think
    if (contactsData[clickedRow].delete) {
      contactsData[clickedRow].delete = false;
    } else {
      contactsData[clickedRow].delete = true;
    }

    updateLocalStorage();
    populateTable();

  }

  function populateTable() {
    if (contactsData.length){
      $('table').show();
    } else {
      $('table').hide();
    }

// can optimize here by grouping all into one element
// try using clone?
    $('tbody').empty();

    contactsData.forEach(function(contact){

      let $name = $('<td>').text(contact.name);
      let $email = $('<td>').text(contact.email);
      let $phoneNumber = $('<td>').text(contact.phoneNumber);
      let $address = $('<td>').text(contact.address);
      let $editButton = $('<td>').append($('<button>').addClass('editModeButton btn btn-default').text('Edit'));
      let $deleteCheckBox = $('<td>').append($('<input>').attr('type', 'checkbox').addClass('deleteCheckBox checkbox'));

      // delete checkbox checked?
      if (contact.delete === true){
        $deleteCheckBox.find('input').prop('checked', true);
      }

      let $newTr = $('<tr>').append($name, $email, $phoneNumber, $address, $editButton, $deleteCheckBox);

      $('tbody').append($newTr);

    });
  }


  function addToContacts(event) {
    event.preventDefault();
    event.stopPropagation();

    let name = $('#nameInput').val();
    let email = $('#emailInput').val();
    let phoneNumber = $('#phoneNumberInput').val();
    let address = $('#addressInput').val();

    // $('#addToContactsButton').popover('hide');

    if (!(name + email + phoneNumber + address)){
      // $('#addToContactsButton').popover('show');
      return;
    } else {
      console.log('there');
    let newContact = new Contact(name, email, phoneNumber, address);
    contactsData.push(newContact);

    updateLocalStorage();
    populateTable();

    }
  }

  function updateLocalStorage() {

    localStorage.contactsData = JSON.stringify(contactsData);

  }

  let Contact = function(name, email, phoneNumber, address){
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.edit = false;
    this.delete = false;
  }


})(jQuery);
