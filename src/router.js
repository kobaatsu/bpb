import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Config from './views/Config'
import Batter from './views/Batter'
import Pitcher from './views/Pitcher'
import Export from './views/Export'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/config',
      name: 'config',
      component: Config
    },
    {
      path: '/batter',
      name: 'batter',
      component: Batter
    },
    {
      path: '/pitcher',
      name: 'pitcher',
      component: Pitcher
    },
    {
      path: '/export',
      name: 'export',
      component: Export
    }
  ]
})
