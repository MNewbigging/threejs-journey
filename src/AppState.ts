import * as THREE from 'three';
import { action, makeObservable, observable } from 'mobx';

import { CanvasListener } from './utils/CanvasListener';
import { Renderer } from './core/Renderer';

export class AppState {
  private canvasListener: CanvasListener;
  private renderer: Renderer;
  private masterClock = new THREE.Clock();

  public setup() {
    // Setup screen listener
    const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Could not find main canvas');
      return;
    }
    this.canvasListener = new CanvasListener(canvas);

    // Renderer
    this.renderer = new Renderer(this.canvasListener);

    // Load initial scene

    // Start render loop
  }

  public toggleFullScreen = () => {
    // For safari use: document.webkitFullscreenElement (typescript doesn't like it)

    if (!document.fullscreenElement) {
      this.canvasListener.canvas.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  private update = () => {
    requestAnimationFrame(this.update);

    const deltaTime = this.masterClock.getDelta();
  };
}
