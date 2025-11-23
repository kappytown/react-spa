# SimpleApp React SPA Template
This is a single page application starter template built in React on the front-end and Node.js on the back-end.

## Prerequisites
- [**npm**](https://www.npmjs.com/) to install all the necessary packages
- [**vite**](https://vite.dev/) to build the application

## Installing
First clone the project and install dependencies:
```bash
mkdir react-spa
cd react-spa
git clone https://github.com/kappytown/react-spa.git
npm install
```

## Server
Clone either the node-server or php-server repository.
**Note:** you many have to update the `server.proxy.target` setting inside the vite.config.mjs file.

# Building
```bash
npm run dev
```

## Features
- HTTP-only cookie token-based authorization. When the user logs in, the credentials are verified in MySQL users table. Upon successfull login, a token is generated, saved into MySQL, and sent back in the response as an HTTP-only cookie to keep the user logged in.
- Service manager to handle all of your RESTful API calls.
- Caching system used to cache anything that you may need cached such as API responses.
- Event observer to subscribe to and publish events such as when a user log into the app.
- Boostrap
- React Router

## Dependencies
- **Global State Management**:
React Context is used to manage global state management for things like authentication
- **React**:
React 18.3.1 - Used 
- **Layout**:
Bootstrap 5.3.3 - Used for responsive page layout and modal functionality
- **Build**:
Vite 7.1.12

## Main layout structure:
```pug
// Wrapper
div#root
  // Header
  header.header
    ...

  // Main
  main
    // Section (Page Content)
    section#content
      ...

  // Footer
  footer.footer
    ...
```

## API Caching
API calls are stored in cache for up to 1 hour when using the useCachService hook. This hook utilizes the cache class for caching API responses but you can also use the cache class to store any key/value pair you desire.

## Authors
- [**@kappytown**](https://github.com/kappytown)

## License
**react-spa** is licensed under the [GNU General Public License v3.0](LICENSE).