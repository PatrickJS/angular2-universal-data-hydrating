import 'angular2-universal/polyfills';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

// Angular 2 Universal
import {
  provide,
  enableProdMode,
  expressEngine,
  REQUEST_URL,
  ORIGIN_URL,
  BASE_URL,
  NODE_ROUTER_PROVIDERS,
  NODE_HTTP_PROVIDERS,
  ExpressEngineConfig
} from 'angular2-universal';

// Application
import {App} from './app/app.component';

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

enableProdMode();

// Express View
app.engine('.html', expressEngine);
app.set('views', __dirname);
app.set('view engine', 'html');

app.use(bodyParser.json());


import {Service} from './app/universal.service';
import {getDOM} from '@angular/platform-browser/src/dom/dom_adapter';


function ngApp(req, res) {
  let baseUrl = '/';
  let url = req.originalUrl || '/';

  let config: ExpressEngineConfig = {
    directives: [ App ],
    platformProviders: [
      provide(ORIGIN_URL, {useValue: 'http://localhost:3000'}),
      provide(BASE_URL, {useValue: baseUrl}),
    ],
    providers: [
      provide(REQUEST_URL, {useValue: url}),
      ...NODE_ROUTER_PROVIDERS,
      ...NODE_HTTP_PROVIDERS,
      Service
    ],
    ngOnStable([{applicationRef, componentRef}]: any, document) {
      const DOM: any = getDOM();
      const injector = componentRef.injector;
      const service = injector.get(Service);
      return new Promise(resolve => {
        service.asyncPrefetch().then(() => {

          let el = componentRef.location.nativeElement;
          let code = `window.UNIVERSAL_DATA = ${JSON.stringify(service._cache)}`;
          let scriptTag = DOM.createScriptTag('type', 'text/javascript', document);
          DOM.setInnerHTML(scriptTag, code);
          DOM.insertAfter(el, scriptTag);

          applicationRef.tick();
          
          resolve();
        });
      });
    },
    async: true,
    preboot: false // { appRoot: 'app' } // your top level app component selector
  };

  res.render('index', config);
}

function indexFile(req, res) {
  res.sendFile('/index.html', {root: __dirname});
}

// Serve static files
app.use(express.static(ROOT, {index: false}));

// Our API for demos only
app.get('/data.json', (req, res) => {
  res.json({
    data: 'This fake data came from the server.'
  });
});

// Routes with html5pushstate
app.use('/', ngApp);
app.use('/about', ngApp);
app.use('/home', ngApp);

// Server
app.listen(3000, () => {
  console.log('Listening on: http://localhost:3000');
});
