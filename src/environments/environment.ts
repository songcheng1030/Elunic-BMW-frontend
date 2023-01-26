// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import urlJoin from 'url-join';

export const environment = {
  production: false,
  coreServiceUrl: urlJoin(window.location.protocol + '//' + window.location.hostname + ':4010'),
  fileServiceUrl: urlJoin(window.location.protocol + '//' + window.location.hostname + ':4020'),
  tinymceUrl: '/tinymce',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
