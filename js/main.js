var firebaseConfig = {
	apiKey: "AIzaSyC824t0c0KHHFjqUmbJ8MQDDYDeATpeqdc",
	authDomain: "bp-readings-70ed2.firebaseapp.com",
	projectId: "bp-readings-70ed2",
	storageBucket: "bp-readings-70ed2.appspot.com",
	messagingSenderId: "1059047326555",
	appId: "1:1059047326555:web:e75a87869a74e51a8d507e"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();



//  LOGIN SECTION

const loginSection = document.querySelector('.login');
const readingsSection = document.querySelector('.readings-container');
const loginForm = document.querySelector('.login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');


function loginUser(e) {
	e.preventDefault();
	const email = loginEmail.value;
	const password = loginPassword.value;

	auth.signInWithEmailAndPassword(email, password)
		.then(() => {
			showReadings();
		}).catch((err) => {
			console.log('Login Error Occured');
		})
}


// Hides/Displays login page
auth.onAuthStateChanged((user) => {
	if (user) {
		console.log('You are signed in!');
		showReadings();
	} else {
		console.log('You are NOT signed in!');
		showLoginPage();
	}
});


function showReadings() {
	loginSection.classList.add('hide');
	readingsSection.classList.remove('hide');
}


function showLoginPage() {
	loginSection.classList.remove('hide');
	readingsSection.classList.add('hide');
}

loginBtn.addEventListener('click', loginUser);





//  BLOOD PRESSURE SECTION

const saveBtn = document.getElementById('saveBtn');
const control = document.querySelector('.control-bar');
let readings = JSON.parse(localStorage.getItem('readings')) || [];
const readingsUl = document.querySelector('.readings');
const bpForm = document.querySelector('.bp-form');
const sysInput = document.querySelector('[name=systolic]');
const diaInput = document.querySelector('[name=diastolic]');
const pulseInput = document.querySelector('[name=pulse]');


function addReadingtoFb(e) {
	e.preventDefault();
	let sys = sysInput.value;
	let dia = diaInput.value;
	let pulse = pulseInput.value;
	let id = Date.now();
	let findDate = new Date();
	let month = findDate.toLocaleString('default', {
		month: 'short'
	});
	let day = findDate.getDate();
	let year = findDate.getFullYear();
	let time = new Date().toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});
	bpForm.reset();

	auth.onAuthStateChanged((user) => {
		if (user) {
			db.collection(user.uid).doc('+' + id).set({
				id: '+' + id,
				sys,
				dia,
				pulse,
				month,
				day,
				year,
				time
			}).then(() => {}).catch((error) => {
				console.log('error!');
			})
		}
	})
	raiseLowerForm();
	sysInput.blur();
}

saveBtn.addEventListener('click', addReadingtoFb);


function displayReadings(individualDoc) {
	let li = document.createElement('li');
	li.id = individualDoc.id;
	readingsUl.insertBefore(li, readingsUl.childNodes[0]);
//	readingsUl.appendChild(li);

	let readingContainer = document.createElement('div');
	readingContainer.className = 'reading-container';
	li.appendChild(readingContainer);

	let bpReading = document.createElement('div');
	bpReading.className = 'bp';
	bpReading.textContent = `${individualDoc.data().sys}/${individualDoc.data().dia}`;
	readingContainer.appendChild(bpReading);

	let pulseReading = document.createElement('div');
	pulseReading.className = 'pulse';
	pulseReading.textContent = individualDoc.data().pulse;
	let heartImg = document.createElement('img');
	heartImg.className = 'heart';
	heartImg.src = "./img/heart.svg";
	pulseReading.appendChild(heartImg);
	readingContainer.appendChild(pulseReading);

	let deleteBtn = document.createElement('img');
	deleteBtn.src = "./img/trash-can.svg";
	deleteBtn.className = 'delete-btn';
	readingContainer.appendChild(deleteBtn);

	let date = document.createElement('div');
	date.className = 'date';
	date.textContent = `${individualDoc.data().month} ${individualDoc.data().day}, ${individualDoc.data().year} @ ${individualDoc.data().time}`;
	li.appendChild(date);

	bpColorRating(individualDoc.data().sys, individualDoc.data().dia, bpReading);

	deleteBtn.addEventListener('click', (e) => {
		let id = e.target.parentElement.parentElement.id;
		auth.onAuthStateChanged((user) => {
			if (user) {
				db.collection(user.uid).doc(id).delete();
			}
		})
	})
}


// Realtime Listener
auth.onAuthStateChanged(user => {
	if (user) {
		db.collection(user.uid).onSnapshot((snapshot) => {
			let changes = snapshot.docChanges();
			changes.forEach(change => {
				if (change.type == "added") {
					displayReadings(change.doc);
				} else if (change.type == 'removed') {
					let li = document.getElementById(change.doc.id);
					readingsUl.removeChild(li);
				}
			})
		})
	}
})

// reversed order instead by changing the li to ul append in displayReadings function
//auth.onAuthStateChanged(user => {
//	if (user) {
//		db.collection(user.uid).orderBy('id', 'desc').onSnapshot((snapshot) => {
//			let changes = snapshot.docChanges();
//			changes.forEach(change => {
//				if (change.type == "added") {
//					displayReadings(change.doc);
//				} else if (change.type == 'removed') {
//					let li = document.getElementById(change.doc.id);
//					readingsUl.removeChild(li);
//				}
//			})
//		})
//	}
//})


function bpColorRating(systolic, diastolic, display) {
	if (systolic >= 140 || diastolic >= 90) {
		display.classList.add('high');
	} else if (systolic >= 130 || diastolic >= 80) {
		display.classList.add('elevated');
	} else if (systolic >= 120 || diastolic >= 80) {
		display.classList.add('sl-elevated');
	}
}


function raiseLowerForm() {
	bpForm.classList.contains('active') ? bpForm.classList.remove('active') : bpForm.classList.add('active');
	bpForm.classList.contains('active') ? control.textContent = "−" : control.textContent = "+";
	document.querySelector('[name=systolic]').focus();
}


function autoTab(current, to) {
	if (current.value.length === current.maxLength) {
		to.focus();
	}
}

control.addEventListener('click', raiseLowerForm);