import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { debounce, throttle } from "radash";
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
  _initConfig = null; // 初始化配置
  _renderUpdateFuncs = []; // 渲染更新函数集
  _scene = null;
  _camera = null;
  _renderer = null;
  _css2dRenderer = null;
  _css2DObjectDefaultGroup = null;

  _css3dRenderer = null;
  _css3DObjectDefaultGroup = null;
  _css3DSpriteDefaultGroup = null;

  _controls = null;
  _stats = null;
  _canvas = null;
  _canvasWrapperElement = null;
  _gui = null;
  _clickEvents = []; // 点击事件集合
  _hoverEvents = []; // 鼠标悬停事件集合

  utils = {}; // 工具集

  // 构造函数
  constructor(config = {}) {
    this.setupByConfig(config);
  }

  // 配置初始化配置参数，并根据参数初始化场景
  setupByConfig(config) {
    if (config.cwe && config.cwe.nodeType !== 1)
      return new Error("canvasWrapperElement is not a element");
    // 初始化配置
    const defaultConfig = {
      showEyeMap: false,
      showFps: true,
      showHelper: true,
      showGUI: false,
      neededRender: false,
      interactive: true,
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
      interactive,
    } = (this._initConfig = initConfig);

    this._init(canvasWrapperElement);
    this._addResizeListener();
    this._createUtils(); // 初始化工具函数集

    this._sceneRender(neededRender); // 场景渲染

    interactive && this._initEventHandle(interactive); // 初始化事件
    showEyeMap && this._addEyeMap();
    showFps && this._showFps();
    showHelper && this._showHelper(showHelper);
    showGUI && this._showGUI();
  }

  // 初始化
  _init(canvasWrapperElement) {
    console.log("ThreeTool init");
    this._canvasWrapperElement = canvasWrapperElement;
    this._canvas = this._setupCanvas(canvasWrapperElement); // 创建canvas元素
    const canvasRect = this._canvas.getBoundingClientRect();
    // 场景
    this._scene = new THREE.Scene();

    // 相机
    this._camera = new THREE.PerspectiveCamera(
      75,
      canvasRect.width / canvasRect.height,
      1,
      10000
    );
    this._camera.position.set(4, 4, 6);

    // 渲染器
    this._renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
      canvas: this._canvas,
      // 设置对数深度缓冲区，优化深度冲突问题
      // logarithmicDepthBuffer: true,
    });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(canvasRect.width, canvasRect.height);

    this._renderer.setClearColor(0x000000, 1);
    this._scene.background = new THREE.Color("#ccc");
    this._scene.environment = new THREE.Color("#eee");

    // CSS2D渲染器
    this._css2dRenderer = new CSS2DRenderer();
    this._css2dRenderer.setSize(canvasRect.width, canvasRect.height);
    Object.assign(this._css2dRenderer.domElement.style, {
      // 样式初始化
      position: "absolute",
      inset: "0",
      zIndex: "1000",
      pointerEvents: "none",
    });
    this._canvasWrapperElement.appendChild(this._css2dRenderer.domElement); // 添加到canvasWrapper元素中
    this._css2DObjectDefaultGroup = new THREE.Group();
    this._scene.add(this._css2DObjectDefaultGroup); // 添加到场景中

    // CSS3D渲染器
    this._css3dRenderer = new CSS3DRenderer();
    this._css3dRenderer.setSize(canvasRect.width, canvasRect.height);
    Object.assign(this._css3dRenderer.domElement.style, {
      // 样式初始化
      position: "absolute",
      inset: "0",
      zIndex: "1001",
      pointerEvents: "none",
    });
    this._canvasWrapperElement.appendChild(this._css3dRenderer.domElement); // 添加到canvasWrapper元素中
    this._css3DObjectDefaultGroup = new THREE.Group();
    this._scene.add(this._css3DObjectDefaultGroup); // 添加到场景中
    this._css3DSpriteDefaultGroup = new THREE.Group();
    this._scene.add(this._css3DSpriteDefaultGroup); // 添加到场景中

    // 控制器

    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;
    this._controls.minDistance = 1;
    this._controls.maxDistance = 500;
    this._controls.update();

    return {
      scene: this._scene,
      camera: this._camera,
      renderer: this._renderer,
      controls: this._controls,
    };
  }

  // 创建canvas元素
  _setupCanvas(elem) {
    // 放置canvas 元素
    const canvas = document.createElement("canvas");
    const parentRect = elem.getBoundingClientRect();
    elem.style.position = "relative";
    canvas.width = parentRect.width;
    canvas.height = parentRect.height;
    elem.appendChild(canvas);
    return canvas;
  }

  // 渲染
  _sceneRender(isNeededRender = false) {
    // isNeededRender 是否按需渲染
    // 渲染时需要执行的函数集
    const renderFunc = (time) => {
      this._controls.update();
      this._stats && this._stats.update();
      this._renderUpdateFuncs.forEach((func) => func(time)); // 执行渲染更新函数集
      this._renderer.render(this._scene, this._camera);
      this._css2dRenderer.render(this._scene, this._camera);
      this._css3dRenderer.render(this._scene, this._camera);
    };
    // 按需渲染
    const neededRender = () => {
      let renderRequested = false;
      const render = (time) => {
        renderRequested = false;
        renderFunc(time);
      };

      const requestRenderIfNotRequested = () => {
        if (!renderRequested) {
          renderRequested = true;
          requestAnimationFrame(render);
        }
      };
      this._controls.addEventListener("change", requestRenderIfNotRequested);
      window.addEventListener("resize", requestRenderIfNotRequested);
      requestAnimationFrame(render); // 初始渲染一次
    };

    // 循环渲染

    const keepRender = () => {
      const render = (time) => {
        renderFunc(time);
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    };
    isNeededRender ? neededRender() : keepRender();
  }

  // 初始化事件
  _initEventHandle(config) {
    const intConfig = typeof config === "boolean" ? {} : config;
    const { clickDelay = 0, hoverDelay = 80 } = intConfig;

    const rayRaster = new THREE.Raycaster();
    const canvasRect = this._canvas.getBoundingClientRect();
    const handleFn = (event) => {
      // 坐标归一化
      const { offsetX, offsetY } = event;
      const x = (offsetX / canvasRect.width) * 2 - 1;
      const y = -(offsetY / canvasRect.height) * 2 + 1;
      // 发出射线
      rayRaster.setFromCamera(
        {
          x,
          y,
        },
        this._camera
      );
      // 遍历点击事件集合
      for (const eventObj of [...this._clickEvents, ...this._hoverEvents]) {
        const { type, callback, meshes } = eventObj;
        const intersects = rayRaster.intersectObjects(meshes);
        const current = intersects[0];
        if (
          current &&
          current !== eventObj.curObj &&
          current.instanceId !== eventObj.curObj?.instanceId
        ) {
          eventObj.preObj = eventObj.curObj;
          eventObj.curObj = current;
        }
        Object.assign(eventObj, {
          type,
          intersects,
        });
        eventObj.intersects = intersects;
        callback?.(eventObj);
      }
    };
    this._canvas.addEventListener(
      "click",
      debounce({ delay: clickDelay }, (event) => {
        if (!this._clickEvents.length) return;
        handleFn(event);
      }),
      {
        passive: true,
      }
    );
    this._canvas.addEventListener(
      "mousemove",
      throttle({ interval: hoverDelay }, (event) => {
        if (!this._hoverEvents.length) return;
        handleFn(event);
      }),
      {
        passive: true,
      }
    );
  }

  // 窗口自适应
  _addResizeListener() {
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
    const canvas = this._renderer.domElement;
    window.addEventListener(
      "resize",
      debounce({ delay: 100 }, () => {
        if (resizeRendererToDisplaySize(this._renderer)) {
          const canvas = this._renderer.domElement;
          this._camera.aspect = canvas.clientWidth / canvas.clientHeight;
          this._camera.updateProjectionMatrix();
        }
      }),
      false
    );
  }

  // 添加工具集
  _createUtils() {
    this.utils = {};

    const toolsMap = new Map([
      [
        "importGltfModel",
        () => {
          // 导入模型函数
          const gltfLoader = new GLTFLoader();
          return (postOperations = {}) => {
            const {
              position = [0, 0, 0],
              rotation = [0, 0, 0],
              scale = [1, 1, 1],
              callback,
              url,
              dir,
            } = postOperations;

            const loadedHandle = (gltf) => {
              const model = gltf.scene;
              model.position.set(position[0], position[1], position[2]);
              model.rotation.set(rotation[0], rotation[1], rotation[2]);
              model.scale.set(scale[0], scale[1], scale[2]);
              this._scene.add(model);

              const info = this.getInfo();
              callback?.(gltf, {
                ...info,
              });
            };
            gltfLoader.setPath(dir);
            gltfLoader.load(url, loadedHandle);
          };
        },
      ],
      ["addMesh", () => (callback) => callback?.(this.getInfo(), THREE)], // 添加网格
      [
        "addCSS2DObject",
        () =>
          (callback, group = this._css2DObjectDefaultGroup) => {
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
          (callback, group = this._css3DObjectDefaultGroup) => {
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
          (callback, group = this._css3DSpriteDefaultGroup) => {
            // 添加CSS3D对象, 添加一些标签
            const div = document.createElement("div");
            callback?.(div);
            const css3DSprite = new CSS3DSprite(div);
            group.add(css3DSprite);
            return css3DSprite;
          },
      ],
      [
        "autoFitCameraToModel",
        () =>
          (model, fitRatio = 0.8, camera = this._camera) => {
            /**
             * 自动调整相机以适当观察3D模型
             * @param {THREE.Object3D} model 要观察的3D模型对象
             * @param {THREE.PerspectiveCamera} camera 相机对象
             * @param {Number} fitRatio 适当观察时,模型占视口的比例,介于0-1之间
             */
            const box = new THREE.Box3().setFromObject(model);
            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());

            // 计算合适的相机距离// 因为boxSize 取得是对角线，对角线肯定比高度(不确定取那边为高度)长，所以initialDistance 比实际值要大
            const initialDistance =
              boxSize /
              2 /
              Math.tan((camera.fov * Math.PI) / 180 / 2) /
              fitRatio;

            // 设置相机位置和朝向
            camera.position.copy(boxCenter);
            camera.position.add(
              camera.position
                .clone()
                .normalize()
                .multiplyScalar(initialDistance)
            );
            camera.lookAt(boxCenter);
            console.log("camera position", camera.position);
            return box;

            // 可视化包围盒
            // const boxHelper = new THREE.Box3Helper(
            //   box,
            //   new THREE.Color(0xffff00)
            // );
            // this._scene.add(boxHelper);
          },
      ],
      [
        "playModelAnimation",
        () => (model, clip, clipActionInitFn) => {
          const mixer = new THREE.AnimationMixer(model);
          const clipAction = mixer.clipAction(clip);
          clipAction.play();
          clipActionInitFn(clipAction);
          const clock = new THREE.Clock();
          this.callOn("renderUpdate", (time) => {
            const frameT = clock.getDelta();
            mixer.update(frameT);
          });
          return {
            mixer,
            clipAction,
            clock,
          };
        },
      ],
      [
        "playGltfAnimation",
        () => (gltf) => {
          const model = gltf.scene;
          return this.playModelAnimation(model, gltf.animations[0]);
        },
      ],
    ]);

    for (let [key, genFunc] of toolsMap) {
      this.utils[key] = genFunc();
    }
  }

  // 添加鹰眼
  _addEyeMap() {
    const mapSize = 20;
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

    this._canvas.parentNode.appendChild(mapRenderer.domElement);

    function eyeMapRender() {
      mapCamera.position.copy(this._camera.position);
      mapCamera.target;
      mapRenderer.render(this._scene, mapCamera);
    }
    eyeMapRender.call(this);
    this._controls.addEventListener("change", eyeMapRender.bind(this));
    window.addEventListener("resize", eyeMapRender.bind(this));
  }

  // 显示帧率
  _showFps() {
    this._stats = new Stats();
    Object.assign(this._stats.dom.style, {
      position: "absolute",
    });
    this._canvas.parentNode.appendChild(this._stats.dom);
  }

  // 添加辅助坐标系
  _showHelper(config) {
    let size = 10;
    typeof config === "number" && (size = config);
    // 网格
    const gridHelper = new THREE.GridHelper(size, size);
    gridHelper.material.opacity = 0.4;
    gridHelper.material.transparent = true;
    this._scene.add(gridHelper);

    // 坐标系
    const axesHelper = new THREE.AxesHelper(Math.round(size / 2));
    this._scene.add(axesHelper);
  }

  // 显示GUI
  _showGUI() {
    // 设置GUI
    const gui = (this._gui = new GUI({ name: "GUI" }));
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

    this._canvasWrapperElement.append(gui.domElement);
  }

  // 获取工具信息
  getInfo() {
    return {
      scene: this._scene,
      camera: this._camera,
      renderer: this._renderer,
      controls: this._controls,
      utils: this.utils,
      stats: this._stats,
      gui: this._gui,
    };
  }

  // 给不同阶段注册函数
  callOn(type, callback) {
    if (typeof callback !== "function") throw new Error("callback is required");
    if (type === "renderUpdate") {
      this._renderUpdateFuncs.push(callback);
    }
  }

  // 添加事件监听
  eventOn(type, callback, meshes = this._scene.children) {
    if (!["click", "hover"].includes(type))
      throw new Error(`暂时不支持 ${type} 类型的事件监听`);
    if (typeof callback !== "function") throw new Error("callback is required");
    this[`_${type}Events`].push({
      type,
      callback,
      meshes,
      preObj: null,
      curObj: null,
    });
  }
  // 移除事件监听
  eventOff(type, callback) {
    if (!["click", "hover"].includes(type))
      new Error(`暂时不支持 ${type} 类型的事件移除监听`);
    const events = this[`_${type}Events`];
    const index = events.findIndex(
      (eventObj) => eventObj.callback === callback
    );
    if (index !== -1) events.splice(index, 1);
  }

  // 销毁
  destroy() {
    this._scene.traverse((child) => {
      if (child.material) {
        child.material.dispose();
      }
      if (child.geometry) {
        child.geometry.dispose();
      }
      child = null;
    });

    this._renderer.forceContextLoss();
    this._renderer.dispose();
    this._scene.clear();
    this._renderer = null;
    this._scene = null;
    this._camera = null;
    this._controls = null;
    this._stats = null;
    this._gui = null;
    this._canvas = null;
    this._css2DObjectDefaultGroup = null;
    this._css3DObjectDefaultGroup = null;
    this._css3DSpriteDefaultGroup = null;
    this._renderUpdateFuncs = null;
    this._clickEvents = null;
    this._hoverEvents = null; 
    this.utils = null;
    this._canvasWrapperElement.remove();

  }
}
