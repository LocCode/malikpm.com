const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const icon = document.getElementById('theme-icon');
const label = document.getElementById('theme-label');
const skillsSelector = document.getElementById('skills_list');
const skillsButtons = document.querySelectorAll('#skills_sorting_buttons button');
const skillsDefaultHTML = skillsSelector.innerHTML;

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

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    icon.textContent = '☀️';
    label.textContent = 'Light Mode';
}

// Toggle theme
toggleButton.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');

    icon.classList.add('animate');
    icon.textContent = isDark ? '☀️' : '🌙';
    label.textContent = isDark ? 'Light Mode' : 'Dark Mode';

    setTimeout(() => icon.classList.remove('animate'), 400);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Handle skills filter buttons
skillsButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const target = e.target;
        if (!target.classList.contains('active')) {
            // Remove active from all
            skillsButtons.forEach(btn => btn.classList.remove('active'));
            target.classList.add('active');

            const category = target.dataset.skillcategory;
            let skillsListing = '';

            if (category !== 'all') {
                for (const skill of skills[category]) {
                    skillsListing += `<li>${skill.name}</li>`;
                }
            } else {
                skillsListing = skillsDefaultHTML;
            }

            skillsSelector.innerHTML = skillsListing;
        }
    });
});
