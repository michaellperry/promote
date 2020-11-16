import { Domain } from "@shared/model/visit";
import * as React from 'react';
import '../styles/app';
import { RefreshBar } from './refresh-bar';
import { withUser } from './user-container';
import { VisitCounter } from "./visit-counter";

const AppDetail = withUser(({ user, userDisplayName }) => (
    <VisitCounter user={ user } userDisplayName={ userDisplayName } fact={ new Domain("myapplication") } />
  ), () => (
    <a href="/auth/twitter">Sign in with Twitter</a>
  )
);

export const App = () => {
  return (
    <>
      <AppDetail />
      <RefreshBar />
    </>
  );
};
