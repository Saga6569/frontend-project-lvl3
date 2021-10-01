/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
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
  const result = parser.parseFromString(data, 'application/xml');
  return result.activeElement.nodeName === 'parsererror' ? 'er' : result;
};

export const renderingMessage = (text, status) => {
  if (status === 'finiched') {
    document.querySelector('.feedback').classList.add('text-success');
    document.querySelector('.feedback').classList.remove('text-danger');
    document.querySelector('form').reset();
  } else if (status === 'failed') {
    document.querySelector('.feedback').classList.add('text-danger');
    document.querySelector('.feedback').classList.remove('text-success');
  }
  document.querySelector('.feedback').innerHTML = text;
};

export const renderValidForm = (data) => {
  if (data === false) {
    document.querySelector('#url-input').classList.add('is-invalid');
    return;
  }
  document.querySelector('#url-input').classList.remove('is-invalid');
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

export const renderingPosts = (post) => {
  const listGroup = document.querySelector('.posts > ul');
  const li = document.createElement('li');
  const id = _.uniqueId();
  li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
  li.innerHTML = `<a href="${post.link}" class="fw-bold" data-id="${id}" target="_blank" rel="noopener noreferrer">${post.title}</a>
    <button type="button" class="btn btn-outline-primary btn-sm" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
  li.querySelector('button').addEventListener('click', () => {
    document.querySelector('.modal-title').innerHTML = `${post.title}`;
    document.querySelector('.modal-body').innerHTML = `${post.description}`;
    document.querySelector('.modal-body').innerHTML = `${post.description}`;
    li.querySelector('a').className = 'fw-normal';
    document.querySelector('.modal-footer > a').setAttribute('href', post.link);
  });
  return listGroup.append(li);
};

export const renderingFids = (fids) => {
  const listGroup = document.querySelector('.feeds > ul');
  const li = document.createElement('li');
  return fids.map((fid) => {
    li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
    li.innerHTML = `<li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">${fid.fidTitle}</h3><p class="m-0 small text-black-50">${fid.fidDescription}</p></li>`;
    return listGroup.append(li);
  });
};

export const updatePost = (state) => {
  const contenerPost = document.querySelector('.posts > .rounded-0');
  const arrUrl = state.SuccessfulAdded;
  const arrItems = Array.from(contenerPost.children);
  const text = arrItems.map((el) => el.firstChild.textContent);
  return arrUrl.map((url) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(String(url))}&disableCache=true`)
    .then((value) => generationData(parserData(value.data.contents)).posts)
    .then((value1) => value1.map((el) => {
      if (!text.includes(el.title)) {
        console.log('совпадение');
        return renderingPosts(el);
      }
      console.log('нет совпадений');
    })));
};
