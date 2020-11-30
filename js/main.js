const saveBtn = document.getElementById('saveBtn');
const control = document.querySelector('.control-bar');
let readings = JSON.parse(localStorage.getItem('readings')) || [];
const readingsUl = document.querySelector('.readings'); //the Ul


function addNewBPReading(e) {
	e.preventDefault();

	const systolicInput = document.querySelector('[name=systolic]');
	const diastolicInput = document.querySelector('[name=diastolic]');
	const pulse = document.querySelector('[name=pulse]');
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


	let reading = {
		systolic: systolicInput.value,
		diastolic: diastolicInput.value,
		pulse: pulse.value,
		date: {
			month: month,
			day: day,
			year: year,
			time: time
		}
	};

	readings.push(reading);
	displayReadings(readings, readingsUl, readings[readings.length-1]);
	localStorage.setItem('readings', JSON.stringify(readings));
	raiseLowerControls();
}



function displayReadings(pickArray = [], pickUlElement, item) {

	let li = document.createElement('li');
	pickUlElement.appendChild(li);

		let readingContainer = document.createElement('div');
	readingContainer.className = 'reading-container';
	li.appendChild(readingContainer);

	let bpReading = document.createElement('div');
	bpReading.className = 'bp';
	bpReading.textContent = `${item.systolic}/${item.diastolic}`;
	readingContainer.appendChild(bpReading);

	let pulseReading = document.createElement('div');
	pulseReading.className = 'pulse';
	pulseReading.textContent = item.pulse;
	let heartImg = document.createElement('img');
	heartImg.className = 'heart';
	heartImg.src = "./img/heart.svg";
	pulseReading.appendChild(heartImg);
	readingContainer.appendChild(pulseReading);

	let date = document.createElement('div');
	date.className = 'date';
	date.textContent = `${item.date.month} ${item.date.day}, ${item.date.year} @ ${item.date.time}`;
	li.appendChild(date);
	
	bpColorRating(item.systolic, item.diastolic, bpReading);
	document.querySelector('form').reset();
}


function bpColorRating(systolic, diastolic, display) {
	if (systolic >= 140 || diastolic >= 90) {
		display.classList.add('high');
	} else if (systolic >= 130 || diastolic >= 80) {
		display.classList.add('elevated');
	};
}


function raiseLowerControls() {
	let form = document.querySelector('form');
	let active = (form.classList.contains('active')) ? form.classList.remove('active') : form.classList.add('active');
}


control.addEventListener('click', raiseLowerControls);
saveBtn.addEventListener('click', addNewBPReading);

//displayReadings(readings, readingsUl, readings[1]);






//TO DO

// Of course add to local storage