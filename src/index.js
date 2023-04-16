import './css/styles.css';
import { fetchCountries } from './fetchCountries';
// import debounce from 'lodash.debounce';
const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

fetchCountries(value)
.then(data => {
  if (data.length > 10) {
    Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  renderCountries(data);
})
.catch(err => {
  clearInterfaceUI();
  Notify.failure('Oops, there is no country with that name');
});