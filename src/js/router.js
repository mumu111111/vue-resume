const routes = [
  { path: '/', component: window.App  },
  { path: '/login', component: window.Login },
  { path: '/signUp', component: window.SignUp},
  { path: '/share', component: window.Share}
]

const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

const root = new Vue({
  router,
  data(){
      return{
          currentUser:{}
      }
  }

}).$mount('#root')


