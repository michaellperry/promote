import { FormEvent } from 'react';

export function run(operation: () => Promise<void>) {
  operation().catch((err) => console.error(err));
}

export function handler(operation: () => Promise<void>) {
  return () => run(operation);
}

export function formHandler(operation: () => Promise<void>) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run(operation);
  };
}
