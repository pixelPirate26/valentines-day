/**
 * Valentine's Day - Rose Growing Animation
 */

(function(window) {
    'use strict';

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function random(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    function randomFloat(min, max) {
        return min + Math.random() * (max - min);
    }

    function bezier(points, t) {
        var p0 = points[0], p1 = points[1], p2 = points[2];
        var mt = 1 - t;
        return {
            x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
            y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
        };
    }

    function inHeart(x, y, r) {
        var xx = x / r, yy = y / r;
        var z = xx * xx + yy * yy - 1;
        return z * z * z - xx * xx * yy * yy * yy < 0;
    }

    // ============================================
    // HEART SEED
    // ============================================
    function HeartSeed(ctx, x, y, scale, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.scale = scale || 2;
        this.color = color || '#c41e3a';
    }

    HeartSeed.prototype = {
        draw: function() {
            var ctx = this.ctx;
            var x = this.x, y = this.y, s = this.scale;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(s, s);
            
            // Draw heart shape
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.bezierCurveTo(-10, -18, -20, -8, 0, 10);
            ctx.bezierCurveTo(20, -8, 10, -18, 0, -8);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            ctx.restore();
            
            // Draw button
            var btnY = y + 80;
            var btnWidth = 200;
            var btnHeight = 70;
            var btnX = x - btnWidth / 2;
            
            ctx.save();
            
            // Button background - VISIBLE
            ctx.fillStyle = 'rgba(196, 30, 58, 0.3)';
            ctx.strokeStyle = 'rgba(255, 107, 138, 0.6)';
            ctx.lineWidth = 2;
            
            // Rounded rectangle
            var radius = 16;
            ctx.beginPath();
            ctx.moveTo(btnX + radius, btnY);
            ctx.lineTo(btnX + btnWidth - radius, btnY);
            ctx.quadraticCurveTo(btnX + btnWidth, btnY, btnX + btnWidth, btnY + radius);
            ctx.lineTo(btnX + btnWidth, btnY + btnHeight - radius);
            ctx.quadraticCurveTo(btnX + btnWidth, btnY + btnHeight, btnX + btnWidth - radius, btnY + btnHeight);
            ctx.lineTo(btnX + radius, btnY + btnHeight);
            ctx.quadraticCurveTo(btnX, btnY + btnHeight, btnX, btnY + btnHeight - radius);
            ctx.lineTo(btnX, btnY + radius);
            ctx.quadraticCurveTo(btnX, btnY, btnX + radius, btnY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Button text - BRIGHT
            ctx.fillStyle = '#ffffff';
            ctx.font = "bold 22px 'Dancing Script', cursive";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Click Me 💕', x, btnY + 25);
            
            ctx.font = "14px 'Quicksand', sans-serif";
            ctx.fillStyle = '#ffb3c1';
            ctx.fillText('to grow our love', x, btnY + 50);
            
            ctx.restore();
        },
        
        hover: function(mx, my) {
            var btnX = this.x - 100;
            var btnY = this.y + 80;
            var btnWidth = 200;
            var btnHeight = 70;
            
            return mx >= btnX && mx <= btnX + btnWidth && 
                   my >= btnY && my <= btnY + btnHeight;
        },
        
        shrink: function(factor) {
            this.scale *= factor;
            return this.scale > 0.1;
        }
    };

    // ============================================
    // ROSE STEM
    // ============================================
    function RoseStem(ctx, startX, startY) {
        this.ctx = ctx;
        this.startX = startX;
        this.startY = startY;
        this.progress = 0;
        this.maxProgress = 1;
        
        this.path = [
            {x: startX, y: startY},
            {x: startX - 20, y: startY - 150},
            {x: startX + 10, y: startY - 300}
        ];
        
        this.leafPositions = [0.3, 0.5, 0.7];
        this.leafDirections = [1, -1, 1];
    }

    RoseStem.prototype = {
        grow: function(amount) {
            this.progress += amount || 0.004; // Slightly slower growth
            if (this.progress > this.maxProgress) {
                this.progress = this.maxProgress;
                return false;
            }
            return true;
        },
        
        draw: function() {
            var ctx = this.ctx;
            var path = this.path;
            
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // Draw the main stem
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            
            var steps = Math.floor(this.progress * 80); // High resolution
            for (var i = 1; i <= steps; i++) {
                var t = i / 80;
                var pt = bezier(path, t);
                ctx.lineTo(pt.x, pt.y);
            }
            
            // Gradient Stem
            var grad = ctx.createLinearGradient(path[0].x, path[0].y, path[2].x, path[2].y);
            grad.addColorStop(0, '#0a210f'); // Very dark green bottom
            grad.addColorStop(1, '#2f5e36'); // Lighter green top
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 5; // Elegant thickness
            ctx.stroke();
            
            // Add subtle thorns (Spikes)
            if (this.progress > 0.2) {
                ctx.fillStyle = '#0a210f';
                for (var j = 0; j < steps; j += 15) {
                    if (j < 10) continue;
                    var t = j / 80;
                    var pt = bezier(path, t);
                    // Calculate normal vector for perpendicular thorns
                    // Simple approximation based on alternating sides
                    var side = (j % 30 === 0) ? 1 : -1;
                    
                    ctx.beginPath();
                    ctx.moveTo(pt.x, pt.y);
                    ctx.lineTo(pt.x + side * 8, pt.y - 2); // Sharp tip
                    ctx.lineTo(pt.x, pt.y + 6); // Base
                    ctx.fill();
                }
            }
            
            ctx.restore();
            
            // Leaves with transparency
            for (var k = 0; k < this.leafPositions.length; k++) {
                if (this.progress > this.leafPositions[k] + 0.1) {
                    var leafT = this.leafPositions[k];
                    var leafPt = bezier(path, leafT);
                    var leafProgress = Math.min(1, (this.progress - leafT - 0.1) / 0.15);
                    this.drawLeaf(leafPt.x, leafPt.y, this.leafDirections[k], leafProgress);
                }
            }
        },
        
        drawLeaf: function(x, y, dir, progress) {
            var ctx = this.ctx;
            var size = 35 * progress;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(dir, 1);
            ctx.rotate(-0.4);
            
            // Leaf glow
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(47, 94, 54, 0.4)';
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            // Elegant curved leaf
            ctx.bezierCurveTo(size/2, -size/2, size, -size/4, size, 0);
            ctx.bezierCurveTo(size, size/4, size/2, size/2, 0, 0);
            
            ctx.fillStyle = "rgba(47, 94, 54, 0.9)";
            ctx.fill();
            
            ctx.restore();
        },
        
        getTopPoint: function() {
            return bezier(this.path, this.progress);
        },
        
        isComplete: function() {
            return this.progress >= this.maxProgress;
        }
    };

    // ============================================
    // ROSE BLOOM
    // ============================================
    function RoseBloom(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.petalLayers = 4;
        this.petalsPerLayer = [5, 7, 9, 12];
        this.layerProgress = [0, 0, 0, 0];
        this.currentLayer = 0;
        this.colors = ['#c41e3a', '#dc3545', '#e74c6f', '#f08080'];
        this.scale = 0;
        this.maxScale = 1;
    }

    RoseBloom.prototype = {
        bloom: function(amount) {
            // Slower, elegant unfolding
            amount = amount || 0.003; 
            
            if (this.scale < this.maxScale) {
                this.scale += amount;
                // Soft ease-out for a natural stop
                if (this.scale > this.maxScale) this.scale = this.maxScale;
                return true;
            }
            return false;
        },
        
        draw: function() {
            var ctx = this.ctx;
            var x = this.x, y = this.y;
            
            if (this.scale <= 0) return;
            
            ctx.save();
            ctx.translate(x, y);
            
            // Adjust scale to be generous but not overwhelming
            var finalScale = this.scale * 1.2; 
            ctx.scale(finalScale, finalScale);
            
            // Soft "Atmospheric" Glow behind the flower
            ctx.shadowBlur = 40;
            ctx.shadowColor = "rgba(180, 0, 40, 0.4)";
            
            // Draw the tight center bud first (Darker)
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#330000"; // Almost black-red center
            ctx.fill();

            // PHYLLOTAXIS ALGORITHM (The Golden Spiral)
            // Increased density for a "lush" look (80 petals instead of 45)
            var maxPetals = 80; 
            var goldenAngle = 137.508 * (Math.PI / 180);
            
            for (var i = 0; i < maxPetals; i++) {
                // Tighter spacing function for a solid core
                var r = 3.5 * Math.sqrt(i) * this.scale; 
                var theta = i * goldenAngle;
                
                var pX = r * Math.cos(theta);
                var pY = r * Math.sin(theta);
                
                // Petal Size: Grows as we move outward
                var petalSize = (5 + i * 0.25) * this.scale;
                
                // Rotation: Petals face the center
                var rotation = theta + Math.PI / 2;
                
                // DYNAMIC COLOR PALETTE (Velvet Effect)
                // Inner petals: Deep Burgundy (#4a0010)
                // Outer petals: Rich Red (#c41e3a)
                // We calculate a ratio (0 to 1) based on 'i'
                var ratio = i / maxPetals;
                
                // Draw the sophisticated petal
                this.drawVelvetPetal(pX, pY, petalSize, rotation, ratio);
            }
            
            ctx.restore();
        },
        
        drawVelvetPetal: function(x, y, size, rotation, ratio) {
            var ctx = this.ctx;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            
            // 1. SHAPE GEOMETRY (Cupped Shell, not a circle)
            // We use a "squashed heart" shape to mimic real petals
            ctx.beginPath();
            ctx.moveTo(0, 0); // Base
            // Left curve (wide belly)
            ctx.bezierCurveTo(-size, -size * 0.5, -size, -size * 1.5, 0, -size * 1.3);
            // Right curve (wide belly)
            ctx.bezierCurveTo(size, -size * 1.5, size, -size * 0.5, 0, 0);
            
            // 2. COLOR GRADIENT (Depth)
            // Light at the tip, dark at the base
            var grad = ctx.createLinearGradient(0, -size * 1.5, 0, 0);
            
            if (ratio < 0.3) {
                // Inner Core: Dark & Intense
                grad.addColorStop(0, '#99001b'); // Dark Red
                grad.addColorStop(1, '#2b0005'); // Almost Black
            } else {
                // Outer Bloom: Bright & Lush
                grad.addColorStop(0, '#ff1f48'); // Bright Ruby tip
                grad.addColorStop(0.6, '#b3001e'); // Rich middle
                grad.addColorStop(1, '#4a000c'); // Dark base shadow
            }
            
            // Fill with shadow/glow disabled for the petal body (crisper look)
            ctx.shadowBlur = 0;
            ctx.fillStyle = grad;
            ctx.fill();
            
            // 3. THE "AESTHETIC" RIM LIGHT (Crucial!)
            // We draw a faint, bright line only on the top edge
            // This separates the layers and makes it look 3D
            ctx.beginPath();
            ctx.moveTo(-size * 0.8, -size * 1.1); // Start near top left
            ctx.quadraticCurveTo(0, -size * 1.45, size * 0.8, -size * 1.1); // Arc over top
            
            ctx.lineWidth = 1.5;
            // Subtle pink highlight
            ctx.strokeStyle = "rgba(255, 180, 200, 0.25)"; 
            ctx.stroke();
            
            ctx.restore();
        },
        
        isComplete: function() {
            return this.scale >= this.maxScale;
        }
    };
    // ============================================
    // HEART BLOOM
    // ============================================
    function HeartBloom(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.hearts = [];
        this.heartPositions = [];
        this.currentHeart = 0;
        
        this.generateHeartPattern();
    }

    HeartBloom.prototype = {
        generateHeartPattern: function() {
            var centerX = this.width / 2 + 300;
            var centerY = this.height / 2 - 50;
            var scale = 8;
            
            for (var angle = 0; angle < Math.PI * 2; angle += 0.15) {
                var t = angle;
                var x = 16 * Math.pow(Math.sin(t), 3);
                var y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
                
                this.heartPositions.push({
                    x: centerX + x * scale,
                    y: centerY + y * scale,
                    size: random(8, 15),
                    color: this.getHeartColor()
                });
            }
            
            for (var i = 0; i < 100; i++) {
                var rx = randomFloat(-12, 12) * scale;
                var ry = randomFloat(-12, 10) * scale;
                
                if (inHeart(rx / scale, ry / scale, 15)) {
                    this.heartPositions.push({
                        x: centerX + rx,
                        y: centerY + ry,
                        size: random(5, 12),
                        color: this.getHeartColor()
                    });
                }
            }
            
            this.heartPositions.sort(function() { return Math.random() - 0.5; });
        },
        
        getHeartColor: function() {
            var colors = [
                '#c41e3a', '#dc3545', '#e74c6f', '#f08080',
                '#ff6b8a', '#ff8fa3', '#ffb3c1', '#ffc2d1',
                '#ff4d6d', '#ff758f'
            ];
            return colors[random(0, colors.length - 1)];
        },
        
        bloom: function(count) {
            count = count || 5;
            for (var i = 0; i < count; i++) {
                if (this.currentHeart < this.heartPositions.length) {
                    var pos = this.heartPositions[this.currentHeart];
                    this.hearts.push({
                        x: pos.x,
                        y: pos.y,
                        targetSize: pos.size,
                        size: 0,
                        color: pos.color,
                        growing: true
                    });
                    this.currentHeart++;
                }
            }
            
            for (var j = 0; j < this.hearts.length; j++) {
                var h = this.hearts[j];
                if (h.growing) {
                    h.size += 1;
                    if (h.size >= h.targetSize) {
                        h.size = h.targetSize;
                        h.growing = false;
                    }
                }
            }
            
            return this.currentHeart < this.heartPositions.length || this.hearts.some(function(h) { return h.growing; });
        },
        
        draw: function() {
            var ctx = this.ctx;
            
            for (var i = 0; i < this.hearts.length; i++) {
                var h = this.hearts[i];
                if (h.size <= 0) continue;
                
                ctx.save();
                ctx.translate(h.x, h.y);
                
                var s = h.size / 15;
                ctx.scale(s, s);
                
                ctx.beginPath();
                ctx.moveTo(0, -8);
                ctx.bezierCurveTo(-10, -18, -20, -8, 0, 10);
                ctx.bezierCurveTo(20, -8, 10, -18, 0, -8);
                ctx.fillStyle = h.color;
                ctx.fill();
                
                ctx.restore();
            }
        },
        
        isComplete: function() {
            return this.currentHeart >= this.heartPositions.length && 
                   !this.hearts.some(function(h) { return h.growing; });
        }
    };

    // ============================================
    // MAIN VALENTINE CLASS
    // ============================================
    function Valentine(canvas) {
        // Accept canvas element directly
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        var seedX = this.width / 2;
        var seedY = this.height - 250;
        var groundY = this.height - 70; // This matches your ground line

        this.seed = new HeartSeed(this.ctx, seedX, seedY, 2, '#c41e3a');
        this.stem = new RoseStem(this.ctx, seedX, groundY); // Stem now starts at ground
        this.rose = null;
        this.heartBloom = new HeartBloom(this.ctx, this.width, this.height);
        
        this.phase = 'waiting';
        this.started = false;
        this.musicStarted = false;
        
        this.backgroundHearts = this.createBackgroundHearts();
        
        // Callback placeholder
        this.onComplete = null;
    }

    Valentine.prototype = {
        createBackgroundHearts: function() {
            var hearts = [];
            for (var i = 0; i < 20; i++) {
                hearts.push({
                    x: random(0, this.width),
                    y: random(0, this.height),
                    size: random(3, 8),
                    opacity: randomFloat(0.03, 0.08),
                    speed: randomFloat(0.1, 0.3)
                });
            }
            return hearts;
        },
        
        updateBackgroundHearts: function() {
            for (var i = 0; i < this.backgroundHearts.length; i++) {
                var h = this.backgroundHearts[i];
                h.y -= h.speed;
                if (h.y < -20) {
                    h.y = this.height + 20;
                    h.x = random(0, this.width);
                }
            }
        },
        
        drawBackground: function() {
            var ctx = this.ctx;
            
            ctx.fillStyle = '#0a0505';
            ctx.fillRect(0, 0, this.width, this.height);
            
            var gradient = ctx.createRadialGradient(
                this.width / 2, this.height / 2, 0,
                this.width / 2, this.height / 2, this.width * 0.7
            );
            gradient.addColorStop(0, 'rgba(30, 10, 15, 0)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Draw background floating hearts
            for (var i = 0; i < this.backgroundHearts.length; i++) {
                var h = this.backgroundHearts[i];
                ctx.save();
                ctx.globalAlpha = h.opacity;
                ctx.translate(h.x, h.y);
                ctx.scale(h.size / 15, h.size / 15);
                
                ctx.beginPath();
                ctx.moveTo(0, -8);
                ctx.bezierCurveTo(-10, -18, -20, -8, 0, 10);
                ctx.bezierCurveTo(20, -8, 10, -18, 0, -8);
                ctx.fillStyle = '#ff6b8a';
                ctx.fill();
                ctx.restore();
            }
        },
        
        drawGround: function() {
            var ctx = this.ctx;
            var y = this.height -70;
            
            ctx.save();
            ctx.strokeStyle = '#3d2020';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.width / 2 - 225, y);
            ctx.lineTo(this.width / 2 + 225, y);
            ctx.stroke();
            ctx.restore();
        },
        
        update: function() {
            this.updateBackgroundHearts();
            
            switch (this.phase) {
                case 'waiting':
                    break;
                    
                case 'shrinking':
                    if (!this.musicStarted) {
                        this.startMusic();
                        this.musicStarted = true;
                    }
                    
                    if (!this.seed.shrink(0.96)) {
                        this.phase = 'growing';
                    }
                    break;
                    
                case 'growing':
                    if (!this.stem.grow()) {
                        var top = this.stem.getTopPoint();
                        this.rose = new RoseBloom(this.ctx, top.x, top.y - 20);
                        this.phase = 'blooming';
                    }
                    break;
                    
                case 'blooming':
                    if (this.rose && !this.rose.bloom()) {
                        this.phase = 'hearts';
                    }
                    break;
                    
                case 'hearts':
                    if (!this.heartBloom.bloom(1)) {
                        this.phase = 'done';
                        if (typeof this.onComplete === 'function') {
                            this.onComplete();
                        }
                    }
                    break;
            }
        },
        
        draw: function() {
            var ctx = this.ctx;
            ctx.clearRect(0, 0, this.width, this.height);
            
            this.drawBackground();
            this.drawGround();
            
            if (this.phase === 'waiting' || this.phase === 'shrinking') {
                this.seed.draw();
            }
            
            if (this.phase !== 'waiting') {
                this.stem.draw();
                
                if (this.rose) {
                    this.rose.draw();
                }
                
                if (this.phase === 'hearts' || this.phase === 'done') {
                    this.heartBloom.draw();
                }
            }
        },
        
        start: function() {
            if (this.phase === 'waiting') {
                this.phase = 'shrinking';
                this.started = true;
            }
        },
        
        startMusic: function() {
            var audio = document.getElementById('bgMusic');
            if (audio) {
                audio.volume = 0.4;
                audio.play().catch(function() {});
            }
        },
        
        checkHover: function(x, y) {
            if (this.phase === 'waiting') {
                return this.seed.hover(x, y);
            }
            return false;
        }
    };

    window.Valentine = Valentine;

})(window);