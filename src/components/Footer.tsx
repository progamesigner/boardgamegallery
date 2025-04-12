import type { JSX } from 'solid-js';

export function Footer(): JSX.Element {
  return (
    <p>
      Made with <span class="text-red-600">♥</span> by{' '}
      <a class="link link-hover" href="https://progamesigner.com">
        progamesigner
      </a>
    </p>
  );
}
