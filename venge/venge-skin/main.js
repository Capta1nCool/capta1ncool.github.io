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

        this.glbloader = new GLTFLoader();
    }

    _initLights() {
        var light = new THREE.AmbientLight(0x101010, 20);
        this._scene.add(light);
    }

    _loadModel(path, texture) {
        this.glbloader.load(path, (gltf) => {
            this.gunModel = gltf.scene;
            const box = new THREE.Box3().setFromObject(this.gunModel);
            const center = box.getCenter(new THREE.Vector3());

            this.gunModel.position.x += (this.gunModel.position.x - center.x);
            this.gunModel.position.y += (this.gunModel.position.y - center.y);
            this.gunModel.position.z += (this.gunModel.position.z - center.z);

            this.gunModel.rotation.y = 80;

            if (texture) {
                var guntexture = new THREE.TextureLoader().load(texture);
                guntexture.flipY = false;
                const newMaterial = new THREE.MeshBasicMaterial({ map: guntexture });
                this.gunModel.traverse((o) => {
                    if (o.isMesh) o.material = newMaterial;
                });
            }

            this._scene.add(this.gunModel);
        }, undefined, function (error) {

            console.error(error);
        });
    }

    _changeModel(newModel, texture) {
        this._scene.remove(this.gunModel)
        console.log(this.gunModel)
        this._loadModel(newModel, texture)
    }

    _changeTexture(weaponModel, texture) {
        var guntexture = new THREE.TextureLoader().load(texture);
        guntexture.flipY = false;
        const newMaterial = new THREE.MeshBasicMaterial({ map: guntexture });
        weaponModel.traverse((o) => {
            if (o.isMesh) o.material = newMaterial;
        });
    }

    _initItems() {
        this._loadModel("https://venge.io/files/assets/46780312/1/Weapon-Scar.glb", './Scar_Diffuse.jpg')

        document.querySelector("body > button").onclick = () => {
            this._changeModel("https://venge.io/files/assets/46780314/1/Weapon-Shotgun.glb", "./Scar_Diffuse.jpg")
            // this._changeTexture(this.gunModel, 'https://assets.venge.io/Scar-Inferno.png')
        }

        var modelButtons = document.getElementsByClassName("weapon");
        for (var i = 0; i < modelButtons.length; i++) {
            let modelButton = modelButtons[i];
            modelButton.onclick = (e) => {
                console.log(e.srcElement.dataset.texture)
                this._changeModel(e.srcElement.dataset.model, e.srcElement.dataset.texture)
            }
        }
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
