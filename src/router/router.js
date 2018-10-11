import HelloWorld from '../components/HelloWorld.vue'
import Windows from '../components/Windows.vue'
import Login from '../components/Login.vue'

export default [{
    path: '/',
    component: Windows,
    children: [
        {
            path: '',
            redirect: '/home'
        },
        {
            path: '/home',
            component: HelloWorld
        },
    ]
}, 
{
    path: '/Login',
    component: Login,
}]
