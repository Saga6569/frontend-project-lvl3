/* eslint-disable no-undef */
import 'bootstrap';
import _ from 'lodash';
import './style.css';
import Icon from './icon.png';

const component = () => {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  element.classList.add('hello');

  const myIcon = new Image();
  myIcon.src = Icon;
  element.appendChild(myIcon);

  return element;
};
export default component;
