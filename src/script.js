import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

/**
 * Base
 */
const gui = new dat.GUI({
    width: 400
})
const debugObject = {}

//canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Medusa
 */
//Geometry
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.RawShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        wireframe: true,
        uniforms: {
            uTime: {value: 0},
            uFrequency: {value: new THREE.Vector2(10, 5)},
        }
    })
)
scene.add(sphere)
gui.add(sphere.material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX')
gui.add(sphere.material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY')
gui.add(sphere.material, 'wireframe')


const count = sphere.geometry.attributes.position.count

const random = new Float32Array(count)

for(let i = 0; i < count; i++){

    random[i] = Math.random()

}
sphere.geometry.setAttribute('aRandom', new THREE.BufferAttribute(random, 1))

/**
 * sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})


const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x =  event.clientX / sizes.width - 0.5
    cursor.y =  - (event.clientY / sizes.height - 0.5)
})

/**
 * camera
 */
//base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, -0.25, 4)
scene.add(camera) 


//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true 


//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    sphere.material.uniforms.uTime.value = elapsedTime

    camera.position.y = - scrollY / sizes.height * 4

    const parallaxX = cursor.x
    const parallaxY = cursor.y
    camera.position.x = parallaxX
    camera.position.y = parallaxY

    sphere.rotation.y -= Math.sin(0.1)  * 0.01 

    //update controls
    controls.update()

    //renderer
    renderer.render(scene, camera)

    //call tick again on the next frame

    window.requestAnimationFrame(tick)

}

tick()
