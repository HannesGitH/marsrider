varying vec2 vUv;
varying vec3 vPosition;

uniform float uColVal1;
uniform float uTime;

void main(){

    float thirdColor = sin(3.141*mod(vUv.x+uTime*0.5,1.))*0.5;

    vec3 final=vec3(1.-uColVal1,thirdColor,uColVal1);
    
    gl_FragColor=vec4(final,1.);
    
}