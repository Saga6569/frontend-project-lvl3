/* eslint-disable no-undef */
import onChange from 'on-change';
import * as yup from 'yup';
import { setLocale } from 'yup';
import axios from 'axios';
import Example from './Example.js';
import render from './render';
import { generationData, parserData } from './utilits.js';

setLocale({
  mixed: {
    default: 'field_invalid',
  },
  string: {
    url: () => ({ type: 'url', text: 'Ссылка должна быть валидным URL' }),
  },
});

export default () => {
  const element = document.getElementById('point');
  const obj = new Example(element);
  obj.init();

  const schema = yup.object().shape({
    url: yup.string().url(),
  });

  const state = {
    processStatus: null,
    registrationForm: {
      status: 'invalid',
      url: '',
    },
    SuccessfulAdded: [],
    errors: {},
    contener: {
      fids: [],
      items: [],
    },
  };

  const watchedState = onChange(state, (path, value) => {
    const promise = schema.validate({ url: value });
    promise
      .then(() => {
        console.log('ссылка валидна');
        state.registrationForm.status = 'correct';
        state.registrationForm.url = value;
        state.SuccessfulAdded.push(value);
        return value;
      })
      .then(() => axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(String(value))}`))
      .then((response) => {
        console.log('результат запроса');
        if (response.data.contents === null) {
          console.log('ошибка запроса');
          state.registrationForm.status = 'RequestError';
          return render(state);
        }
        console.log('запрос успешен');
        const XML = parserData(response.data.contents);
        if (XML === 'er') {
          console.log('ошибка парсера');
          state.registrationForm.status = 'rss';
          return render(state);
        }
        console.log('парсим данные');
        const result = generationData(XML);
        console.log(result);
        state.contener.fids = [...state.contener.fids, ...result.fids];
        state.contener.items = [...state.contener.items, ...result.items];
        return render(state);
      })
      .catch((e) => {
        console.log('отрисовывваем ошибки');
        state.registrationForm.status = 'invalid';
        state.errors = e.errors;
        return render(state);
      });
  });

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = formData.get('url');
    watchedState.registrationForm.url = result;
  });
};
