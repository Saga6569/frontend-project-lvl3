/* eslint-disable no-throw-literal */
/* eslint-disable no-undef */
import onChange from 'on-change';
import * as yup from 'yup';
import { setLocale } from 'yup';
import axios from 'axios';
import i18n from 'i18next';
import {
  generationData, parserData, updatePost, renderingMessage,
  renderingPosts, renderHeadlines, renderingFids, renderValidForm,
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

const defaultLanguage = 'ru';

export default () => {
  const i18next = i18n.createInstance();
  i18next.init({
    lng: defaultLanguage,
    debug: true,
    resources: {
      ru,
      en,
    },
  });

  const state = {
    signUpForm: {
      valid: null,
    },
    processStatus: null,
    SuccessfulAdded: [],
    errors: {},
    contener: {
      fids: [],
      posts: [],
    },
  };

  const watchedState = onChange(state, (path, value) => {
    if (value === 'during') {
      document.querySelectorAll('button')[2].setAttribute('disabled', 'disabled');
      document.querySelector('input').setAttribute('readonly', 'readonly');
      return;
    }

    if (value === 'failed') {
      document.querySelectorAll('button')[2].removeAttribute('disabled');
      document.querySelector('input').removeAttribute('readonly');
    } else if (value === 'finiched') {
      console.log('успешно');
      document.querySelectorAll('button')[2].removeAttribute('disabled');
      document.querySelector('input').removeAttribute('readonly');
      renderHeadlines();
      const { posts, fids } = state.contener;
      posts.map((el) => renderingPosts(el));
      renderingFids(fids);
    }
    const keyMessage = value === 'finiched' ? 'feed.loaded' : state.errors.key;
    const message = i18next.t(keyMessage);
    renderingMessage(message, value);
    renderValidForm(keyMessage);
  });

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.processStatus = 'during';
    const formData = new FormData(e.target);
    const result = formData.get('url');
    const valid = schema.validate({ url: result });
    valid
      .then(({ url }) => {
        if (state.SuccessfulAdded.includes(url)) {
          state.errors = { key: 'form.exist' };
          watchedState.processStatus = 'failed';
          return;
        }
        const promis = axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`);
        promis
          .catch(() => {
            state.errors = { key: 'feed.networkError' };
            watchedState.processStatus = 'failed';
          })
          .then((response) => {
            if (response === undefined) {
              state.errors = { key: 'feed.networkError' };
              watchedState.processStatus = 'failed';
              return;
            }
            const XML = parserData(response.data.contents);
            if (XML === 'er') {
              state.errors = { key: 'feed.noRss' };
              watchedState.processStatus = 'failed';
              return;
            }
            const { fids, posts } = generationData(XML);
            state.contener.fids = [...state.contener.fids, ...fids];
            state.contener.posts = [...state.contener.posts, ...posts];
            state.SuccessfulAdded.push(url);
            watchedState.processStatus = 'finiched';
            const up = () => {
              if (state.SuccessfulAdded.length === 0) {
                return;
              }
              const promise1 = new Promise((resolve) => {
                setTimeout(() => {
                  resolve(updatePost);
                }, 5000);
              });
              promise1.then((value) => {
                value(state);
                up();
              });
            };
            document.querySelector('input').focus();
            up();
          });
      })
      .catch((er) => {
        const err = er.errors[0];
        state.errors = err;
        watchedState.processStatus = 'failed';
      });
  });
};
