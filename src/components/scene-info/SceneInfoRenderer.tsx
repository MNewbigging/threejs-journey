import React from 'react';
import { SceneName } from '../../scenes/SceneList';

export class SceneInfoRenderer {
  public static renderSceneInfo(sceneName: SceneName) {
    switch (sceneName) {
      case SceneName.BASIC_TRANSFORMS:
      //return <BasicTransformsInfo />;
      case SceneName.BASIC_ORBIT_CAM:
      //return <BasicOrbitCamInfo />;
      case SceneName.STANDARD_ORBIT_CAM:
      //return <StandardOrbitCamInfo />;
      case SceneName.BUFFER_GEOMETRY:
      //return <BufferGeometryInfo />;
      case SceneName.BASIC_TEXTURE:
      // return <BasicTextureInfo />;
      case SceneName.MATERIALS:
      //return <MaterialsInfo />;
      default:
        return <div>No info for this scene!</div>;
    }
  }
}
