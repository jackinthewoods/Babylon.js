﻿module BABYLON {

    /**
     * A particle represents one of the element emitted by a particle system.
     * This is mainly define by its coordinates, direction, velocity and age.
     */
    export class Particle {
        /**
         * The world position of the particle in the scene.
         */
        public position = Vector3.Zero();

        /**
         * The world direction of the particle in the scene.
         */
        public direction = Vector3.Zero();

        /**
         * The color of the particle.
         */
        public color = new Color4(0, 0, 0, 0);

        /**
         * The color change of the particle per step.
         */
        public colorStep = new Color4(0, 0, 0, 0);

        /**
         * Defines how long will the life of the particle be.
         */
        public lifeTime = 1.0;

        /**
         * The current age of the particle.
         */
        public age = 0;

        /**
         * The current size of the particle.
         */
        public size = 0;

        /**
         * The current scale of the particle.
         */
        public scale = new Vector2(1, 1);        

        /**
         * The current angle of the particle.
         */
        public angle = 0;

        /**
         * Defines how fast is the angle changing.
         */
        public angularSpeed = 0;

        /**
         * Defines the cell index used by the particle to be rendered from a sprite.
         */
        public cellIndex: number = 0;  

        private _currentFrameCounter = 0;

        /** @hidden */
        public _initialDirection: Nullable<Vector3>;

        /**
         * Creates a new instance Particle
         * @param particleSystem the particle system the particle belongs to
         */
        constructor(
            /**
             * particleSystem the particle system the particle belongs to.
             */
            public particleSystem: ParticleSystem) {
            if (!this.particleSystem.isAnimationSheetEnabled) {
                return;
            }

            this.updateCellInfoFromSystem();
        }

        private updateCellInfoFromSystem(): void {
            this.cellIndex = this.particleSystem.startSpriteCellID;

            if (this.particleSystem.spriteCellChangeSpeed == 0) {
                this.updateCellIndex = this._updateCellIndexWithSpeedCalculated;
            }
            else {
                this.updateCellIndex = this._updateCellIndexWithCustomSpeed;
            }
        }

        /**
         * Defines how the sprite cell index is updated for the particle. This is 
         * defined as a callback.
         */
        public updateCellIndex: (scaledUpdateSpeed: number) => void;

        private _updateCellIndexWithSpeedCalculated(scaledUpdateSpeed: number): void {
            //   (ageOffset / scaledUpdateSpeed) / available cells
            var numberOfScaledUpdatesPerCell = ((this.lifeTime - this.age) / scaledUpdateSpeed) / (this.particleSystem.endSpriteCellID + 1 - this.cellIndex);

            this._currentFrameCounter += scaledUpdateSpeed;
            if (this._currentFrameCounter >= numberOfScaledUpdatesPerCell * scaledUpdateSpeed) {
                this._currentFrameCounter = 0;
                this.cellIndex++;
                if (this.cellIndex > this.particleSystem.endSpriteCellID) {
                    this.cellIndex = this.particleSystem.endSpriteCellID;
                }
            }
        }

        private _updateCellIndexWithCustomSpeed(): void {
            if (this._currentFrameCounter >= this.particleSystem.spriteCellChangeSpeed) {
                this.cellIndex++;
                this._currentFrameCounter = 0;
                if (this.cellIndex > this.particleSystem.endSpriteCellID) {
                    if (this.particleSystem.spriteCellLoop) {
                        this.cellIndex = this.particleSystem.startSpriteCellID;
                    }
                    else {
                        this.cellIndex = this.particleSystem.endSpriteCellID;
                    }
                }
            }
            else {
                this._currentFrameCounter++;
            }
        }

        /**
         * Copy the properties of particle to another one.
         * @param other the particle to copy the information to.
         */
        public copyTo(other: Particle) {
            other.position.copyFrom(this.position);
            if (this._initialDirection) {
                if (other._initialDirection) {
                    other._initialDirection.copyFrom(this._initialDirection);
                } else {
                    other._initialDirection = this._initialDirection.clone();
                }
            } else {
                other._initialDirection = null;
            }
            other.direction.copyFrom(this.direction);
            other.color.copyFrom(this.color);
            other.colorStep.copyFrom(this.colorStep);
            other.lifeTime = this.lifeTime;
            other.age = this.age;
            other.size = this.size;
            other.scale.copyFrom(this.scale);
            other.angle = this.angle;
            other.angularSpeed = this.angularSpeed;
            other.particleSystem = this.particleSystem;
            other.cellIndex = this.cellIndex;
        }
    }
} 