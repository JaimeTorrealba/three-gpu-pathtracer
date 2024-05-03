let e,t,r,a,i,o,n;function s(e,t,r,a){Object.defineProperty(e,t,{get:r,set:a,enumerable:!0,configurable:!0})}var l=globalThis,c={},d={},u=l.parcelRequire5b70;null==u&&((u=function(e){if(e in c)return c[e].exports;if(e in d){var t=d[e];delete d[e];var r={id:e,exports:{}};return c[e]=r,t.call(r.exports,r,r.exports),r.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){d[e]=t},l.parcelRequire5b70=u);var h=u.register;h("27Lyk",function(e,t){s(e.exports,"register",()=>r,e=>r=e),s(e.exports,"resolve",()=>a,e=>a=e);var r,a,i=new Map;r=function(e,t){for(var r=0;r<t.length-1;r+=2)i.set(t[r],{baseUrl:e,path:t[r+1]})},a=function(e){var t=i.get(e);if(null==t)throw Error("Could not resolve bundle with id "+e);return new URL(t.path,t.baseUrl).toString()}}),h("eLX8K",function(e,t){s(e.exports,"BlurredEnvMapGenerator",()=>l);var r=u("ilwiq"),a=u("RPVlj"),i=u("9fZ6X"),o=u("dUUQZ");class n extends i.MaterialBase{constructor(){super({uniforms:{envMap:{value:null},blur:{value:0}},vertexShader:`

				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}

			`,fragmentShader:`

				#include <common>
				#include <cube_uv_reflection_fragment>

				${o.util_functions}

				uniform sampler2D envMap;
				uniform float blur;
				varying vec2 vUv;
				void main() {

					vec3 rayDirection = equirectUvToDirection( vUv );
					gl_FragColor = textureCubeUV( envMap, rayDirection, blur );

				}

			`})}}class l{constructor(e){this.renderer=e,this.pmremGenerator=new r.PMREMGenerator(e),this.copyQuad=new a.FullScreenQuad(new n),this.renderTarget=new r.WebGLRenderTarget(1,1,{type:r.FloatType,format:r.RGBAFormat})}dispose(){this.pmremGenerator.dispose(),this.copyQuad.dispose(),this.renderTarget.dispose()}generate(e,t){let{pmremGenerator:a,renderTarget:i,copyQuad:o,renderer:n}=this,s=a.fromEquirectangular(e),{width:l,height:c}=e.image;i.setSize(l,c),o.material.envMap=s.texture,o.material.blur=t;let d=n.getRenderTarget(),u=n.autoClear;n.setRenderTarget(i),n.autoClear=!0,o.render(n),n.setRenderTarget(d),n.autoClear=u;let h=new Uint16Array(l*c*4),p=new Float32Array(l*c*4);n.readRenderTargetPixels(i,0,0,l,c,p);for(let e=0,t=p.length;e<t;e++)h[e]=(0,r.DataUtils).toHalfFloat(p[e]);let m=new r.DataTexture(h,l,c,r.RGBAFormat,r.HalfFloatType);return m.minFilter=e.minFilter,m.magFilter=e.magFilter,m.wrapS=e.wrapS,m.wrapT=e.wrapT,m.mapping=r.EquirectangularReflectionMapping,m.needsUpdate=!0,s.dispose(),m}}}),h("9fZ6X",function(e,t){s(e.exports,"MaterialBase",()=>a);var r=u("ilwiq");class a extends r.ShaderMaterial{constructor(e){for(let t in super(e),this.uniforms)Object.defineProperty(this,t,{get(){return this.uniforms[t].value},set(e){this.uniforms[t].value=e}})}setDefine(e,t){if(null==t){if(e in this.defines)return delete this.defines[e],this.needsUpdate=!0,!0}else if(this.defines[e]!==t)return this.defines[e]=t,this.needsUpdate=!0,!0;return!1}}}),h("dUUQZ",function(e,t){s(e.exports,"util_functions",()=>r);let r=`

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
`}),h("bHiTZ",function(e,t){s(e.exports,"GradientEquirectTexture",()=>o);var r=u("ilwiq"),a=u("dbdMq");let i=new r.Vector3;class o extends a.ProceduralEquirectTexture{constructor(e=512){super(e,e),this.topColor=new(0,r.Color)().set(16777215),this.bottomColor=new(0,r.Color)().set(0),this.exponent=2,this.generationCallback=(e,t,r,a)=>{i.setFromSpherical(e);let o=.5*i.y+.5;a.lerpColors(this.bottomColor,this.topColor,o**this.exponent)}}copy(e){return super.copy(e),this.topColor.copy(e.topColor),this.bottomColor.copy(e.bottomColor),this}}}),h("dbdMq",function(e,t){s(e.exports,"ProceduralEquirectTexture",()=>l);var r=u("ilwiq");let a=new r.Vector2,i=new r.Vector2,o=new r.Spherical,n=new r.Color;class l extends r.DataTexture{constructor(e=512,t=512){super(new Float32Array(e*t*4),e,t,r.RGBAFormat,r.FloatType,r.EquirectangularReflectionMapping,r.RepeatWrapping,r.ClampToEdgeWrapping,r.LinearFilter,r.LinearFilter),this.generationCallback=null}update(){this.dispose(),this.needsUpdate=!0;let{data:e,width:t,height:r}=this.image;for(let s=0;s<t;s++)for(let l=0;l<r;l++){i.set(t,r),a.set(s/t,l/r),a.x-=.5,a.y=1-a.y,o.theta=2*a.x*Math.PI,o.phi=a.y*Math.PI,o.radius=1,this.generationCallback(o,a,i,n);let c=4*(l*t+s);e[c+0]=n.r,e[c+1]=n.g,e[c+2]=n.b,e[c+3]=1}}copy(e){return super.copy(e),this.generationCallback=e.generationCallback,this}}}),h("8mHfG",function(e,t){s(e.exports,"WebGLPathTracer",()=>h);var r=u("ilwiq"),a=u("hWj76"),i=u("hWds8"),o=u("RPVlj"),n=u("bHiTZ"),l=u("9wqOU"),c=u("5rCKZ");let d=new r.Vector2;class h{get multipleImportanceSampling(){return!!this._pathTracer.material.defines.FEATURE_MIS}set multipleImportanceSampling(e){this._pathTracer.material.setDefine("FEATURE_MIS",e?1:0)}get transmissiveBounces(){return this._pathTracer.material.transmissiveBounces}set transmissiveBounces(e){this._pathTracer.material.transmissiveBounces=e}get bounces(){return this._pathTracer.material.bounces}set bounces(e){this._pathTracer.material.bounces=e}get filterGlossyFactor(){return this._pathTracer.material.filterGlossyFactor}set filterGlossyFactor(e){this._pathTracer.material.filterGlossyFactor=e}get samples(){return this._pathTracer.samples}get target(){return this._pathTracer.target}get tiles(){return this._pathTracer.tiles}constructor(e){this._renderer=e,this._generator=new a.PathTracingSceneGenerator,this._pathTracer=new i.PathTracingRenderer(e),this._queueReset=!1,this._clock=new r.Clock,this._lowResPathTracer=new i.PathTracingRenderer(e),this._lowResPathTracer.tiles.set(1,1),this._quad=new o.FullScreenQuad(new c.ClampedInterpolationMaterial({map:null,transparent:!0,blending:r.NoBlending,premultipliedAlpha:e.getContextAttributes().premultipliedAlpha})),this._materials=null,this.renderDelay=100,this.minSamples=5,this.fadeDuration=500,this.enablePathTracing=!0,this.pausePathTracing=!1,this.dynamicLowRes=!1,this.lowResScale=.25,this.renderScale=1,this.synchronizeRenderSize=!0,this.rasterizeScene=!0,this.renderToCanvas=!0,this.textureSize=new r.Vector2(1024,1024),this.rasterizeSceneCallback=(e,t)=>{this._renderer.render(e,t)},this.renderToCanvasCallback=(e,t,r)=>{let a=t.autoClear;t.autoClear=!1,r.render(t),t.autoClear=a},this.setScene(new r.Scene,new r.PerspectiveCamera)}setBVHWorker(e){this._generator.setBVHWorker(e)}setScene(e,t,r={}){e.updateMatrixWorld(!0),t.updateMatrixWorld();let a=this._generator;if(a.setObjects(e),this._buildAsync)return a.generateAsync(r.onProgress).then(r=>this._updateFromResults(e,t,r));{let r=a.generate();return this._updateFromResults(e,t,r)}}setSceneAsync(...e){this._buildAsync=!0;let t=this.setScene(...e);return this._buildAsync=!1,t}setCamera(e){this.camera=e,this.updateCamera()}updateCamera(){let e=this.camera;e.updateMatrixWorld(),this._pathTracer.setCamera(e),this._lowResPathTracer.setCamera(e),this.reset()}updateMaterials(){let e=this._pathTracer.material,t=this._renderer,r=this._materials,a=this.textureSize,i=(0,l.getTextures)(r);e.textures.setTextures(t,i,a.x,a.y),e.materials.updateFrom(r,i),this.reset()}updateLights(){let e=this.scene,t=this._renderer,r=this._pathTracer.material,a=(0,l.getLights)(e),i=(0,l.getIesTextures)(a);r.lights.updateFrom(a,i),r.iesProfiles.setTextures(t,i),this.reset()}updateEnvironment(){let e=this.scene,t=this._pathTracer.material;if(t.backgroundBlur=e.backgroundBlurriness,t.backgroundIntensity=e.backgroundIntensity??1,t.backgroundRotation.makeRotationFromEuler(e.backgroundRotation).invert(),null===e.background)t.backgroundMap=null,t.backgroundAlpha=0;else if(e.background.isColor){this._colorBackground=this._colorBackground||new n.GradientEquirectTexture(16);let r=this._colorBackground;r.topColor.equals(e.background)||(r.topColor.set(e.background),r.bottomColor.set(e.background),r.update()),t.backgroundMap=r,t.backgroundAlpha=1}else t.backgroundMap=e.background,t.backgroundAlpha=1;t.environmentIntensity=e.environmentIntensity??1,t.environmentRotation.makeRotationFromEuler(e.environmentRotation).invert(),this._previousEnvironment!==e.environment&&(e.environment?t.envMapInfo.updateFrom(e.environment):t.environmentIntensity=0),this._previousEnvironment=e.environment,this.reset()}_updateFromResults(e,t,r){let{materials:a,geometry:i,bvh:o,bvhChanged:n}=r;this._materials=a;let s=this._pathTracer.material;return n&&(s.bvh.updateFrom(o),s.attributesArray.updateFrom(i.attributes.normal,i.attributes.tangent,i.attributes.uv,i.attributes.color),s.materialIndexAttribute.updateFrom(i.attributes.materialIndex)),this._previousScene=e,this.scene=e,this.camera=t,this.updateCamera(),this.updateMaterials(),this.updateEnvironment(),this.updateLights(),r}renderSample(){let e=this._lowResPathTracer,t=this._pathTracer,a=this._renderer,i=this._clock,o=this._quad;this._updateScale(),this._queueReset&&(t.reset(),e.reset(),this._queueReset=!1,o.material.opacity=0,i.start());let n=1e3*i.getDelta(),s=1e3*i.getElapsedTime();if(!this.pausePathTracing&&this.enablePathTracing&&this.renderDelay<=s&&t.update(),t.alpha=1!==t.material.backgroundAlpha||!a.extensions.get("EXT_float_blend"),e.alpha=t.alpha,this.renderToCanvas){let a=this._renderer,i=this.minSamples;if(s>=this.renderDelay&&this.samples>=this.minSamples&&(0!==this.fadeDuration?o.material.opacity=Math.min(o.material.opacity+n/this.fadeDuration,1):o.material.opacity=1),!this.enablePathTracing||this.samples<i||o.material.opacity<1){if(this.dynamicLowRes){e.samples<1&&(e.material=t.material,e.update());let r=o.material.opacity;o.material.opacity=1-o.material.opacity,o.material.map=e.target.texture,o.render(a),o.material.opacity=r}else this.rasterizeScene&&this.rasterizeSceneCallback(this.scene,this.camera)}this.enablePathTracing&&o.material.opacity>0&&(o.material.opacity<1&&(o.material.blending=this.dynamicLowRes?r.AdditiveBlending:r.NormalBlending),o.material.map=t.target.texture,this.renderToCanvasCallback(t.target,a,o),o.material.blending=r.NoBlending)}}reset(){this._queueReset=!0,this._pathTracer.samples=0}dispose(){this._renderQuad.dispose(),this._renderQuad.material.dispose(),this._pathTracer.dispose()}_updateScale(){if(this.synchronizeRenderSize){this._renderer.getDrawingBufferSize(d);let e=Math.floor(this.renderScale*d.x),t=Math.floor(this.renderScale*d.y);if(this._pathTracer.getSize(d),d.x!==e||d.y!==t){let r=this.lowResScale;this._pathTracer.setSize(e,t),this._lowResPathTracer.setSize(Math.floor(e*r),Math.floor(t*r))}}}}}),h("5rCKZ",function(e,t){s(e.exports,"ClampedInterpolationMaterial",()=>a);var r=u("ilwiq");class a extends r.ShaderMaterial{get map(){return this.uniforms.map.value}set map(e){this.uniforms.map.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}constructor(e){super({uniforms:{map:{value:null},opacity:{value:1}},vertexShader:`
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
			`}),this.setValues(e)}}}),h("891vQ",function(e,t){s(e.exports,"RGBELoader",()=>a);var r=u("ilwiq");class a extends r.DataTextureLoader{constructor(e){super(e),this.type=r.HalfFloatType}parse(e){let t,a,i;let o=function(e,t){switch(e){case 1:throw Error("THREE.RGBELoader: Read Error: "+(t||""));case 2:throw Error("THREE.RGBELoader: Write Error: "+(t||""));case 3:throw Error("THREE.RGBELoader: Bad File Format: "+(t||""));default:throw Error("THREE.RGBELoader: Memory Error: "+(t||""))}},n=function(e,t,r){t=t||1024;let a=e.pos,i=-1,o=0,n="",s=String.fromCharCode.apply(null,new Uint16Array(e.subarray(a,a+128)));for(;0>(i=s.indexOf("\n"))&&o<t&&a<e.byteLength;)n+=s,o+=s.length,a+=128,s+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(a,a+128)));return -1<i&&(!1!==r&&(e.pos+=o+i+1),n+s.slice(0,i))},s=new Uint8Array(e);s.pos=0;let l=function(e){let t,r;let a=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,i=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,s=/^\s*FORMAT=(\S+)\s*$/,l=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,c={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};for(!(e.pos>=e.byteLength)&&(t=n(e))||o(1,"no header found"),(r=t.match(/^#\?(\S+)/))||o(3,"bad initial token"),c.valid|=1,c.programtype=r[1],c.string+=t+"\n";!1!==(t=n(e));){if(c.string+=t+"\n","#"===t.charAt(0)){c.comments+=t+"\n";continue}if((r=t.match(a))&&(c.gamma=parseFloat(r[1])),(r=t.match(i))&&(c.exposure=parseFloat(r[1])),(r=t.match(s))&&(c.valid|=2,c.format=r[1]),(r=t.match(l))&&(c.valid|=4,c.height=parseInt(r[1],10),c.width=parseInt(r[2],10)),2&c.valid&&4&c.valid)break}return 2&c.valid||o(3,"missing format specifier"),4&c.valid||o(3,"missing image size specifier"),c}(s),c=l.width,d=l.height,u=function(e,t,r){if(t<8||t>32767||2!==e[0]||2!==e[1]||128&e[2])return new Uint8Array(e);t!==(e[2]<<8|e[3])&&o(3,"wrong scanline width");let a=new Uint8Array(4*t*r);a.length||o(4,"unable to allocate buffer space");let i=0,n=0,s=4*t,l=new Uint8Array(4),c=new Uint8Array(s),d=r;for(;d>0&&n<e.byteLength;){n+4>e.byteLength&&o(1),l[0]=e[n++],l[1]=e[n++],l[2]=e[n++],l[3]=e[n++],(2!=l[0]||2!=l[1]||(l[2]<<8|l[3])!=t)&&o(3,"bad rgbe scanline format");let r=0,u;for(;r<s&&n<e.byteLength;){let t=(u=e[n++])>128;if(t&&(u-=128),(0===u||r+u>s)&&o(3,"bad scanline data"),t){let t=e[n++];for(let e=0;e<u;e++)c[r++]=t}else c.set(e.subarray(n,n+u),r),r+=u,n+=u}for(let e=0;e<t;e++){let r=0;a[i]=c[e+r],r+=t,a[i+1]=c[e+r],r+=t,a[i+2]=c[e+r],r+=t,a[i+3]=c[e+r],i+=4}d--}return a}(s.subarray(s.pos),c,d);switch(this.type){case r.FloatType:let h=new Float32Array(4*(i=u.length/4));for(let e=0;e<i;e++)!function(e,t,r,a){let i=Math.pow(2,e[t+3]-128)/255;r[a+0]=e[t+0]*i,r[a+1]=e[t+1]*i,r[a+2]=e[t+2]*i,r[a+3]=1}(u,4*e,h,4*e);t=h,a=r.FloatType;break;case r.HalfFloatType:let p=new Uint16Array(4*(i=u.length/4));for(let e=0;e<i;e++)!function(e,t,a,i){let o=Math.pow(2,e[t+3]-128)/255;a[i+0]=(0,r.DataUtils).toHalfFloat(Math.min(e[t+0]*o,65504)),a[i+1]=(0,r.DataUtils).toHalfFloat(Math.min(e[t+1]*o,65504)),a[i+2]=(0,r.DataUtils).toHalfFloat(Math.min(e[t+2]*o,65504)),a[i+3]=(0,r.DataUtils).toHalfFloat(1)}(u,4*e,p,4*e);t=p,a=r.HalfFloatType;break;default:throw Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:c,height:d,data:t,header:l.string,gamma:l.gamma,exposure:l.exposure,type:a}}setDataType(e){return this.type=e,this}load(e,t,a,i){return super.load(e,function(e,a){switch(e.type){case r.FloatType:case r.HalfFloatType:e.colorSpace=r.LinearSRGBColorSpace,e.minFilter=r.LinearFilter,e.magFilter=r.LinearFilter,e.generateMipmaps=!1,e.flipY=!0}t&&t(e,a)},a,i)}}}),h("cE5k3",function(e,t){s(e.exports,"getScaledSettings",()=>r);function r(){let e=3,t=Math.max(1/window.devicePixelRatio,.5);return window.innerWidth/window.innerHeight<.65&&(e=4,t=.5/window.devicePixelRatio),{tiles:e,renderScale:t}}}),h("e2Pv4",function(e,t){let r;s(e.exports,"LoaderElement",()=>a);class a{constructor(){r||((r=document.createElement("style")).textContent=`

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
	`,document.head.appendChild(r));let e=document.createElement("div");e.classList.add("loader-container");let t=document.createElement("div");t.classList.add("percentage"),e.appendChild(t);let a=document.createElement("div");a.classList.add("samples"),e.appendChild(a);let i=document.createElement("div");i.classList.add("credits"),e.appendChild(i);let o=document.createElement("div");o.classList.add("bar"),e.appendChild(o);let n=document.createElement("div");n.classList.add("description"),e.appendChild(n),this._description=n,this._loaderBar=o,this._percentage=t,this._credits=i,this._samples=a,this._container=e,this.setPercentage(0)}attach(e){e.appendChild(this._container),e.appendChild(this._description)}setPercentage(e){this._loaderBar.style.width=`${100*e}%`,0===e?this._percentage.innerText="Loading...":this._percentage.innerText=`${(100*e).toFixed(0)}%`,e>=1?this._container.classList.remove("loading"):this._container.classList.add("loading")}setSamples(e){this._samples.innerText=`${Math.floor(e)} samples`}setCredits(e){this._credits.innerHTML=e}setDescription(e){this._description.innerHTML=e}}}),h("kqOCM",function(e,t){s(e.exports,"ParallelMeshBVHWorker",()=>h);var r=u("ilwiq"),a=u("6KVZ3"),i=u("3ePKg"),o=u("cSOJe"),n=u("a8VBx"),l=u("5Gkg5");let c="undefined"!=typeof navigator?navigator.hardwareConcurrency:4;class d extends i.WorkerBase{constructor(){if(super(new Worker(u("2tQrc"))),this.name="ParallelMeshBVHWorker",this.maxWorkerCount=Math.max(c,4),!(0,o.isSharedArrayBufferSupported)())throw Error("ParallelMeshBVHWorker: Shared Array Buffers are not supported.")}runTask(e,t,i={}){return new Promise((n,s)=>{if(t.index||i.indirect||(0,l.ensureIndex)(t,i),t.getAttribute("position").isInterleavedBufferAttribute||t.index&&t.index.isInterleavedBufferAttribute)throw Error("ParallelMeshBVHWorker: InterleavedBufferAttribute are not supported for the geometry attributes.");e.onerror=e=>{s(Error(`ParallelMeshBVHWorker: ${e.message}`))},e.onmessage=o=>{let{data:l}=o;if(l.error)s(Error(l.error)),e.onmessage=null;else if(l.serialized){let{serialized:o,position:s}=l,c=(0,a.MeshBVH).deserialize(o,t,{setIndex:!1}),d={setBoundingBox:!0,...i};if(t.attributes.position.array=s,o.index){if(t.index)t.index.array=o.index;else{let e=new r.BufferAttribute(o.index,1,!1);t.setIndex(e)}}d.setBoundingBox&&(t.boundingBox=c.getBoundingBox(new r.Box3)),i.onProgress&&i.onProgress(l.progress),n(c),e.onmessage=null}else i.onProgress&&i.onProgress(l.progress)};let c=t.index?t.index.array:null,d=t.attributes.position.array;e.postMessage({operation:"BUILD_BVH",maxWorkerCount:this.maxWorkerCount,index:(0,o.convertToBufferType)(c,SharedArrayBuffer),position:(0,o.convertToBufferType)(d,SharedArrayBuffer),options:{...i,onProgress:null,includedProgressCallback:!!i.onProgress,groups:[...t.groups]}})})}}class h{constructor(){if((0,o.isSharedArrayBufferSupported)())return new d;{console.warn("ParallelMeshBVHWorker: SharedArrayBuffers not supported. Falling back to single-threaded GenerateMeshBVHWorker.");let e=new n.GenerateMeshBVHWorker;return e.maxWorkerCount=c,e}}}}),h("3ePKg",function(e,t){s(e.exports,"WorkerBase",()=>r);class r{constructor(e){this.name="WorkerBase",this.running=!1,this.worker=e,this.worker.onerror=e=>{if(e.message)throw Error(`${this.name}: Could not create Web Worker with error "${e.message}"`);throw Error(`${this.name}: Could not create Web Worker.`)}}runTask(){}generate(...e){if(this.running)throw Error("GenerateMeshBVHWorker: Already running job.");if(null===this.worker)throw Error("GenerateMeshBVHWorker: Worker has been disposed.");this.running=!0;let t=this.runTask(this.worker,...e);return t.finally(()=>{this.running=!1}),t}dispose(){this.worker.terminate(),this.worker=null}}}),h("a8VBx",function(e,t){s(e.exports,"GenerateMeshBVHWorker",()=>o);var r=u("ilwiq"),a=u("6KVZ3"),i=u("3ePKg");class o extends i.WorkerBase{constructor(){super(new Worker(u("jVRlM"))),this.name="GenerateMeshBVHWorker"}runTask(e,t,i={}){return new Promise((o,n)=>{if(t.getAttribute("position").isInterleavedBufferAttribute||t.index&&t.index.isInterleavedBufferAttribute)throw Error("GenerateMeshBVHWorker: InterleavedBufferAttribute are not supported for the geometry attributes.");e.onerror=e=>{n(Error(`GenerateMeshBVHWorker: ${e.message}`))},e.onmessage=s=>{let{data:l}=s;if(l.error)n(Error(l.error)),e.onmessage=null;else if(l.serialized){let{serialized:n,position:s}=l,c=(0,a.MeshBVH).deserialize(n,t,{setIndex:!1}),d=Object.assign({setBoundingBox:!0},i);if(t.attributes.position.array=s,n.index){if(t.index)t.index.array=n.index;else{let e=new r.BufferAttribute(n.index,1,!1);t.setIndex(e)}}d.setBoundingBox&&(t.boundingBox=c.getBoundingBox(new r.Box3)),i.onProgress&&i.onProgress(l.progress),o(c),e.onmessage=null}else i.onProgress&&i.onProgress(l.progress)};let s=t.index?t.index.array:null,l=t.attributes.position.array,c=[l];s&&c.push(s),e.postMessage({index:s,position:l,options:{...i,onProgress:null,includedProgressCallback:!!i.onProgress,groups:[...t.groups]}},c.map(e=>e.buffer).filter(e=>"undefined"==typeof SharedArrayBuffer||!(e instanceof SharedArrayBuffer)))})}}}),h("jVRlM",function(e,t){var r=u("7ryUf");let a=new URL("generateMeshBVH.worker.373f3c58.js",import.meta.url);e.exports=r(a.toString(),a.origin,!0)}),h("7ryUf",function(e,t){e.exports=function(e,t,r){if(t===self.location.origin)return e;var a=r?"import "+JSON.stringify(e)+";":"importScripts("+JSON.stringify(e)+");";return URL.createObjectURL(new Blob([a],{type:"application/javascript"}))}}),h("2tQrc",function(e,t){var r=u("7ryUf");let a=new URL("parallelMeshBVH.worker.22cf4bb0.js",import.meta.url);e.exports=r(a.toString(),a.origin,!0)}),h("fYvb1",function(e,t){s(e.exports,"math_functions",()=>r);let r=`

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

`}),h("8keuf",function(e,t){s(e.exports,"ggx_functions",()=>r);let r=`

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

`}),u("27Lyk").register(new URL("",import.meta.url).toString(),JSON.parse('["0iKVa","depthOfField.0cc6d401.js","512E4","parallelMeshBVH.worker.22cf4bb0.js","9P1cE","generateMeshBVH.worker.cd4b9fc6.js","lWWke","generateMeshBVH.worker.373f3c58.js","9P1cE","generateMeshBVH.worker.cd4b9fc6.js","jwbL2","aoRender.e5303912.js","63CMm","aoRender.a1271ff5.js","2tzBs","aoRender.89c1b67b.js","6UuCC","aoRender.5fc59dbe.js","6mMEU","aoRender.fc8349f1.js","i0zVc","aoRender.dcf40b33.js","j19h5","aoRender.e8b1599c.js","eif6c","areaLight.5654e8b2.js"]'));var p=u("ilwiq"),m=u("7lx9d"),f=u("5Rd1x"),g=u("eLX8K"),v=u("bHiTZ"),x=u("kLfIo"),b=u("8mHfG"),w=u("891vQ"),y=u("kp7Te"),T=u("jiuw3"),C=u("cE5k3"),S=u("e2Pv4"),k=u("kqOCM");const _=new p.Vector2,B=new p.Vector3,M={bounces:3,renderScale:1/window.devicePixelRatio,filterGlossyFactor:.5,tiles:1,autoFocus:!0,...(0,C.getScaledSettings)()};function P(e){_.set(e.clientX,e.clientY)}function F(t){if(Math.abs(_.x-t.clientX)+Math.abs(_.y-t.clientY)<2&&o){let r=new p.Raycaster;r.setFromCamera({x:t.clientX/window.innerWidth*2-1,y:-(t.clientY/window.innerHeight*2)+1},a);let i=o.raycastFirst(r.ray);i&&(B.copy(i.point),a.focusDistance=i.distance-a.near,e.updateCamera())}}function E(){t.setSize(window.innerWidth,window.innerHeight),t.setPixelRatio(window.devicePixelRatio),a.aspect=window.innerWidth/window.innerHeight,a.updateProjectionMatrix(),e.updateCamera()}function R(){e.filterGlossyFactor=M.filterGlossyFactor,e.bounces=M.bounces,e.renderScale=M.renderScale,e.updateCamera(),e.reset()}!async function(){(n=new S.LoaderElement).attach(document.body),(t=new p.WebGLRenderer({antialias:!0})).toneMapping=p.ACESFilmicToneMapping,document.body.appendChild(t.domElement),(e=new b.WebGLPathTracer(t)).setBVHWorker(new k.ParallelMeshBVHWorker),e.tiles.set(M.tiles,M.tiles),(a=new x.PhysicalCamera(60,window.innerWidth/window.innerHeight,.025,500)).position.set(-.262,.5276,-1.1606),a.apertureBlades=6,a.fStop=.6,a.focusDistance=1.1878,B.set(-.5253353217832674,.3031596413506029,777794185259223e-18);let s=new v.GradientEquirectTexture;s.topColor.set(3739424).convertSRGBToLinear(),s.bottomColor.set(1383199).convertSRGBToLinear(),s.update(),(i=new p.Scene).background=s,i.environmentIntensity=.5,(r=new f.OrbitControls(a,t.domElement)).target.set(-.182,.147,.06),r.update(),r.addEventListener("change",()=>{M.autoFocus&&(a.focusDistance=a.position.distanceTo(B)-a.near),e.updateCamera()});let[l,c]=await Promise.all([new(0,w.RGBELoader)().loadAsync("https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/royal_esplanade_1k.hdr"),new(0,m.GLTFLoader)().setMeshoptDecoder(y.MeshoptDecoder).loadAsync("https://raw.githubusercontent.com/gkjohnson/3d-demo-data/main/models/sd-macross-city-standoff-diorama/scene.glb")]),d=new g.BlurredEnvMapGenerator(t),u=d.generate(l,.35);d.dispose(),l.dispose(),i.environment=u;let h=new p.SphereGeometry(1,10,10),C=new p.MeshStandardMaterial({emissiveIntensity:10,emissive:16777215});for(let e=0;e<300;e++){let e=new p.Mesh(h,C);e.scale.setScalar(.075*Math.random()+.03),e.position.randomDirection().multiplyScalar(30+15*Math.random()),i.add(e)}c.scene.scale.setScalar(.5),c.scene.traverse(e=>{e.material&&(e.material.roughness=.05,e.material.metalness=.05)}),i.add(c.scene),i.updateMatrixWorld(!0),o=(await e.setSceneAsync(i,a,{onProgress:e=>n.setPercentage(e)})).bvh,n.setCredits("Model by tipatat on Sketchfab"),n.setDescription("Path tracing with configurable bokeh and depth of field. Click point in scene to focus."),R(),E(),window.addEventListener("resize",E),t.domElement.addEventListener("mouseup",F),t.domElement.addEventListener("mousedown",P);let _=new T.GUI,L=_.addFolder("Path Tracer");L.add(M,"tiles",1,4,1).onChange(t=>{e.tiles.set(t,t)}),L.add(M,"bounces",1,30,1).onChange(R),L.add(M,"renderScale",.1,1).onChange(R);let A=_.addFolder("Camera");A.add(a,"focusDistance",1,100).onChange(R).listen(),A.add(a,"apertureBlades",0,10,1).onChange(function(e){a.apertureBlades=0===e?0:Math.max(e,3),this.updateDisplay(),R()}),A.add(a,"apertureRotation",0,12.5).onChange(R),A.add(a,"anamorphicRatio",.1,10).onChange(R),A.add(a,"bokehSize",0,100).onChange(R).listen(),A.add(a,"fStop",.02,20).onChange(R).listen(),A.add(a,"fov",25,100).onChange(()=>{a.updateProjectionMatrix(),e.updateCamera()}).listen(),A.add(M,"autoFocus"),function t(){requestAnimationFrame(t),e.renderSample(),n.setSamples(e.samples)}()}();
//# sourceMappingURL=depthOfField.0cc6d401.js.map
