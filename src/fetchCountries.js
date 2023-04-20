
//створюється константа зі значенням базового URL для запитів до REST-сервісу країн за назвою

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
 