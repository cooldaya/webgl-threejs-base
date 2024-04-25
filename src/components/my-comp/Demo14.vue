<template>
  <div class="demo14">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip">
      使用instancedBufferGeometry绘制多个相同的物体，每个物体的位置、颜色、大小、方向都可以不同
      （rawShaderMaterial）。
    </div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { effect, onMounted, ref } from "vue";

const props = defineProps({});

const loading = ref(false);
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
  });
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    const COUNT = 100;
    const distance = 10;
    const positions = []; // 基础的三角形的形状 pointes
    const len = 1;
    positions.push(len, -len, 0);
    positions.push(-len, len, 0);
    positions.push(0, 0, len);
    const instancedGeometry = new THREE.InstancedBufferGeometry();
    instancedGeometry.instanceCount = COUNT;
    const randomFloat = (min, max) => Math.random() * (max - min) + min;
    instancedGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const offsets = [];
    const colors = [];
    const quaternions = [];
    const sizes = [];

    Array.from({ length: COUNT }, () => {
      // 随机偏移量 不同方向上的偏移量
      offsets.push(
        randomFloat(-distance, distance),
        randomFloat(-distance, distance),
        randomFloat(-distance, distance)
      );
      // 随机颜色
      colors.push(randomFloat(0, 1), randomFloat(0, 1), randomFloat(0, 1));
      // 随机旋转
      const quaternion = new THREE.Quaternion();
      // 随机旋转角度
      quaternion.setFromEuler(
        new THREE.Euler(
          randomFloat(0, 2 * Math.PI),
          randomFloat(0, 2 * Math.PI),
          randomFloat(0, 2 * Math.PI)
        )
      );
      quaternions.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
      // 随机大小
      sizes.push(randomFloat(0.2, 1));
    });
    instancedGeometry.setAttribute(
      "offset",
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3, false)
    );
    instancedGeometry.setAttribute(
      "color",
      new THREE.InstancedBufferAttribute(new Float32Array(colors), 3, false)
    );
    instancedGeometry.setAttribute(
      "quaternion",
      new THREE.InstancedBufferAttribute(new Float32Array(quaternions), 3, false)
    );
    instancedGeometry.setAttribute(
      "size",
      new THREE.InstancedBufferAttribute(new Float32Array(quaternions), 1, false)
    );

    const material = new THREE.RawShaderMaterial({
      vertexShader: `
        precision highp float;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        attribute vec3 position;
        attribute vec3 offset;
        attribute vec3 color;
        attribute vec4 quaternion;
        attribute float size;

        varying vec4 vColor;

        vec3 applyQuaternionToVector(vec4 q, vec3 v) {
          return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
        }

        void main(){
          vec3 _position = position;
          _position = applyQuaternionToVector(quaternion, _position);
          _position += offset;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(_position, 1.0) * size;

          vColor = vec4(color, 1.0);
        }`,
      fragmentShader: `
        precision highp float;
        varying vec4 vColor;

        void main(){
          gl_FragColor = vColor;
        }`,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(instancedGeometry, material);

    scene.add(mesh);
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo14 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
  .tip {
    position: absolute;
    right: -10px;
    bottom: 10px;
    background: white;
    transform: translateX(100%);
    max-width: 300px;
  }
  .text-red {
    color: red;
  }

  .des {
    height: 200px;
    max-width: 300px;
    overflow: scroll;
  }
}
</style>
