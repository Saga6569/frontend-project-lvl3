/* eslint-disable no-prototype-builtins */
/* eslint-disable no-throw-literal */
/* eslint-disable no-undef */
import onChange from 'on-change';
import * as yup from 'yup';
import { setLocale } from 'yup';
import i18n from 'i18next';
import {
  generationData, parserData, updatePost, renderingMessage, formLock,
  renderingPosts, renderHeadlines, renderingFids, router,
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
    debug: false,
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
    successfulAdded: [],
    errors: {},
    contener: {
      fids: [],
      posts: [],
    },
  };

  const input = document.querySelector('input');
  const form = document.querySelector('form');
  const buttonForm = document.querySelectorAll('button')[2];
  const feedbaСkcontainer = document.querySelector('.feedback');
  const watchedState = onChange(state, async (path, value) => {
    formLock(value, input, buttonForm);
    renderingMessage(value, feedbaСkcontainer);
    if (value === 'finiched') {
      form.reset();
      buttonForm.removeAttribute('disabled');
      input.removeAttribute('readonly');
      renderHeadlines();
      const { posts, fids } = state.contener;
      posts.map((el) => renderingPosts(el));
      await renderingFids(fids);
    }
    const keyMessage = value === 'finiched' ? 'feed.loaded' : state.errors.key;
    const message = i18next.t(keyMessage);
    feedbaСkcontainer.innerHTML = message;
    if (keyMessage === 'form.exist' || keyMessage === 'form.invalid') {
      input.classList.add('is-invalid');
      return;
    }
    input.classList.remove('is-invalid');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.processStatus = 'during';
    const formData = new FormData(e.target);
    const result = formData.get('url');
    try {
      await schema.validate({ url: result });
      if (state.successfulAdded.includes(result)) {
        state.errors = { key: 'form.exist' };
        watchedState.processStatus = 'failed';
        return;
      }
      const response = await router(result);
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
      state.successfulAdded.push(result);
      watchedState.processStatus = 'finiched';
      input.focus();
    } catch (er) {
      const key = 'request';
      if (er.hasOwnProperty(key)) {
        state.errors = { key: 'feed.networkError' };
        watchedState.processStatus = 'failed';
        return;
      }
      const err = er.errors[0];
      state.errors = err;
      watchedState.processStatus = 'failed';
    }
  });
  const up = async () => {
    if (state.successfulAdded.length === 0) {
      console.log('не обновляем');
      return setTimeout(() => {
        up();
      }, 5000);
    }
    updatePost(state);
    console.log('обновляем');
    return setTimeout(() => {
      up();
    }, 5000);
  };
  up();
};
