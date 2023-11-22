import { fetchBreeds, fetchCatByBreed } from './cat-api';
import './styles.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'slim-select/styles';
import SlimSelect from 'slim-select';
import axios from 'axios';
axios.defaults.headers.common['x-api-key'] =
  'live_BmJCj1bbQvY1fEs5LpoLsVVgCc44InHNO1vjoGhmkFByGwldXWQniln4D9lplXUl';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

breedSelect.classList.add('is-hidden');
loader.classList.add('is-hidden');
error.classList.add('is-hidden');
catInfo.classList.add('is-hidden');

let arrBreedsId = [];

loader.classList.replace('is-hidden', 'loader');

fetchBreeds()
  .then(data => {
    data.forEach(element => {
      arrBreedsId.push({ text: element.name, value: element.id });
    });

    new SlimSelect({
      select: breedSelect,
      data: arrBreedsId,
    });

    loader.classList.replace('loader', 'is-hidden');
    breedSelect.addEventListener('change', onSelectBreed);
    breedSelect.classList.replace('is-hidden', 'breed-select');
  })
  .catch(onFetchError);

function onSelectBreed(event) {
  loader.classList.replace('is-hidden', 'loader');
  breedSelect.classList.replace('is-hidden', 'breed-select');
  catInfo.classList.add('is-hidden');

  const breedId = event.currentTarget.value;

  fetchCatByBreed(breedId)
    .then(data => {
      loader.classList.replace('loader', 'is-hidden');
      breedSelect.classList.remove('is-hidden');

      const { url, breeds } = data[0];

      catInfo.innerHTML = `<div class="box-img"><img src="${url}" alt="${breeds[0].name}" width="400"/></div><div class="box"><h1>${breeds[0].name}</h1><p>${breeds[0].description}</p><p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`;
      catInfo.classList.remove('is-hidden');
    })
    .catch(onFetchError);
}

function onFetchError() {
  breedSelect.classList.remove('is-hidden');
  loader.classList.replace('loader', 'is-hidden');

  iziToast.error({
    message:
      'Oops! Something went wrong! Try reloading the page or select another cat breed!',
    position: 'topCenter',
  });
}
