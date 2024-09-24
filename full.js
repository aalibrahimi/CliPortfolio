// Register the TextPlugin for GSAP
gsap.registerPlugin(TextPlugin);

// Initialize ScrollMagic
var controller = new ScrollMagic.Controller();

const bootText = [
    "BIOS Version 1.0.2424",
    "Copyright (C) 2024, Ali Alibrahimi",
    "CPU: AliTech 686 at 66 MHz",
    "Memory Test: 640K OK",
    "Hard Disk: 80 MB",
    "Loading portfolio.sys...",
    "Welcome to Ali's Portfolio OS"
];

function typeWriter(text, i, fnCallback) {
    if (i < text.length) {
        document.getElementById("boot-text").innerHTML += text.charAt(i);
        i++;
        setTimeout(function() {
            typeWriter(text, i, fnCallback)
        }, 25);
    } else if (typeof fnCallback == 'function') {
        setTimeout(fnCallback, 700);
    }
}

function startBootSequence(i) {
    if (i < bootText.length) {
        typeWriter(bootText[i] + "\n", 0, function() {
            setTimeout(() => startBootSequence(i + 1), 300);
        });
    } else {
        console.log('Boot sequence completed');
        setTimeout(function() {
            const bootSequence = document.getElementById("boot-sequence");
            bootSequence.style.opacity = '0';
            bootSequence.style.transition = 'opacity 1s ease-out';
            setTimeout(() => {
                bootSequence.style.display = 'none';
                document.body.classList.add("loaded");
                revealMainContent();
            }, 1000);
        }, 1000);
    }
}

function revealMainContent() {
    console.log('Revealing main content started');
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        console.log('Main content found');
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = '1';
    } else {
        console.error('Main content not found');
    }

    initScrollMagic();
    cli.init();
    createSkillBars();
}

function createSectionScene(section) {
    var tl = gsap.timeline();
    
    tl.to(section, {duration: 0.3, opacity: 1, y: 0});
    
    section.querySelectorAll('.typing-text').forEach(function(element) {
        var originalText = element.textContent.trim();
        if (originalText.length > 0) {
            element.setAttribute('data-original-text', originalText);
            element.textContent = '';
            tl.to(element, {
                duration: 0.8,
                text: originalText, 
                ease: "none"
            }, "-=0.3");
        }
    });

    new ScrollMagic.Scene({
        triggerElement: section,
        triggerHook: 0.8,
        reverse: false
    })
    .setTween(tl)
    .addTo(controller);
}

function initScrollMagic() {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    var sections = document.querySelectorAll('section');
    sections.forEach(function(section) {
        gsap.set(section, {opacity: 0, y: 30});
        createSectionScene(section);
    });
}

// Command-line Interface
const cli = {
    output: document.getElementById('cli-output'),
    input: document.getElementById('cli-input'),
    commands: {
        help: () => `Available commands:
  help - Show this help message
  about - About Ali Alibrahimi
  skills - List skills
  projects - List projects
  contact - Show contact information
  clear - Clear the console`,
        about: () => `Ali Alibrahimi
Full-Stack Developer | Problem Solver | Code Enthusiast`,
        skills: () => `Skills:
- JavaScript: Expert
- Python: Proficient
- React: Advanced
- Node.js: Advanced
- CSS/SASS: Expert
- HTML5: Expert
- SQL: Proficient
- Git: Advanced
- WebGL: Intermediate
- Three.js: Intermediate`,
        projects: () => `Projects:
1. E-commerce Platform
2. Data Visualization Dashboard
3. RESTful API
4. Machine Learning Model`,
        contact: () => `Contact Information:
Email: aalibrahimi@example.com
LinkedIn: linkedin.com/in/alialibrahimi
GitHub: github.com/alialibrahimi`,
        clear: () => {
            cli.output.innerHTML = '';
            return '';
        }
    },
    execute(command) {
        const cmd = command.toLowerCase().trim();
        return this.commands.hasOwnProperty(cmd) 
            ? this.commands[cmd]() 
            : `Command not found: ${command}. Type 'help' for available commands.`;
    },
    init() {
        if (this.input) {
            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const command = this.input.value;
                    this.output.innerHTML += `\n> ${command}\n${this.execute(command)}\n`;
                    this.input.value = '';
                    this.output.scrollTop = this.output.scrollHeight;
                }
            });
            this.output.innerHTML = 'Welcome to Ali Alibrahimi\'s portfolio. Type \'help\' for available commands.\n';
        } else {
            console.error('CLI input element not found');
        }
    }
};

function createSkillBars() {
    const skills = [
      { name: 'JavaScript', level: 90 },
      { name: 'React', level: 85 },
      { name: 'Node.js', level: 80 },
      { name: 'Python', level: 75 },
      { name: 'SQL', level: 70 },
      { name: 'Git', level: 85 }
    ];
  
    const skillsContainer = document.getElementById('skills-container');
    
    skills.forEach(skill => {
      const skillBar = document.createElement('div');
      skillBar.className = 'skill-bar';
      skillBar.innerHTML = `
        <div class="skill-name">${skill.name}</div>
        <div class="skill-level" style="width: 0%"></div>
      `;
      skillsContainer.appendChild(skillBar);
  
      setTimeout(() => {
        skillBar.querySelector('.skill-level').style.width = `${skill.level}%`;
      }, 100);
    });
}

function initializePortfolio() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(result => {
                if (result.ok) {
                    formStatus.textContent = 'Message sent successfully!';
                    form.reset();
                } else {
                    formStatus.textContent = 'Failed to send message. Please try again.';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                formStatus.textContent = 'An error occurred. Please try again later.';
            });
        });
    }
}

// Single DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    startBootSequence(0);
    initializePortfolio();
});

console.log('ScrollMagic script loaded and running');