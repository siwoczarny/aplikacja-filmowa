import React from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';
import {AppBar, TextField, RaisedButton, Toolbar} from 'material-ui';
import * as movieActions from './movie-browser.actions';
import * as movieHelpers from './movie-browser.helpers';
import MovieList from './movie-list/movie-list.component';
import * as scrollHelpers from '../common/scroll.helpers';
import MovieModal from './movie-modal/movie-modal.container';

import Popup from 'reactjs-popup';


class MovieBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      currentMovies: []
    };
    // Binds the handleScroll to this class (MovieBrowser)
    // which provides access to MovieBrowser's props
    // Note: You don't have to do this if you call a method
    // directly from a lifecycle method
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.onscroll = this.handleScroll;
    this.props.getTopMovies(this.state.currentPage);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const {topMovies} = this.props;
    if (!topMovies.isLoading) {
      let percentageScrolled = scrollHelpers.getPercentageScrolledDown(window);
      if (percentageScrolled > .8) {
        const nextPage = this.state.currentPage + 1;
        this.props.getTopMovies(nextPage);
        this.setState({currentPage: nextPage});
      }
    }
  }

  render() {
    const {topMovies} = this.props;
    const movies = movieHelpers.getMoviesList(topMovies.response);

    return (
      <div>
        <AppBar title='Movie Browser'>
          <Toolbar>
            <Popup trigger = {
                <button className = "button" > Login </button>}
                  modal
                  closeOnDocumentClick >
                <div class = "login-page" >
                  <div class = "form" >
                    <form class = "login-form" >
                      <input type = "text" placeholder = "username" />
                      <input type = "password" placeholder = "password" />
                      <input type = "submit" value="login"/>
                    </form>
                  </div>
                </div>
            </Popup>
            <Popup trigger = {
                <button className = "button" > Registration </button>}
                  modal
                  closeOnDocumentClick >
                <div class = "register-page" >
                  <div class = "form" >
                    <form class = "register-form" >
                      <input type = "email" placeholder= "e-mail"/>
                      <input type = "text" placeholder = "username" />
                      <input type = "password" placeholder = "password" />
                      <input type = "submit" value="create"/>
                    </form>
                  </div>
                </div>
            </Popup>
          </Toolbar>
        </AppBar>
        <Container>
          <Row>
            <p>Search will go here</p>
          </Row>
          <Row>
            <MovieList movies={movies} isLoading={topMovies.isLoading} />
          </Row>
        </Container>
        <MovieModal />
      </div>
    );
  }
}

export default connect(
  // Map nodes in our state to a properties of our component
  (state) => ({
    topMovies: state.movieBrowser.topMovies
  }),
  // Map action creators to properties of our component
  { ...movieActions }
)(MovieBrowser);