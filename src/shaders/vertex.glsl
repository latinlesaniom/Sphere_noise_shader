uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;



attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;


varying float vRandom;
varying vec2 VuV;
varying float u_Time;



void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1 ;
    modelPosition.y += cos(modelPosition.y * uFrequency.y - uTime) * 0.1 ;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;   

    vRandom = aRandom;

    VuV = uv;
    u_Time = uTime;
}