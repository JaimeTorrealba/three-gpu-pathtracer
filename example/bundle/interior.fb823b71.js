let e,t,r,a,i,n,o,s,l;function c(e,t,r,a){Object.defineProperty(e,t,{get:r,set:a,enumerable:!0,configurable:!0})}var d=globalThis,h={},u={},p=d.parcelRequire5b70;null==p&&((p=function(e){if(e in h)return h[e].exports;if(e in u){var t=u[e];delete u[e];var r={id:e,exports:{}};return h[e]=r,t.call(r.exports,r,r.exports),r.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){u[e]=t},d.parcelRequire5b70=p);var m=p.register;m("27Lyk",function(e,t){c(e.exports,"register",()=>r,e=>r=e),c(e.exports,"resolve",()=>a,e=>a=e);var r,a,i=new Map;r=function(e,t){for(var r=0;r<t.length-1;r+=2)i.set(t[r],{baseUrl:e,path:t[r+1]})},a=function(e){var t=i.get(e);if(null==t)throw Error("Could not resolve bundle with id "+e);return new URL(t.path,t.baseUrl).toString()}}),m("8mHfG",function(e,t){c(e.exports,"WebGLPathTracer",()=>h);var r=p("ilwiq"),a=p("hWj76"),i=p("hWds8"),n=p("RPVlj"),o=p("bHiTZ"),s=p("9wqOU"),l=p("5rCKZ");let d=new r.Vector2;class h{get multipleImportanceSampling(){return!!this._pathTracer.material.defines.FEATURE_MIS}set multipleImportanceSampling(e){this._pathTracer.material.setDefine("FEATURE_MIS",e?1:0)}get transmissiveBounces(){return this._pathTracer.material.transmissiveBounces}set transmissiveBounces(e){this._pathTracer.material.transmissiveBounces=e}get bounces(){return this._pathTracer.material.bounces}set bounces(e){this._pathTracer.material.bounces=e}get filterGlossyFactor(){return this._pathTracer.material.filterGlossyFactor}set filterGlossyFactor(e){this._pathTracer.material.filterGlossyFactor=e}get samples(){return this._pathTracer.samples}get target(){return this._pathTracer.target}get tiles(){return this._pathTracer.tiles}constructor(e){this._renderer=e,this._generator=new a.PathTracingSceneGenerator,this._pathTracer=new i.PathTracingRenderer(e),this._queueReset=!1,this._clock=new r.Clock,this._lowResPathTracer=new i.PathTracingRenderer(e),this._lowResPathTracer.tiles.set(1,1),this._quad=new n.FullScreenQuad(new l.ClampedInterpolationMaterial({map:null,transparent:!0,blending:r.NoBlending,premultipliedAlpha:e.getContextAttributes().premultipliedAlpha})),this._materials=null,this.renderDelay=100,this.minSamples=5,this.fadeDuration=500,this.enablePathTracing=!0,this.pausePathTracing=!1,this.dynamicLowRes=!1,this.lowResScale=.25,this.renderScale=1,this.synchronizeRenderSize=!0,this.rasterizeScene=!0,this.renderToCanvas=!0,this.textureSize=new r.Vector2(1024,1024),this.rasterizeSceneCallback=(e,t)=>{this._renderer.render(e,t)},this.renderToCanvasCallback=(e,t,r)=>{let a=t.autoClear;t.autoClear=!1,r.render(t),t.autoClear=a},this.setScene(new r.Scene,new r.PerspectiveCamera)}setBVHWorker(e){this._generator.setBVHWorker(e)}setScene(e,t,r={}){e.updateMatrixWorld(!0),t.updateMatrixWorld();let a=this._generator;if(a.setObjects(e),this._buildAsync)return a.generateAsync(r.onProgress).then(r=>this._updateFromResults(e,t,r));{let r=a.generate();return this._updateFromResults(e,t,r)}}setSceneAsync(...e){this._buildAsync=!0;let t=this.setScene(...e);return this._buildAsync=!1,t}setCamera(e){this.camera=e,this.updateCamera()}updateCamera(){let e=this.camera;e.updateMatrixWorld(),this._pathTracer.setCamera(e),this._lowResPathTracer.setCamera(e),this.reset()}updateMaterials(){let e=this._pathTracer.material,t=this._renderer,r=this._materials,a=this.textureSize,i=(0,s.getTextures)(r);e.textures.setTextures(t,i,a.x,a.y),e.materials.updateFrom(r,i),this.reset()}updateLights(){let e=this.scene,t=this._renderer,r=this._pathTracer.material,a=(0,s.getLights)(e),i=(0,s.getIesTextures)(a);r.lights.updateFrom(a,i),r.iesProfiles.setTextures(t,i),this.reset()}updateEnvironment(){let e=this.scene,t=this._pathTracer.material;if(t.backgroundBlur=e.backgroundBlurriness,t.backgroundIntensity=e.backgroundIntensity??1,t.backgroundRotation.makeRotationFromEuler(e.backgroundRotation).invert(),null===e.background)t.backgroundMap=null,t.backgroundAlpha=0;else if(e.background.isColor){this._colorBackground=this._colorBackground||new o.GradientEquirectTexture(16);let r=this._colorBackground;r.topColor.equals(e.background)||(r.topColor.set(e.background),r.bottomColor.set(e.background),r.update()),t.backgroundMap=r,t.backgroundAlpha=1}else t.backgroundMap=e.background,t.backgroundAlpha=1;t.environmentIntensity=e.environmentIntensity??1,t.environmentRotation.makeRotationFromEuler(e.environmentRotation).invert(),this._previousEnvironment!==e.environment&&(e.environment?t.envMapInfo.updateFrom(e.environment):t.environmentIntensity=0),this._previousEnvironment=e.environment,this.reset()}_updateFromResults(e,t,r){let{materials:a,geometry:i,bvh:n,bvhChanged:o}=r;this._materials=a;let s=this._pathTracer.material;return o&&(s.bvh.updateFrom(n),s.attributesArray.updateFrom(i.attributes.normal,i.attributes.tangent,i.attributes.uv,i.attributes.color),s.materialIndexAttribute.updateFrom(i.attributes.materialIndex)),this._previousScene=e,this.scene=e,this.camera=t,this.updateCamera(),this.updateMaterials(),this.updateEnvironment(),this.updateLights(),r}renderSample(){let e=this._lowResPathTracer,t=this._pathTracer,a=this._renderer,i=this._clock,n=this._quad;this._updateScale(),this._queueReset&&(t.reset(),e.reset(),this._queueReset=!1,n.material.opacity=0,i.start());let o=1e3*i.getDelta(),s=1e3*i.getElapsedTime();if(!this.pausePathTracing&&this.enablePathTracing&&this.renderDelay<=s&&t.update(),t.alpha=1!==t.material.backgroundAlpha||!a.extensions.get("EXT_float_blend"),e.alpha=t.alpha,this.renderToCanvas){let a=this._renderer,i=this.minSamples;if(s>=this.renderDelay&&this.samples>=this.minSamples&&(0!==this.fadeDuration?n.material.opacity=Math.min(n.material.opacity+o/this.fadeDuration,1):n.material.opacity=1),!this.enablePathTracing||this.samples<i||n.material.opacity<1){if(this.dynamicLowRes){e.samples<1&&(e.material=t.material,e.update());let r=n.material.opacity;n.material.opacity=1-n.material.opacity,n.material.map=e.target.texture,n.render(a),n.material.opacity=r}else this.rasterizeScene&&this.rasterizeSceneCallback(this.scene,this.camera)}this.enablePathTracing&&n.material.opacity>0&&(n.material.opacity<1&&(n.material.blending=this.dynamicLowRes?r.AdditiveBlending:r.NormalBlending),n.material.map=t.target.texture,this.renderToCanvasCallback(t.target,a,n),n.material.blending=r.NoBlending)}}reset(){this._queueReset=!0,this._pathTracer.samples=0}dispose(){this._renderQuad.dispose(),this._renderQuad.material.dispose(),this._pathTracer.dispose()}_updateScale(){if(this.synchronizeRenderSize){this._renderer.getDrawingBufferSize(d);let e=Math.floor(this.renderScale*d.x),t=Math.floor(this.renderScale*d.y);if(this._pathTracer.getSize(d),d.x!==e||d.y!==t){let r=this.lowResScale;this._pathTracer.setSize(e,t),this._lowResPathTracer.setSize(Math.floor(e*r),Math.floor(t*r))}}}}}),m("bHiTZ",function(e,t){c(e.exports,"GradientEquirectTexture",()=>n);var r=p("ilwiq"),a=p("dbdMq");let i=new r.Vector3;class n extends a.ProceduralEquirectTexture{constructor(e=512){super(e,e),this.topColor=new(0,r.Color)().set(16777215),this.bottomColor=new(0,r.Color)().set(0),this.exponent=2,this.generationCallback=(e,t,r,a)=>{i.setFromSpherical(e);let n=.5*i.y+.5;a.lerpColors(this.bottomColor,this.topColor,n**this.exponent)}}copy(e){return super.copy(e),this.topColor.copy(e.topColor),this.bottomColor.copy(e.bottomColor),this}}}),m("dbdMq",function(e,t){c(e.exports,"ProceduralEquirectTexture",()=>s);var r=p("ilwiq");let a=new r.Vector2,i=new r.Vector2,n=new r.Spherical,o=new r.Color;class s extends r.DataTexture{constructor(e=512,t=512){super(new Float32Array(e*t*4),e,t,r.RGBAFormat,r.FloatType,r.EquirectangularReflectionMapping,r.RepeatWrapping,r.ClampToEdgeWrapping,r.LinearFilter,r.LinearFilter),this.generationCallback=null}update(){this.dispose(),this.needsUpdate=!0;let{data:e,width:t,height:r}=this.image;for(let s=0;s<t;s++)for(let l=0;l<r;l++){i.set(t,r),a.set(s/t,l/r),a.x-=.5,a.y=1-a.y,n.theta=2*a.x*Math.PI,n.phi=a.y*Math.PI,n.radius=1,this.generationCallback(n,a,i,o);let c=4*(l*t+s);e[c+0]=o.r,e[c+1]=o.g,e[c+2]=o.b,e[c+3]=1}}copy(e){return super.copy(e),this.generationCallback=e.generationCallback,this}}}),m("5rCKZ",function(e,t){c(e.exports,"ClampedInterpolationMaterial",()=>a);var r=p("ilwiq");class a extends r.ShaderMaterial{get map(){return this.uniforms.map.value}set map(e){this.uniforms.map.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}constructor(e){super({uniforms:{map:{value:null},opacity:{value:1}},vertexShader:`
				varying vec2 vUv;
				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,fragmentShader:`
				uniform sampler2D map;
				uniform float opacity;
				varying vec2 vUv;

				vec4 clampedTexelFatch( sampler2D map, ivec2 px, int lod ) {

					vec4 res = texelFetch( map, ivec2( px.x, px.y ), 0 );

					#if defined( TONE_MAPPING )

					res.xyz = toneMapping( res.xyz );

					#endif

			  		return linearToOutputTexel( res );

				}

				void main() {

					vec2 size = vec2( textureSize( map, 0 ) );
					vec2 pxUv = vUv * size;
					vec2 pxCurr = floor( pxUv );
					vec2 pxFrac = fract( pxUv ) - 0.5;
					vec2 pxOffset;
					pxOffset.x = pxFrac.x > 0.0 ? 1.0 : - 1.0;
					pxOffset.y = pxFrac.y > 0.0 ? 1.0 : - 1.0;

					vec2 pxNext = clamp( pxOffset + pxCurr, vec2( 0.0 ), size - 1.0 );
					vec2 alpha = abs( pxFrac );

					vec4 p1 = mix(
						clampedTexelFatch( map, ivec2( pxCurr.x, pxCurr.y ), 0 ),
						clampedTexelFatch( map, ivec2( pxNext.x, pxCurr.y ), 0 ),
						alpha.x
					);

					vec4 p2 = mix(
						clampedTexelFatch( map, ivec2( pxCurr.x, pxNext.y ), 0 ),
						clampedTexelFatch( map, ivec2( pxNext.x, pxNext.y ), 0 ),
						alpha.x
					);

					gl_FragColor = mix( p1, p2, alpha.y );
					gl_FragColor.a *= opacity;
					#include <premultiplied_alpha_fragment>

				}
			`}),this.setValues(e)}}}),m("891vQ",function(e,t){c(e.exports,"RGBELoader",()=>a);var r=p("ilwiq");class a extends r.DataTextureLoader{constructor(e){super(e),this.type=r.HalfFloatType}parse(e){let t,a,i;let n=function(e,t){switch(e){case 1:throw Error("THREE.RGBELoader: Read Error: "+(t||""));case 2:throw Error("THREE.RGBELoader: Write Error: "+(t||""));case 3:throw Error("THREE.RGBELoader: Bad File Format: "+(t||""));default:throw Error("THREE.RGBELoader: Memory Error: "+(t||""))}},o=function(e,t,r){t=t||1024;let a=e.pos,i=-1,n=0,o="",s=String.fromCharCode.apply(null,new Uint16Array(e.subarray(a,a+128)));for(;0>(i=s.indexOf("\n"))&&n<t&&a<e.byteLength;)o+=s,n+=s.length,a+=128,s+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(a,a+128)));return -1<i&&(!1!==r&&(e.pos+=n+i+1),o+s.slice(0,i))},s=new Uint8Array(e);s.pos=0;let l=function(e){let t,r;let a=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,i=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,s=/^\s*FORMAT=(\S+)\s*$/,l=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,c={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};for(!(e.pos>=e.byteLength)&&(t=o(e))||n(1,"no header found"),(r=t.match(/^#\?(\S+)/))||n(3,"bad initial token"),c.valid|=1,c.programtype=r[1],c.string+=t+"\n";!1!==(t=o(e));){if(c.string+=t+"\n","#"===t.charAt(0)){c.comments+=t+"\n";continue}if((r=t.match(a))&&(c.gamma=parseFloat(r[1])),(r=t.match(i))&&(c.exposure=parseFloat(r[1])),(r=t.match(s))&&(c.valid|=2,c.format=r[1]),(r=t.match(l))&&(c.valid|=4,c.height=parseInt(r[1],10),c.width=parseInt(r[2],10)),2&c.valid&&4&c.valid)break}return 2&c.valid||n(3,"missing format specifier"),4&c.valid||n(3,"missing image size specifier"),c}(s),c=l.width,d=l.height,h=function(e,t,r){if(t<8||t>32767||2!==e[0]||2!==e[1]||128&e[2])return new Uint8Array(e);t!==(e[2]<<8|e[3])&&n(3,"wrong scanline width");let a=new Uint8Array(4*t*r);a.length||n(4,"unable to allocate buffer space");let i=0,o=0,s=4*t,l=new Uint8Array(4),c=new Uint8Array(s),d=r;for(;d>0&&o<e.byteLength;){o+4>e.byteLength&&n(1),l[0]=e[o++],l[1]=e[o++],l[2]=e[o++],l[3]=e[o++],(2!=l[0]||2!=l[1]||(l[2]<<8|l[3])!=t)&&n(3,"bad rgbe scanline format");let r=0,h;for(;r<s&&o<e.byteLength;){let t=(h=e[o++])>128;if(t&&(h-=128),(0===h||r+h>s)&&n(3,"bad scanline data"),t){let t=e[o++];for(let e=0;e<h;e++)c[r++]=t}else c.set(e.subarray(o,o+h),r),r+=h,o+=h}for(let e=0;e<t;e++){let r=0;a[i]=c[e+r],r+=t,a[i+1]=c[e+r],r+=t,a[i+2]=c[e+r],r+=t,a[i+3]=c[e+r],i+=4}d--}return a}(s.subarray(s.pos),c,d);switch(this.type){case r.FloatType:let u=new Float32Array(4*(i=h.length/4));for(let e=0;e<i;e++)!function(e,t,r,a){let i=Math.pow(2,e[t+3]-128)/255;r[a+0]=e[t+0]*i,r[a+1]=e[t+1]*i,r[a+2]=e[t+2]*i,r[a+3]=1}(h,4*e,u,4*e);t=u,a=r.FloatType;break;case r.HalfFloatType:let p=new Uint16Array(4*(i=h.length/4));for(let e=0;e<i;e++)!function(e,t,a,i){let n=Math.pow(2,e[t+3]-128)/255;a[i+0]=(0,r.DataUtils).toHalfFloat(Math.min(e[t+0]*n,65504)),a[i+1]=(0,r.DataUtils).toHalfFloat(Math.min(e[t+1]*n,65504)),a[i+2]=(0,r.DataUtils).toHalfFloat(Math.min(e[t+2]*n,65504)),a[i+3]=(0,r.DataUtils).toHalfFloat(1)}(h,4*e,p,4*e);t=p,a=r.HalfFloatType;break;default:throw Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:c,height:d,data:t,header:l.string,gamma:l.gamma,exposure:l.exposure,type:a}}setDataType(e){return this.type=e,this}load(e,t,a,i){return super.load(e,function(e,a){switch(e.type){case r.FloatType:case r.HalfFloatType:e.colorSpace=r.LinearSRGBColorSpace,e.minFilter=r.LinearFilter,e.magFilter=r.LinearFilter,e.generateMipmaps=!1,e.flipY=!0}t&&t(e,a)},a,i)}}}),m("cE5k3",function(e,t){c(e.exports,"getScaledSettings",()=>r);function r(){let e=3,t=Math.max(1/window.devicePixelRatio,.5);return window.innerWidth/window.innerHeight<.65&&(e=4,t=.5/window.devicePixelRatio),{tiles:e,renderScale:t}}}),m("kqOCM",function(e,t){c(e.exports,"ParallelMeshBVHWorker",()=>h);var r=p("ilwiq"),a=p("6KVZ3"),i=p("3ePKg"),n=p("cSOJe"),o=p("a8VBx"),s=p("5Gkg5");let l="undefined"!=typeof navigator?navigator.hardwareConcurrency:4;class d extends i.WorkerBase{constructor(){if(super(new Worker(p("2tQrc"))),this.name="ParallelMeshBVHWorker",this.maxWorkerCount=Math.max(l,4),!(0,n.isSharedArrayBufferSupported)())throw Error("ParallelMeshBVHWorker: Shared Array Buffers are not supported.")}runTask(e,t,i={}){return new Promise((o,l)=>{if(t.index||i.indirect||(0,s.ensureIndex)(t,i),t.getAttribute("position").isInterleavedBufferAttribute||t.index&&t.index.isInterleavedBufferAttribute)throw Error("ParallelMeshBVHWorker: InterleavedBufferAttribute are not supported for the geometry attributes.");e.onerror=e=>{l(Error(`ParallelMeshBVHWorker: ${e.message}`))},e.onmessage=n=>{let{data:s}=n;if(s.error)l(Error(s.error)),e.onmessage=null;else if(s.serialized){let{serialized:n,position:l}=s,c=(0,a.MeshBVH).deserialize(n,t,{setIndex:!1}),d={setBoundingBox:!0,...i};if(t.attributes.position.array=l,n.index){if(t.index)t.index.array=n.index;else{let e=new r.BufferAttribute(n.index,1,!1);t.setIndex(e)}}d.setBoundingBox&&(t.boundingBox=c.getBoundingBox(new r.Box3)),i.onProgress&&i.onProgress(s.progress),o(c),e.onmessage=null}else i.onProgress&&i.onProgress(s.progress)};let c=t.index?t.index.array:null,d=t.attributes.position.array;e.postMessage({operation:"BUILD_BVH",maxWorkerCount:this.maxWorkerCount,index:(0,n.convertToBufferType)(c,SharedArrayBuffer),position:(0,n.convertToBufferType)(d,SharedArrayBuffer),options:{...i,onProgress:null,includedProgressCallback:!!i.onProgress,groups:[...t.groups]}})})}}class h{constructor(){if((0,n.isSharedArrayBufferSupported)())return new d;{console.warn("ParallelMeshBVHWorker: SharedArrayBuffers not supported. Falling back to single-threaded GenerateMeshBVHWorker.");let e=new o.GenerateMeshBVHWorker;return e.maxWorkerCount=l,e}}}}),m("3ePKg",function(e,t){c(e.exports,"WorkerBase",()=>r);class r{constructor(e){this.name="WorkerBase",this.running=!1,this.worker=e,this.worker.onerror=e=>{if(e.message)throw Error(`${this.name}: Could not create Web Worker with error "${e.message}"`);throw Error(`${this.name}: Could not create Web Worker.`)}}runTask(){}generate(...e){if(this.running)throw Error("GenerateMeshBVHWorker: Already running job.");if(null===this.worker)throw Error("GenerateMeshBVHWorker: Worker has been disposed.");this.running=!0;let t=this.runTask(this.worker,...e);return t.finally(()=>{this.running=!1}),t}dispose(){this.worker.terminate(),this.worker=null}}}),m("a8VBx",function(e,t){c(e.exports,"GenerateMeshBVHWorker",()=>n);var r=p("ilwiq"),a=p("6KVZ3"),i=p("3ePKg");class n extends i.WorkerBase{constructor(){super(new Worker(p("jVRlM"))),this.name="GenerateMeshBVHWorker"}runTask(e,t,i={}){return new Promise((n,o)=>{if(t.getAttribute("position").isInterleavedBufferAttribute||t.index&&t.index.isInterleavedBufferAttribute)throw Error("GenerateMeshBVHWorker: InterleavedBufferAttribute are not supported for the geometry attributes.");e.onerror=e=>{o(Error(`GenerateMeshBVHWorker: ${e.message}`))},e.onmessage=s=>{let{data:l}=s;if(l.error)o(Error(l.error)),e.onmessage=null;else if(l.serialized){let{serialized:o,position:s}=l,c=(0,a.MeshBVH).deserialize(o,t,{setIndex:!1}),d=Object.assign({setBoundingBox:!0},i);if(t.attributes.position.array=s,o.index){if(t.index)t.index.array=o.index;else{let e=new r.BufferAttribute(o.index,1,!1);t.setIndex(e)}}d.setBoundingBox&&(t.boundingBox=c.getBoundingBox(new r.Box3)),i.onProgress&&i.onProgress(l.progress),n(c),e.onmessage=null}else i.onProgress&&i.onProgress(l.progress)};let s=t.index?t.index.array:null,l=t.attributes.position.array,c=[l];s&&c.push(s),e.postMessage({index:s,position:l,options:{...i,onProgress:null,includedProgressCallback:!!i.onProgress,groups:[...t.groups]}},c.map(e=>e.buffer).filter(e=>"undefined"==typeof SharedArrayBuffer||!(e instanceof SharedArrayBuffer)))})}}}),m("jVRlM",function(e,t){var r=p("7ryUf");let a=new URL("generateMeshBVH.worker.373f3c58.js",import.meta.url);e.exports=r(a.toString(),a.origin,!0)}),m("7ryUf",function(e,t){e.exports=function(e,t,r){if(t===self.location.origin)return e;var a=r?"import "+JSON.stringify(e)+";":"importScripts("+JSON.stringify(e)+");";return URL.createObjectURL(new Blob([a],{type:"application/javascript"}))}}),m("2tQrc",function(e,t){var r=p("7ryUf");let a=new URL("parallelMeshBVH.worker.22cf4bb0.js",import.meta.url);e.exports=r(a.toString(),a.origin,!0)}),m("e2Pv4",function(e,t){let r;c(e.exports,"LoaderElement",()=>a);class a{constructor(){r||((r=document.createElement("style")).textContent=`

		.loader-container, .description {
			position: absolute;
			width: 100%;
			font-family: 'Courier New', Courier, monospace;
			color: white;
			font-weight: light;
			align-items: flex-start;
			font-size: 14px;
			pointer-events: none;
			user-select: none;
		}

		.loader-container {
			display: flex;
			flex-direction: column;
			bottom: 0;
		}

		.description {
			top: 0;
			width: 100%;
			text-align: center;
			padding: 5px 0;
		}

		.loader-container .bar {
			height: 2px;
			background: white;
			width: 100%;
		}

		.loader-container .credits,
		.loader-container .samples,
		.loader-container .percentage {
			padding: 5px;
			margin: 0 0 1px 1px;
			background: rgba( 0, 0, 0, 0.2 );
			border-radius: 2px;
			display: inline-block;
		}

		.loader-container:not(.loading) .bar,
		.loader-container:not(.loading) .percentage,
		.loader-container.loading .credits,
		.loader-container.loading .samples,
		.loader-container .credits:empty {
			display: none;
		}

		.loader-container .credits a,
		.loader-container .credits,
		.loader-container .samples {
			color: rgba( 255, 255, 255, 0.75 );
		}
	`,document.head.appendChild(r));let e=document.createElement("div");e.classList.add("loader-container");let t=document.createElement("div");t.classList.add("percentage"),e.appendChild(t);let a=document.createElement("div");a.classList.add("samples"),e.appendChild(a);let i=document.createElement("div");i.classList.add("credits"),e.appendChild(i);let n=document.createElement("div");n.classList.add("bar"),e.appendChild(n);let o=document.createElement("div");o.classList.add("description"),e.appendChild(o),this._description=o,this._loaderBar=n,this._percentage=t,this._credits=i,this._samples=a,this._container=e,this.setPercentage(0)}attach(e){e.appendChild(this._container),e.appendChild(this._description)}setPercentage(e){this._loaderBar.style.width=`${100*e}%`,0===e?this._percentage.innerText="Loading...":this._percentage.innerText=`${(100*e).toFixed(0)}%`,e>=1?this._container.classList.remove("loading"):this._container.classList.add("loading")}setSamples(e){this._samples.innerText=`${Math.floor(e)} samples`}setCredits(e){this._credits.innerHTML=e}setDescription(e){this._description.innerHTML=e}}}),m("9fZ6X",function(e,t){c(e.exports,"MaterialBase",()=>a);var r=p("ilwiq");class a extends r.ShaderMaterial{constructor(e){for(let t in super(e),this.uniforms)Object.defineProperty(this,t,{get(){return this.uniforms[t].value},set(e){this.uniforms[t].value=e}})}setDefine(e,t){if(null==t){if(e in this.defines)return delete this.defines[e],this.needsUpdate=!0,!0}else if(this.defines[e]!==t)return this.defines[e]=t,this.needsUpdate=!0,!0;return!1}}}),m("fYvb1",function(e,t){c(e.exports,"math_functions",()=>r);let r=`

	// Fast arccos approximation used to remove banding artifacts caused by numerical errors in acos.
	// This is a cubic Lagrange interpolating polynomial for x = [-1, -1/2, 0, 1/2, 1].
	// For more information see: https://github.com/gkjohnson/three-gpu-pathtracer/pull/171#issuecomment-1152275248
	float acosApprox( float x ) {

		x = clamp( x, -1.0, 1.0 );
		return ( - 0.69813170079773212 * x * x - 0.87266462599716477 ) * x + 1.5707963267948966;

	}

	// An acos with input values bound to the range [-1, 1].
	float acosSafe( float x ) {

		return acos( clamp( x, -1.0, 1.0 ) );

	}

	float saturateCos( float val ) {

		return clamp( val, 0.001, 1.0 );

	}

	float square( float t ) {

		return t * t;

	}

	vec2 square( vec2 t ) {

		return t * t;

	}

	vec3 square( vec3 t ) {

		return t * t;

	}

	vec4 square( vec4 t ) {

		return t * t;

	}

	vec2 rotateVector( vec2 v, float t ) {

		float ac = cos( t );
		float as = sin( t );
		return vec2(
			v.x * ac - v.y * as,
			v.x * as + v.y * ac
		);

	}

	// forms a basis with the normal vector as Z
	mat3 getBasisFromNormal( vec3 normal ) {

		vec3 other;
		if ( abs( normal.x ) > 0.5 ) {

			other = vec3( 0.0, 1.0, 0.0 );

		} else {

			other = vec3( 1.0, 0.0, 0.0 );

		}

		vec3 ortho = normalize( cross( normal, other ) );
		vec3 ortho2 = normalize( cross( normal, ortho ) );
		return mat3( ortho2, ortho, normal );

	}

`}),m("dUUQZ",function(e,t){c(e.exports,"util_functions",()=>r);let r=`

	// TODO: possibly this should be renamed something related to material or path tracing logic

	#ifndef RAY_OFFSET
	#define RAY_OFFSET 1e-4
	#endif

	// adjust the hit point by the surface normal by a factor of some offset and the
	// maximum component-wise value of the current point to accommodate floating point
	// error as values increase.
	vec3 stepRayOrigin( vec3 rayOrigin, vec3 rayDirection, vec3 offset, float dist ) {

		vec3 point = rayOrigin + rayDirection * dist;
		vec3 absPoint = abs( point );
		float maxPoint = max( absPoint.x, max( absPoint.y, absPoint.z ) );
		return point + offset * ( maxPoint + 1.0 ) * RAY_OFFSET;

	}

	// https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md#attenuation
	vec3 transmissionAttenuation( float dist, vec3 attColor, float attDist ) {

		vec3 ot = - log( attColor ) / attDist;
		return exp( - ot * dist );

	}

	vec3 getHalfVector( vec3 wi, vec3 wo, float eta ) {

		// get the half vector - assuming if the light incident vector is on the other side
		// of the that it's transmissive.
		vec3 h;
		if ( wi.z > 0.0 ) {

			h = normalize( wi + wo );

		} else {

			// Scale by the ior ratio to retrieve the appropriate half vector
			// From Section 2.2 on computing the transmission half vector:
			// https://blog.selfshadow.com/publications/s2015-shading-course/burley/s2015_pbs_disney_bsdf_notes.pdf
			h = normalize( wi + wo * eta );

		}

		h *= sign( h.z );
		return h;

	}

	vec3 getHalfVector( vec3 a, vec3 b ) {

		return normalize( a + b );

	}

	// The discrepancy between interpolated surface normal and geometry normal can cause issues when a ray
	// is cast that is on the top side of the geometry normal plane but below the surface normal plane. If
	// we find a ray like that we ignore it to avoid artifacts.
	// This function returns if the direction is on the same side of both planes.
	bool isDirectionValid( vec3 direction, vec3 surfaceNormal, vec3 geometryNormal ) {

		bool aboveSurfaceNormal = dot( direction, surfaceNormal ) > 0.0;
		bool aboveGeometryNormal = dot( direction, geometryNormal ) > 0.0;
		return aboveSurfaceNormal == aboveGeometryNormal;

	}

	// ray sampling x and z are swapped to align with expected background view
	vec2 equirectDirectionToUv( vec3 direction ) {

		// from Spherical.setFromCartesianCoords
		vec2 uv = vec2( atan( direction.z, direction.x ), acos( direction.y ) );
		uv /= vec2( 2.0 * PI, PI );

		// apply adjustments to get values in range [0, 1] and y right side up
		uv.x += 0.5;
		uv.y = 1.0 - uv.y;
		return uv;

	}

	vec3 equirectUvToDirection( vec2 uv ) {

		// undo above adjustments
		uv.x -= 0.5;
		uv.y = 1.0 - uv.y;

		// from Vector3.setFromSphericalCoords
		float theta = uv.x * 2.0 * PI;
		float phi = uv.y * PI;

		float sinPhi = sin( phi );

		return vec3( sinPhi * cos( theta ), cos( phi ), sinPhi * sin( theta ) );

	}

	// power heuristic for multiple importance sampling
	float misHeuristic( float a, float b ) {

		float aa = a * a;
		float bb = b * b;
		return aa / ( aa + bb );

	}

	// tentFilter from Peter Shirley's 'Realistic Ray Tracing (2nd Edition)' book, pg. 60
	// erichlof/THREE.js-PathTracing-Renderer/
	float tentFilter( float x ) {

		return x < 0.5 ? sqrt( 2.0 * x ) - 1.0 : 1.0 - sqrt( 2.0 - ( 2.0 * x ) );

	}
`}),m("8keuf",function(e,t){c(e.exports,"ggx_functions",()=>r);let r=`

	// The GGX functions provide sampling and distribution information for normals as output so
	// in order to get probability of scatter direction the half vector must be computed and provided.
	// [0] https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.pdf
	// [1] https://hal.archives-ouvertes.fr/hal-01509746/document
	// [2] http://jcgt.org/published/0007/04/01/
	// [4] http://jcgt.org/published/0003/02/03/

	// trowbridge-reitz === GGX === GTR

	vec3 ggxDirection( vec3 incidentDir, vec2 roughness, vec2 uv ) {

		// TODO: try GGXVNDF implementation from reference [2], here. Needs to update ggxDistribution
		// function below, as well

		// Implementation from reference [1]
		// stretch view
		vec3 V = normalize( vec3( roughness * incidentDir.xy, incidentDir.z ) );

		// orthonormal basis
		vec3 T1 = ( V.z < 0.9999 ) ? normalize( cross( V, vec3( 0.0, 0.0, 1.0 ) ) ) : vec3( 1.0, 0.0, 0.0 );
		vec3 T2 = cross( T1, V );

		// sample point with polar coordinates (r, phi)
		float a = 1.0 / ( 1.0 + V.z );
		float r = sqrt( uv.x );
		float phi = ( uv.y < a ) ? uv.y / a * PI : PI + ( uv.y - a ) / ( 1.0 - a ) * PI;
		float P1 = r * cos( phi );
		float P2 = r * sin( phi ) * ( ( uv.y < a ) ? 1.0 : V.z );

		// compute normal
		vec3 N = P1 * T1 + P2 * T2 + V * sqrt( max( 0.0, 1.0 - P1 * P1 - P2 * P2 ) );

		// unstretch
		N = normalize( vec3( roughness * N.xy, max( 0.0, N.z ) ) );

		return N;

	}

	// Below are PDF and related functions for use in a Monte Carlo path tracer
	// as specified in Appendix B of the following paper
	// See equation (34) from reference [0]
	float ggxLamda( float theta, float roughness ) {

		float tanTheta = tan( theta );
		float tanTheta2 = tanTheta * tanTheta;
		float alpha2 = roughness * roughness;

		float numerator = - 1.0 + sqrt( 1.0 + alpha2 * tanTheta2 );
		return numerator / 2.0;

	}

	// See equation (34) from reference [0]
	float ggxShadowMaskG1( float theta, float roughness ) {

		return 1.0 / ( 1.0 + ggxLamda( theta, roughness ) );

	}

	// See equation (125) from reference [4]
	float ggxShadowMaskG2( vec3 wi, vec3 wo, float roughness ) {

		float incidentTheta = acos( wi.z );
		float scatterTheta = acos( wo.z );
		return 1.0 / ( 1.0 + ggxLamda( incidentTheta, roughness ) + ggxLamda( scatterTheta, roughness ) );

	}

	// See equation (33) from reference [0]
	float ggxDistribution( vec3 halfVector, float roughness ) {

		float a2 = roughness * roughness;
		a2 = max( EPSILON, a2 );
		float cosTheta = halfVector.z;
		float cosTheta4 = pow( cosTheta, 4.0 );

		if ( cosTheta == 0.0 ) return 0.0;

		float theta = acosSafe( halfVector.z );
		float tanTheta = tan( theta );
		float tanTheta2 = pow( tanTheta, 2.0 );

		float denom = PI * cosTheta4 * pow( a2 + tanTheta2, 2.0 );
		return ( a2 / denom );

	}

	// See equation (3) from reference [2]
	float ggxPDF( vec3 wi, vec3 halfVector, float roughness ) {

		float incidentTheta = acos( wi.z );
		float D = ggxDistribution( halfVector, roughness );
		float G1 = ggxShadowMaskG1( incidentTheta, roughness );

		return D * G1 * max( 0.0, dot( wi, halfVector ) ) / wi.z;

	}

`}),p("27Lyk").register(new URL("",import.meta.url).toString(),JSON.parse('["8qxQv","interior.fb823b71.js","512E4","parallelMeshBVH.worker.22cf4bb0.js","9P1cE","generateMeshBVH.worker.cd4b9fc6.js","lWWke","generateMeshBVH.worker.373f3c58.js","9P1cE","generateMeshBVH.worker.cd4b9fc6.js","jwbL2","aoRender.e5303912.js","63CMm","aoRender.a1271ff5.js","2tzBs","aoRender.89c1b67b.js","6UuCC","aoRender.5fc59dbe.js","6mMEU","aoRender.fc8349f1.js","i0zVc","aoRender.dcf40b33.js","j19h5","aoRender.e8b1599c.js","eif6c","areaLight.5654e8b2.js"]'));var f=p("ilwiq"),g=p("7lx9d"),v=p("5Rd1x"),f=p("ilwiq");class x extends f.Camera{constructor(){super(),this.isEquirectCamera=!0}}var b=p("8mHfG"),y=p("891vQ"),w=p("kp7Te"),T=p("jiuw3"),k=p("cE5k3"),C=p("kqOCM"),S=p("e2Pv4");const _={environmentIntensity:1,emissiveIntensity:5,bounces:20,renderScale:1/window.devicePixelRatio,tiles:2,projection:"Perspective",...(0,k.getScaledSettings)()};function P(){t.setSize(window.innerWidth,window.innerHeight),t.setPixelRatio(window.devicePixelRatio),o.aspect=window.innerWidth/window.innerHeight,o.updateProjectionMatrix(),e.updateCamera()}function B(){let t=_.projection;"Perspective"===t?(i=o,a.enabled=!1,r.enabled=!0,r.update()):"Equirectangular"===t&&(i=s,r.enabled=!1,a.enabled=!0,a.update()),n.traverse(e=>{let t=e.material;t&&(t.emissiveIntensity=_.emissiveIntensity)}),n.environmentIntensity=_.environmentIntensity,n.backgroundIntensity=_.environmentIntensity,e.bounces=_.bounces,e.renderScale=_.renderScale,e.setScene(n,i)}!async function(){(l=new S.LoaderElement).attach(document.body),(t=new f.WebGLRenderer({antialias:!0})).toneMapping=f.ACESFilmicToneMapping,document.body.appendChild(t.domElement),(e=new b.WebGLPathTracer(t)).dynamicLowRes=!0,e.filterGlossyFactor=.25,e.tiles.set(_.tiles,_.tiles),e.setBVHWorker(new C.ParallelMeshBVHWorker),(o=new f.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.025,500)).position.set(.4,.6,2.65),(s=new x).position.set(-.2,.33,.08),(r=new v.OrbitControls(o,t.domElement)).target.set(-.15,.33,-.08),o.lookAt(r.target),r.update(),r.addEventListener("change",()=>e.updateCamera()),(a=new v.OrbitControls(s,t.domElement)).target.set(-.15,.33,-.08),s.lookAt(a.target),a.update(),a.addEventListener("change",()=>e.updateCamera()),n=new f.Scene;let[i,c]=await Promise.all([new(0,y.RGBELoader)().loadAsync("https://raw.githubusercontent.com/gkjohnson/3d-demo-data/master/hdri/aristea_wreck_puresky_2k.hdr"),new(0,g.GLTFLoader)().setMeshoptDecoder(w.MeshoptDecoder).loadAsync("https://raw.githubusercontent.com/gkjohnson/3d-demo-data/main/models/pathtracing-bathroom/modernbathroom.glb")]);i.mapping=f.EquirectangularReflectionMapping,n.background=i,n.environment=i,c.scene.traverse(e=>{e.material&&(e.material.thickness=1)}),n.add(c.scene),n.updateMatrixWorld();let d=new f.Box3;d.setFromObject(c.scene);let h=new f.Vector3;d.getCenter(h),c.scene.position.addScaledVector(h,-.5),await e.setSceneAsync(n,o,{onProgress:e=>l.setPercentage(e)}),l.setCredits('Interior scene by <a href="https://twitter.com/charlesforman">Charles Forman</a>'),P(),B(),window.addEventListener("resize",P);let u=new T.GUI,p=u.addFolder("Path Tracer");p.add(_,"tiles",1,4,1).onChange(t=>{e.tiles.set(t,t)}),p.add(_,"bounces",1,30,1).onChange(B),p.add(_,"renderScale",.1,1).onChange(B);let m=u.addFolder("Scene");m.add(_,"projection",["Perspective","Equirectangular"]).onChange(B),m.add(_,"environmentIntensity",0,25).onChange(B),m.add(_,"emissiveIntensity",0,50).onChange(B),function t(){requestAnimationFrame(t),e.renderSample(),l.setSamples(e.samples)}()}();
//# sourceMappingURL=interior.fb823b71.js.map
