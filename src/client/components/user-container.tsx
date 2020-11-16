import { UserName, User } from '@shared/model/user';
import * as React from 'react';
import { j } from '../jinaga-config';
import { run } from '../util/processor';

interface UserProps {
  user: User;
  userDisplayName: string;
}

async function login() {
  try {
    const { userFact: user, profile } = await j.login<User>();
    const userDisplayName = profile.displayName;

    // Query for the user's current name.
    const names = await j.query(user, j.for(UserName.forUser));
    if (names.length !== 1 || names[0].value != userDisplayName) {
      // Set their name if it is not set, in conflict, or different.
      await j.fact(new UserName(user, userDisplayName, names));
    }

    return { user, userDisplayName };
  }
  catch (err) {
    return null;
  }
}

const UserContext = React.createContext(null as UserProps);

export const UserContainer = ({ children }: React.PropsWithChildren<{}>) => {
  const [ user, setUser ] = React.useState(null as UserProps);
  React.useEffect(() => {
    run(async () => {
      const user = await login();
      setUser(user);
    });
  }, []);

  return (
    <UserContext.Provider value={user}>
      { children }
    </UserContext.Provider>
  );
}

export function withUser<T>(WrappedComponent: React.Factory<UserProps & T>, DefaultComponent?: React.Factory<T>) {
  DefaultComponent = DefaultComponent || (() => <></>);
  return (props: T) => (
    <UserContext.Consumer>
      { value => value
        ? <WrappedComponent {...value} {...props} />
        : <DefaultComponent {...props} />
      }
    </UserContext.Consumer>
  );
}
