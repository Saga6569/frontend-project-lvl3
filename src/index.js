/* eslint-disable no-throw-literal */
/* eslint-disable no-undef */
import onChange from 'on-change';
import * as yup from 'yup';
import { setLocale } from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import {
  generationData, parserData, updatePost, renderingMessage, renderingPosts, renderHeadlines, renderingFids, renderValidForm,
} from './utilits';
import langl from './locales/index.js';

const { ru, en } = langl;

setLocale({
  mixed: {
    default: 'field_invalid',
  },
  string: {
    url: () => ({ key: 'form.invalid' }),
  },

});

const schema = yup.object().shape({
  url: yup.string().url(),
});

const app = () => {
  const state = {
    signUpForm: {
      valid: null,
    },
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
    if (value === 'during') {
      console.log('блокируем кнопку');
      document.querySelectorAll('button')[2].setAttribute('disabled', 'disabled');
      return;
    }
    const text = i18next.t(state.errors.key);
    const validForm = state.signUpForm.valid;
    if (value === 'failed') {
      console.log('отрисовываем ошибку');
      document.querySelectorAll('button')[2].removeAttribute('disabled');
    } else if (value === 'finiched') {
      console.log('успешно');
      document.querySelectorAll('button')[2].removeAttribute('disabled');
      renderHeadlines();
      const { posts, fids } = state.contener;
      posts.map((el) => renderingPosts(el));
      renderingFids(fids);
    }
    renderingMessage(text, value, state.signUpForm.valid);
    renderValidForm(validForm);
  });

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    console.log();
    watchedState.processStatus = 'during';
    const formData = new FormData(e.target);
    const result = formData.get('url');
    const valid = schema.validate({ url: result });
    valid
      .then(({ url }) => {
        if (state.SuccessfulAdded.includes(url)) {
          state.errors = { key: 'form.exist' };
          state.signUpForm.valid = false;
          watchedState.processStatus = 'failed';
          return;
        }
        const promis = axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`);
        promis
          .then((response) => {
            if (response.data.contents === null) {
              state.errors = { key: 'feed.networkError' };
              state.signUpForm.valid = true;
              watchedState.processStatus = 'failed';
              return;
            }
            const XML = parserData(response.data.contents);
            if (XML === 'er') {
              state.errors = { key: 'feed.noRss' };
              state.signUpForm.valid = true;
              watchedState.processStatus = 'failed';
              return;
            }
            const result = generationData(XML);
            state.contener.fids = [...state.contener.fids, ...result.fids];
            state.contener.posts = [...state.contener.posts, ...result.posts];
            state.SuccessfulAdded.push(url);
            state.signUpForm.valid = true;
            watchedState.processStatus = 'finiched';
            console.log('успешный конец промиса');
          });
      })
      .catch((er) => {
        if (er.hasOwnProperty('isAxiosError')) {
          state.errors = { key: 'feed.networkError' };
          state.signUpForm.valid = true;
          watchedState.processStatus = 'failed';
          return;
        }
        state.signUpForm.valid = false;
        state.errors = er.errors[0];
        watchedState.processStatus = 'failed';
      });
  });
};

export default () => {
  const promise = new Promise((resolve, reject) => {
    i18next.init({
      lng: 'ru',
      debug: true,
      resources: {
        ru,
        en,
      },
    });
    resolve(app());
  });
};
