﻿module BABYLON {

    /** @hidden */
    class ColorGradient {
        public gradient: number;
        public color: Color4;
    }

    /**
     * This represents a particle system in Babylon.
     * Particles are often small sprites used to simulate hard-to-reproduce phenomena like fire, smoke, water, or abstract visual effects like magic glitter and faery dust.
     * Particles can take different shapes while emitted like box, sphere, cone or you can write your custom function.
     * @example https://doc.babylonjs.com/babylon101/particles
     */
    export class ParticleSystem implements IDisposable, IAnimatable, IParticleSystem {
        /**
         * Source color is added to the destination color without alpha affecting the result.
         */
        public static BLENDMODE_ONEONE = 0;
        /**
         * Blend current color and particle color using particle’s alpha.
         */
        public static BLENDMODE_STANDARD = 1;

        /**
         * Add current color and particle color multiplied by particle’s alpha.
         */
        public static BLENDMODE_ADD = 2;

        /**
         * List of animations used by the particle system.
         */
        public animations: Animation[] = [];

        /**
         * The id of the Particle system.
         */
        public id: string;

        /**
         * The friendly name of the Particle system.
         */
        public name: string;

        /**
         * The rendering group used by the Particle system to chose when to render.
         */
        public renderingGroupId = 0;

        /**
         * The emitter represents the Mesh or position we are attaching the particle system to.
         */
        public emitter: Nullable<AbstractMesh | Vector3> = null;

        /**
         * The maximum number of particles to emit per frame
         */
        public emitRate = 10;

        /**
         * If you want to launch only a few particles at once, that can be done, as well.
         */
        public manualEmitCount = -1;

        /**
         * The overall motion speed (0.01 is default update speed, faster updates = faster animation)
         */
        public updateSpeed = 0.01;

        /**
         * The amount of time the particle system is running (depends of the overall update speed).
         */
        public targetStopDuration = 0;

        /**
         * Specifies whether the particle system will be disposed once it reaches the end of the animation.
         */
        public disposeOnStop = false;

        /**
         * Minimum power of emitting particles.
         */
        public minEmitPower = 1;
        /**
         * Maximum power of emitting particles.
         */
        public maxEmitPower = 1;

        /**
         * Minimum life time of emitting particles.
         */
        public minLifeTime = 1;
        /**
         * Maximum life time of emitting particles.
         */
        public maxLifeTime = 1;

        /**
         * Minimum Size of emitting particles.
         */
        public minSize = 1;
        /**
         * Maximum Size of emitting particles.
         */
        public maxSize = 1;

        /**
         * Minimum scale of emitting particles on X axis.
         */
        public minScaleX = 1;
        /**
         * Maximum scale of emitting particles on X axis.
         */
        public maxScaleX = 1;        

        /**
         * Minimum scale of emitting particles on Y axis.
         */
        public minScaleY = 1;
        /**
         * Maximum scale of emitting particles on Y axis.
         */
        public maxScaleY = 1;           

        /**
         * Minimum angular speed of emitting particles (Z-axis rotation for each particle).
         */
        public minAngularSpeed = 0;
        /**
         * Maximum angular speed of emitting particles (Z-axis rotation for each particle).
         */
        public maxAngularSpeed = 0;

        /**
         * The texture used to render each particle. (this can be a spritesheet)
         */
        public particleTexture: Nullable<Texture>;

        /**
         * The layer mask we are rendering the particles through.
         */
        public layerMask: number = 0x0FFFFFFF;

        /**
         * This can help using your own shader to render the particle system.
         * The according effect will be created 
         */
        public customShader: any = null;

        /**
         * By default particle system starts as soon as they are created. This prevents the 
         * automatic start to happen and let you decide when to start emitting particles.
         */
        public preventAutoStart: boolean = false;

        /**
         * This function can be defined to provide custom update for active particles.
         * This function will be called instead of regular update (age, position, color, etc.).
         * Do not forget that this function will be called on every frame so try to keep it simple and fast :)
         */
        public updateFunction: (particles: Particle[]) => void;

        /**
         * Callback triggered when the particle animation is ending.
         */
        public onAnimationEnd: Nullable<() => void> = null;

        /**
         * Blend mode use to render the particle, it can be either ParticleSystem.BLENDMODE_ONEONE or ParticleSystem.BLENDMODE_STANDARD.
         */
        public blendMode = ParticleSystem.BLENDMODE_ONEONE;

        /**
         * Forces the particle to write their depth information to the depth buffer. This can help preventing other draw calls
         * to override the particles.
         */
        public forceDepthWrite = false;

        /**
         * You can use gravity if you want to give an orientation to your particles.
         */
        public gravity = Vector3.Zero();

        private _colorGradients: Nullable<Array<ColorGradient>> = null;

       /**
         * Random direction of each particle after it has been emitted, between direction1 and direction2 vectors.
         * This only works when particleEmitterTyps is a BoxParticleEmitter
         */
        public get direction1(): Vector3 {
            if ((<BoxParticleEmitter>this.particleEmitterType).direction1) {
                return (<BoxParticleEmitter>this.particleEmitterType).direction1;
            }

            return Vector3.Zero();
        }

        public set direction1(value: Vector3) {
            if ((<BoxParticleEmitter>this.particleEmitterType).direction1) {
                (<BoxParticleEmitter>this.particleEmitterType).direction1 = value;
            }
        }

        /**
         * Random direction of each particle after it has been emitted, between direction1 and direction2 vectors.
         * This only works when particleEmitterTyps is a BoxParticleEmitter
         */
        public get direction2(): Vector3 {
            if ((<BoxParticleEmitter>this.particleEmitterType).direction2) {
                return (<BoxParticleEmitter>this.particleEmitterType).direction2;
            }

            return Vector3.Zero();
        }

        public set direction2(value: Vector3) {
            if ((<BoxParticleEmitter>this.particleEmitterType).direction2) {
                (<BoxParticleEmitter>this.particleEmitterType).direction2 = value;
            }
        }

        /**
         * Minimum box point around our emitter. Our emitter is the center of particles source, but if you want your particles to emit from more than one point, then you can tell it to do so.
         * This only works when particleEmitterTyps is a BoxParticleEmitter
         */
        public get minEmitBox(): Vector3 {
            if ((<BoxParticleEmitter>this.particleEmitterType).minEmitBox) {
                return (<BoxParticleEmitter>this.particleEmitterType).minEmitBox;
            }

            return Vector3.Zero();
        }

        public set minEmitBox(value: Vector3) {
            if ((<BoxParticleEmitter>this.particleEmitterType).minEmitBox) {
                (<BoxParticleEmitter>this.particleEmitterType).minEmitBox = value;
            }
        }

        /**
         * Maximum box point around our emitter. Our emitter is the center of particles source, but if you want your particles to emit from more than one point, then you can tell it to do so.
         * This only works when particleEmitterTyps is a BoxParticleEmitter
         */
        public get maxEmitBox(): Vector3 {
            if ((<BoxParticleEmitter>this.particleEmitterType).maxEmitBox) {
                return (<BoxParticleEmitter>this.particleEmitterType).maxEmitBox;
            }

            return Vector3.Zero();
        }

        public set maxEmitBox(value: Vector3) {
            if ((<BoxParticleEmitter>this.particleEmitterType).maxEmitBox) {
                (<BoxParticleEmitter>this.particleEmitterType).maxEmitBox = value;
            }
        }

        /**
         * Random color of each particle after it has been emitted, between color1 and color2 vectors
         */
        public color1 = new Color4(1.0, 1.0, 1.0, 1.0);
        /**
         * Random color of each particle after it has been emitted, between color1 and color2 vectors
         */
        public color2 = new Color4(1.0, 1.0, 1.0, 1.0);
        /**
         * Color the particle will have at the end of its lifetime
         */
        public colorDead = new Color4(0, 0, 0, 1.0);

        /**
         * An optional mask to filter some colors out of the texture, or filter a part of the alpha channel
         */
        public textureMask = new Color4(1.0, 1.0, 1.0, 1.0);

        /**
         * The particle emitter type defines the emitter used by the particle system.
         * It can be for example box, sphere, or cone...
         */
        public particleEmitterType: IParticleEmitterType;

        /**
         * This function can be defined to specify initial direction for every new particle.
         * It by default use the emitterType defined function
         */
        public startDirectionFunction: (worldMatrix: Matrix, directionToUpdate: Vector3, particle: Particle) => void;
        /**
         * This function can be defined to specify initial position for every new particle.
         * It by default use the emitterType defined function
         */
        public startPositionFunction: (worldMatrix: Matrix, positionToUpdate: Vector3, particle: Particle) => void;

        /**
         * If using a spritesheet (isAnimationSheetEnabled), defines if the sprite animation should loop between startSpriteCellID and endSpriteCellID or not
         */
        public spriteCellLoop = true;
        /**
         * If using a spritesheet (isAnimationSheetEnabled) and spriteCellLoop defines the speed of the sprite loop
         */
        public spriteCellChangeSpeed = 0;
        /**
         * If using a spritesheet (isAnimationSheetEnabled) and spriteCellLoop defines the first sprite cell to display
         */
        public startSpriteCellID = 0;
        /**
         * If using a spritesheet (isAnimationSheetEnabled) and spriteCellLoop defines the last sprite cell to display
         */
        public endSpriteCellID = 0;
        /**
         * If using a spritesheet (isAnimationSheetEnabled), defines the sprite cell width to use
         */
        public spriteCellWidth = 0;
        /**
         * If using a spritesheet (isAnimationSheetEnabled), defines the sprite cell height to use
         */
        public spriteCellHeight = 0;

        /** Gets or sets a value indicating how many cycles (or frames) must be executed before first rendering (this value has to be set before starting the system). Default is 0 */
        public preWarmCycles = 0;

        /** Gets or sets a value indicating the time step multiplier to use in pre-warm mode (default is 1) */
        public preWarmStepOffset = 1;

        /**
        * An event triggered when the system is disposed
        */
        public onDisposeObservable = new Observable<ParticleSystem>();

        private _onDisposeObserver: Nullable<Observer<ParticleSystem>>;
        /**
         * Sets a callback that will be triggered when the system is disposed
         */
        public set onDispose(callback: () => void) {
            if (this._onDisposeObserver) {
                this.onDisposeObservable.remove(this._onDisposeObserver);
            }
            this._onDisposeObserver = this.onDisposeObservable.add(callback);
        }

        /**
         * Gets whether an animation sprite sheet is enabled or not on the particle system
         */
        public get isAnimationSheetEnabled(): boolean {
            return this._isAnimationSheetEnabled;
        }

        /**
         * Gets or sets a boolean indicating if the particles must be rendered as billboard or aligned with the direction
         */
        public get isBillboardBased(): boolean {
            return this._isBillboardBased;
        }      
        
        public set isBillboardBased(value: boolean) {
            if (this._isBillboardBased === value) {
                return;
            }

            this._isBillboardBased = value;
            this._resetEffect();
        }            

        private _particles = new Array<Particle>();
        private _epsilon: number;
        private _capacity: number;
        private _scene: Scene;
        private _stockParticles = new Array<Particle>();
        private _newPartsExcess = 0;
        private _vertexData: Float32Array;
        private _vertexBuffer: Nullable<Buffer>;
        private _vertexBuffers: { [key: string]: VertexBuffer } = {};
        private _spriteBuffer: Nullable<Buffer>;
        private _indexBuffer: Nullable<WebGLBuffer>;
        private _effect: Effect;
        private _customEffect: Nullable<Effect>;
        private _cachedDefines: string;
        private _scaledColorStep = new Color4(0, 0, 0, 0);
        private _colorDiff = new Color4(0, 0, 0, 0);
        private _scaledDirection = Vector3.Zero();
        private _scaledGravity = Vector3.Zero();
        private _currentRenderId = -1;
        private _alive: boolean;
        private _useInstancing = false;

        private _started = false;
        private _stopped = false;
        private _actualFrame = 0;
        private _scaledUpdateSpeed: number;
        private _vertexBufferSize: number;
        private _isAnimationSheetEnabled: boolean;
        private _isBillboardBased = true;

        // end of sheet animation

        // Sub-emitters
        /**
         * this is the Sub-emitters templates that will be used to generate particle system when the particle dies, this property is used by the root particle system only.
         */
        public subEmitters: ParticleSystem[];
        /**
        * The current active Sub-systems, this property is used by the root particle system only.
        */
        public activeSubSystems: Array<ParticleSystem>;
        
        private _rootParticleSystem: ParticleSystem;
        //end of Sub-emitter

        /**
         * Gets the current list of active particles
         */
        public get particles(): Particle[] {
            return this._particles;
        }

        /**
         * Returns the string "ParticleSystem"
         * @returns a string containing the class name
         */
        public getClassName(): string {
            return "ParticleSystem";
        }        

        /**
         * Instantiates a particle system.
         * Particles are often small sprites used to simulate hard-to-reproduce phenomena like fire, smoke, water, or abstract visual effects like magic glitter and faery dust.
         * @param name The name of the particle system
         * @param capacity The max number of particles alive at the same time
         * @param scene The scene the particle system belongs to
         * @param customEffect a custom effect used to change the way particles are rendered by default
         * @param isAnimationSheetEnabled Must be true if using a spritesheet to animate the particles texture
         * @param epsilon Offset used to render the particles
         */
        constructor(name: string, capacity: number, scene: Scene, customEffect: Nullable<Effect> = null, isAnimationSheetEnabled: boolean = false, epsilon: number = 0.01) {
            this.id = name;
            this.name = name;

            this._capacity = capacity;

            this._epsilon = epsilon;
            this._isAnimationSheetEnabled = isAnimationSheetEnabled;

            this._scene = scene || Engine.LastCreatedScene;

            this._customEffect = customEffect;

            scene.particleSystems.push(this);

            this._useInstancing = this._scene.getEngine().getCaps().instancedArrays;

            this._createIndexBuffer();
            this._createVertexBuffers();

            // Default emitter type
            this.particleEmitterType = new BoxParticleEmitter();

            this.updateFunction = (particles: Particle[]): void => {
                for (var index = 0; index < particles.length; index++) {
                    var particle = particles[index];
                    particle.age += this._scaledUpdateSpeed;

                    if (particle.age >= particle.lifeTime) { // Recycle by swapping with last particle
                        this._emitFromParticle(particle);
                        this.recycleParticle(particle);
                        index--;
                        continue;
                    }
                    else {
                        if (this._colorGradients && this._colorGradients.length > 0) {
                            let ratio = particle.age / particle.lifeTime;

                            for (var gradientIndex = 0; gradientIndex < this._colorGradients.length - 1; gradientIndex++) {
                                let currentGradient = this._colorGradients[gradientIndex];
                                let nextGradient = this._colorGradients[gradientIndex + 1];

                                if (ratio >= currentGradient.gradient && ratio <= nextGradient.gradient) {
                                    let scale = (ratio - currentGradient.gradient) / (nextGradient.gradient - currentGradient.gradient);
                                    Color4.LerpToRef(currentGradient.color, nextGradient.color, scale, particle.color);
                                    break;
                               }
                            }
                        }
                        else {
                            particle.colorStep.scaleToRef(this._scaledUpdateSpeed, this._scaledColorStep);
                            particle.color.addInPlace(this._scaledColorStep);

                            if (particle.color.a < 0) {
                                particle.color.a = 0;
                            }
                        }
                        particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;

                        particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
                        particle.position.addInPlace(this._scaledDirection);

                        this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
                        particle.direction.addInPlace(this._scaledGravity);

                        if (this._isAnimationSheetEnabled) {
                            particle.updateCellIndex(this._scaledUpdateSpeed);
                        }
                    }
                }
            }
        }

        /**
         * Adds a new color gradient
         * @param gradient defines the gradient to use (between 0 and 1)
         * @param color defines the color to affect to the specified gradient
         */
        public addColorGradient(gradient: number, color: Color4): ParticleSystem {
            if (!this._colorGradients) {
                this._colorGradients = [];
            }

            let colorGradient = new ColorGradient();
            colorGradient.gradient = gradient;
            colorGradient.color = color;
            this._colorGradients.push(colorGradient);

            this._colorGradients.sort((a, b) => {
                if (a.gradient < b.gradient) {
                    return -1;
                } else if (a.gradient > b.gradient) {
                    return 1;
                }

                return 0;
            })

            return this;
        }

        /**
         * Remove a specific color gradient
         * @param gradient defines the gradient to remove
         */
        public removeColorGradient(gradient: number): ParticleSystem {
            if (!this._colorGradients) {
                return this;
            }

            let index = 0;
            for (var colorGradient of this._colorGradients) {
                if (colorGradient.gradient === gradient) {
                    this._colorGradients.splice(index, 1);
                    break;
                }
                index++;
            }

            return this;
        }

        private _resetEffect() {
            if (this._vertexBuffer) {
                this._vertexBuffer.dispose();
                this._vertexBuffer = null;
            }

            if (this._spriteBuffer) {
                this._spriteBuffer.dispose();
                this._spriteBuffer = null;
            }            

            this._createVertexBuffers();           
        }

        private _createVertexBuffers() {
            this._vertexBufferSize = this._useInstancing ? 10 : 12;
            if (this._isAnimationSheetEnabled) {
                this._vertexBufferSize += 1;
            }

            if (!this._isBillboardBased) {
                this._vertexBufferSize += 3;
            }

            let engine = this._scene.getEngine();
            this._vertexData = new Float32Array(this._capacity * this._vertexBufferSize * (this._useInstancing ? 1 : 4));
            this._vertexBuffer = new Buffer(engine, this._vertexData, true, this._vertexBufferSize);

            let dataOffset = 0;        
            var positions = this._vertexBuffer.createVertexBuffer(VertexBuffer.PositionKind, dataOffset, 3, this._vertexBufferSize, this._useInstancing);
            this._vertexBuffers[VertexBuffer.PositionKind] = positions;
            dataOffset += 3;

            var colors = this._vertexBuffer.createVertexBuffer(VertexBuffer.ColorKind, dataOffset, 4, this._vertexBufferSize, this._useInstancing);
            this._vertexBuffers[VertexBuffer.ColorKind] = colors;
            dataOffset += 4;

            var options = this._vertexBuffer.createVertexBuffer("angle", dataOffset, 1, this._vertexBufferSize, this._useInstancing);
            this._vertexBuffers["angle"] = options;
            dataOffset += 1;
            
            var size = this._vertexBuffer.createVertexBuffer("size", dataOffset, 2, this._vertexBufferSize, this._useInstancing);
            this._vertexBuffers["size"] = size;
            dataOffset += 2;

            if (this._isAnimationSheetEnabled) {
                var cellIndexBuffer = this._vertexBuffer.createVertexBuffer("cellIndex", dataOffset, 1, this._vertexBufferSize, this._useInstancing);
                this._vertexBuffers["cellIndex"] = cellIndexBuffer;
                dataOffset += 1;
            }

            if (!this._isBillboardBased) {
                var directionBuffer = this._vertexBuffer.createVertexBuffer("direction", dataOffset, 3, this._vertexBufferSize, this._useInstancing);
                this._vertexBuffers["direction"] = directionBuffer;
                dataOffset += 3;
            }

            var offsets: VertexBuffer;
            if (this._useInstancing) {
                var spriteData = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);  
                this._spriteBuffer = new Buffer(engine, spriteData, false, 2);  
                offsets = this._spriteBuffer.createVertexBuffer("offset", 0, 2);
            } else {
                offsets = this._vertexBuffer.createVertexBuffer("offset", dataOffset, 2, this._vertexBufferSize, this._useInstancing);
                dataOffset += 2;
            }
            this._vertexBuffers["offset"] = offsets;              
        }

        private _createIndexBuffer() {
            if (this._useInstancing) {
                return;
            }
            var indices = [];
            var index = 0;
            for (var count = 0; count < this._capacity; count++) {
                indices.push(index);
                indices.push(index + 1);
                indices.push(index + 2);
                indices.push(index);
                indices.push(index + 2);
                indices.push(index + 3);
                index += 4;
            }

            this._indexBuffer = this._scene.getEngine().createIndexBuffer(indices);
        }

        /**
         * Gets the maximum number of particles active at the same time.
         * @returns The max number of active particles.
         */
        public getCapacity(): number {
            return this._capacity;
        }

        /**
         * Gets Wether there are still active particles in the system.
         * @returns True if it is alive, otherwise false.
         */
        public isAlive(): boolean {
            return this._alive;
        }

        /**
         * Gets Wether the system has been started.
         * @returns True if it has been started, otherwise false.
         */
        public isStarted(): boolean {
            return this._started;
        }

        /**
         * Starts the particle system and begins to emit.
         */
        public start(): void {
            this._started = true;
            this._stopped = false;
            this._actualFrame = 0;
            if (this.subEmitters && this.subEmitters.length != 0) {
                this.activeSubSystems = new Array<ParticleSystem>();
            }

            if (this.preWarmCycles) {
                for (var index = 0; index < this.preWarmCycles; index++) {
                    this.animate(true);
                }
            }
        }

        /**
         * Stops the particle system.
         * @param stopSubEmitters if true it will stop the current system and all created sub-Systems if false it will stop the current root system only, this param is used by the root particle system only. the default value is true.
         */
        public stop(stopSubEmitters = true): void {
            this._stopped = true;

            if (stopSubEmitters) {
                this._stopSubEmitters();
            }
        }

        // animation sheet

        /**
         * Remove all active particles
         */
        public reset(): void {
            this._stockParticles = [];
            this._particles = [];
        }

        /**
         * @hidden (for internal use only)
         */
        public _appendParticleVertex(index: number, particle: Particle, offsetX: number, offsetY: number): void {
            var offset = index * this._vertexBufferSize;

            this._vertexData[offset++] = particle.position.x;
            this._vertexData[offset++] = particle.position.y;
            this._vertexData[offset++] = particle.position.z;
            this._vertexData[offset++] = particle.color.r;
            this._vertexData[offset++] = particle.color.g;
            this._vertexData[offset++] = particle.color.b;
            this._vertexData[offset++] = particle.color.a;
            this._vertexData[offset++] = particle.angle;

            this._vertexData[offset++] = particle.scale.x * particle.size;
            this._vertexData[offset++] = particle.scale.y * particle.size;
            
            if (this._isAnimationSheetEnabled) {
                this._vertexData[offset++] = particle.cellIndex;
            }

            if (!this._isBillboardBased) {
                if (particle._initialDirection) {
                    this._vertexData[offset++] = particle._initialDirection.x;
                    this._vertexData[offset++] = particle._initialDirection.y;
                    this._vertexData[offset++] = particle._initialDirection.z;
                } else {
                    this._vertexData[offset++] = particle.direction.x;
                    this._vertexData[offset++] = particle.direction.y;
                    this._vertexData[offset++] = particle.direction.z;
                }
            }

            if (!this._useInstancing) {
                if (this._isAnimationSheetEnabled) {
                    if (offsetX === 0)
                        offsetX = this._epsilon;
                    else if (offsetX === 1)
                        offsetX = 1 - this._epsilon;
    
                    if (offsetY === 0)
                        offsetY = this._epsilon;
                    else if (offsetY === 1)
                        offsetY = 1 - this._epsilon;
                }

                this._vertexData[offset++] = offsetX;
                this._vertexData[offset++] = offsetY;   
            }
        }

        // start of sub system methods

        /**
         * "Recycles" one of the particle by copying it back to the "stock" of particles and removing it from the active list.
         * Its lifetime will start back at 0.
         */
        public recycleParticle: (particle: Particle) => void = (particle) => {
            var lastParticle = <Particle>this._particles.pop();
            if (lastParticle !== particle) {
                lastParticle.copyTo(particle);
            }
            this._stockParticles.push(lastParticle);
        };

        private _stopSubEmitters(): void {
            if (!this.activeSubSystems) {
                return;
            }
            this.activeSubSystems.forEach(subSystem => {
                subSystem.stop(true);
            });
            this.activeSubSystems = new Array<ParticleSystem>();
        }

        private _createParticle: () => Particle = () => {
            var particle: Particle;
            if (this._stockParticles.length !== 0) {
                particle = <Particle>this._stockParticles.pop();
                particle.age = 0;
                particle.cellIndex = this.startSpriteCellID;
            } else {
                particle = new Particle(this);
            }
            return particle;
        }

        private _removeFromRoot(): void {
            if (!this._rootParticleSystem){
                return;
            }
            
            let index = this._rootParticleSystem.activeSubSystems.indexOf(this);
            if (index !== -1) {
                this._rootParticleSystem.activeSubSystems.splice(index, 1);
            }
        }

        private _emitFromParticle: (particle: Particle) => void = (particle) => {
            if (!this.subEmitters || this.subEmitters.length === 0) {
                return;
            }

            var templateIndex = Math.floor(Math.random() * this.subEmitters.length);

            var subSystem = this.subEmitters[templateIndex].clone(this.name + "_sub", particle.position.clone());
            subSystem._rootParticleSystem = this;
            this.activeSubSystems.push(subSystem);
            subSystem.start();
        }

        // end of sub system methods

        private _update(newParticles: number): void {
            // Update current
            this._alive = this._particles.length > 0;

            this.updateFunction(this._particles);

            // Add new ones
            var worldMatrix;

            if ((<AbstractMesh>this.emitter).position) {
                var emitterMesh = (<AbstractMesh>this.emitter);
                worldMatrix = emitterMesh.getWorldMatrix();
            } else {
                var emitterPosition = (<Vector3>this.emitter);
                worldMatrix = Matrix.Translation(emitterPosition.x, emitterPosition.y, emitterPosition.z);
            }

            var particle: Particle;
            for (var index = 0; index < newParticles; index++) {
                if (this._particles.length === this._capacity) {
                    break;
                }

                particle = this._createParticle();

                this._particles.push(particle);

                let emitPower = Scalar.RandomRange(this.minEmitPower, this.maxEmitPower);

                if (this.startPositionFunction) {
                    this.startPositionFunction(worldMatrix, particle.position, particle);
                }
                else {
                    this.particleEmitterType.startPositionFunction(worldMatrix, particle.position, particle);
                }

                if (this.startDirectionFunction) {
                    this.startDirectionFunction(worldMatrix, particle.direction, particle);
                }
                else {
                    this.particleEmitterType.startDirectionFunction(worldMatrix, particle.direction, particle);
                }

                if (emitPower === 0) {
                    if (!particle._initialDirection) {
                        particle._initialDirection = particle.direction.clone();
                    } else {
                        particle._initialDirection.copyFrom(particle.direction);
                    }
                } else {
                    particle._initialDirection = null;
                }

                particle.direction.scaleInPlace(emitPower);

                particle.lifeTime = Scalar.RandomRange(this.minLifeTime, this.maxLifeTime);

                particle.size = Scalar.RandomRange(this.minSize, this.maxSize);
                particle.scale.copyFromFloats(Scalar.RandomRange(this.minScaleX, this.maxScaleX), Scalar.RandomRange(this.minScaleY, this.maxScaleY));
                particle.angularSpeed = Scalar.RandomRange(this.minAngularSpeed, this.maxAngularSpeed);

                if (!this._colorGradients || this._colorGradients.length === 0) {
                    var step = Scalar.RandomRange(0, 1.0);

                    Color4.LerpToRef(this.color1, this.color2, step, particle.color);

                    this.colorDead.subtractToRef(particle.color, this._colorDiff);
                    this._colorDiff.scaleToRef(1.0 / particle.lifeTime, particle.colorStep);
                } else {
                    particle.color.copyFrom(this._colorGradients[0].color);
                }
            }
        }

        private _getEffect(): Effect {
            if (this._customEffect) {
                return this._customEffect;
            };

            var defines = [];

            if (this._scene.clipPlane) {
                defines.push("#define CLIPPLANE");
            }

            if (this._isAnimationSheetEnabled) {
                defines.push("#define ANIMATESHEET");
            }

            if (this._isBillboardBased) {
                defines.push("#define BILLBOARD");
            }

            // Effect
            var join = defines.join("\n");
            if (this._cachedDefines !== join) {
                this._cachedDefines = join;

                var attributesNamesOrOptions = [VertexBuffer.PositionKind, VertexBuffer.ColorKind, "angle", "offset", "size"];
                var effectCreationOption = ["invView", "view", "projection", "vClipPlane", "textureMask"];

                if (this._isAnimationSheetEnabled) {
                    attributesNamesOrOptions.push("cellIndex");
                    effectCreationOption.push("particlesInfos")
                }

                if (!this._isBillboardBased) {
                    attributesNamesOrOptions.push("direction");
                }

                this._effect = this._scene.getEngine().createEffect(
                    "particles",
                    attributesNamesOrOptions,
                    effectCreationOption,
                    ["diffuseSampler"], join);
            }

            return this._effect;
        }

        /**
         * Animates the particle system for the current frame by emitting new particles and or animating the living ones.
         * @param preWarmOnly will prevent the system from updating the vertex buffer (default is false)
         */
        public animate(preWarmOnly = false): void {
            if (!this._started)
                return;

            if (!preWarmOnly) {
                var effect = this._getEffect();

                // Check
                if (!this.emitter || !effect.isReady() || !this.particleTexture || !this.particleTexture.isReady())
                    return;

                if (this._currentRenderId === this._scene.getRenderId()) {
                    return;
                }
                this._currentRenderId = this._scene.getRenderId();
            }

            this._scaledUpdateSpeed = this.updateSpeed * (preWarmOnly ? this.preWarmStepOffset : this._scene.getAnimationRatio());

            // determine the number of particles we need to create
            var newParticles;

            if (this.manualEmitCount > -1) {
                newParticles = this.manualEmitCount;
                this._newPartsExcess = 0;
                this.manualEmitCount = 0;
            } else {
                newParticles = ((this.emitRate * this._scaledUpdateSpeed) >> 0);
                this._newPartsExcess += this.emitRate * this._scaledUpdateSpeed - newParticles;
            }

            if (this._newPartsExcess > 1.0) {
                newParticles += this._newPartsExcess >> 0;
                this._newPartsExcess -= this._newPartsExcess >> 0;
            }

            this._alive = false;

            if (!this._stopped) {
                this._actualFrame += this._scaledUpdateSpeed;

                if (this.targetStopDuration && this._actualFrame >= this.targetStopDuration)
                    this.stop();
            } else {
                newParticles = 0;
            }
            this._update(newParticles);

            // Stopped?
            if (this._stopped) {
                if (!this._alive) {
                    this._started = false;
                    if (this.onAnimationEnd) {
                        this.onAnimationEnd();
                    }
                    if (this.disposeOnStop) {
                        this._scene._toBeDisposed.push(this);
                    }
                }
            }

            if (!preWarmOnly) {
                // Update VBO
                var offset = 0;
                for (var index = 0; index < this._particles.length; index++) {
                    var particle = this._particles[index];
                    this._appendParticleVertices(offset, particle);                
                    offset += this._useInstancing ? 1 : 4;
                }

                if (this._vertexBuffer) {
                    this._vertexBuffer.update(this._vertexData);
                }
            }

            if (this.manualEmitCount === 0 && this.disposeOnStop) {
                this.stop();
            }
        }

        private _appendParticleVertices(offset: number, particle: Particle) {
            this._appendParticleVertex(offset++, particle, 0, 0);
            if (!this._useInstancing) {
                this._appendParticleVertex(offset++, particle, 1, 0);
                this._appendParticleVertex(offset++, particle, 1, 1);
                this._appendParticleVertex(offset++, particle, 0, 1);
            }
        }

        /**
         * Rebuilds the particle system.
         */
        public rebuild(): void {
            this._createIndexBuffer();

            if (this._vertexBuffer) {
                this._vertexBuffer._rebuild();
            }
        }

        /**
         * Is this system ready to be used/rendered
         * @return true if the system is ready
         */
        public isReady(): boolean {
            var effect = this._getEffect();
            if (!this.emitter || !effect.isReady() || !this.particleTexture || !this.particleTexture.isReady()) {
                return false;
            }

            return true;
        }

        /**
         * Renders the particle system in its current state.
         * @returns the current number of particles
         */
        public render(): number {
            var effect = this._getEffect();

            // Check
            if (!this.isReady() || !this._particles.length) {
                return 0;
            }

            var engine = this._scene.getEngine();

            // Render
            engine.enableEffect(effect);
            engine.setState(false);

            var viewMatrix = this._scene.getViewMatrix();
            effect.setTexture("diffuseSampler", this.particleTexture);
            effect.setMatrix("view", viewMatrix);
            effect.setMatrix("projection", this._scene.getProjectionMatrix());

            if (this._isAnimationSheetEnabled && this.particleTexture) {
                var baseSize = this.particleTexture.getBaseSize();
                effect.setFloat3("particlesInfos", this.spriteCellWidth / baseSize.width, this.spriteCellHeight / baseSize.height, baseSize.width / this.spriteCellWidth);
            }

            effect.setFloat4("textureMask", this.textureMask.r, this.textureMask.g, this.textureMask.b, this.textureMask.a);

            if (this._scene.clipPlane) {
                var clipPlane = this._scene.clipPlane;
                var invView = viewMatrix.clone();
                invView.invert();
                effect.setMatrix("invView", invView);
                effect.setFloat4("vClipPlane", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
            }

            engine.bindBuffers(this._vertexBuffers, this._indexBuffer, effect);

            // Draw order
            switch(this.blendMode)
            {
                case ParticleSystem.BLENDMODE_ADD:
                    engine.setAlphaMode(Engine.ALPHA_ADD);
                    break;
                case ParticleSystem.BLENDMODE_ONEONE:
                    engine.setAlphaMode(Engine.ALPHA_ONEONE);
                    break;
                case ParticleSystem.BLENDMODE_STANDARD:
                    engine.setAlphaMode(Engine.ALPHA_COMBINE);
                    break;
            }

            if (this.forceDepthWrite) {
                engine.setDepthWrite(true);
            }

            if (this._useInstancing) {
                engine.drawArraysType(Material.TriangleFanDrawMode, 0, 4, this._particles.length);  
                engine.unbindInstanceAttributes();
            } else {
                engine.drawElementsType(Material.TriangleFillMode, 0, this._particles.length * 6);
            }
            engine.setAlphaMode(Engine.ALPHA_DISABLE);

            return this._particles.length;
        }

        /**
         * Disposes the particle system and free the associated resources
         * @param disposeTexture defines if the particule texture must be disposed as well (true by default)
         */
        public dispose(disposeTexture = true): void {
            if (this._vertexBuffer) {
                this._vertexBuffer.dispose();
                this._vertexBuffer = null;
            }

            if (this._spriteBuffer) {
                this._spriteBuffer.dispose();
                this._spriteBuffer = null;
            }

            if (this._indexBuffer) {
                this._scene.getEngine()._releaseBuffer(this._indexBuffer);
                this._indexBuffer = null;
            }

            if (disposeTexture && this.particleTexture) {
                this.particleTexture.dispose();
                this.particleTexture = null;
            }

            this._removeFromRoot();

            // Remove from scene
            var index = this._scene.particleSystems.indexOf(this);
            if (index > -1) {
                this._scene.particleSystems.splice(index, 1);
            }

            // Callback
            this.onDisposeObservable.notifyObservers(this);
            this.onDisposeObservable.clear();
        }

        /**
         * Creates a Sphere Emitter for the particle system. (emits along the sphere radius)
         * @param radius The radius of the sphere to emit from
         * @returns the emitter
         */
        public createSphereEmitter(radius = 1): SphereParticleEmitter {
            var particleEmitter = new SphereParticleEmitter(radius);
            this.particleEmitterType = particleEmitter;
            return particleEmitter;
        }

        /**
         * Creates a Directed Sphere Emitter for the particle system. (emits between direction1 and direction2)
         * @param radius The radius of the sphere to emit from
         * @param direction1 Particles are emitted between the direction1 and direction2 from within the sphere
         * @param direction2 Particles are emitted between the direction1 and direction2 from within the sphere
         * @returns the emitter
         */
        public createDirectedSphereEmitter(radius = 1, direction1 = new Vector3(0, 1.0, 0), direction2 = new Vector3(0, 1.0, 0)): SphereDirectedParticleEmitter {
            var particleEmitter = new SphereDirectedParticleEmitter(radius, direction1, direction2)
            this.particleEmitterType = particleEmitter;
            return particleEmitter;
        }

        /**
         * Creates a Cone Emitter for the particle system. (emits from the cone to the particle position)
         * @param radius The radius of the cone to emit from
         * @param angle The base angle of the cone
         * @returns the emitter
         */
        public createConeEmitter(radius = 1, angle = Math.PI / 4): ConeParticleEmitter {
            var particleEmitter = new ConeParticleEmitter(radius, angle);
            this.particleEmitterType = particleEmitter;
            return particleEmitter;
        }

        // this method needs to be changed when breaking changes will be allowed to match the sphere and cone methods and properties direction1,2 and minEmitBox,maxEmitBox to be removed from the system.
        /**
         * Creates a Box Emitter for the particle system. (emits between direction1 and direction2 from withing the box defined by minEmitBox and maxEmitBox)
         * @param direction1 Particles are emitted between the direction1 and direction2 from within the box
         * @param direction2 Particles are emitted between the direction1 and direction2 from within the box
         * @param minEmitBox Particles are emitted from the box between minEmitBox and maxEmitBox
         * @param maxEmitBox  Particles are emitted from the box between minEmitBox and maxEmitBox
         * @returns the emitter
         */
        public createBoxEmitter(direction1: Vector3, direction2: Vector3, minEmitBox: Vector3, maxEmitBox: Vector3): BoxParticleEmitter {
            var particleEmitter = new BoxParticleEmitter();
            this.particleEmitterType = particleEmitter;
            this.direction1 = direction1;
            this.direction2 = direction2;
            this.minEmitBox = minEmitBox;
            this.maxEmitBox = maxEmitBox;
            return particleEmitter;
        }

        // Clone
        /**
         * Clones the particle system.
         * @param name The name of the cloned object
         * @param newEmitter The new emitter to use
         * @returns the cloned particle system
         */
        public clone(name: string, newEmitter: any): ParticleSystem {
            var custom: Nullable<Effect> = null;
            var program: any = null;
            if (this.customShader != null) {
                program = this.customShader;
                var defines: string = (program.shaderOptions.defines.length > 0) ? program.shaderOptions.defines.join("\n") : "";
                custom = this._scene.getEngine().createEffectForParticles(program.shaderPath.fragmentElement, program.shaderOptions.uniforms, program.shaderOptions.samplers, defines);
            }
            var result = new ParticleSystem(name, this._capacity, this._scene, custom);
            result.customShader = program;

            Tools.DeepCopy(this, result, ["particles", "customShader"]);

            if (newEmitter === undefined) {
                newEmitter = this.emitter;
            }

            result.emitter = newEmitter;
            if (this.particleTexture) {
                result.particleTexture = new Texture(this.particleTexture.url, this._scene);
            }

            if (!this.preventAutoStart) {
                result.start();
            }

            return result;
        }

        /**
         * Serializes the particle system to a JSON object.
         * @returns the JSON object
         */
        public serialize(): any {
            var serializationObject: any = {};

            serializationObject.name = this.name;
            serializationObject.id = this.id;

            // Emitter
            if ((<AbstractMesh>this.emitter).position) {
                var emitterMesh = (<AbstractMesh>this.emitter);
                serializationObject.emitterId = emitterMesh.id;
            } else {
                var emitterPosition = (<Vector3>this.emitter);
                serializationObject.emitter = emitterPosition.asArray();
            }

            serializationObject.capacity = this.getCapacity();

            if (this.particleTexture) {
                serializationObject.textureName = this.particleTexture.name;
            }

            // Animations
            Animation.AppendSerializedAnimations(this, serializationObject);

            // Particle system
            serializationObject.minAngularSpeed = this.minAngularSpeed;
            serializationObject.maxAngularSpeed = this.maxAngularSpeed;
            serializationObject.minSize = this.minSize;
            serializationObject.maxSize = this.maxSize;
            serializationObject.minScaleX = this.minScaleX;
            serializationObject.maxScaleX = this.maxScaleX;
            serializationObject.minScaleY = this.minScaleY;
            serializationObject.maxScaleY = this.maxScaleY;            
            serializationObject.minEmitPower = this.minEmitPower;
            serializationObject.maxEmitPower = this.maxEmitPower;
            serializationObject.minLifeTime = this.minLifeTime;
            serializationObject.maxLifeTime = this.maxLifeTime;
            serializationObject.emitRate = this.emitRate;
            serializationObject.minEmitBox = this.minEmitBox.asArray();
            serializationObject.maxEmitBox = this.maxEmitBox.asArray();
            serializationObject.gravity = this.gravity.asArray();
            serializationObject.direction1 = this.direction1.asArray();
            serializationObject.direction2 = this.direction2.asArray();
            serializationObject.color1 = this.color1.asArray();
            serializationObject.color2 = this.color2.asArray();
            serializationObject.colorDead = this.colorDead.asArray();
            serializationObject.updateSpeed = this.updateSpeed;
            serializationObject.targetStopDuration = this.targetStopDuration;
            serializationObject.textureMask = this.textureMask.asArray();
            serializationObject.blendMode = this.blendMode;
            serializationObject.customShader = this.customShader;
            serializationObject.preventAutoStart = this.preventAutoStart;

            serializationObject.startSpriteCellID = this.startSpriteCellID;
            serializationObject.endSpriteCellID = this.endSpriteCellID;
            serializationObject.spriteCellLoop = this.spriteCellLoop;
            serializationObject.spriteCellChangeSpeed = this.spriteCellChangeSpeed;
            serializationObject.spriteCellWidth = this.spriteCellWidth;
            serializationObject.spriteCellHeight = this.spriteCellHeight;

            serializationObject.isAnimationSheetEnabled = this._isAnimationSheetEnabled;

            // Emitter
            if (this.particleEmitterType) {
                serializationObject.particleEmitterType = this.particleEmitterType.serialize();
            }            

            return serializationObject;
        }

        /**
         * Parses a JSON object to create a particle system.
         * @param parsedParticleSystem The JSON object to parse
         * @param scene The scene to create the particle system in
         * @param rootUrl The root url to use to load external dependencies like texture
         * @returns the Parsed particle system
         */
        public static Parse(parsedParticleSystem: any, scene: Scene, rootUrl: string): ParticleSystem {
            var name = parsedParticleSystem.name;
            var custom: Nullable<Effect> = null;
            var program: any = null;
            if (parsedParticleSystem.customShader) {
                program = parsedParticleSystem.customShader;
                var defines: string = (program.shaderOptions.defines.length > 0) ? program.shaderOptions.defines.join("\n") : "";
                custom = scene.getEngine().createEffectForParticles(program.shaderPath.fragmentElement, program.shaderOptions.uniforms, program.shaderOptions.samplers, defines);
            }
            var particleSystem = new ParticleSystem(name, parsedParticleSystem.capacity, scene, custom, parsedParticleSystem.isAnimationSheetEnabled);
            particleSystem.customShader = program;

            if (parsedParticleSystem.id) {
                particleSystem.id = parsedParticleSystem.id;
            }

            // Auto start
            if (parsedParticleSystem.preventAutoStart) {
                particleSystem.preventAutoStart = parsedParticleSystem.preventAutoStart;
            }

            // Texture
            if (parsedParticleSystem.textureName) {
                particleSystem.particleTexture = new Texture(rootUrl + parsedParticleSystem.textureName, scene);
                particleSystem.particleTexture.name = parsedParticleSystem.textureName;
            }

            // Emitter
            if (parsedParticleSystem.emitterId) {
                particleSystem.emitter = scene.getLastMeshByID(parsedParticleSystem.emitterId);
            } else {
                particleSystem.emitter = Vector3.FromArray(parsedParticleSystem.emitter);
            }

            // Animations
            if (parsedParticleSystem.animations) {
                for (var animationIndex = 0; animationIndex < parsedParticleSystem.animations.length; animationIndex++) {
                    var parsedAnimation = parsedParticleSystem.animations[animationIndex];
                    particleSystem.animations.push(Animation.Parse(parsedAnimation));
                }
            }

            if (parsedParticleSystem.autoAnimate) {
                scene.beginAnimation(particleSystem, parsedParticleSystem.autoAnimateFrom, parsedParticleSystem.autoAnimateTo, parsedParticleSystem.autoAnimateLoop, parsedParticleSystem.autoAnimateSpeed || 1.0);
            }

            // Particle system
            particleSystem.minAngularSpeed = parsedParticleSystem.minAngularSpeed;
            particleSystem.maxAngularSpeed = parsedParticleSystem.maxAngularSpeed;
            particleSystem.minSize = parsedParticleSystem.minSize;
            particleSystem.maxSize = parsedParticleSystem.maxSize;

            if (parsedParticleSystem.minScaleX) {
                particleSystem.minScaleX = parsedParticleSystem.minScaleX;
                particleSystem.maxScaleX = parsedParticleSystem.maxScaleX;                
                particleSystem.minScaleY = parsedParticleSystem.minScaleY;
                particleSystem.maxScaleY = parsedParticleSystem.maxScaleY;                
            }

            particleSystem.minLifeTime = parsedParticleSystem.minLifeTime;
            particleSystem.maxLifeTime = parsedParticleSystem.maxLifeTime;
            particleSystem.minEmitPower = parsedParticleSystem.minEmitPower;
            particleSystem.maxEmitPower = parsedParticleSystem.maxEmitPower;
            particleSystem.emitRate = parsedParticleSystem.emitRate;
            particleSystem.minEmitBox = Vector3.FromArray(parsedParticleSystem.minEmitBox);
            particleSystem.maxEmitBox = Vector3.FromArray(parsedParticleSystem.maxEmitBox);
            particleSystem.gravity = Vector3.FromArray(parsedParticleSystem.gravity);
            particleSystem.direction1 = Vector3.FromArray(parsedParticleSystem.direction1);
            particleSystem.direction2 = Vector3.FromArray(parsedParticleSystem.direction2);
            particleSystem.color1 = Color4.FromArray(parsedParticleSystem.color1);
            particleSystem.color2 = Color4.FromArray(parsedParticleSystem.color2);
            particleSystem.colorDead = Color4.FromArray(parsedParticleSystem.colorDead);
            particleSystem.updateSpeed = parsedParticleSystem.updateSpeed;
            particleSystem.targetStopDuration = parsedParticleSystem.targetStopDuration;
            particleSystem.textureMask = Color4.FromArray(parsedParticleSystem.textureMask);
            particleSystem.blendMode = parsedParticleSystem.blendMode;

            particleSystem.startSpriteCellID = parsedParticleSystem.startSpriteCellID;
            particleSystem.endSpriteCellID = parsedParticleSystem.endSpriteCellID;
            particleSystem.spriteCellLoop = parsedParticleSystem.spriteCellLoop;
            particleSystem.spriteCellChangeSpeed = parsedParticleSystem.spriteCellChangeSpeed;
            particleSystem.spriteCellWidth = parsedParticleSystem.spriteCellWidth;
            particleSystem.spriteCellHeight = parsedParticleSystem.spriteCellHeight;

            if (!particleSystem.preventAutoStart) {
                particleSystem.start();
            }

            return particleSystem;
        }
    }
}