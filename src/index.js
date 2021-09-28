/* eslint-disable no-throw-literal */
/* eslint-disable no-undef */
import './Bootstrap/style.css';
import 'bootstrap';
import onChange from 'on-change';
import * as yup from 'yup';
import { setLocale } from 'yup';
import axios from 'axios';
import render from './render';
import { generationData, parserData, updatePost } from './utilits';

setLocale({
  mixed: {
    default: 'field_invalid',
  },
  string: {
    url: () => ({ type: 'url', text: 'Ссылка должна быть валидным URL' }),
  },
});

const init = () => {
  const schema = yup.object().shape({
    url: yup.string().url(),
  });

  const state = {
    updatePosts: true,
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
        state.contener.fids = [];
        state.contener.posts = [];
        if ((state.SuccessfulAdded).includes(value)) {
          throw ({ message: { type: 'duble', text: 'RSS уже существует' } });
        }
        state.processStatus = 'inquiry';
        return value;
      })
      .then(() => axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(String(value))}&disableCache=true`))
      .then((response) => {
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
        state.updatePosts = true;
        return render(state);
      })
      .catch((e) => {
        // eslint-disable-next-line no-prototype-builtins
        if (e.hasOwnProperty('isAxiosError')) {
          state.errors = { type: 'rss', text: 'Ошибка сети' };
          return render(state);
        }
        state.processStatus = 'failed';
        state.errors = e.message;
        return render(state);
      });

    const update = () => {
      const promise1 = new Promise((resolve) => {
        setTimeout(() => {
          resolve(state);
        }, 5000);
      });
      promise1.then(() => {
        updatePost(state);
        return update();
      });
    };

    if ((state.contener.posts).length === 0 && state.processStatus !== 'failed') {
      update();
    }
  });
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = formData.get('url');
    watchedState.url = result;
  });
};

export default () => new Promise((resolve) => resolve(init()));
