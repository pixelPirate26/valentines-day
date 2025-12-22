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
            this.progress += amount || 0.006;
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
            ctx.strokeStyle = '#2d5a27';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            
            var steps = Math.floor(this.progress * 50);
            for (var i = 1; i <= steps; i++) {
                var t = i / 50;
                var pt = bezier(path, t);
                ctx.lineTo(pt.x, pt.y);
            }
            ctx.stroke();
            
            // Thorns
            for (var j = 0; j < steps; j += 5) {
                var t = j / 50;
                var pt = bezier(path, t);
                var dir = (j % 10 === 0) ? 1 : -1;
                ctx.beginPath();
                ctx.moveTo(pt.x, pt.y);
                ctx.lineTo(pt.x + dir * 6, pt.y - 4);
                ctx.strokeStyle = '#1a3d17';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            
            ctx.restore();
            
            // Leaves
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
            var size = 25 * progress;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(dir, 1);
            ctx.rotate(-0.3);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(size * 0.5, -size * 0.3, size, -size * 0.2, size, 0);
            ctx.bezierCurveTo(size, size * 0.2, size * 0.5, size * 0.3, 0, 0);
            
            var gradient = ctx.createLinearGradient(0, 0, size, 0);
            gradient.addColorStop(0, '#2d5a27');
            gradient.addColorStop(1, '#4a7c43');
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(size * 0.8, 0);
            ctx.strokeStyle = '#1a3d17';
            ctx.lineWidth = 1;
            ctx.stroke();
            
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
            amount = amount || 0.015;
            
            if (this.scale < this.maxScale) {
                this.scale += amount * 2;
                if (this.scale > this.maxScale) this.scale = this.maxScale;
                return true;
            }
            
            if (this.currentLayer < this.petalLayers) {
                this.layerProgress[this.currentLayer] += amount;
                if (this.layerProgress[this.currentLayer] >= 1) {
                    this.layerProgress[this.currentLayer] = 1;
                    this.currentLayer++;
                }
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
            ctx.scale(this.scale, this.scale);
            
            for (var layer = this.petalLayers - 1; layer >= 0; layer--) {
                var progress = this.layerProgress[layer];
                if (progress <= 0) continue;
                
                var numPetals = this.petalsPerLayer[layer];
                var layerRadius = 15 + layer * 10;
                var petalSize = (20 - layer * 3) * progress;
                var color = this.colors[layer];
                
                for (var i = 0; i < numPetals; i++) {
                    var angle = (Math.PI * 2 * i / numPetals) + layer * 0.2;
                    this.drawPetal(
                        Math.cos(angle) * layerRadius * 0.3 * progress,
                        Math.sin(angle) * layerRadius * 0.3 * progress - 5,
                        petalSize,
                        angle - Math.PI / 2,
                        color
                    );
                }
            }
            
            if (this.scale > 0.5) {
                ctx.beginPath();
                ctx.arc(0, -5, 8, 0, Math.PI * 2);
                ctx.fillStyle = '#8b0000';
                ctx.fill();
            }
            
            ctx.restore();
        },
        
        // Replace the drawPetal function (around line 270)
        drawPetal: function(x, y, size, rotation, color) {
            var ctx = this.ctx;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            
            // Add Magical Glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = color;

            // Create 3D Gradient for depth
            var grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
            grad.addColorStop(0, color);        // Bright center
            grad.addColorStop(0.7, color);      
            grad.addColorStop(1, '#4b0000');    // Dark "3D" edges

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-size * 0.6, -size * 0.4, -size * 0.6, -size, 0, -size * 1.3);
            ctx.bezierCurveTo(size * 0.6, -size, size * 0.6, -size * 0.4, 0, 0);
            ctx.fillStyle = grad;
            ctx.fill();
            
            // Highlight for 3D fold effect
            ctx.beginPath();
            ctx.moveTo(0, -size * 0.1);
            ctx.lineTo(0, -size * 1.1);
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.restore();
        },
        isComplete: function() {
            return this.currentLayer >= this.petalLayers;
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
        
        var seedX = this.width / 2 - 100;
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
            ctx.moveTo(this.width / 2 - 300, y);
            ctx.lineTo(this.width / 2 + 150, y);
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