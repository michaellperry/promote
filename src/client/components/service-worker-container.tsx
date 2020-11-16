import * as React from 'react';

interface ServiceWorkerContainerProps {
  registerServiceWorker(promptForRefresh: (refresh: () => void) => void): void;
}

interface ServiceWorkerProps {
  refresh(): void;
  ignore(): void;
}

const ServiceWorkerContext = React.createContext(null as ServiceWorkerProps);

export const ServiceWorkerContainer = ({ registerServiceWorker, children }: React.PropsWithChildren<ServiceWorkerContainerProps>) => {
  const [serviceWorkerProps, setServiceWorkerProps] = React.useState(null as ServiceWorkerProps);

  React.useEffect(() => {
    registerServiceWorker(refresh => {
      setServiceWorkerProps({
        refresh,
        ignore: () => setServiceWorkerProps(null)
      });
    });
  }, []);

  return (
    <ServiceWorkerContext.Provider value={serviceWorkerProps}>
      { children }
    </ServiceWorkerContext.Provider>
  );
};

export function withRefresh<T>(RefreshComponent: React.Factory<ServiceWorkerProps & T>, DefaultComponent?: React.Factory<T>) {
  DefaultComponent = DefaultComponent || (() => <></>);
  return (props: T) => (
    <ServiceWorkerContext.Consumer>
      { value => value 
        ? <RefreshComponent {...value} {...props} />
        : <DefaultComponent {...props} />
      }
    </ServiceWorkerContext.Consumer>
  );
}
