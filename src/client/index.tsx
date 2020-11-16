import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/app";
import { ServiceWorkerContainer } from './components/service-worker-container';
import { UserContainer } from './components/user-container';
import './styles/app';
import { registerServiceWorker } from './util/register-service-worker';

ReactDOM.render(
  <ServiceWorkerContainer registerServiceWorker={registerServiceWorker}>
    <UserContainer>
      <App />
    </UserContainer>
  </ServiceWorkerContainer>,
  document.getElementById('application-host'));
