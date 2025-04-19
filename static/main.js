// Model-specific configurations
const modelConfigs = {
    "deep-learning": {
        color: "rgba(220, 38, 38, 0.1)", // Blood red
        symbol: `<svg class="w-64 h-64" viewBox="0 0 100 100" fill="none">
            <!-- Neural Network Layers -->
            <g fill="rgba(220, 38, 38, 0.8)">
                <!-- Input Layer -->
                <circle cx="20" cy="20" r="4"/>
                <circle cx="20" cy="40" r="4"/>
                <circle cx="20" cy="60" r="4"/>
                <circle cx="20" cy="80" r="4"/>
                
                <!-- Hidden Layer 1 -->
                <circle cx="40" cy="30" r="4"/>
                <circle cx="40" cy="50" r="4"/>
                <circle cx="40" cy="70" r="4"/>
                
                <!-- Hidden Layer 2 -->
                <circle cx="60" cy="40" r="4"/>
                <circle cx="60" cy="60" r="4"/>
                
                <!-- Output Layer -->
                <circle cx="80" cy="50" r="4"/>
                
                <!-- Connections -->
                <path d="M20,20 L40,30 L40,50 L40,70" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
                <path d="M20,40 L40,30 L40,50 L40,70" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
                <path d="M20,60 L40,30 L40,50 L40,70" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
                <path d="M20,80 L40,30 L40,50 L40,70" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
                <path d="M40,30 L60,40 L60,60" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
                <path d="M40,50 L60,40 L60,60" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
                <path d="M40,70 L60,40 L60,60" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
                <path d="M60,40 L80,50" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
                <path d="M60,60 L80,50" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
            </g>
        </svg>`,
        name: "Deep Learning"
    },
    "svm": {
        color: "rgba(16, 185, 129, 0.1)", // Green
        symbol: `<svg class="w-64 h-64" viewBox="0 0 100 100" fill="none">
            <!-- SVM Hyperplane and Support Vectors -->
            <g fill="rgba(16, 185, 129, 0.8)">
                <!-- Hyperplane -->
                <line x1="20" y1="80" x2="80" y2="20" stroke="rgba(16, 185, 129, 0.8)" stroke-width="2"/>
                <!-- Margin Lines -->
                <line x1="15" y1="85" x2="75" y2="25" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1" stroke-dasharray="2"/>
                <line x1="25" y1="75" x2="85" y2="15" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1" stroke-dasharray="2"/>
                <!-- Class 1 Points -->
                <circle cx="30" cy="30" r="3"/>
                <circle cx="40" cy="35" r="3"/>
                <circle cx="35" cy="40" r="3"/>
                <!-- Class 2 Points -->
                <circle cx="60" cy="60" r="3"/>
                <circle cx="65" cy="65" r="3"/>
                <circle cx="70" cy="70" r="3"/>
                <!-- Support Vectors -->
                <circle cx="45" cy="45" r="4" stroke="rgba(16, 185, 129, 0.8)" stroke-width="2" fill="none"/>
                <circle cx="55" cy="55" r="4" stroke="rgba(16, 185, 129, 0.8)" stroke-width="2" fill="none"/>
            </g>
        </svg>`,
        name: "Support Vector Machine"
    },
    "random-forest": {
        color: "rgba(245, 158, 11, 0.1)", // Orange
        symbol: `<svg class="w-64 h-64" viewBox="0 0 100 100" fill="none">
            <!-- Random Forest Multiple Decision Trees -->
            <g fill="rgba(245, 158, 11, 0.8)">
                <!-- Tree 1 -->
                <path d="M20,80 L20,60 L10,50 M20,60 L30,50" stroke="rgba(245, 158, 11, 0.8)" stroke-width="2"/>
                <circle cx="10" cy="50" r="3"/>
                <circle cx="30" cy="50" r="3"/>
                <!-- Tree 2 -->
                <path d="M50,80 L50,50 L40,40 M50,50 L60,40" stroke="rgba(245, 158, 11, 0.8)" stroke-width="2"/>
                <circle cx="40" cy="40" r="3"/>
                <circle cx="60" cy="40" r="3"/>
                <!-- Tree 3 -->
                <path d="M80,80 L80,60 L70,50 M80,60 L90,50" stroke="rgba(245, 158, 11, 0.8)" stroke-width="2"/>
                <circle cx="70" cy="50" r="3"/>
                <circle cx="90" cy="50" r="3"/>
                <!-- Tree Tops -->
                <path d="M10,20 Q20,10 30,20 Q20,30 10,20" fill="rgba(245, 158, 11, 0.8)"/>
                <path d="M40,10 Q50,0 60,10 Q50,20 40,10" fill="rgba(245, 158, 11, 0.8)"/>
                <path d="M70,20 Q80,10 90,20 Q80,30 70,20" fill="rgba(245, 158, 11, 0.8)"/>
            </g>
        </svg>`,
        name: "Random Forest"
    },
    "knn": {
        color: "rgba(168, 85, 247, 0.1)", // Purple
        symbol: `<svg class="w-64 h-64" viewBox="0 0 100 100" fill="none">
            <!-- K-Nearest Neighbors Visualization -->
            <g fill="rgba(168, 85, 247, 0.8)">
                <!-- Target Point -->
                <circle cx="50" cy="50" r="4" stroke="rgba(168, 85, 247, 0.8)" stroke-width="2" fill="white"/>
                <!-- Distance Circles -->
                <circle cx="50" cy="50" r="20" stroke="rgba(168, 85, 247, 0.2)" stroke-width="1" fill="none"/>
                <circle cx="50" cy="50" r="30" stroke="rgba(168, 85, 247, 0.1)" stroke-width="1" fill="none"/>
                <!-- Nearest Points -->
                <circle cx="45" cy="40" r="3"/>
                <circle cx="60" cy="45" r="3"/>
                <circle cx="40" cy="55" r="3"/>
                <!-- Connection Lines -->
                <line x1="50" y1="50" x2="45" y2="40" stroke="rgba(168, 85, 247, 0.5)" stroke-width="1"/>
                <line x1="50" y1="50" x2="60" y2="45" stroke="rgba(168, 85, 247, 0.5)" stroke-width="1"/>
                <line x1="50" y1="50" x2="40" y2="55" stroke="rgba(168, 85, 247, 0.5)" stroke-width="1"/>
                <!-- Other Points -->
                <circle cx="20" cy="20" r="2"/>
                <circle cx="80" cy="80" r="2"/>
                <circle cx="75" cy="25" r="2"/>
                <circle cx="30" cy="70" r="2"/>
            </g>
        </svg>`,
        name: "K-Nearest Neighbors"
    }
};

// Create background overlay
const overlay = document.createElement('div');
overlay.className = 'fixed inset-0 transition-all duration-700 pointer-events-none z-0';
document.body.appendChild(overlay);

// Create symbol container
const symbolContainer = document.createElement('div');
symbolContainer.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 opacity-0 pointer-events-none z-10';
document.body.appendChild(symbolContainer);

// Animation for recommendation text
function showRecommendation(text) {
    const output = document.getElementById("recommendation-output");
    const model = event.currentTarget.getAttribute('data-model');
    const config = modelConfigs[model];
    
    // Add fade out effect
    output.style.opacity = '0';
    output.style.transform = 'translateY(10px)';
    
    // Remove active class from all cards
    document.querySelectorAll('.model-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to clicked card with ripple effect
    event.currentTarget.classList.add('active');
    createRippleEffect(event);

    // Change background color
    overlay.style.backgroundColor = config.color;
    overlay.style.opacity = '1';

    // Show model symbol
    symbolContainer.innerHTML = config.symbol;
    symbolContainer.style.opacity = '0.2';
    
    // Add floating animation to symbol
    symbolContainer.style.animation = 'float 3s ease-in-out infinite';

    // Update text with fade in effect after a small delay
    setTimeout(() => {
        output.innerHTML = `
            <div class="animate-fade-in">
                <h3 class="text-lg font-medium mb-2">${text}</h3>
                <p class="text-gray-400 text-sm">Based on your preferences and selected model</p>
            </div>
        `;
        output.style.opacity = '1';
        output.style.transform = 'translateY(0)';
    }, 300);
}

// Ripple effect on card click
function createRippleEffect(event) {
    const card = event.currentTarget;
    const ripple = document.createElement('div');
    
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'ripple';
    
    card.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 1000);
}

// Hover effect for model cards
document.querySelectorAll('.model-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Add loading animation to Get Recommendations button
document.querySelector('.btn-primary').addEventListener('click', function() {
    const button = this;
    const originalText = button.textContent;
    
    button.disabled = true;
    button.innerHTML = '<span class="loading-dots">Getting Recommendations</span>';
    
    // Simulate loading (replace with actual API call)
    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
    }, 1500);
});

// Initialize mood select with custom styling
document.addEventListener('DOMContentLoaded', () => {
    const select = document.querySelector('select');
    
    select.addEventListener('change', () => {
        if (select.value) {
            select.classList.add('selected');
        } else {
            select.classList.remove('selected');
        }
    });
});

// Add this CSS to your stylesheet
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 1s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .loading-dots::after {
        content: '...';
        animation: loading-dots 1.5s infinite;
    }

    @keyframes loading-dots {
        0% { content: '.'; }
        33% { content: '..'; }
        66% { content: '...'; }
    }

    .animate-fade-in {
        animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .model-card {
        transition: transform 0.3s ease-out;
    }

    select.selected {
        border-color: var(--button-primary);
    }
`;
document.head.appendChild(style);

// Add new CSS for floating animation
const newStyles = `
    @keyframes float {
        0% {
            transform: translate(-50%, -50%);
        }
        50% {
            transform: translate(-50%, -60%);
        }
        100% {
            transform: translate(-50%, -50%);
        }
    }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = newStyles;
document.head.appendChild(styleSheet);
