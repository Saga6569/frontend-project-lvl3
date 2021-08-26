/* eslint-disable no-undef */
import onChange from 'on-change';
import * as yup from 'yup';
import { setLocale } from 'yup';
import axios from 'axios';
import Example from './Example.js';
import render from './render';

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
    registrationForm: {
      status: 'invalid',
      url: '',
    },
    SuccessfulAdded: [],
    errors: {},
  };

  const watchedState = onChange(state, (path, value) => {
    const parser = new DOMParser();
    axios.get(value)
      .then((response) => {
        const xmlString = response.data;
        console.log(xmlString);
        const doc1 = parser.parseFromString(xmlString, 'text/html');
        console.log(doc1.querySelector('channel'));
        const html = doc1.querySelector('channel');
        //console.log(html.children);
        console.log(doc1);
        const cild = Array.from(html.children);
        const f = cild.filter((el) => el.tagName.toLowerCase() === 'item');
        console.log(f);
        // const items = (html.children).filter(el => el.innerHTML === 'item');
        // console.log(items);
      })
      .catch((error) => {
        console.log(error);
      });

    const promise = schema.validate({ url: value });
    promise
      .then(() => {
        state.registrationForm.status = 'correct';
        state.registrationForm.url = value;
        state.SuccessfulAdded.push(value);
        return render(state);
      })
      .catch((e) => {
        state.registrationForm.status = 'invalid';
        console.log(e.errors[0]);
        // console.log(e.name);
        // console.log(Object.keys(e));
        state.errors = e.errors;
        return render(state);
      });
    console.log('конец прослушки');
  });

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = formData.get('url');
    watchedState.registrationForm.url = result;
  });
};
