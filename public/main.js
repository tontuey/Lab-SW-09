document.addEventListener('DOMContentLoaded', function() {
  try{
      let app =firebase.app();
      let features = ['auth','database','messaging','storage'].filter
      (feature => typeof app[feature] === 'function');
      document.getElementById('status').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
      let db = firebase.database();
  //load contacts both old and newly added 
  db.ref('contacts').on('child_added', snapshot =>{
      if (snapshot.exists()){
      console.log("added",snapshot.val(),snapshot.key);
       let contactRecord = contactRecordFromSnapshot(snapshot);
       let contactsElem = document.getElementById('contacts');
       contactsElem.innerHTML = contactRecord + contactsElem.innerHTML;
      }
  });
  //save a new contact when Add button clicked 
  document.querySelector ('.addContact') 
   .addEventListener('click', event => {
      event.preventDefault() //prevents default form submt 
      if (
          document.querySelector ('#name').value != '' &&
          (document.querySelector ('#email').value != '' || 
          document.querySelector ('#phone').value != '')
      ){
          db.ref ('contacts') .push ({
            name: document.querySelector ('#name').value, detail: {
                email: document.querySelector ('#email').value, 
                phone: document.querySelector ('#phone').value 
              }
          });
          contactForm.reset ();
      } else {
          document.querySelector('status') .innerHTML = 'Some fields are  missing';
      }
      });
  }catch(e){
          console.error(e);
          document.getElementById('status').innerHTML='Error loading the Firebase SDK,check the console.';
      }
  });
  
   function contactRecordFromSnapshot (snapshot) {
      let contact = snapshot.val();
      let key = snapshot.key;
       var record =''; 
       record = '<li>' + contact.name + '</li>';
       record += '<ul>';
       record += '<li>Email:' + contact.detail.email + '</li>';
       record += '<li>Phone:' + contact.detail.phone + '</li>';
       record += '<button><a href onclick="removeContact( \'' + key + '\' )">Remove</a></button>';
       record += '</ul></li>';
       return record;
   }
       function removeContact(key) {
          firebase.database().ref('contacts/' + key).remove();
          console.log('removed', key);
          return false;
   }
  