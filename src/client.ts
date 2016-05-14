import 'angular2-universal/polyfills';
import {bootstrap, enableProdMode, BROWSER_ROUTER_PROVIDERS, BROWSER_HTTP_PROVIDERS} from 'angular2-universal';
import {ComponentRef} from '@angular/core';

import {App} from './app/app.component';
import {Service} from './app/universal.service';

enableProdMode();

bootstrap(App, [
  ...BROWSER_ROUTER_PROVIDERS,
  ...BROWSER_HTTP_PROVIDERS,
  {
    provide: Service,
    useFactory: () => {
      var data = getData();
      const service = new Service();
      service._cache = data || service._cache;
      return service;
    }
  }
]);
// .then(afterBootstrap);



function afterBootstrap(componentRef: ComponentRef<any>) {
  const injector = componentRef.injector;
  const service = injector.get(Service);
  let data = getData();
  service._cache = data || service._cache;
  return componentRef;
}


function getData() {
  let data;
  try {
    // data = JSON.parse((<any>window).UNIVERSAL_DATA);
    data = (<any>window).UNIVERSAL_DATA;
  } catch (e) {}
  return data;
}
