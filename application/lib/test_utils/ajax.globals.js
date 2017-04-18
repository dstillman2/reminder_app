import $ from 'jquery';

global.navigator = {
  userAgent: 'node.js',
};

global.$ = $;

window = global;
window.location = {
  href: '/',
};
