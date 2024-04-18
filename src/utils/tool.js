import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { debounce } from "radash";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

// 引入CSS3渲染器CSS3DRenderer
import {
  CSS3DRenderer,
  CSS3DObject,
  CSS3DSprite,
} from "three/addons/renderers/CSS3DRenderer.js";

export default class ThreeTool {
  scene = null;
  camera = null;
  renderer = null;
  css2dRenderer = null;
  css2DObjectDefaultGroup = null;

  css3dRenderer = null;
  css3DObjectDefaultGroup = null;
  css3DSpriteDefaultGroup = null;

  controls = null;
  stats = null;
  canvas = null;
  canvasWrapperElement = null;
  gui = null;
  utils = {}; // 工具集
  pickEvens = []; // 点击事件集合

  // 构造函数
  constructor(config = {}) {
    this.setupByConfig(config);
  }

  // 配置初始化
  setupByConfig(config) {
    if (config.cwe && config.cwe.nodeType !== 1)
      return new Error("canvasWrapperElement is not a element");
    const defaultConfig = {
      showEyeMap: false,
      showFps: true,
      showHelper: true,
      showGUI: false,

      neededRender: false,
      isClick: true,
    };
    const initConfig = Object.assign({}, defaultConfig, config);

    const {
      showEyeMap,
      showFps,
      showHelper,
      showGUI,
      cwe: canvasWrapperElement,
      neededRender,
      isClick,
    } = (this.initConfig = initConfig);

    this.init(canvasWrapperElement);
    this.addResizeListener();
    this.createUtils();
    neededRender ? this.neededRender() : this.keepRender();
    showEyeMap && this.addEyeMap();
    showFps && this.showFps();
    showHelper && this.showHelper();
    showGUI && this.showGUI();
    isClick && this.addClickEventListener();
  }

  // 初始化
  init(canvasWrapperElement) {
    console.log("ThreeTool init");

    this.canvasWrapperElement = canvasWrapperElement;
    this.canvas = this.setupCanvas(canvasWrapperElement); // 创建canvas元素
    const canvasRect = this.canvas.getBoundingClientRect();
    // 场景
    this.scene = new THREE.Scene();

    // 相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvasRect.width / canvasRect.height,
      0.1,
      1000
    );
    this.camera.position.set(4, 2.5, 8);

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    this.renderer.setSize(canvasRect.width, canvasRect.height);

    this.renderer.setClearColor(0x000000, 1);
    this.scene.background = new THREE.Color("#ccc");
    this.scene.environment = new THREE.Color("#eee");

    // CSS2D渲染器
    this.css2dRenderer = new CSS2DRenderer();
    this.css2dRenderer.setSize(canvasRect.width, canvasRect.height);
    Object.assign(this.css2dRenderer.domElement.style, {
      // 样式初始化
      position: "absolute",
      inset: "0",
      zIndex: "1000",
      pointerEvents: "none",
    });
    this.canvasWrapperElement.appendChild(this.css2dRenderer.domElement); // 添加到canvasWrapper元素中
    this.css2DObjectDefaultGroup = new THREE.Group();
    this.scene.add(this.css2DObjectDefaultGroup); // 添加到场景中

    // CSS3D渲染器
    this.css3dRenderer = new CSS3DRenderer();
    this.css3dRenderer.setSize(canvasRect.width, canvasRect.height);
    Object.assign(this.css3dRenderer.domElement.style, {
      // 样式初始化
      position: "absolute",
      inset: "0",
      zIndex: "1001",
      pointerEvents: "none",
    });
    this.canvasWrapperElement.appendChild(this.css3dRenderer.domElement); // 添加到canvasWrapper元素中
    this.css3DObjectDefaultGroup = new THREE.Group();
    this.scene.add(this.css3DObjectDefaultGroup); // 添加到场景中
    this.css3DSpriteDefaultGroup = new THREE.Group();
    this.scene.add(this.css3DSpriteDefaultGroup); // 添加到场景中

    // 控制器

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 500;
    this.controls.update();

    return {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      controls: this.controls,
    };
  }

  // 循环渲染
  keepRender(config = {}) {
    const { callback } = config;
    function render(time) {
      time *= 0.001; // 将时间单位变为秒
      callback && callback(time);
      this.controls.update();
      this.stats.update();
      this.renderer.render(this.scene, this.camera);
      this.css2dRenderer.render(this.scene, this.camera);
      this.css3dRenderer.render(this.scene, this.camera);

      requestAnimationFrame(render.bind(this));
    }
    requestAnimationFrame(render.bind(this));
  }

  // 按需渲染
  neededRender(config = {}) {
    let renderRequested = false;
    function render() {
      renderRequested = false;
      this.controls.update();
      this.stats && this.stats.update();
      this.renderer.render(this.scene, this.camera);
      this.css2dRenderer.render(this.scene, this.camera);
      this.css3dRenderer.render(this.scene, this.camera);
    }
    function requestRenderIfNotRequested() {
      if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render.bind(this));
      }
    }

    this.controls.addEventListener(
      "change",
      requestRenderIfNotRequested.bind(this)
    );
    window.addEventListener("resize", requestRenderIfNotRequested.bind(this));
    requestAnimationFrame(render.bind(this));
  }

  // 窗口自适应
  addResizeListener() {
    const resizeRendererToDisplaySize = (renderer) => {
      const canvas = renderer.domElement;
      const parentNode = canvas.parentNode;
      const { width: pWidth, height: pHeight } =
        parentNode.getBoundingClientRect();
      const { width: cWidth, height: cHeight } = canvas.getBoundingClientRect();
      const needResize = pWidth !== cWidth || pHeight !== cHeight;
      if (needResize) {
        renderer.setSize(pWidth, pHeight, true);
        css2dRenderer.setSize(pWidth, pHeight, true);
        css3dRenderer.setSize(pWidth, pHeight, true);
      }
      return needResize;
    };
    const canvas = this.renderer.domElement;
    window.addEventListener(
      "resize",
      debounce({ delay: 100 }, () => {
        if (resizeRendererToDisplaySize(this.renderer)) {
          const canvas = this.renderer.domElement;
          this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
          this.camera.updateProjectionMatrix();
        }
      }),
      false
    );
  }

  // 添加工具集
  createUtils() {
    this.utils = {};

    const toolsMap = new Map([
      [
        "importGltfModel",
        () => {
          // 导入模型函数
          const gltfLoader = new GLTFLoader();
          return (url, postOperations = {}) => {
            const {
              position = { x: 0, y: 0, z: 0 },
              rotation = { x: 0, y: 0, z: 0 },
              scale = { x: 1, y: 1, z: 1 },
              callback,
            } = postOperations;
            const getVals = (obj) => Object.values(obj);

            const loadedHandle = (gltf) => {
              const model = gltf.scene;
              model.position.set(...getVals(position));
              model.rotation.set(...getVals(rotation));
              model.scale.set(...getVals(scale));
              this.scene.add(model);

              const info = this.getInfo();
              callback?.(model, {
                ...info,
              });
              info.renderFunc();
            };
            gltfLoader.load(url, loadedHandle);
          };
        },
      ],
      ["addMesh", () => (callback) => callback?.(this.getInfo(), THREE)], // 添加网格
      [
        "addCSS2DObject",
        () =>
          (callback, group = this.css2DObjectDefaultGroup) => {
            // 添加CSS2D对象, 添加一些标签
            const div = document.createElement("div");
            callback?.(div);
            const css2DObject = new CSS2DObject(div);
            group.add(css2DObject);
            return css2DObject;
          },
      ],
      [
        "addCSS3DObject",
        () =>
          (callback, group = this.css3DObjectDefaultGroup) => {
            // 添加CSS3D对象, 添加一些标签
            const div = document.createElement("div");
            callback?.(div);
            const css3DObject = new CSS3DObject(div);
            group.add(css3DObject);
            return css3DObject;
          },
      ],
      [
        "addCSS3DSprite",
        () =>
          (callback, group = this.css3DSpriteDefaultGroup) => {
            // 添加CSS3D对象, 添加一些标签
            const div = document.createElement("div");
            callback?.(div);
            const css3DSprite = new CSS3DSprite(div);
            group.add(css3DSprite);
            return css3DSprite;
          },
      ],
    ]);

    for (let [key, genFunc] of toolsMap) {
      this.utils[key] = genFunc();
    }
  }

  // 添加鹰眼
  addEyeMap() {
    const mapSize = 20;
    // const mapCamera = new THREE.OrthographicCamera(
    //   -mapSize / 2,
    //   mapSize / 2,
    //   mapSize / 2,
    //   -mapSize / 2,
    //   1,
    //   100
    // );
    const mapCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    mapCamera.position.set(0, 10, 0);
    mapCamera.lookAt(new THREE.Vector3(0, 0, 0));

    // 初始化小地图渲染器
    const mapRenderSize = 200; //决定了小地图2D平面的css样式大小
    const mapRenderer = new THREE.WebGLRenderer({ alpha: true });
    mapRenderer.setSize(mapRenderSize, mapRenderSize);
    mapRenderer.setClearColor(0x7d684f);

    // 设置样式，并添加到HTML
    const defaultMapStyle = {
      id: "mapcanvas",
      position: "absolute",
      right: "5px",
      top: "5px",
      zIndex: "1001",
      border: "1px dashed #000",
      borderRadius: "16px",
    };
    Object.assign(mapRenderer.domElement.style, defaultMapStyle);
    // document.body.appendChild(mapRenderer.domElement);

    this.canvas.parentNode.appendChild(mapRenderer.domElement);

    function eyeMapRender() {
      mapCamera.position.copy(this.camera.position);
      mapCamera.target;
      mapRenderer.render(this.scene, mapCamera);
    }
    eyeMapRender.call(this);
    this.controls.addEventListener("change", eyeMapRender.bind(this));
    window.addEventListener("resize", eyeMapRender.bind(this));
  }

  // 创建canvas元素
  setupCanvas(elem) {
    // 放置canvas 元素
    const canvas = document.createElement("canvas");
    const parentRect = elem.getBoundingClientRect();
    elem.style.position = "relative";
    canvas.width = parentRect.width;
    canvas.height = parentRect.height;
    elem.appendChild(canvas);
    return canvas;
  }

  // 显示帧率
  showFps() {
    this.stats = new Stats();
    Object.assign(this.stats.dom.style, {
      position: "absolute",
    });
    this.canvas.parentNode.appendChild(this.stats.dom);
  }

  // 添加点击事件
  addClickEventListener() {
    const rayRaster = new THREE.Raycaster();
    const canvasRect = this.canvas.getBoundingClientRect();

    this.canvas.addEventListener("click", (event) => {
      if (!this.pickEvens.length) return;
      const { offsetX, offsetY } = event;
      const x = (offsetX / canvasRect.width) * 2 - 1;
      const y = -(offsetY / canvasRect.height) * 2 + 1;
      rayRaster.setFromCamera(
        {
          x,
          y,
        },
        this.camera
      );
      for (const eventObj of this.pickEvens) {
        const { objectList, callback } = eventObj;
        const intersects = rayRaster.intersectObjects(objectList);
        if (
          intersects.length &&
          eventObj.currentObject !== intersects[0] &&
          eventObj.currentObject?.instanceId !== intersects[0]?.instanceId
        ) {
          eventObj.prePickedObject = eventObj.currentObject;
          eventObj.currentObject = intersects[0];
        }
        callback?.({ eventObj, intersects });
      }
    });
  }

  // 点击选取
  addPickEventListener(objectList = [], callback) {
    if (
      objectList &&
      objectList.length &&
      callback &&
      typeof callback === "function"
    ) {
      return this.pickEvens.push({
        objectList,
        callback,
        prePickedObject: null,
        currentPickedObject: null,
      });
    }
    throw new Error("objectList, callback is required");
  }

  // 获取工具信息
  getInfo() {
    return {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      controls: this.controls,
      utils: this.utils,
      stats: this.stats,
      renderFunc: () => {
        this.renderer.render(this.scene, this.camera);
      },
    };
  }

  // 添加辅助坐标系
  showHelper() {
    // 网格
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.material.opacity = 0.4;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);

    // 坐标系
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
  }

  showGUI() {
    // 设置GUI
    const gui = (this.gui = new GUI({ name: "GUI" }));
    //改变交互界面style属性
    Object.assign(gui.domElement.style, {
      top: "10px",
      zIndex: "9999",
      backgroundColor: "rgba(255, 0.9)",
      padding: "10px",
      borderRadius: "4px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
      position: "absolute",
    });

    this.canvasWrapperElement.append(gui.domElement);
  }
}
