class ThemeToggler {
    constructor(buttonId, iconId, labelId) {
        this.toggleButton = document.getElementById(buttonId);
        this.body = document.body;
        this.icon = document.getElementById(iconId);
        this.label = document.getElementById(labelId);
        
        this.init();
    }
    
    init() {
        this.loadSavedTheme();
        this.attachEventListener();
    }
    
    loadSavedTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            this.body.classList.add('dark-mode');
            this.icon.textContent = '☀️';
            this.label.textContent = 'Light Mode';
        }
    }
    
    attachEventListener() {
        this.toggleButton.addEventListener('click', () => this.toggle());
    }
    
    toggle() {
        const isDark = this.body.classList.toggle('dark-mode');
        
        this.icon.classList.add('animate');
        this.icon.textContent = isDark ? '☀️' : '🌙';
        this.label.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        
        setTimeout(() => this.icon.classList.remove('animate'), 400);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
}

class SkillsFilter {
    constructor(selectorId, buttonsSelector, skillsData) {
        this.skillsSelector = document.getElementById(selectorId);
        this.skillsButtons = document.querySelectorAll(buttonsSelector);
        this.skillsDefaultHTML = this.skillsSelector.innerHTML;
        this.skills = skillsData;
        this.draggedElement = null;
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.enableDragAndDrop();
        this.setupContainerListeners();
    }
    
    attachEventListeners() {
        this.skillsButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilterClick(e));
        });
    }
    
    handleFilterClick(e) {
        const target = e.target;
        
        if (!target.classList.contains('active')) {
            this.skillsButtons.forEach(btn => btn.classList.remove('active'));
            target.classList.add('active');
            
            const category = target.dataset.skillcategory;
            this.updateSkillsDisplay(category);
        }
    }
    
    updateSkillsDisplay(category) {
        let skillsListing = '';
        
        if (category !== 'all') {
            for (const skill of this.skills[category]) {
                skillsListing += `<li draggable="true">${skill.name}</li>`;
            }
        } else {
            skillsListing = this.skillsDefaultHTML;
        }
        
        this.skillsSelector.innerHTML = skillsListing;
        this.enableDragAndDrop();
    }
    
    setupContainerListeners() {
        this.skillsSelector.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        this.skillsSelector.addEventListener('drop', (e) => {
            e.preventDefault();
        });
    }
    
    enableDragAndDrop() {
        const listItems = this.skillsSelector.querySelectorAll('li');
        
        listItems.forEach(item => {
            item.setAttribute('draggable', 'true');
            
            // Mouse events
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragover', (e) => this.handleDragOver(e));
            item.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            item.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            item.addEventListener('drop', (e) => this.handleDrop(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            // Touch events for mobile
            item.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
            item.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            item.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        });
    }
    
    // Desktop drag handlers
    handleDragStart(e) {
        this.draggedElement = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.innerHTML);
        
        setTimeout(() => {
            e.target.style.opacity = '0.5';
        }, 0);
    }
    
    handleDragEnter(e) {
        e.preventDefault();
        const target = e.target;
        if (target.tagName === 'LI' && target !== this.draggedElement) {
            target.style.backgroundColor = 'var(--underline-color)';
            target.style.opacity = '0.6';
        }
    }
    
    handleDragLeave(e) {
        const target = e.target;
        if (target.tagName === 'LI' && target !== this.draggedElement) {
            target.style.backgroundColor = '';
            target.style.opacity = '';
        }
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const target = e.target;
        
        if (target.tagName === 'LI' && target !== this.draggedElement) {
            const rect = target.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            
            const allItems = this.skillsSelector.querySelectorAll('li');
            allItems.forEach(item => {
                if (item !== this.draggedElement && item !== target) {
                    item.style.borderTop = '';
                    item.style.borderBottom = '';
                }
            });
            
            if (e.clientY < midpoint) {
                target.style.borderTop = '3px solid var(--underline-color)';
                target.style.borderBottom = '';
            } else {
                target.style.borderBottom = '3px solid var(--underline-color)';
                target.style.borderTop = '';
            }
        }
        
        return false;
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.target;
        
        if (this.draggedElement && target.tagName === 'LI' && target !== this.draggedElement) {
            const rect = target.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            
            // Actually move the element in the DOM
            if (e.clientY < midpoint) {
                this.skillsSelector.insertBefore(this.draggedElement, target);
            } else {
                if (target.nextSibling) {
                    this.skillsSelector.insertBefore(this.draggedElement, target.nextSibling);
                } else {
                    this.skillsSelector.appendChild(this.draggedElement);
                }
            }
        }
        
        this.resetStyles();
        
        return false;
    }
    
    handleDragEnd(e) {
        this.resetStyles();
        this.draggedElement = null;
    }
    
    resetStyles() {
        const allItems = this.skillsSelector.querySelectorAll('li');
        allItems.forEach(item => {
            item.style.opacity = '1';
            item.style.backgroundColor = '';
            item.style.borderTop = '';
            item.style.borderBottom = '';
        });
    }
    
    // Touch event handlers for mobile
    handleTouchStart(e) {
        if (e.touches.length > 1) return;
        
        this.draggedElement = e.target;
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        
        setTimeout(() => {
            this.draggedElement.style.opacity = '0.5';
            this.draggedElement.style.transform = 'scale(1.05)';
            this.draggedElement.style.zIndex = '1000';
            this.draggedElement.style.position = 'relative';
            this.draggedElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }, 50);
    }
    
    handleTouchMove(e) {
        if (!this.draggedElement || e.touches.length > 1) return;
        
        e.preventDefault();
        
        const touch = e.touches[0];
        const offsetY = touch.clientY - this.touchStartY;
        
        this.draggedElement.style.transform = `translateY(${offsetY}px) scale(1.05)`;
        
        // Find element under touch
        this.draggedElement.style.pointerEvents = 'none';
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        this.draggedElement.style.pointerEvents = 'auto';
        
        // Reset all highlights
        const allItems = this.skillsSelector.querySelectorAll('li');
        allItems.forEach(item => {
            if (item !== this.draggedElement) {
                item.style.backgroundColor = '';
                item.style.opacity = '';
                item.style.borderTop = '';
                item.style.borderBottom = '';
            }
        });
        
        if (elementBelow && elementBelow.tagName === 'LI' && elementBelow !== this.draggedElement) {
            const rect = elementBelow.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            
            if (touch.clientY < midpoint) {
                elementBelow.style.borderTop = '3px solid var(--underline-color)';
                elementBelow.style.backgroundColor = 'var(--underline-color)';
                elementBelow.style.opacity = '0.3';
            } else {
                elementBelow.style.borderBottom = '3px solid var(--underline-color)';
                elementBelow.style.backgroundColor = 'var(--underline-color)';
                elementBelow.style.opacity = '0.3';
            }
        }
    }
    
    handleTouchEnd(e) {
        if (!this.draggedElement) return;
        
        const touch = e.changedTouches[0];
        
        // Find drop target
        this.draggedElement.style.pointerEvents = 'none';
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        this.draggedElement.style.pointerEvents = 'auto';
        
        if (elementBelow && elementBelow.tagName === 'LI' && elementBelow !== this.draggedElement) {
            const rect = elementBelow.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            
            // Actually move the element in the DOM
            if (touch.clientY < midpoint) {
                this.skillsSelector.insertBefore(this.draggedElement, elementBelow);
            } else {
                if (elementBelow.nextSibling) {
                    this.skillsSelector.insertBefore(this.draggedElement, elementBelow.nextSibling);
                } else {
                    this.skillsSelector.appendChild(this.draggedElement);
                }
            }
        }
        
        // Reset all styles
        this.draggedElement.style.opacity = '1';
        this.draggedElement.style.transform = '';
        this.draggedElement.style.zIndex = '';
        this.draggedElement.style.position = '';
        this.draggedElement.style.boxShadow = '';
        
        const allItems = this.skillsSelector.querySelectorAll('li');
        allItems.forEach(item => {
            item.style.backgroundColor = '';
            item.style.opacity = '';
            item.style.borderTop = '';
            item.style.borderBottom = '';
        });
        
        this.draggedElement = null;
    }
}

// Skills data
const skills = {
    pm: [
        { name: "Agile" },
        { name: "Kanban" },
        { name: "Scrum" },
        { name: "Stakeholder management" },
        { name: "Budgeting" },
        { name: "Resource planning" }
    ],
    tech: [
        { name: "JavaScript" },
        { name: "SQL" },
        { name: "Lua" },
        { name: "API integrations" },
        { name: "JQL" }
    ],
    tools: [
        { name: "Jira" },
        { name: "Confluence" },
        { name: "Asana" },
        { name: "Trello" },
        { name: "Power BI" },
        { name: "Power Automate" },
        { name: "Microsoft 365" },
        { name: "Git" },
        { name: "Postman" },
        { name: "Figma" },
        { name: "Miro" },
        { name: "ChatGPT" },
        { name: "Claude" },
        { name: "Lovable" },
        { name: "N8N" },
        { name: "Make.com" },
        { name: "WordPress" }
    ]
};

// Initialize
new ThemeToggler('theme-toggle', 'theme-icon', 'theme-label');
new SkillsFilter('skills_list', '#skills_sorting_buttons button', skills);
