import HelloWorld from '../components/HelloWorld.vue'
import Windows from '../components/Windows.vue'

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
}]
