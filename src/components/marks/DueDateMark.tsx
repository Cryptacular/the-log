import * as React from 'react';

interface IDueDateMarkProps {
  children: any;
}

export const DueDateMark = (props: IDueDateMarkProps) => (
  <span className="log-due">{props.children}</span>
);
