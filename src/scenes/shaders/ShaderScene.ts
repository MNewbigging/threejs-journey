import * as THREE from 'three';
import { Camera, MeshBasicMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BaseScene } from '../BaseScene';

export class ShaderScene extends BaseScene {
  private _camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private meshes: THREE.Mesh[] = [];

  public get camera(): Camera {
    return this._camera;
  }

  public initScene(): void {
    this.scene = new THREE.Scene();

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      this.canvasListener.width / this.canvasListener.height,
      0.1,
      1000
    );
    camera.position.x = 2;
    camera.position.y = 2;
    camera.position.z = 2;
    this._camera = camera;
    this.controls = new OrbitControls(this.camera, this.canvasListener.canvas);
    this.controls.enableDamping = true;

    // Objects
    const planeGeom = new THREE.PlaneGeometry();
    const planeMat = this.getShaderMaterial();
    const mesh = new THREE.Mesh(planeGeom, planeMat);
    this.meshes.push(mesh);
    this.scene.add(mesh);
  }

  public updateScene(deltaTime: number): void {
    this.controls.update();
  }

  public destroyScene(): void {
    this.meshes.forEach((m) => {
      m.geometry.dispose();
      (m.material as MeshBasicMaterial).dispose();
    });
  }

  private getShaderMaterial() {
    return new THREE.RawShaderMaterial({
      vertexShader: `
        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 modelMatrix;

        attribute vec3 position;

        void main() 
        {
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;

        void main() 
        {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,
    });
  }
}
