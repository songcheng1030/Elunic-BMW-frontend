import urlJoin from 'url-join';

const baseHref = ((document.getElementsByTagName('base')[0] as HTMLBaseElement) || { href: '' })
  .href;

export const environment = {
  production: true,
  coreServiceUrl: urlJoin(window.location.origin, window.location.pathname, 'core'),
  fileServiceUrl: urlJoin(window.location.origin, window.location.pathname, 'file'),
  tinymceUrl: new URL('tinymce', baseHref).href,
};
