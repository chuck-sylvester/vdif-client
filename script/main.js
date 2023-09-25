/*
    Basic JavaScript code to run HL7 FHIR queries
    Includes default version of query and a version with a patient value.
    It seems like there is only a single sample patient on the test server (100000002)
*/

// Event listeners to respond to button clicks
document.getElementById('get-metadata-default').addEventListener('click', getMetadataDefault);
document.getElementById('get-metadata-report').addEventListener('click', getMetadataReport);
document.getElementById('clear-metadata').addEventListener('click', clearMetadata);

document.getElementById('get-appointment-default').addEventListener('click', getAppointmentDefault);
document.getElementById('get-appointment-patient').addEventListener('click', getAppointmentPatient);
document.getElementById('get-appointment-date').addEventListener('click', getAppointmentDate);
document.getElementById('clear-appointment').addEventListener('click', clearAppointment);

document.getElementById('get-encounter-default').addEventListener('click', getEncounterDefault);
document.getElementById('get-encounter-date').addEventListener('click', getEncounterDate);
document.getElementById('clear-encounter').addEventListener('click', clearEncounter);

document.getElementById('get-medication-default').addEventListener('click', getMedicationDefault);
document.getElementById('get-medication-code').addEventListener('click', getMedicationCode);
// document.getElementById('get-medication-report').addEventListener('click', getMedicationReport);
document.getElementById('clear-medication').addEventListener('click', clearMedication);

document.getElementById('get-patient-default').addEventListener('click', getPatientDefault);
// document.getElementById('get-medication-code').addEventListener('click', getMedicationCode);
// document.getElementById('get-medication-report').addEventListener('click', getMedicationReport);
document.getElementById('clear-patient').addEventListener('click', clearPatient);

// ---------- Functions to display Metadata results & clear Metadata results  ----------
function getMetadataDefault() {
  getMetadata('default');
}

function getMetadataReport() {
  getMetadata('report');
}

function getMetadata(qualifier) {
  let data = null;
  let req = 'https://vac10apphsh222.va.gov/csp/healthshare/hsods/fhir/r4/metadata';

  // create XHR object that will interact with VDIF server
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  // add listener to respond with ready state changes
  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      let originalValue = this.responseText;
      let jsonValue = JSON.parse(originalValue);
      let prettyValue = JSON.stringify(JSON.parse(originalValue), undefined, 2);

      if (qualifier === 'default') {
        // display JSON formatted responseText
        document.querySelector('#get-metadata-response').innerHTML = req + '<br><br>' + prettyValue;
      } else if (qualifier === 'report') {
        // parse JSON payload to get specific values for the specified keys
        const resourceType = jsonValue.resourceType;
        const id = jsonValue.id;
        const lastUpdated = jsonValue.meta.lastUpdated;
        const fhirVersion = jsonValue.fhirVersion;
        const format = jsonValue.format;

        const sizeOfRestResources = jsonValue.rest[0].resource.length;
        let listOfResources = '';

        for (let i = 0; i < sizeOfRestResources; i++) {
          listOfResources += jsonValue.rest[0].resource[i].type;
          listOfResources += ', ';
        }

        // Add another row for rest[0].resource[4].type ==> Appointment
        // Plus the related values for rest[0].resource[4].searchInclude[...]
        const sizeOfSearchIncludes = jsonValue.rest[0].resource[4].searchInclude.length;
        let listOfResourcesAppointment = '';

        for (let i = 0; i < sizeOfSearchIncludes; i++) {
          listOfResourcesAppointment += jsonValue.rest[0].resource[4].searchInclude[i];
          listOfResourcesAppointment += ', ';
        }

        // Add another row for rest[0].resource[N].type ==> Encounter
        // Plus the related values for rest[0].resource[N].searchInclude[...]

        console.log(jsonValue.rest[0].resource[41].type);
        const sizeOfSearchIncludes41 = jsonValue.rest[0].resource[41].searchInclude.length;
        let listOfResourcesEncounter = '';

        for (let i = 0; i < sizeOfSearchIncludes41; i++) {
          listOfResourcesEncounter += jsonValue.rest[0].resource[41].searchInclude[i];
          listOfResourcesEncounter += ', ';
        }

        let reportContent =
          '<table>' +
          `<tr><td>Resource Type</td><td>${resourceType}</td></tr>` +
          `<tr><td>ID</td><td>${id}</td></tr>` +
          `<tr><td>Last Updated</td><td>${lastUpdated}</td></tr>` +
          `<tr><td>FHIR Version</td><td>${fhirVersion}</td></tr>` +
          `<tr><td>Format</td><td>${format}</td></tr>` +
          `<tr><td>Resource Count</td><td>${sizeOfRestResources}</td></tr>` +
          `<tr><td>Resource List</td><td>${listOfResources}</td></tr>` +
          `<tr><td>Appointment Search List</td><td>${listOfResourcesAppointment}</td></tr>` +
          `<tr><td>Encounter Search List</td><td>${listOfResourcesEncounter}</td></tr>` +
          '</table>';

        document.querySelector('#get-metadata-response').innerHTML = req + '<br><br>' + reportContent;
      }
    }
  });

  xhr.open('GET', req);
  xhr.send(data);
}

function clearMetadata() {
  document.getElementById('get-metadata-response').innerHTML = '<br>';
}

// ---------- Functions to display Appointment results & clear Appointment results  ----------
function getAppointmentDefault() {
  getAppointment('default');
}

function getAppointmentPatient() {
  getAppointment('patient');
}

function getAppointmentDate() {
  getAppointment('date');
}

function getAppointment(qualifier) {
  let data = null;
  let req = 'https://vac10apphsh222.va.gov/csp/healthshare/hsods/fhir/r4/Appointment';

  if (qualifier === 'default') {
    console.log('Qualifier: default');
  } else if (qualifier === 'patient') {
    console.log('Qualifier: patient');
    req += '?patient=100000002';
  } else if (qualifier === 'date') {
    console.log('Qualifier: date');
    req += '?date=2015-10-13';
  }

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      // console.log(req);
      // console.log(this.responseText);
      let originalValue = this.responseText;
      let prettyValue = JSON.stringify(JSON.parse(originalValue), undefined, 2);
      document.querySelector('#get-appointment-response').innerHTML = req + '<br><br>' + prettyValue;
    }
  });

  xhr.open('GET', req);
  xhr.send(data);
}

function clearAppointment() {
  document.getElementById('get-appointment-response').innerHTML = '<br>';
}

// ---------- Functions to display Encounter results & clear Encounter results ----------
function getEncounterDefault() {
  getEncounter('default');
}

function getEncounterDate() {
  getEncounter('date');
}

function getEncounter(qualifier) {
  let data = null;
  let req = 'https://vac10apphsh222.va.gov/csp/healthshare/hsods/fhir/r4/Encounter';

  if (qualifier === 'default') {
    console.log('Qualifier: default');
  } else if (qualifier === 'date') {
    console.log('Qualifier: date');
    req += '?date=2022-01-20  ';
  }

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      // console.log(req);
      // console.log(this.responseText);
      let originalValue = this.responseText;
      let prettyValue = JSON.stringify(JSON.parse(originalValue), undefined, 2);
      document.querySelector('#get-encounter-response').innerHTML = req + '<br><br>' + prettyValue;
    }
  });

  xhr.open('GET', req);
  xhr.send(data);
}

function clearEncounter() {
  document.getElementById('get-encounter-response').innerHTML = '<br>';
}

// ---------- Functions to display Medication results and clear Medication results  ----------
function getMedicationDefault() {
  getMedication('default');
}

function getMedicationCode() {
  getMedication('code');
}

function getMedicationReport() {
  getMedication('report');
}

function getMedication(qualifier) {
  let data = null;
  let req = 'https://vac10apphsh222.va.gov/csp/healthshare/hsods/fhir/r4/Medication?code=3259';

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      // console.log(req);
      // console.log(this.responseText);
      let originalValue = this.responseText;
      let prettyValue = JSON.stringify(JSON.parse(originalValue), undefined, 2);
      document.querySelector('#get-medication-response').innerHTML = req + '<br><br>' + prettyValue;
    }
  });

  xhr.open('GET', req);
  xhr.send(data);
}

function clearMedication() {
  document.getElementById('get-medication-response').innerHTML = '<br>';
}

// ---------- Functions to display Patient results and clear Patient results  ----------
function getPatientDefault() {
  getPatient('default');
}

function getPatientPatient() {
  getPatient('patient');
}

function getMedicationReport() {
  getMedication('report');
}

function getPatient(qualifier) {
  let data = null;
  let req = 'https://vac10apphsh222.va.gov/csp/healthshare/hsods/fhir/r4/Patient';

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      // console.log(req);
      // console.log(this.responseText);
      let originalValue = this.responseText;
      let prettyValue = JSON.stringify(JSON.parse(originalValue), undefined, 2);
      document.querySelector('#get-patient-response').innerHTML = req + '<br><br>' + prettyValue;
    }
  });

  xhr.open('GET', req);
  xhr.send(data);
}

function clearPatient() {
  document.getElementById('get-patient-response').innerHTML = '<br>';
}
