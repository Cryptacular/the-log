import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { mockEditorService } from './mocks/services/MockEditorService';
import { mockLogService } from './mocks/services/MockLogService';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <App logService={mockLogService} editorService={mockEditorService} />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
