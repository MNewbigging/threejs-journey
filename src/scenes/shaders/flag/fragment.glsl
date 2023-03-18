precision mediump float;

uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main() 
{
  vec4 textureColor = texture2D(uTexture, vUv);

  textureColor.rgb *= vElevation * 3.0 + 0.5;

  gl_FragColor = textureColor;
}