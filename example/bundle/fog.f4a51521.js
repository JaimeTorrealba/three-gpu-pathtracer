let e,t,a,r,i,o,n;function s(e,t,a,r){Object.defineProperty(e,t,{get:a,set:r,enumerable:!0,configurable:!0})}var l=globalThis,c={},h={},d=l.parcelRequire5b70;null==d&&((d=function(e){if(e in c)return c[e].exports;if(e in h){var t=h[e];delete h[e];var a={id:e,exports:{}};return c[e]=a,t.call(a.exports,a,a.exports),a.exports}var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){h[e]=t},l.parcelRequire5b70=d);var p=d.register;p("11ZPe",function(e,t){s(e.exports,"FogVolumeMaterial",()=>r);var a=d("ilwiq");class r extends a.MeshStandardMaterial{constructor(e){super(e),this.isFogVolumeMaterial=!0,this.density=.015,this.emissive=new a.Color,this.emissiveIntensity=0,this.opacity=.15,this.transparent=!0,this.roughness=1,this.metalness=0,this.setValues(e)}}}),p("d4kES",function(e,t){s(e.exports,"PhysicalSpotLight",()=>r);var a=d("ilwiq");class r extends a.SpotLight{constructor(...e){super(...e),this.iesMap=null,this.radius=0}copy(e,t){return super.copy(e,t),this.iesMap=e.iesMap,this.radius=e.radius,this}}}),p("8mHfG",function(e,t){s(e.exports,"WebGLPathTracer",()=>p);var a=d("ilwiq"),r=d("hWj76"),i=d("hWds8"),o=d("RPVlj"),n=d("bHiTZ"),l=d("9wqOU"),c=d("5rCKZ");let h=new a.Vector2;class p{get multipleImportanceSampling(){return!!this._pathTracer.material.defines.FEATURE_MIS}set multipleImportanceSampling(e){this._pathTracer.material.setDefine("FEATURE_MIS",e?1:0)}get transmissiveBounces(){return this._pathTracer.material.transmissiveBounces}set transmissiveBounces(e){this._pathTracer.material.transmissiveBounces=e}get bounces(){return this._pathTracer.material.bounces}set bounces(e){this._pathTracer.material.bounces=e}get filterGlossyFactor(){return this._pathTracer.material.filterGlossyFactor}set filterGlossyFactor(e){this._pathTracer.material.filterGlossyFactor=e}get samples(){return this._pathTracer.samples}get target(){return this._pathTracer.target}get tiles(){return this._pathTracer.tiles}constructor(e){this._renderer=e,this._generator=new r.PathTracingSceneGenerator,this._pathTracer=new i.PathTracingRenderer(e),this._queueReset=!1,this._clock=new a.Clock,this._lowResPathTracer=new i.PathTracingRenderer(e),this._lowResPathTracer.tiles.set(1,1),this._quad=new o.FullScreenQuad(new c.ClampedInterpolationMaterial({map:null,transparent:!0,blending:a.NoBlending,premultipliedAlpha:e.getContextAttributes().premultipliedAlpha})),this._materials=null,this.renderDelay=100,this.minSamples=5,this.fadeDuration=500,this.enablePathTracing=!0,this.pausePathTracing=!1,this.dynamicLowRes=!1,this.lowResScale=.25,this.renderScale=1,this.synchronizeRenderSize=!0,this.rasterizeScene=!0,this.renderToCanvas=!0,this.textureSize=new a.Vector2(1024,1024),this.rasterizeSceneCallback=(e,t)=>{this._renderer.render(e,t)},this.renderToCanvasCallback=(e,t,a)=>{let r=t.autoClear;t.autoClear=!1,a.render(t),t.autoClear=r},this.setScene(new a.Scene,new a.PerspectiveCamera)}setBVHWorker(e){this._generator.setBVHWorker(e)}setScene(e,t,a={}){e.updateMatrixWorld(!0),t.updateMatrixWorld();let r=this._generator;if(r.setObjects(e),this._buildAsync)return r.generateAsync(a.onProgress).then(a=>this._updateFromResults(e,t,a));{let a=r.generate();return this._updateFromResults(e,t,a)}}setSceneAsync(...e){this._buildAsync=!0;let t=this.setScene(...e);return this._buildAsync=!1,t}setCamera(e){this.camera=e,this.updateCamera()}updateCamera(){let e=this.camera;e.updateMatrixWorld(),this._pathTracer.setCamera(e),this._lowResPathTracer.setCamera(e),this.reset()}updateMaterials(){let e=this._pathTracer.material,t=this._renderer,a=this._materials,r=this.textureSize,i=(0,l.getTextures)(a);e.textures.setTextures(t,i,r.x,r.y),e.materials.updateFrom(a,i),this.reset()}updateLights(){let e=this.scene,t=this._renderer,a=this._pathTracer.material,r=(0,l.getLights)(e),i=(0,l.getIesTextures)(r);a.lights.updateFrom(r,i),a.iesProfiles.setTextures(t,i),this.reset()}updateEnvironment(){let e=this.scene,t=this._pathTracer.material;if(t.backgroundBlur=e.backgroundBlurriness,t.backgroundIntensity=e.backgroundIntensity??1,t.backgroundRotation.makeRotationFromEuler(e.backgroundRotation).invert(),null===e.background)t.backgroundMap=null,t.backgroundAlpha=0;else if(e.background.isColor){this._colorBackground=this._colorBackground||new n.GradientEquirectTexture(16);let a=this._colorBackground;a.topColor.equals(e.background)||(a.topColor.set(e.background),a.bottomColor.set(e.background),a.update()),t.backgroundMap=a,t.backgroundAlpha=1}else t.backgroundMap=e.background,t.backgroundAlpha=1;t.environmentIntensity=e.environmentIntensity??1,t.environmentRotation.makeRotationFromEuler(e.environmentRotation).invert(),this._previousEnvironment!==e.environment&&(e.environment?t.envMapInfo.updateFrom(e.environment):t.environmentIntensity=0),this._previousEnvironment=e.environment,this.reset()}_updateFromResults(e,t,a){let{materials:r,geometry:i,bvh:o,bvhChanged:n}=a;this._materials=r;let s=this._pathTracer.material;return n&&(s.bvh.updateFrom(o),s.attributesArray.updateFrom(i.attributes.normal,i.attributes.tangent,i.attributes.uv,i.attributes.color),s.materialIndexAttribute.updateFrom(i.attributes.materialIndex)),this._previousScene=e,this.scene=e,this.camera=t,this.updateCamera(),this.updateMaterials(),this.updateEnvironment(),this.updateLights(),a}renderSample(){let e=this._lowResPathTracer,t=this._pathTracer,r=this._renderer,i=this._clock,o=this._quad;this._updateScale(),this._queueReset&&(t.reset(),e.reset(),this._queueReset=!1,o.material.opacity=0,i.start());let n=1e3*i.getDelta(),s=1e3*i.getElapsedTime();if(!this.pausePathTracing&&this.enablePathTracing&&this.renderDelay<=s&&t.update(),t.alpha=1!==t.material.backgroundAlpha||!r.extensions.get("EXT_float_blend"),e.alpha=t.alpha,this.renderToCanvas){let r=this._renderer,i=this.minSamples;if(s>=this.renderDelay&&this.samples>=this.minSamples&&(0!==this.fadeDuration?o.material.opacity=Math.min(o.material.opacity+n/this.fadeDuration,1):o.material.opacity=1),!this.enablePathTracing||this.samples<i||o.material.opacity<1){if(this.dynamicLowRes){e.samples<1&&(e.material=t.material,e.update());let a=o.material.opacity;o.material.opacity=1-o.material.opacity,o.material.map=e.target.texture,o.render(r),o.material.opacity=a}else this.rasterizeScene&&this.rasterizeSceneCallback(this.scene,this.camera)}this.enablePathTracing&&o.material.opacity>0&&(o.material.opacity<1&&(o.material.blending=this.dynamicLowRes?a.AdditiveBlending:a.NormalBlending),o.material.map=t.target.texture,this.renderToCanvasCallback(t.target,r,o),o.material.blending=a.NoBlending)}}reset(){this._queueReset=!0,this._pathTracer.samples=0}dispose(){this._renderQuad.dispose(),this._renderQuad.material.dispose(),this._pathTracer.dispose()}_updateScale(){if(this.synchronizeRenderSize){this._renderer.getDrawingBufferSize(h);let e=Math.floor(this.renderScale*h.x),t=Math.floor(this.renderScale*h.y);if(this._pathTracer.getSize(h),h.x!==e||h.y!==t){let a=this.lowResScale;this._pathTracer.setSize(e,t),this._lowResPathTracer.setSize(Math.floor(e*a),Math.floor(t*a))}}}}}),p("bHiTZ",function(e,t){s(e.exports,"GradientEquirectTexture",()=>o);var a=d("ilwiq"),r=d("dbdMq");let i=new a.Vector3;class o extends r.ProceduralEquirectTexture{constructor(e=512){super(e,e),this.topColor=new(0,a.Color)().set(16777215),this.bottomColor=new(0,a.Color)().set(0),this.exponent=2,this.generationCallback=(e,t,a,r)=>{i.setFromSpherical(e);let o=.5*i.y+.5;r.lerpColors(this.bottomColor,this.topColor,o**this.exponent)}}copy(e){return super.copy(e),this.topColor.copy(e.topColor),this.bottomColor.copy(e.bottomColor),this}}}),p("dbdMq",function(e,t){s(e.exports,"ProceduralEquirectTexture",()=>l);var a=d("ilwiq");let r=new a.Vector2,i=new a.Vector2,o=new a.Spherical,n=new a.Color;class l extends a.DataTexture{constructor(e=512,t=512){super(new Float32Array(e*t*4),e,t,a.RGBAFormat,a.FloatType,a.EquirectangularReflectionMapping,a.RepeatWrapping,a.ClampToEdgeWrapping,a.LinearFilter,a.LinearFilter),this.generationCallback=null}update(){this.dispose(),this.needsUpdate=!0;let{data:e,width:t,height:a}=this.image;for(let s=0;s<t;s++)for(let l=0;l<a;l++){i.set(t,a),r.set(s/t,l/a),r.x-=.5,r.y=1-r.y,o.theta=2*r.x*Math.PI,o.phi=r.y*Math.PI,o.radius=1,this.generationCallback(o,r,i,n);let c=4*(l*t+s);e[c+0]=n.r,e[c+1]=n.g,e[c+2]=n.b,e[c+3]=1}}copy(e){return super.copy(e),this.generationCallback=e.generationCallback,this}}}),p("5rCKZ",function(e,t){s(e.exports,"ClampedInterpolationMaterial",()=>r);var a=d("ilwiq");class r extends a.ShaderMaterial{get map(){return this.uniforms.map.value}set map(e){this.uniforms.map.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}constructor(e){super({uniforms:{map:{value:null},opacity:{value:1}},vertexShader:`
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
			`}),this.setValues(e)}}}),p("cE5k3",function(e,t){s(e.exports,"getScaledSettings",()=>a);function a(){let e=3,t=Math.max(1/window.devicePixelRatio,.5);return window.innerWidth/window.innerHeight<.65&&(e=4,t=.5/window.devicePixelRatio),{tiles:e,renderScale:t}}}),p("e2Pv4",function(e,t){let a;s(e.exports,"LoaderElement",()=>r);class r{constructor(){a||((a=document.createElement("style")).textContent=`

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
	`,document.head.appendChild(a));let e=document.createElement("div");e.classList.add("loader-container");let t=document.createElement("div");t.classList.add("percentage"),e.appendChild(t);let r=document.createElement("div");r.classList.add("samples"),e.appendChild(r);let i=document.createElement("div");i.classList.add("credits"),e.appendChild(i);let o=document.createElement("div");o.classList.add("bar"),e.appendChild(o);let n=document.createElement("div");n.classList.add("description"),e.appendChild(n),this._description=n,this._loaderBar=o,this._percentage=t,this._credits=i,this._samples=r,this._container=e,this.setPercentage(0)}attach(e){e.appendChild(this._container),e.appendChild(this._description)}setPercentage(e){this._loaderBar.style.width=`${100*e}%`,0===e?this._percentage.innerText="Loading...":this._percentage.innerText=`${(100*e).toFixed(0)}%`,e>=1?this._container.classList.remove("loading"):this._container.classList.add("loading")}setSamples(e){this._samples.innerText=`${Math.floor(e)} samples`}setCredits(e){this._credits.innerHTML=e}setDescription(e){this._description.innerHTML=e}}}),p("9fZ6X",function(e,t){s(e.exports,"MaterialBase",()=>r);var a=d("ilwiq");class r extends a.ShaderMaterial{constructor(e){for(let t in super(e),this.uniforms)Object.defineProperty(this,t,{get(){return this.uniforms[t].value},set(e){this.uniforms[t].value=e}})}setDefine(e,t){if(null==t){if(e in this.defines)return delete this.defines[e],this.needsUpdate=!0,!0}else if(this.defines[e]!==t)return this.defines[e]=t,this.needsUpdate=!0,!0;return!1}}}),p("fYvb1",function(e,t){s(e.exports,"math_functions",()=>a);let a=`

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

`}),p("dUUQZ",function(e,t){s(e.exports,"util_functions",()=>a);let a=`

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
`}),p("8keuf",function(e,t){s(e.exports,"ggx_functions",()=>a);let a=`

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

`});var u=d("ilwiq"),m=d("5Rd1x"),g=d("11ZPe"),f=d("kLfIo"),v=d("d4kES"),x=d("8mHfG"),b=d("jiuw3"),y=d("cE5k3"),w=d("e2Pv4");const T={multipleImportanceSampling:!0,tiles:2,renderScale:1/window.devicePixelRatio,color:"#eeeeee",fog:!0,density:.01,lightIntensity:500,lightColor:"#ffffff",bounces:10,...(0,y.getScaledSettings)()};function _(){i.color.set(T.color).convertSRGBToLinear(),i.density=T.density,o.intensity=T.lightIntensity,o.color.set(T.lightColor),e.multipleImportanceSampling=T.multipleImportanceSampling,e.bounces=T.bounces,e.renderScale=T.renderScale,e.updateLights(),e.updateMaterials()}function C(){t.setSize(window.innerWidth,window.innerHeight),t.setPixelRatio(window.devicePixelRatio),a.aspect=window.innerWidth/window.innerHeight,a.updateProjectionMatrix(),e.updateCamera()}!async function(){(n=new w.LoaderElement).attach(document.body),(t=new u.WebGLRenderer({antialias:!0})).toneMapping=u.ACESFilmicToneMapping,document.body.appendChild(t.domElement),(e=new x.WebGLPathTracer(t)).tiles.set(T.tiles,T.tiles);let s=window.innerWidth/window.innerHeight;(a=new f.PhysicalCamera(75,s,.025,500)).position.set(0,1,6),new m.OrbitControls(a,t.domElement).addEventListener("change",()=>{e.updateCamera()}),(r=new u.Scene).background=new u.Color(0),i=new g.FogVolumeMaterial;let l=new u.MeshStandardMaterial({color:10066329,roughness:1,metalness:0}),c=new u.Mesh(new u.BoxGeometry(8,4.05,8),i),h=new u.Mesh(new u.CylinderGeometry(5,5,.1,40),l);h.position.y=-1.1,(o=new v.PhysicalSpotLight).position.set(0,1,0).multiplyScalar(3),o.angle=Math.PI/4.5,o.decay=2,o.penumbra=.15,o.distance=0,o.intensity=50,o.radius=.05;let d=new u.Group;d.add(o);let p=new u.Mesh(new u.BoxGeometry(.1,.1,2),l);for(let e=0;e<10;e++){let t=p.clone();t.position.x=-1+2*e/9,t.position.y=2,d.add(t)}r.add(c,h,d),e.setScene(r,a),n.setPercentage(1),_(),C(),window.addEventListener("resize",C);let y=new b.GUI,S=y.addFolder("Path Tracer");S.add(T,"bounces",1,20,1).onChange(_),S.add(T,"multipleImportanceSampling").onChange(_),S.add(T,"tiles",1,4,1).onChange(t=>{e.tiles.set(t,t)}),S.add(T,"renderScale",.1,1).onChange(_);let P=y.addFolder("Fog");P.addColor(T,"color").onChange(_),P.add(T,"density",0,1).onChange(_);let F=y.addFolder("Spot Light");F.add(T,"lightIntensity",0,1e3).onChange(_),F.addColor(T,"lightColor").onChange(_),function t(){requestAnimationFrame(t),e.renderSample(),n.setSamples(e.samples)}()}();
//# sourceMappingURL=fog.f4a51521.js.map
