<template>
  <div class="container">
    <div class="row">
          <div class="col-md-12">
            <div class="well" id="movie-form">
                <div class="form-group">
                  <label for="name" v-bind:class="{ 'text-danger': hasError }">Name</label><br />
                  <input v-model="name" id='name' class="form-control" />
                </div>
                <div class="form-group">
                  <button v-on:click='freshSearchMovies' :disabled="disabled" class="btn btn-primary">Search</button><br />
                </div>
                <div class="form-group" v-if="hasError">
                    <span class="text-danger">Ops! Something wrong happened.</span>
                </div>
            </div>
          </div>
      <h2 v-if="upcoming">Upcomings</h2>
      <h2 v-else>Search</h2>
    </div>

    <div v-model="search" v-if="search" class="row" v-for="i in Math.ceil(movies.length / 3)">
        <div class="movie-list col-md-4" v-for="movie in movies.slice((i - 1) * 3, i * 3)">
          <div widht="80%" class="movie">
            <div>
              <img :src="'https://image.tmdb.org/t/p/w300/' + movie.image" v-on:click='fetchMovie(movie.id)'/>
            </div>

            <b>{{movie.name}}</b><br />
            {{movie.releaseDateFormatted}}<br />
            <b>Genres:</b>
            <span v-for="genre in movie.genres">
              {{genre.name}}<br />
            </span>
          </div>
        </div>
    </div>
    <div v-else v-for="movie in movies">
      <div class="movie-list col-md-12">
        <div class="movie">
          <div>
            <img :src="'https://image.tmdb.org/t/p/w500/' + movie.image" />
          </div>

          <b>{{movie.name}}</b><br />
          {{movie.releaseDateFormatted}}<br />
          <b>Genres:</b>
          <span v-for="genre in movie.genres">
            {{genre.name}}<br />
          </span>
          <b>Overview:</b>
          <div>
            {{movie.overview}}
          </div>

        </div>
      </div>
    </div>
    <div v-model="search" v-if="search" class="row col-md12">
      <button v-on:click='nextPage' :disabled="disabled" class="btn btn-primary">Next page</button>
    </div>
  </div>
</template>

<script>
import config from '../config'

export default {
  name: 'moviesWidget',
  data: function () {
    return {movies: [], hasError: false, disabled: false, name: null, movieId: null, search: true, page: 1, upcoming: 1}
  },
  watch: {
    '$route' (to, from) {
      this.routeChanged()
      this.$set(this, 'upcoming', this.search && !this.name)
    }
  },
  mounted: function () {
    this.routeChanged()
    this.$set(this, 'upcoming', this.search && !this.name)
  },
  methods: {
    routeChanged: function () {
      if (this.$route) {
        const movieId = this.$route.params.movieId
        if (movieId) {
          this.$set(this, 'movieId', movieId)
          this.fetchMovie(movieId)
        }
        const name = this.$route.params.name
        if (name) {
          this.$set(this, 'name', name)
          this.freshSearchMovies()
        }
        if (!name && !movieId) {
          this.freshSearchMovies()
        }
      }
    },
    processMovie: function (data) {
      data['releaseDateFormatted'] = (new Date(data['releaseDate'])).toLocaleDateString('en-US')
      return data
    },
    fetchMovie: function (movieId) {
      this.$set(this, 'disabled', true)
      this.$set(this, 'movieId', movieId)
      this.$router.push({ name: 'movie', params: { movieId: this.movieId } })
      this.$http.get(config.API_HOST + '/movies/' + movieId).then(function (response) {
        let extendedList = [response.body].map(this.processMovie)
        this.$set(this, 'movies', extendedList)
        this.$set(this, 'disabled', false)
        this.$set(this, 'search', false)
      }, function (e) {
        this.$set(this, 'hasError', true)
        this.$set(this, 'disabled', false)
      })
    },
    freshSearchMovies: function () {
      this.$set(this, 'disabled', true)
      this.$set(this, 'page', 1)
      let params = {params: {page: this.page}}
      if (this.name) {
        params['params']['title'] = this.name
        this.$router.push({ name: 'search', params: {name: this.name} })
      } else {
        this.$router.push({ name: 'home' })
      }
      this.searchMovies(params, false)
    },
    searchMovies: function (params, append) {
      this.$http.get(config.API_HOST + '/movies', params).then(function (response) {
        let extendedList = response.body.map(this.processMovie)
        if (append) {
          extendedList = this.movies.concat(extendedList)
        }
        this.$set(this, 'movies', extendedList)
        this.$set(this, 'disabled', false)
        this.$set(this, 'search', true)
      }, function (e) {
        this.$set(this, 'hasError', true)
        this.$set(this, 'disabled', false)
      })
    },
    nextPage: function () {
      this.$set(this, 'disabled', true)
      let page = this.page
      let params = {params: {page: page + 1}}
      this.$set(this, 'page', page + 1)
      if (this.name) {
        params['params']['title'] = this.name
      }
      this.searchMovies(params, true)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: bold;
  font-size: 100px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.error {
  color: red;
}
#movie-form, #movies-info {
  height: 280px;
}
.movie {
  background-color:lightgray;
  padding:10px;
  margin:20px;
}
</style>
