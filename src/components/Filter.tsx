import * as React from 'react';
import { TagMark } from './marks/TagMark';

interface IFilterProps {
  tags: string[];
}

export class Filter extends React.Component<IFilterProps> {
  public render() {
    const { tags } = this.props;
    return (
      <div>
        {tags.map((t, i) => (
          <TagMark key={`${t}-${i}`}>#{t}</TagMark>
        ))}
      </div>
    );
  }
}
