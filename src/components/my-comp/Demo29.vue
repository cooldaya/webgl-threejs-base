<template>
  <div class="demo21">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip"></div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { getImg } from "@/assets/imgs";
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'




const props = defineProps({});
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
    usePostprocessing:true,
  });

  const setBox = (scene) => {
    const textureLoader = new THREE.TextureLoader();
    const cloudTexture = textureLoader.load(getImg("cloud.png"));
    const lavaTexture = textureLoader.load(getImg("lavatile.jpg"));

    cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
    lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

    const uniforms = {
      texture1: { value: cloudTexture },
      texture2: { value: lavaTexture },
      time: { value: 1.0 },
    };
    const geometry = new THREE.TorusGeometry(5, 2, 50, 40);
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `
        uniform vec2 uvScale;
        varying vec2 vUv;

        void main()
        {

          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          gl_Position = projectionMatrix * mvPosition;

        }`,
      fragmentShader: `
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        varying vec2 vUv;
        uniform float time;

        void main() {
          vec4 noise = texture2D( texture1, vUv );
          vec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;
          vec2 T2 = vUv + vec2( -0.5, 2.0 ) * time * 0.01;
         
          T1.x += noise.x * 2.0;
          T1.y += noise.y * 2.0;
          T2.x -= noise.y * 0.2;
          T2.y += noise.z * 0.2;
          float p = texture2D( texture1, T1 * 2.0 ).a;

          vec4 cloudColor = texture2D( texture2, T1 );

          vec4 color = texture2D( texture2, T2 );
          vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );

          gl_FragColor = temp;

        }
      `,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    threeTool.callOn("renderUpdate", () => {
      uniforms.time.value += 0.05;
    });
  };

  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    setBox(scene);
    const glitchPass = new GlitchPass()

    threeTool.addPass( glitchPass );
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo21 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
  .tip {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
  }
}
</style>
