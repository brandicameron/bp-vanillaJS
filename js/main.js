var firebaseConfig = {
  apiKey: 'AIzaSyC824t0c0KHHFjqUmbJ8MQDDYDeATpeqdc',
  authDomain: 'bp-readings-70ed2.firebaseapp.com',
  projectId: 'bp-readings-70ed2',
  storageBucket: 'bp-readings-70ed2.appspot.com',
  messagingSenderId: '1059047326555',
  appId: '1:1059047326555:web:e75a87869a74e51a8d507e',
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// LOADING SCREEN

window.onload = setTimeout(() => {
  document.querySelector('.loading-screen').classList.add('hide');
  window.scrollTo(0, 0);
  checkForReadings();
}, 1500);

//  LOGIN

const loginSection = document.querySelector('.login-section');
const loginEmail = document.getElementById('login-email');
const signUpPassword = document.getElementById('signup-password');
const forgotPassword = document.getElementById('forgot-password');
const readingsSection = document.querySelector('.readings-container');

function loginOrSignup() {
  const loginSlider = document.getElementById('login');
  const formTitle = document.querySelector('.form-title');
  const signUpForm = document.querySelector('.signup-form');
  const loginForm = document.querySelector('.login-form');
  const sliderLoginLabel = document.querySelector('.login');
  const sliderSignUpLabel = document.querySelector('.signup');

  if (loginSlider.checked == true) {
    signUpForm.hidden = true;
    loginForm.hidden = false;
    formTitle.textContent = 'Login';
    sliderSignUpLabel.style.color = '#5e5e5e';
    sliderLoginLabel.style.color = '#fff';
  } else {
    signUpForm.hidden = false;
    loginForm.hidden = true;
    formTitle.textContent = 'Signup';
    sliderSignUpLabel.style.color = '#fff';
    sliderLoginLabel.style.color = '#5e5e5e';
  }
}

function loginUser(e) {
  e.preventDefault();
  const email = loginEmail.value;
  const password = document.getElementById('login-password').value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      showUserReadings();
    })
    .catch((err) => {
      let incorrectLogin = document.querySelector('.login-incorrect');
      incorrectLogin.hidden = false;
    });
}

function guestSignIn() {
  auth
    .signInAnonymously()
    .then(() => {
      showUserReadings();
    })
    .catch((err) => {
      console.log('Guest Enter Error Occured');
    });
}

function checkPasswordLength() {
  const warningText = document.querySelector('.password-length-warning');

  if (signUpPassword.value.length < 6) {
    warningText.textContent = '*Password must be at least 6 characters.';
  } else {
    warningText.textContent = '';
  }
}

function signUpUser(e) {
  e.preventDefault();
  const signUpEmail = document.getElementById('signup-email');
  const email = signUpEmail.value;
  const password = signUpPassword.value;

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      showUserReadings();
    })
    .catch((err) => {
      console.log('SignUp Error Occured');
    });
}

function forgotPasswordLink() {
  const email = loginEmail.value;

  if (email == '') {
    forgotPassword.textContent = 'Please enter your email address above.';
    forgotPassword.style.color = '#5e5e5e';
    setInterval(() => {
      forgotPassword.textContent = 'Forgot password?';
      forgotPassword.style.color = '#1a75ff';
      forgotPassword.style.cursor = 'pointer';
    }, 2000);
  } else {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        forgotPassword.textContent = 'Password reset email sent.';
      })
      .catch((err) => {
        console.log('Something went wrong!');
      });
  }
}

function logOut() {
  let logoutBtn = document.querySelector('.logout-btn');
  logoutBtn.classList.toggle('slide-right');

  logoutBtn.addEventListener('click', () => {
    logoutBtn.classList.remove('slide-right');
    auth.signOut();
  });
}

function showUserReadings() {
  document.title = 'Blood Pressure Readings';
  loginSection.classList.add('hide');
  readingsSection.classList.remove('hide');
}

function showLoginPage() {
  document.title = 'Login/Signup';
  loginSection.classList.remove('hide');
  readingsSection.classList.add('hide');
}

// Hide/display login page
auth.onAuthStateChanged((user) => {
  if (user) {
    let userEmail = firebase.auth().currentUser.email;
    if (userEmail == null) {
      userEmail = 'Guest User';
    }
    console.log(`Hello, ${userEmail}.`);
    showUserReadings();
  } else {
    console.log('Please sign in.');
    showLoginPage();
  }
});

// Login event listeners
const loginFormContainer = document.querySelector('.login-form-container');
const accountBtn = document.querySelector('.account');

signUpPassword.addEventListener('keyup', checkPasswordLength);
accountBtn.addEventListener('click', logOut);

loginFormContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('slide')) {
    loginOrSignup();
  }
  if (e.target.classList.contains('login-btn')) {
    loginUser(e);
  }
  if (e.target.classList.contains('guest-btn')) {
    guestSignIn();
  }
  if (e.target.classList.contains('signup-btn')) {
    signUpUser(e);
  }
  if (e.target.classList.contains('forgot-password')) {
    forgotPasswordLink();
  }
});

//  ADDING BLOOD PRESSURE READINGS

const control = document.querySelector('.control-bar');
const readingsUl = document.querySelector('.readings');
const bpForm = document.querySelector('.add-reading-form');
const sysInput = document.querySelector('[name=systolic]');
const diaInput = document.querySelector('[name=diastolic]');

function openCloseAddReadingForm() {
  bpForm.classList.contains('active')
    ? bpForm.classList.remove('active')
    : bpForm.classList.add('active');
  bpForm.classList.contains('active')
    ? (control.textContent = '−') && sysInput.focus()
    : (control.textContent = '+') && sysInput.blur();
  window.scrollTo(0, 0);
}

// Auto Tab the Form - gets called in html
function autoTab(current, to) {
  if (diaInput.value.charAt(0) == 1) {
    diaInput.setAttribute('maxLength', 3);
  }
  if (current.value.length === current.maxLength) {
    to.focus();
  }
}

function addReadingtoFireBase(e) {
  e.preventDefault();
  const sys = sysInput.value;
  const dia = diaInput.value;
  const pulse = document.querySelector('[name=pulse]').value;
  const id = Date.now();
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  bpForm.reset();

  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection(user.uid)
        .doc('+' + id)
        .set({
          id: '+' + id,
          sys,
          dia,
          pulse,
          month,
          day,
          year,
          time,
        })
        .then(() => {})
        .catch((error) => {
          console.log('error!');
        });
    }
  });
  openCloseAddReadingForm();
}

function checkForReadings() {
  if (readingsUl.childElementCount == 0) {
    setTimeout(() => {
      document.body.style.overflow = 'hidden';
      document.querySelector('.no-readings').classList.remove('hide');
    }, 1000);
  } else {
    document.body.style.overflow = 'scroll';
    document.querySelector('.no-readings').classList.add('hide');
  }
}

function displayReadings(reading) {
  let li = document.createElement('li');
  li.className = 'reading-list-item';
  li.id = reading.id;
  readingsUl.insertBefore(li, readingsUl.childNodes[0]);

  let readingContainer = document.createElement('div');
  readingContainer.className = 'reading-container';
  li.appendChild(readingContainer);

  let bpReading = document.createElement('div');
  bpReading.setAttribute('aria-label', 'Blood Pressure Reading:');
  bpReading.className = 'bp';
  bpReading.textContent = `${reading.data().sys}/${reading.data().dia}`;
  readingContainer.appendChild(bpReading);

  let pulseReading = document.createElement('div');
  pulseReading.setAttribute('aria-label', 'Pulse Reading:');
  pulseReading.className = 'pulse';
  pulseReading.textContent = reading.data().pulse;
  let heartImg = document.createElement('img');
  heartImg.setAttribute('aria-hidden', 'true');
  heartImg.className = 'heart';
  heartImg.src = './img/heart.svg';
  heartImg.width = '12';
  heartImg.height = '12';
  pulseReading.appendChild(heartImg);
  readingContainer.appendChild(pulseReading);

  let deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('aria-label', 'Delete reading.');
  deleteBtn.className = 'delete-btn';
  readingContainer.appendChild(deleteBtn);

  let date = document.createElement('time');
  date.className = 'date';
  date.textContent = `${reading.data().month} ${reading.data().day}, ${
    reading.data().year
  } @ ${reading.data().time}`;
  li.appendChild(date);

  bpColorRating(reading.data().sys, reading.data().dia, bpReading);
}

function bpColorRating(systolic, diastolic, display) {
  if (systolic >= 180 || diastolic >= 120) {
    display.classList.add('danger');
    showDangerModal();
  } else if (systolic >= 140 || diastolic >= 90) {
    display.classList.add('ht-stage-2');
  } else if (systolic >= 130 || diastolic >= 80) {
    display.classList.add('ht-stage-1');
  } else if (systolic >= 120 || diastolic >= 80) {
    display.classList.add('elevated');
  }
}

function deleteReading() {
  let readingContainer = document.querySelector('.reading-container');
  readingContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      console.log('clicked!');
      let id = e.target.parentElement.parentElement.id;
      let item = e.target.parentElement.parentElement;
      item.classList.add('delete-slideaway');
      //Stops the delete button on the next item up from showing incorrectly.
      setTimeout(() => {
        item.hidden = 'true';
      }, 300);

      //setTimout gives the animation time to show
      setTimeout(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            db.collection(user.uid).doc(id).delete();
          }
        });
      }, 400);
    }
  });
}

// Realtime Listener
auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection(user.uid).onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type == 'added') {
          displayReadings(change.doc);
          checkForReadings();
          deleteReading();
        } else if (change.type == 'removed') {
          let li = document.getElementById(change.doc.id);
          readingsUl.removeChild(li);
          checkForReadings();
        }
      });
    });
  }
});

// Add reading event listeners
const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click', addReadingtoFireBase);
control.addEventListener('click', openCloseAddReadingForm);
control.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    openCloseAddReadingForm();
  }
});

//  HYPERTENSIVE CRISIS MODAL

const dangerModal = document.querySelector('.danger-modal');
const closeBtn = document.querySelector('.close-btn');
const lastestReading = document.querySelector('.latest-reading');

function showDangerModal() {
  dangerModal.style.visibility = 'visible';
  lastestReading.textContent =
    readingsUl.children[0].children[0].children[0].textContent;
}

function closeDangerModal() {
  dangerModal.style.visibility = 'hidden';
}

closeBtn.addEventListener('click', closeDangerModal);
