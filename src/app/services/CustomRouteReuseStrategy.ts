import {RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle} from '@angular/router';
import {ComponentRef, Injectable} from '@angular/core';


@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {

  handlers: { [key: string]: DetachedRouteHandle } = {};

  shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return before.routeConfig === curr.routeConfig;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data.shouldReuse || false;
  }

  store(route: ActivatedRouteSnapshot, handle: {}): void {
    if (route.data.shouldReuse) {
      this.handlers.paramKey =  Object.keys(route.params)[0];
      this.handlers.paramValue = route.params[Object.keys(route.params)[0]];
      this.handlers[route.routeConfig.path] = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (
      Object.keys(route.params)[0] === this.handlers.paramKey
      && this.handlers.paramValue === route.params[Object.keys(route.params)[0]]
      && !!route.routeConfig
      && !!this.handlers[route.routeConfig.path]) {
      return true;
    } else {
      return false;
    }
  }

  retrieve(route: ActivatedRouteSnapshot): {} {
    if (!route.routeConfig) return null;
    return this.handlers[route.routeConfig.path];
  }

  deactivateAllHandles() {
    // tslint:disable-next-line forin
    for (const key in this.handlers) {
      this.deactivateOutlet(this.handlers[key]);
    }
    this.handlers = {};
  }

  // Todo: we manually destroy the component view here. Since RouteReuseStrategy is experimental, it
  // could break anytime the protocol change. We should alter this once the protocol change.
  private deactivateOutlet(handle: DetachedRouteHandle): void {
    const componentRef: ComponentRef<any> = handle['componentRef'];
    if (componentRef) {
      componentRef.destroy();
    }
  }


}
