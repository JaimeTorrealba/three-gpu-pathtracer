let e,t,a,r,i,n,o,s,l;function c(e,t,a,r){Object.defineProperty(e,t,{get:a,set:r,enumerable:!0,configurable:!0})}var d=globalThis,h={},p={},u=d.parcelRequire5b70;null==u&&((u=function(e){if(e in h)return h[e].exports;if(e in p){var t=p[e];delete p[e];var a={id:e,exports:{}};return h[e]=a,t.call(a.exports,a,a.exports),a.exports}var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){p[e]=t},d.parcelRequire5b70=u);var m=u.register;m("eLX8K",function(e,t){c(e.exports,"BlurredEnvMapGenerator",()=>s);var a=u("ilwiq"),r=u("RPVlj"),i=u("9fZ6X"),n=u("dUUQZ");class o extends i.MaterialBase{constructor(){super({uniforms:{envMap:{value:null},blur:{value:0}},vertexShader:`

				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}

			`,fragmentShader:`

				#include <common>
				#include <cube_uv_reflection_fragment>

				${n.util_functions}

				uniform sampler2D envMap;
				uniform float blur;
				varying vec2 vUv;
				void main() {

					vec3 rayDirection = equirectUvToDirection( vUv );
					gl_FragColor = textureCubeUV( envMap, rayDirection, blur );

				}

			`})}}class s{constructor(e){this.renderer=e,this.pmremGenerator=new a.PMREMGenerator(e),this.copyQuad=new r.FullScreenQuad(new o),this.renderTarget=new a.WebGLRenderTarget(1,1,{type:a.FloatType,format:a.RGBAFormat})}dispose(){this.pmremGenerator.dispose(),this.copyQuad.dispose(),this.renderTarget.dispose()}generate(e,t){let{pmremGenerator:r,renderTarget:i,copyQuad:n,renderer:o}=this,s=r.fromEquirectangular(e),{width:l,height:c}=e.image;i.setSize(l,c),n.material.envMap=s.texture,n.material.blur=t;let d=o.getRenderTarget(),h=o.autoClear;o.setRenderTarget(i),o.autoClear=!0,n.render(o),o.setRenderTarget(d),o.autoClear=h;let p=new Uint16Array(l*c*4),u=new Float32Array(l*c*4);o.readRenderTargetPixels(i,0,0,l,c,u);for(let e=0,t=u.length;e<t;e++)p[e]=(0,a.DataUtils).toHalfFloat(u[e]);let m=new a.DataTexture(p,l,c,a.RGBAFormat,a.HalfFloatType);return m.minFilter=e.minFilter,m.magFilter=e.magFilter,m.wrapS=e.wrapS,m.wrapT=e.wrapT,m.mapping=a.EquirectangularReflectionMapping,m.needsUpdate=!0,s.dispose(),m}}}),m("9fZ6X",function(e,t){c(e.exports,"MaterialBase",()=>r);var a=u("ilwiq");class r extends a.ShaderMaterial{constructor(e){for(let t in super(e),this.uniforms)Object.defineProperty(this,t,{get(){return this.uniforms[t].value},set(e){this.uniforms[t].value=e}})}setDefine(e,t){if(null==t){if(e in this.defines)return delete this.defines[e],this.needsUpdate=!0,!0}else if(this.defines[e]!==t)return this.defines[e]=t,this.needsUpdate=!0,!0;return!1}}}),m("dUUQZ",function(e,t){c(e.exports,"util_functions",()=>a);let a=`

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
`}),m("8mHfG",function(e,t){c(e.exports,"WebGLPathTracer",()=>h);var a=u("ilwiq"),r=u("hWj76"),i=u("hWds8"),n=u("RPVlj"),o=u("bHiTZ"),s=u("9wqOU"),l=u("5rCKZ");let d=new a.Vector2;class h{get multipleImportanceSampling(){return!!this._pathTracer.material.defines.FEATURE_MIS}set multipleImportanceSampling(e){this._pathTracer.material.setDefine("FEATURE_MIS",e?1:0)}get transmissiveBounces(){return this._pathTracer.material.transmissiveBounces}set transmissiveBounces(e){this._pathTracer.material.transmissiveBounces=e}get bounces(){return this._pathTracer.material.bounces}set bounces(e){this._pathTracer.material.bounces=e}get filterGlossyFactor(){return this._pathTracer.material.filterGlossyFactor}set filterGlossyFactor(e){this._pathTracer.material.filterGlossyFactor=e}get samples(){return this._pathTracer.samples}get target(){return this._pathTracer.target}get tiles(){return this._pathTracer.tiles}constructor(e){this._renderer=e,this._generator=new r.PathTracingSceneGenerator,this._pathTracer=new i.PathTracingRenderer(e),this._queueReset=!1,this._clock=new a.Clock,this._lowResPathTracer=new i.PathTracingRenderer(e),this._lowResPathTracer.tiles.set(1,1),this._quad=new n.FullScreenQuad(new l.ClampedInterpolationMaterial({map:null,transparent:!0,blending:a.NoBlending,premultipliedAlpha:e.getContextAttributes().premultipliedAlpha})),this._materials=null,this.renderDelay=100,this.minSamples=5,this.fadeDuration=500,this.enablePathTracing=!0,this.pausePathTracing=!1,this.dynamicLowRes=!1,this.lowResScale=.25,this.renderScale=1,this.synchronizeRenderSize=!0,this.rasterizeScene=!0,this.renderToCanvas=!0,this.textureSize=new a.Vector2(1024,1024),this.rasterizeSceneCallback=(e,t)=>{this._renderer.render(e,t)},this.renderToCanvasCallback=(e,t,a)=>{let r=t.autoClear;t.autoClear=!1,a.render(t),t.autoClear=r},this.setScene(new a.Scene,new a.PerspectiveCamera)}setBVHWorker(e){this._generator.setBVHWorker(e)}setScene(e,t,a={}){e.updateMatrixWorld(!0),t.updateMatrixWorld();let r=this._generator;if(r.setObjects(e),this._buildAsync)return r.generateAsync(a.onProgress).then(a=>this._updateFromResults(e,t,a));{let a=r.generate();return this._updateFromResults(e,t,a)}}setSceneAsync(...e){this._buildAsync=!0;let t=this.setScene(...e);return this._buildAsync=!1,t}setCamera(e){this.camera=e,this.updateCamera()}updateCamera(){let e=this.camera;e.updateMatrixWorld(),this._pathTracer.setCamera(e),this._lowResPathTracer.setCamera(e),this.reset()}updateMaterials(){let e=this._pathTracer.material,t=this._renderer,a=this._materials,r=this.textureSize,i=(0,s.getTextures)(a);e.textures.setTextures(t,i,r.x,r.y),e.materials.updateFrom(a,i),this.reset()}updateLights(){let e=this.scene,t=this._renderer,a=this._pathTracer.material,r=(0,s.getLights)(e),i=(0,s.getIesTextures)(r);a.lights.updateFrom(r,i),a.iesProfiles.setTextures(t,i),this.reset()}updateEnvironment(){let e=this.scene,t=this._pathTracer.material;if(t.backgroundBlur=e.backgroundBlurriness,t.backgroundIntensity=e.backgroundIntensity??1,t.backgroundRotation.makeRotationFromEuler(e.backgroundRotation).invert(),null===e.background)t.backgroundMap=null,t.backgroundAlpha=0;else if(e.background.isColor){this._colorBackground=this._colorBackground||new o.GradientEquirectTexture(16);let a=this._colorBackground;a.topColor.equals(e.background)||(a.topColor.set(e.background),a.bottomColor.set(e.background),a.update()),t.backgroundMap=a,t.backgroundAlpha=1}else t.backgroundMap=e.background,t.backgroundAlpha=1;t.environmentIntensity=e.environmentIntensity??1,t.environmentRotation.makeRotationFromEuler(e.environmentRotation).invert(),this._previousEnvironment!==e.environment&&(e.environment?t.envMapInfo.updateFrom(e.environment):t.environmentIntensity=0),this._previousEnvironment=e.environment,this.reset()}_updateFromResults(e,t,a){let{materials:r,geometry:i,bvh:n,bvhChanged:o}=a;this._materials=r;let s=this._pathTracer.material;return o&&(s.bvh.updateFrom(n),s.attributesArray.updateFrom(i.attributes.normal,i.attributes.tangent,i.attributes.uv,i.attributes.color),s.materialIndexAttribute.updateFrom(i.attributes.materialIndex)),this._previousScene=e,this.scene=e,this.camera=t,this.updateCamera(),this.updateMaterials(),this.updateEnvironment(),this.updateLights(),a}renderSample(){let e=this._lowResPathTracer,t=this._pathTracer,r=this._renderer,i=this._clock,n=this._quad;this._updateScale(),this._queueReset&&(t.reset(),e.reset(),this._queueReset=!1,n.material.opacity=0,i.start());let o=1e3*i.getDelta(),s=1e3*i.getElapsedTime();if(!this.pausePathTracing&&this.enablePathTracing&&this.renderDelay<=s&&t.update(),t.alpha=1!==t.material.backgroundAlpha||!r.extensions.get("EXT_float_blend"),e.alpha=t.alpha,this.renderToCanvas){let r=this._renderer,i=this.minSamples;if(s>=this.renderDelay&&this.samples>=this.minSamples&&(0!==this.fadeDuration?n.material.opacity=Math.min(n.material.opacity+o/this.fadeDuration,1):n.material.opacity=1),!this.enablePathTracing||this.samples<i||n.material.opacity<1){if(this.dynamicLowRes){e.samples<1&&(e.material=t.material,e.update());let a=n.material.opacity;n.material.opacity=1-n.material.opacity,n.material.map=e.target.texture,n.render(r),n.material.opacity=a}else this.rasterizeScene&&this.rasterizeSceneCallback(this.scene,this.camera)}this.enablePathTracing&&n.material.opacity>0&&(n.material.opacity<1&&(n.material.blending=this.dynamicLowRes?a.AdditiveBlending:a.NormalBlending),n.material.map=t.target.texture,this.renderToCanvasCallback(t.target,r,n),n.material.blending=a.NoBlending)}}reset(){this._queueReset=!0,this._pathTracer.samples=0}dispose(){this._renderQuad.dispose(),this._renderQuad.material.dispose(),this._pathTracer.dispose()}_updateScale(){if(this.synchronizeRenderSize){this._renderer.getDrawingBufferSize(d);let e=Math.floor(this.renderScale*d.x),t=Math.floor(this.renderScale*d.y);if(this._pathTracer.getSize(d),d.x!==e||d.y!==t){let a=this.lowResScale;this._pathTracer.setSize(e,t),this._lowResPathTracer.setSize(Math.floor(e*a),Math.floor(t*a))}}}}}),m("bHiTZ",function(e,t){c(e.exports,"GradientEquirectTexture",()=>n);var a=u("ilwiq"),r=u("dbdMq");let i=new a.Vector3;class n extends r.ProceduralEquirectTexture{constructor(e=512){super(e,e),this.topColor=new(0,a.Color)().set(16777215),this.bottomColor=new(0,a.Color)().set(0),this.exponent=2,this.generationCallback=(e,t,a,r)=>{i.setFromSpherical(e);let n=.5*i.y+.5;r.lerpColors(this.bottomColor,this.topColor,n**this.exponent)}}copy(e){return super.copy(e),this.topColor.copy(e.topColor),this.bottomColor.copy(e.bottomColor),this}}}),m("dbdMq",function(e,t){c(e.exports,"ProceduralEquirectTexture",()=>s);var a=u("ilwiq");let r=new a.Vector2,i=new a.Vector2,n=new a.Spherical,o=new a.Color;class s extends a.DataTexture{constructor(e=512,t=512){super(new Float32Array(e*t*4),e,t,a.RGBAFormat,a.FloatType,a.EquirectangularReflectionMapping,a.RepeatWrapping,a.ClampToEdgeWrapping,a.LinearFilter,a.LinearFilter),this.generationCallback=null}update(){this.dispose(),this.needsUpdate=!0;let{data:e,width:t,height:a}=this.image;for(let s=0;s<t;s++)for(let l=0;l<a;l++){i.set(t,a),r.set(s/t,l/a),r.x-=.5,r.y=1-r.y,n.theta=2*r.x*Math.PI,n.phi=r.y*Math.PI,n.radius=1,this.generationCallback(n,r,i,o);let c=4*(l*t+s);e[c+0]=o.r,e[c+1]=o.g,e[c+2]=o.b,e[c+3]=1}}copy(e){return super.copy(e),this.generationCallback=e.generationCallback,this}}}),m("5rCKZ",function(e,t){c(e.exports,"ClampedInterpolationMaterial",()=>r);var a=u("ilwiq");class r extends a.ShaderMaterial{get map(){return this.uniforms.map.value}set map(e){this.uniforms.map.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}constructor(e){super({uniforms:{map:{value:null},opacity:{value:1}},vertexShader:`
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
			`}),this.setValues(e)}}}),m("891vQ",function(e,t){c(e.exports,"RGBELoader",()=>r);var a=u("ilwiq");class r extends a.DataTextureLoader{constructor(e){super(e),this.type=a.HalfFloatType}parse(e){let t,r,i;let n=function(e,t){switch(e){case 1:throw Error("THREE.RGBELoader: Read Error: "+(t||""));case 2:throw Error("THREE.RGBELoader: Write Error: "+(t||""));case 3:throw Error("THREE.RGBELoader: Bad File Format: "+(t||""));default:throw Error("THREE.RGBELoader: Memory Error: "+(t||""))}},o=function(e,t,a){t=t||1024;let r=e.pos,i=-1,n=0,o="",s=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));for(;0>(i=s.indexOf("\n"))&&n<t&&r<e.byteLength;)o+=s,n+=s.length,r+=128,s+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));return -1<i&&(!1!==a&&(e.pos+=n+i+1),o+s.slice(0,i))},s=new Uint8Array(e);s.pos=0;let l=function(e){let t,a;let r=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,i=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,s=/^\s*FORMAT=(\S+)\s*$/,l=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,c={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};for(!(e.pos>=e.byteLength)&&(t=o(e))||n(1,"no header found"),(a=t.match(/^#\?(\S+)/))||n(3,"bad initial token"),c.valid|=1,c.programtype=a[1],c.string+=t+"\n";!1!==(t=o(e));){if(c.string+=t+"\n","#"===t.charAt(0)){c.comments+=t+"\n";continue}if((a=t.match(r))&&(c.gamma=parseFloat(a[1])),(a=t.match(i))&&(c.exposure=parseFloat(a[1])),(a=t.match(s))&&(c.valid|=2,c.format=a[1]),(a=t.match(l))&&(c.valid|=4,c.height=parseInt(a[1],10),c.width=parseInt(a[2],10)),2&c.valid&&4&c.valid)break}return 2&c.valid||n(3,"missing format specifier"),4&c.valid||n(3,"missing image size specifier"),c}(s),c=l.width,d=l.height,h=function(e,t,a){if(t<8||t>32767||2!==e[0]||2!==e[1]||128&e[2])return new Uint8Array(e);t!==(e[2]<<8|e[3])&&n(3,"wrong scanline width");let r=new Uint8Array(4*t*a);r.length||n(4,"unable to allocate buffer space");let i=0,o=0,s=4*t,l=new Uint8Array(4),c=new Uint8Array(s),d=a;for(;d>0&&o<e.byteLength;){o+4>e.byteLength&&n(1),l[0]=e[o++],l[1]=e[o++],l[2]=e[o++],l[3]=e[o++],(2!=l[0]||2!=l[1]||(l[2]<<8|l[3])!=t)&&n(3,"bad rgbe scanline format");let a=0,h;for(;a<s&&o<e.byteLength;){let t=(h=e[o++])>128;if(t&&(h-=128),(0===h||a+h>s)&&n(3,"bad scanline data"),t){let t=e[o++];for(let e=0;e<h;e++)c[a++]=t}else c.set(e.subarray(o,o+h),a),a+=h,o+=h}for(let e=0;e<t;e++){let a=0;r[i]=c[e+a],a+=t,r[i+1]=c[e+a],a+=t,r[i+2]=c[e+a],a+=t,r[i+3]=c[e+a],i+=4}d--}return r}(s.subarray(s.pos),c,d);switch(this.type){case a.FloatType:let p=new Float32Array(4*(i=h.length/4));for(let e=0;e<i;e++)!function(e,t,a,r){let i=Math.pow(2,e[t+3]-128)/255;a[r+0]=e[t+0]*i,a[r+1]=e[t+1]*i,a[r+2]=e[t+2]*i,a[r+3]=1}(h,4*e,p,4*e);t=p,r=a.FloatType;break;case a.HalfFloatType:let u=new Uint16Array(4*(i=h.length/4));for(let e=0;e<i;e++)!function(e,t,r,i){let n=Math.pow(2,e[t+3]-128)/255;r[i+0]=(0,a.DataUtils).toHalfFloat(Math.min(e[t+0]*n,65504)),r[i+1]=(0,a.DataUtils).toHalfFloat(Math.min(e[t+1]*n,65504)),r[i+2]=(0,a.DataUtils).toHalfFloat(Math.min(e[t+2]*n,65504)),r[i+3]=(0,a.DataUtils).toHalfFloat(1)}(h,4*e,u,4*e);t=u,r=a.HalfFloatType;break;default:throw Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:c,height:d,data:t,header:l.string,gamma:l.gamma,exposure:l.exposure,type:r}}setDataType(e){return this.type=e,this}load(e,t,r,i){return super.load(e,function(e,r){switch(e.type){case a.FloatType:case a.HalfFloatType:e.colorSpace=a.LinearSRGBColorSpace,e.minFilter=a.LinearFilter,e.magFilter=a.LinearFilter,e.generateMipmaps=!1,e.flipY=!0}t&&t(e,r)},r,i)}}}),m("1EdOY",function(e,t){c(e.exports,"generateRadialFloorTexture",()=>r);var a=u("ilwiq");function r(e){let t=new Uint8Array(e*e*4);for(let a=0;a<e;a++)for(let r=0;r<e;r++){let i=Math.max(Math.min(1-Math.sqrt((2*(a/(e-1)-.5))**2+(2*(r/(e-1)-.5))**2),1),0);i=Math.min(i=i**2*1.5,1);let n=r*e+a;t[4*n+0]=255,t[4*n+1]=255,t[4*n+2]=255,t[4*n+3]=255*i}let r=new a.DataTexture(t,e,e);return r.format=a.RGBAFormat,r.type=a.UnsignedByteType,r.minFilter=a.LinearFilter,r.magFilter=a.LinearFilter,r.wrapS=a.RepeatWrapping,r.wrapT=a.RepeatWrapping,r.needsUpdate=!0,r}}),m("cE5k3",function(e,t){c(e.exports,"getScaledSettings",()=>a);function a(){let e=3,t=Math.max(1/window.devicePixelRatio,.5);return window.innerWidth/window.innerHeight<.65&&(e=4,t=.5/window.devicePixelRatio),{tiles:e,renderScale:t}}}),m("e2Pv4",function(e,t){let a;c(e.exports,"LoaderElement",()=>r);class r{constructor(){a||((a=document.createElement("style")).textContent=`

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
	`,document.head.appendChild(a));let e=document.createElement("div");e.classList.add("loader-container");let t=document.createElement("div");t.classList.add("percentage"),e.appendChild(t);let r=document.createElement("div");r.classList.add("samples"),e.appendChild(r);let i=document.createElement("div");i.classList.add("credits"),e.appendChild(i);let n=document.createElement("div");n.classList.add("bar"),e.appendChild(n);let o=document.createElement("div");o.classList.add("description"),e.appendChild(o),this._description=o,this._loaderBar=n,this._percentage=t,this._credits=i,this._samples=r,this._container=e,this.setPercentage(0)}attach(e){e.appendChild(this._container),e.appendChild(this._description)}setPercentage(e){this._loaderBar.style.width=`${100*e}%`,0===e?this._percentage.innerText="Loading...":this._percentage.innerText=`${(100*e).toFixed(0)}%`,e>=1?this._container.classList.remove("loading"):this._container.classList.add("loading")}setSamples(e){this._samples.innerText=`${Math.floor(e)} samples`}setCredits(e){this._credits.innerHTML=e}setDescription(e){this._description.innerHTML=e}}}),m("fYvb1",function(e,t){c(e.exports,"math_functions",()=>a);let a=`

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

`}),m("8keuf",function(e,t){c(e.exports,"ggx_functions",()=>a);let a=`

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

`});var g=u("ilwiq"),f=u("7lx9d"),v=u("5Rd1x"),x=u("eLX8K"),b=u("8mHfG"),y=u("891vQ"),w=u("kp7Te"),T=u("jiuw3"),_=u("1EdOY"),F=u("cE5k3"),S=u("e2Pv4");let C=0;const R={bounces:5,samplesPerFrame:1,renderScale:1/window.devicePixelRatio,tiles:1,autoPause:!0,pause:!1,continuous:!1,...(0,F.getScaledSettings)()};function P(e){s.paused=e,R.pause=e,e&&M()}function E(){t.setSize(window.innerWidth,window.innerHeight),t.setPixelRatio(window.devicePixelRatio),r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),e.updateCamera()}function M(){e.bounces=R.bounces,e.setScene(i,r)}!async function(){(l=new S.LoaderElement).setDescription("Rendering deformable geometry with path tracing."),l.attach(document.body),(t=new g.WebGLRenderer({antialias:!0})).toneMapping=g.ACESFilmicToneMapping,document.body.appendChild(t.domElement),(e=new b.WebGLPathTracer(t)).multipleImportanceSampling=!1,e.tiles.set(R.tiles,R.tiles),e.filterGlossyFactor=.25,e.minSamples=1,e.renderDelay=0,e.fadeDuration=0,i=new g.Scene,(r=new g.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.025,500)).position.set(5.5,3.5,7.5),a=new v.OrbitControls(r,t.domElement),r.lookAt(a.target),a.addEventListener("change",()=>e.updateCamera()),a.update(),n=new g.Clock;let c="#morphtarget"===window.location.hash?"https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/RobotExpressive/RobotExpressive.glb":"https://raw.githubusercontent.com/gkjohnson/3d-demo-data/main/models/trex/scene.gltf",[d,h]=await Promise.all([new(0,y.RGBELoader)().loadAsync("https://raw.githubusercontent.com/gkjohnson/3d-demo-data/master/hdri/aristea_wreck_puresky_2k.hdr"),new(0,f.GLTFLoader)().setMeshoptDecoder(w.MeshoptDecoder).loadAsync(c)]),p=new x.BlurredEnvMapGenerator(t),u=p.generate(d,.1);i.background=u,i.environment=u,p.dispose();let m=h.animations;(s=(o=new g.AnimationMixer(h.scene)).clipAction(m[0])).play(),s.paused=R.pause,i.add(h.scene);let F=(0,_.generateRadialFloorTexture)(2048),k=new g.Mesh(new g.PlaneGeometry,new g.MeshStandardMaterial({map:F,transparent:!0,color:14540253,roughness:.15,metalness:1}));k.scale.setScalar(50),k.rotation.x=-Math.PI/2,k.position.y=.075,i.add(k),e.setScene(i,r),l.setPercentage(1),l.setCredits("Model by DailyArt on Sketchfab"),E(),window.addEventListener("resize",E);let D=new T.GUI;D.add(R,"tiles",1,4,1).onChange(t=>{e.tiles.set(t,t)}),D.add(R,"bounces",1,10,1).onChange(M),D.add(R,"renderScale",.1,1).onChange(t=>{e.renderScale=t,e.reset()}),D.add(R,"autoPause").listen(),D.add(R,"pause").onChange(e=>{R.autoPause=!1,P(e)}).listen(),D.add(R,"continuous").onChange(()=>{R.autoPause=!1}),function a(){requestAnimationFrame(a);let s=Math.min(n.getDelta(),.03);o.update(s),R.autoPause?(C+=s,(!R.pause&&C>=2.5||R.pause&&C>=5)&&(P(!R.pause),C=0)):C=0,e.dynamicLowRes=R.continuous,R.pause||R.continuous?(!R.pause&&R.continuous&&M(),e.renderSample(),l.setSamples(e.samples)):(t.render(i,r),l.setSamples(0))}()}();
//# sourceMappingURL=skinnedMesh.49d8c0b2.js.map
