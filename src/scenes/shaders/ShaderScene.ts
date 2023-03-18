import * as THREE from 'three';
import * as dat from 'dat.gui';
import { Camera, RawShaderMaterial } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import flag from '../../assets/flag.png';
import flagFragment from './flag/fragment.glsl';
import flagVertex from './flag/vertex.glsl';
import seaFragment from './sea/fragment.glsl';
import seaVertex from './sea/vertex.glsl';
import { BaseScene } from '../BaseScene';

export class ShaderScene extends BaseScene {
  private _camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private meshes: THREE.Mesh[] = [];
  private planeMat: THREE.RawShaderMaterial;
  private gui: dat.GUI = new dat.GUI();
  private debugObject = {
    depthColor: '#186691',
    surfaceColor: '#9bd8ff',
  };

  public get camera(): Camera {
    return this._camera;
  }

  public initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#1680AF');

    // Setup camera
    this.setupCamera();

    // Objects
    this.setupSea();

    const loader = new GLTFLoader();
    loader.load('assets/models/ship_dark.gltf', this.setupShip);

    this.setupDebugUi();
  }

  public updateScene(deltaTime: number): void {
    this.controls.update();

    this.planeMat.uniforms.uTime.value += deltaTime;
  }

  public destroyScene(): void {
    this.meshes.forEach((m) => {
      m.geometry.dispose();
      (m.material as RawShaderMaterial).dispose();
    });
  }

  private setupCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      this.canvasListener.width / this.canvasListener.height,
      0.1,
      1000
    );
    camera.position.x = 0;
    camera.position.y = 2;
    camera.position.z = 2;
    this._camera = camera;
    this.controls = new OrbitControls(this.camera, this.canvasListener.canvas);
    this.controls.enableDamping = true;
  }

  private setupSea() {
    const planeGeom = new THREE.PlaneBufferGeometry(8, 8, 512, 512);
    const planeMat = new THREE.ShaderMaterial({
      vertexShader: seaVertex,
      fragmentShader: seaFragment,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0.0 },

        uBigWavesElevation: { value: 0.1 },
        uBigWavesFrequency: { value: new THREE.Vector2(1, 2) },
        uBigWavesSpeed: { value: 0.5 },

        uSmallWavesElevation: { value: 0.1 },
        uSmallWavesFrequency: { value: 1.5 },
        uSmallWavesSpeed: { value: 0.25 },
        uSmallWavesIterations: { value: 2.0 },

        uDepthColor: { value: new THREE.Color(this.debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(this.debugObject.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5.0 },
      },
    });
    this.planeMat = planeMat;

    const plane = new THREE.Mesh(planeGeom, planeMat);
    plane.rotation.x = -Math.PI * 0.5;

    this.meshes.push(plane);
    this.scene.add(plane);
  }

  private setupShip = (gltf: GLTF) => {
    console.log('loaded ship');

    gltf.scene.traverse((node) => {
      const meshNode = node as THREE.Mesh;
      if (meshNode.isMesh) {
        (meshNode.material as THREE.MeshStandardMaterial).metalness = 0;
        meshNode.castShadow = true;
        meshNode.receiveShadow = true;
      }
    });

    this.scene.add(gltf.scene);
  };

  private setupDebugUi() {
    this.gui
      .add(this.planeMat.uniforms.uBigWavesElevation, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('uBigWavesElevation');
    this.gui
      .add(this.planeMat.uniforms.uBigWavesFrequency.value, 'x')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uBigWavesFrequencyX');
    this.gui
      .add(this.planeMat.uniforms.uBigWavesFrequency.value, 'y')
      .min(0)
      .max(30)
      .step(0.001)
      .name('uBigWavesFrequencyY');
    this.gui
      .add(this.planeMat.uniforms.uBigWavesSpeed, 'value')
      .min(0)
      .max(4)
      .step(0.001)
      .name('uBigWavesSpeed');

    this.gui
      .add(this.planeMat.uniforms.uSmallWavesElevation, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('uSmallWavesElevation');
    this.gui
      .add(this.planeMat.uniforms.uSmallWavesFrequency, 'value')
      .min(0)
      .max(30)
      .step(0.001)
      .name('uSmallWavesFrequency');
    this.gui
      .add(this.planeMat.uniforms.uSmallWavesSpeed, 'value')
      .min(0)
      .max(5)
      .step(0.001)
      .name('uSmallWavesSpeed');
    this.gui
      .add(this.planeMat.uniforms.uSmallWavesIterations, 'value')
      .min(0)
      .max(5)
      .step(1)
      .name('uSmallWavesIterations');

    this.gui
      .addColor(this.debugObject, 'depthColor')
      .name('depthColor')
      .onChange(() => this.planeMat.uniforms.uDepthColor.value.set(this.debugObject.depthColor));
    this.gui
      .addColor(this.debugObject, 'surfaceColor')
      .name('surfaceColor')
      .onChange(() =>
        this.planeMat.uniforms.uSurfaceColor.value.set(this.debugObject.surfaceColor)
      );
    this.gui
      .add(this.planeMat.uniforms.uColorOffset, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('uColorOffset');
    this.gui
      .add(this.planeMat.uniforms.uColorMultiplier, 'value')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uColorMultiplier');
  }

  private setupFlag() {
    const flagGeom = new THREE.PlaneBufferGeometry(1, 1, 128, 128);
    flagGeom.scale(1.6, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(flag);

    const planeMat = new THREE.RawShaderMaterial({
      vertexShader: flagVertex,
      fragmentShader: flagFragment,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
      },
    });

    const mesh = new THREE.Mesh(flagGeom, planeMat);
    this.meshes.push(mesh);
    this.scene.add(mesh);

    this.planeMat = planeMat;
  }
}
