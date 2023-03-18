uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elavation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                    sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) * 
                    uBigWavesElevation;

  modelPosition.y += elavation;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}