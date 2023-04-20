
//імпорту. стилі CSS, функцію debounce lodash і бібліотеку Notiflix Notify.

import './css/styles.css';
//import { fetchCountries } from './fetchCountries';
 import debounce from 'lodash.debounce';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

//встановлю. затримку в 300 мілісекунд 
const DEBOUNCE_DELAY = 300;
//вибираю три елементи HTML 
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const searchBox = document.querySelector('#search-box');

//додаю прослуховувач подій до елемента searchBox
searchBox.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
      e.preventDefault();
      //отримує значення текстового поля введення, видаляє пробіли з початку та кінця рядка
      const searchCountries = e.target.value.trim();
  
      if (!searchCountries) {
          countriesList.style.visibility = "hidden";//приховує елемент countriesList.
          countryInfo.style.visibility = "hidden";//приховує елемент countryInfo.
          countriesList.innerHTML = '';//очищує вміст елемента
          countryInfo.innerHTML = '';
          return;
      }
   //код виконує запит на отримання даних про країни
      fetchCountries(searchCountries)
          .then(result => {  //Якщо запит виконався успішно, то результат зберігається у змінній result
              if (result.length > 10) {  //Якщо знайдено більше 10 країн, то виводиться повідомлення 
                  Notify.info('Too many matches found. Please, enter a more specific name.');
                  return;
              }
              renderedCountries(result);//Якщо кількість знайдених країн менше 10, то викликається функція renderedCountries
          })
          .catch(error => { //Якщо запит не виконався успішно, то очищаються поля
              countriesList.innerHTML = '';
              countryInfo.innerHTML = '';
              Notify.failure('Oops, there is no country with that name');
          })
  };
  

  //Ця функція відповідає за рендерінг списку країн, що відповідають введеному користувачем запиту
  function renderedCountries(result) {// оголошуємо функцію, яка приймає масив з країнами
      const inputLetters = result.length; // знаходимо довжину масиву
  
      if (inputLetters === 1) {// якщо в масиві лише один елемент
          countriesList.innerHTML = '';// очищуємо список країн
          countriesList.style.visibility = "hidden";// приховуємо список країн
          countryInfo.style.visibility = "visible";// показуємо інформацію про країну
          countryCardMarkup(result);// генеруємо HTML-код для виведення інформації про країну
      }
  
      if (inputLetters > 1 && inputLetters <= 10) {  // якщо в масиві від 2 до 10 елементів
          countryInfo.innerHTML = '';  // очищуємо інформацію про країну
          countryInfo.style.visibility = "hidden";  // приховуємо інформацію про країну
          countriesList.style.visibility = "visible";  // показуємо список країн
          countriesListMarkup(result);   // генеруємо HTML-код для виведення списку країн
      }
  }
  
  
  function countriesListMarkup(result) {
      const listMarkup = result.map((({ name, flags }) => {
          return `<li>
                          <img src="${flags.svg}" alt="${name}" width="60" height="auto">
                          <span>${name.official}</span>
                  </li>`;
      })).join('');
      countriesList.innerHTML = listMarkup;
      return listMarkup;
  }
    //створюю розмітку для кожної країни у result.
  function countryCardMarkup(result) {
      const cardMarkup = result.map(({ flags, name, capital, population, languages }) => {//деструктиризую елементи
          languages = Object.values(languages).join(", ");
          return `
              <img src="${flags.svg}" alt="${name}" width="320" height="auto">
              <p> ${name.official}</p>
              <p>Capital: <span> ${capital}</span></p>
              <p>Population: <span> ${population}</span></p>
              <p>Languages: <span> ${languages}</span></p>`;
      }).join(''); //використовую метод join для об'єднання рядків у один великий рядок.
      countryInfo.innerHTML = cardMarkup;//виводю на екран
      return cardMarkup;
  }
  

  const BASE_URL = 'https://restcountries.com/v3.1/name';

  // параметри запиту  поля країн
  const searchParams = new URLSearchParams({
      fields: 'name,capital,population,flags,languages,',
  });
  
  // експортується функція fetchCountries, яка приймає назву країни як параметр і повертає обіцянку;
  export const fetchCountries = (name) => {
      return fetch(`${BASE_URL}/${name}?${searchParams}`)  //робиться запит до REST-сервісу країн за назвою
          .then(response => {
              if (!response.ok) { // перевірка на успішність виконання запиту, якщо запит не був успішним
                  throw new Error(response.status);
              }
              return response.json(); //якщо запит був успішним, повертається об'єкт JSON з даними країни.
  
          });
  };
  
 
