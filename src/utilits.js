/* eslint-disable no-undef */
import axios from 'axios';
import _ from 'lodash';

export const generationData = (html) => {
  const channel = html.querySelector('channel');
  const fidTitle = channel.querySelector('title').textContent;
  const fidDescription = channel.querySelector('description').textContent;
  const fids = [{ fidTitle, fidDescription }];
  const data = html.querySelector('channel');
  const cild = Array.from(data.children);
  const posts = cild
    .filter((el) => el.tagName.toLowerCase() === 'item')
    .map((el) => {
      const title = el.querySelector('title').textContent.trim();
      const link = el.querySelector('link').textContent;
      const description = el.querySelector('description').textContent;
      const statePost = false;
      return {
        title, link, description, statePost,
      };
    });
  const result = { fids, posts };
  return result;
};

export const parserData = (data) => {
  const parser = new DOMParser();
  const res = parser.parseFromString(data, 'application/xml');
  return res.activeElement.nodeName === 'parsererror' ? 'er' : res;
};

export const coorectUrl = () => {
  document.querySelector('form').reset();
  document.querySelector('.feedback').classList.remove('text-danger');
  document.querySelector('.feedback').classList.add('text-success');
  document.querySelector('.feedback').innerText = 'RSS успешно загружен';
};

export const renderHeadlines = () => {
  const contenerPost = document.querySelector('.posts');
  if (contenerPost.querySelector('.card-title') === null) {
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body-0';
    cardBody.innerHTML = '<h2 class="card-title h4">Посты</h2>';
    contenerPost.append(cardBody);
    const listGroup = document.createElement('ul');
    listGroup.className = 'class="list-group border-0 rounded-0';
    contenerPost.append(listGroup);
  }
  const contenerfids = document.querySelector('.feeds');
  if (contenerfids.querySelector('.card-title') === null) {
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body-0';
    cardBody.innerHTML = '<h2 class="card-title h4">Фиды</h2>';
    contenerfids.append(cardBody);
    const listGroup = document.createElement('ul');
    listGroup.className = 'class="list-group border-0 rounded-0';
    contenerfids.append(listGroup);
  }
};

export const renderingPosts = (posts) => {
  const listGroup = document.querySelector('.posts > ul');
  return posts.map((el) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
    li.innerHTML = `<a href="${el.link}" class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer">${el.title}</a>
    <button type="button" class="btn btn-outline-primary btn-sm" data-id="${_.uniqueId()}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
    return listGroup.append(li);
  });
};

export const renderingFids = (fids) => {
  const listGroup = document.querySelector('.feeds > ul');
  return fids.map((el) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
    li.innerHTML = `<li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">${el.fidTitle}</h3><p class="m-0 small text-black-50">${el.fidDescription}</p></li>`;
    return listGroup.append(li);
  });
};

export const renderError = (state) => {
  document.querySelector('.feedback').classList.remove('text-success');
  document.querySelector('.feedback').classList.add('text-danger');
  document.querySelector('.feedback').innerText = state.errors.text;
};

export const updatePost = (state) => {
  const contenerPost = document.querySelector('.posts > .rounded-0');
  const arrUrl = state.SuccessfulAdded;
  const arrItems = Array.from(contenerPost.children);
  const text = arrItems.map((el) => el.firstChild.textContent);
  console.log(text);
  console.log(contenerPost.childElementCount);
  const arrLl = arrUrl.map((el) => {
    const result = axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(String(el))}`)
      .then((value) => generationData(parserData(value.data.contents)).posts)
      .then((value1) => value1.map((el) => {
        if (!text.includes(el.title)) {
          return el.title;
        }
      }))
      .then((value3) => renderingPosts(value3));
  });
};
