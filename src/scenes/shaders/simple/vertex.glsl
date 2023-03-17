uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;


void main() 
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Wavey!
  modelPosition.z += sin(modelPosition.x * uFrequency.x + -uTime) * 0.1;
  // modelPosition.x += sin(modelPosition.y * 10.0) * 0.1;


  vec4 viewPos = viewMatrix * modelPosition;
  vec4 projPos = projectionMatrix * viewPos;

  gl_Position = projPos;
}