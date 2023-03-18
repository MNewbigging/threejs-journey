uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;

void main() 
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Wavey!
  float elevation = sin(modelPosition.x * 10.0 - uTime) * 0.1;
  //elevation += sin(modelPosition.y + 5.0 - uTime) * 0.1;
  modelPosition.z += elevation;

  vec4 viewPos = viewMatrix * modelPosition;
  vec4 projPos = projectionMatrix * viewPos;

  gl_Position = projPos;

  vUv = uv;
  vElevation = elevation;
}