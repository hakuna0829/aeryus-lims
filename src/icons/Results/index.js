import React from 'react';

import { SvgIcon } from '@material-ui/core';

export default function Results(props) {
  return (
    <SvgIcon {...props}>
      <svg viewBox="0 0 68 68">
        <path
          fillRule="evenodd"
          d="M16.5 14.3h7.8v4.1h-6.2v45h21.5c-.4.8-.6 1.5-.6 2 0 .7.1 1.4.4 2.1h-23c-1.4 0-2.5-1.1-2.5-2.5V16.8c.1-1.4 1.2-2.5 2.6-2.5zm35.2 20.8h5.5c.6 0 1.2.3 1.6.7.4.4.7 1 .7 1.6 0 .6-.2 1.2-.6 1.6-.2.2-.5.4-.8.5V51c1.9 2.5 4.2 5.6 6.2 8.3 2.1 2.9 3.6 5.3 3.6 6.1 0 .8-.3 1.6-.8 2.1-.5.6-1.2.9-2 .9H43.9c-.8 0-1.5-.4-2-.9-.5-.6-.8-1.3-.8-2.1s1.6-3.3 3.6-6.1c1.9-2.7 4.3-5.9 6.2-8.3V39.4c-.3-.1-.6-.3-.8-.5-.4-.4-.6-1-.6-1.6 0-.6.3-1.2.7-1.6.3-.4.9-.6 1.5-.6zm5.5 1.5h-5.5c-.2 0-.4.1-.5.2-.1.2-.2.3-.2.5s.1.4.2.5c.1.1.3.2.5.2h.8v13.3l-.2.5c-1.9 2.5-4.3 5.8-6.3 8.5-1.9 2.7-3.3 4.8-3.3 5.2 0 .4.1.8.4 1.1.2.2.5.4.8.4H65c.3 0 .6-.2.8-.4.2-.3.4-.7.4-1.1 0-.4-1.4-2.6-3.3-5.2-1.9-2.7-4.4-6-6.3-8.5l-.2-.5V38h.8c.2 0 .3-.1.5-.2.1-.1.2-.3.2-.5s-.1-.4-.2-.5c-.2-.1-.3-.2-.5-.2zM45.7 62.3c1.3-1.8 3-4.2 4.6-6.3h8.3c1.6 2.1 3.3 4.4 4.6 6.3 1.3 1.8 2.2 3.2 2.2 3.4v.3c0 .1-.1.2-.1.2l-.1.1-.1.1H43.9s-.1 0-.1-.1l-.1-.1c0-.1-.1-.1-.1-.2v-.3c-.2-.2.8-1.6 2.1-3.4zM52.5 33V18.4h-6.2V14.3h7.8c1.4 0 2.5 1.1 2.5 2.5V33h-4.1zm-30.4 3.2h3.3c.1 0 .1 0 .1.1v3.3c0 .1 0 .1-.1.1h-3.3c-.1 0-.1 0-.1-.1v-3.3s0-.1.1-.1zm0 18.8h3.3c.1 0 .1 0 .1.1v3.3c0 .1 0 .1-.1.1h-3.3c-.1 0-.1 0-.1-.1v-3.3c0-.1 0-.1.1-.1zm6.1.7h16.5c-.5.7-1 1.3-1.4 2H28.2c-.5 0-1-.4-1-1 .1-.5.5-1 1-1zm-6.1-7h3.3c.1 0 .1 0 .1.1v3.3c0 .1 0 .1-.1.1h-3.3c-.1 0-.1 0-.1-.1v-3.3s0-.1.1-.1zm6.1.8h19.4c.5 0 1 .4 1 1v.1c-.2.3-.4.6-.7.9-.1 0-.2.1-.3.1H28.2c-.5 0-1-.4-1-1 .1-.7.5-1.1 1-1.1zm-6.1-7h3.3c.1 0 .1 0 .1.1v3.3c0 .1 0 .1-.1.1h-3.3c-.1 0-.1 0-.1-.1v-3.3c0-.1 0-.1.1-.1zm6.1.7h19.4c.5 0 1 .4 1 1 0 .5-.4 1-1 1H28.2c-.5 0-1-.4-1-1 .1-.5.5-1 1-1zm0-6.2h19.1v.3c0 .6.1 1.1.3 1.6H28.2c-.5 0-1-.4-1-1 .1-.5.5-.9 1-.9zm7.1-15.5c3.3 0 5.9 2.7 5.9 5.9 0 3.3-2.7 5.9-5.9 5.9-3.3 0-5.9-2.7-5.9-5.9s2.6-5.9 5.9-5.9zm-.8 1.6h1.6c.3 0 .5.2.5.5v2.5h2.5c.3 0 .5.2.5.5v1.6c0 .3-.2.5-.5.5h-2.5v2.5c0 .3-.2.5-.5.5h-1.6c-.3 0-.5-.2-.5-.5v-2.5h-2.5c-.3 0-.5-.2-.5-.5v-1.6c0-.3.2-.5.5-.5H34v-2.5c-.1-.3.2-.5.5-.5zM27.4 13h4.4c.5 1.4 1.9 2.4 3.5 2.4s3-1 3.5-2.4h4.4c.9 0 1.7.8 1.7 1.7v4.9H25.7v-4.9c0-.9.7-1.7 1.7-1.7zm7.9-4c1.5 0 2.7 1.2 2.7 2.7 0 1.5-1.2 2.7-2.7 2.7-1.5 0-2.7-1.2-2.7-2.7 0-1.5 1.2-2.7 2.7-2.7zm0 1.7c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
          clipRule="evenodd"
        ></path>
      </svg>
    </SvgIcon>
  );
}
