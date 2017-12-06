import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { createOauthFlow } from 'react-oauth-flow'; // eslint-disable-line
import logo from './logo.svg';
import './App.css';

const { Sender, Receiver } = createOauthFlow({
  authorizeUrl: 'https://www.dropbox.com/oauth2/authorize',
  tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
  clientId: process.env.REACT_APP_DB_KEY,
  clientSecret: process.env.REACT_APP_DB_SECRET,
  redirectUri: 'http://localhost:3000/auth/dropbox',
});

class App extends Component {
  handleSuccess = (accessToken, { response, state }) => {
    console.log('Success!');
    console.log('AccessToken: ', accessToken);
    console.log('Response: ', response);
    console.log('State: ', state);
  };

  handleError = async error => {
    console.error('Error: ', error.message);

    const text = await error.response.text();
    console.log(text);
  };

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>

          <Route
            exact
            path="/"
            render={() => (
              <div>
                <Sender
                  render={({ url }) => <a href={url}>Connect ot Dropbox</a>}
                />
              </div>
            )}
          />

          <Route
            exact
            path="/auth/dropbox"
            render={({ location }) => (
              <Receiver
                location={location}
                onAuthSuccess={this.handleSuccess}
                onAuthError={this.handleError}
                render={({ processing, state, error }) => {
                  if (processing) {
                    return <p>Processing!</p>;
                  }

                  if (error) {
                    return <p style={{ color: 'red' }}>{error.message}</p>;
                  }

                  return <pre>{JSON.stringify(state, null, 2)}</pre>;
                }}
              />
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
