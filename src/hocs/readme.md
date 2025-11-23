# Higher Order Components (HOCs)

These are functions that take a component and return a new component with additional functionality. They are a way of reusing the component's logic.

**This is an example of an HOC and how to use it:**

```JavaScript
import React from 'react';
import logger from '@/utils/logger';

const WithLogger = (WrappedComponent) => {
  return class extends React.Component {
    componentDidMount() {
      logger.log('Component is mounted!');
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default WithLogger;

// Usage
import React from 'react';
import WithLogger from './WithLogger';

const MyComponent = () => {
  return <p>My Component</p>;
}

const EnhancedComponent = WithLogger(MyComponent);
```