import * as React from 'react';

interface ITagMarkProps {
  children: any;
}

export const TagMark = (props: ITagMarkProps) => (
  <span className="log-tag">{props.children}</span>
);
