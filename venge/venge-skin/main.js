import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui'


class BasicWorldDemo {
    constructor() {
        this._initScene()
        this._initLights()
        this._initItems()
    }

    _initScene() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);

        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 1000.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(12, 0, 0);

        this._scene = new THREE.Scene();

        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        const controls = new OrbitControls(this._camera, this.renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

        this._scene.background = new THREE.TextureLoader().load('./sky.jpg');
        this._RAF();
    }

    _initLights() {
        var light = new THREE.AmbientLight(0x101010, 20);
        this._scene.add(light);
    }

    _loadModel(path, texture) {
        let glbloader = new GLTFLoader();
        glbloader.load(path, (gltf) => {
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const center = box.getCenter(new THREE.Vector3());

            gltf.scene.position.x += (gltf.scene.position.x - center.x);
            gltf.scene.position.y += (gltf.scene.position.y - center.y);
            gltf.scene.position.z += (gltf.scene.position.z - center.z);

            gltf.scene.rotation.y = 80;

            if (texture) {
                var guntexture = new THREE.TextureLoader().load(texture);
                guntexture.flipY = false;
                const newMaterial = new THREE.MeshBasicMaterial({ map: guntexture });
                gltf.scene.traverse((o) => {
                    if (o.isMesh) o.material = newMaterial;
                });
            }

            this._scene.add(gltf.scene);
        }, undefined, function (error) {

            console.error(error);
        });
    }

    _initItems() {
        let gun = this._loadModel('https://venge.io/files/assets/46780312/1/Weapon-Scar.glb', './Scar_Diffuse.jpg')

        console.log(gun);
    }


    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        requestAnimationFrame(() => {
            this.renderer.render(this._scene, this._camera);
            this.stats.update();
            this._RAF();
        });
    }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
    _APP = new BasicWorldDemo();
});
