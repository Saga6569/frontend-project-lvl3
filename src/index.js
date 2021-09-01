/* eslint-disable no-undef */
import onChange from 'on-change';
import * as yup from 'yup';
import { setLocale } from 'yup';
import axios from 'axios';
import Example from './Example.js';
import render from './render';
import generationData from './utilits.js';

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
    console.log(value);
    axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(String(value))}`)
      .then((response) => {
        const xmlString = response.data.contents;
        console.log(xmlString);
        const doc1 = parser.parseFromString(xmlString, 'application/xml');
        console.log(doc1);
        const result = generationData(doc1);
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
