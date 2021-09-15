/* eslint-disable no-throw-literal */
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
    url: null,
    SuccessfulAdded: [],
    errors: {},
    contener: {
      fids: [],
      posts: [],
    },
  };

  const watchedState = onChange(state, (path, value) => {
    const promise = schema.validate({ url: value });
    promise
      .then(() => {
        if ((state.SuccessfulAdded).includes(value)) {
          throw ({ message: { type: 'duble', text: 'RSS уже существует' } });
        }
        state.processStatus = 'inquiry';
        return value;
      })
      .then(() => axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(String(value))}`))
      .then((response) => {
        console.log('результат запроса');
        if (response.data.contents === null) {
          throw ({ message: { type: 'RequestError', text: 'Ресурс не содержит валидный RSS' } });
        }
        const XML = parserData(response.data.contents);
        if (XML === 'er') {
          console.log('ошибка парсера');
          throw ({ message: { type: 'rss', text: 'нет RSS потока' } });
        }
        const result = generationData(XML);
        state.contener.fids = [...state.contener.fids, ...result.fids];
        state.contener.posts = [...state.contener.posts, ...result.posts];
        state.SuccessfulAdded.push(value);
        state.processStatus = 'finiched';
        return render(state);
      })
      .catch((e) => {
        state.processStatus = 'failed';
        state.errors = e.message;
        return render(state);
      });
    const f = () => {
      const promise1 = new Promise((resolve) => {
        setTimeout(() => {
          resolve(state);
        }, 5000);
      });
      promise1.then((value) => {
        console.log(value);
        return f();
      });
    };
    f();
  });

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = formData.get('url');
    watchedState.url = result;
  });
};
