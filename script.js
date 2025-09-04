document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Nav Toggle --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const sidebarContainer = document.getElementById('sidebar-container');

    if (mobileNavToggle && sidebarContainer) {
        const toggleSidebar = () => {
            const isOpen = sidebarContainer.classList.toggle('open');
            mobileNavToggle.setAttribute('aria-expanded', isOpen);

            // Stagger animation for nav links on mobile
            if (isOpen) {
                const navLinks = sidebarContainer.querySelectorAll('.nav-links li');
                navLinks.forEach((link, index) => {
                    link.style.animationDelay = `${index * 50}ms`;
                });
            }
            const icon = mobileNavToggle.querySelector('i');
            if (isOpen) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        };

        mobileNavToggle.addEventListener('click', toggleSidebar);

        sidebarContainer.addEventListener('click', (e) => {
            if (e.target === sidebarContainer) {
                toggleSidebar();
            }
        });

        // Since sidebar content is loaded dynamically, we need to add listeners after it's loaded.
        // The best place is inside the function that initializes the theme toggler, which runs after fetch.
    }

    // --- Scrollbar Highlight on Scroll ---
    const mainContent = document.querySelector('.main-content');
    let scrollTimer;

    mainContent.addEventListener('scroll', () => {
        mainContent.classList.add('scrolling');
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            mainContent.classList.remove('scrolling');
        }, 250); // Hide highlight after 250ms of no scrolling
    });

    // --- 1. Load Sidebar and Initialize Theme Toggler --- //
    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
            initializeThemeToggler();
        })
        .catch(error => console.error('Error loading sidebar.html:', error));

    function initializeThemeToggler() {
        // This function runs after the sidebar has been loaded.
        // It's a good place to add listeners to elements inside the sidebar.

        // Add listener to close sidebar when a nav link is clicked
        const navLinks = sidebarContainer.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (sidebarContainer.classList.contains('open')) {
                    sidebarContainer.classList.remove('open');
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    // Reset icon
                    const icon = mobileNavToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.classList.toggle('light-mode');
                const icon = themeToggle.querySelector('i');
                if (document.body.classList.contains('light-mode')) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            });
        }
    }

    // --- 2. Hero Section Animations & Interactive Background --- //
    const interactiveBg = document.querySelector('.interactive-bg');
    if (interactiveBg) {
        window.addEventListener('mousemove', (e) => {
            interactiveBg.style.setProperty('--x', e.clientX + 'px');
            interactiveBg.style.setProperty('--y', e.clientY + 'px');
        });
    }

    const heroAnimation = document.querySelector('.hero-animation');
    const animatedCircle = document.querySelector('.animated-circle');
    if (heroAnimation && animatedCircle) {
        const colors = ['#34d399', '#60a5fa', '#f472b6'];
        const numCircles = 3;
        for (let i = 0; i < numCircles; i++) {
            const dot = document.createElement('div');
            dot.classList.add('floating-dot');
            heroAnimation.appendChild(dot);
            dot.style.backgroundColor = colors[i % colors.length];
            const angle = (2 * Math.PI / numCircles) * i;
            const radius = 170;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            dot.style.setProperty('--x', `${x}px`);
            dot.style.setProperty('--y', `${y}px`);
            const duration = 10 + Math.random() * 10;
            dot.style.animation = `float ${duration}s infinite alternate ease-in-out`;
        }
        animatedCircle.style.animation = 'pulse 5s infinite ease-in-out';
    }

    const animatedElements = [
        document.querySelector('.availability'),
        document.querySelector('h1'),
        document.querySelector('h2'),
        document.querySelector('.description'),
        document.querySelector('.cta-buttons'),
        document.querySelector('.social-links')
    ].filter(Boolean);

    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 500 + index * 200);
    });

    const jobTitleElement = document.querySelector('.hero-text h2');
    if (jobTitleElement) {
        const jobTitles = ['Full-stack Software Engineer', 'Graphic Designer'];
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentTitle = jobTitles[titleIndex];
            const text = isDeleting ? currentTitle.substring(0, charIndex--) : currentTitle.substring(0, charIndex++);

            jobTitleElement.innerHTML = `<span>${text}</span><span class="caret"></span>`;

            if (!isDeleting && charIndex === currentTitle.length + 1) {
                isDeleting = true;
                setTimeout(typeEffect, 2000); // Pause at the end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % jobTitles.length;
                setTimeout(typeEffect, 500); // Pause before typing new title
            } else {
                const typingSpeed = isDeleting ? 50 : 100;
                setTimeout(typeEffect, typingSpeed);
            }
        }
        setTimeout(typeEffect, 2000);
    }

    // --- 3. Dynamic Section Loading & Logic --- //

    const sectionsToLoad = [
        { containerId: 'about-container', htmlFile: 'about.html', cssFile: 'about.css', init: initAboutSection },
        { containerId: 'education-container', htmlFile: 'education.html', cssFile: 'education.css', init: initEducationSection },
        { containerId: 'experience-container', htmlFile: 'experience.html', cssFile: 'experience.css' },
        { containerId: 'skills-container', htmlFile: 'skills.html', cssFile: 'skills.css', init: initSkillsSection },
        { containerId: 'services-container', htmlFile: 'services.html', cssFile: 'services.css' },
        { containerId: 'projects-container', htmlFile: 'projects.html', cssFile: 'projects.css', init: initProjectsSection },
        { containerId: 'contact-container', htmlFile: 'contact.html', cssFile: 'contact.css', init: initContactSection },
        { containerId: 'location-container', htmlFile: 'location.html', cssFile: 'location.css', init: initLocationSection }
    ];

    function loadCSS(file) {
        if (!document.querySelector(`link[href="${file}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = file;
            document.head.appendChild(link);
        }
    }

    function loadSection(sectionConfig) {
        const container = document.getElementById(sectionConfig.containerId);
        if (!container) return;

        loadCSS(sectionConfig.cssFile);

        fetch(sectionConfig.htmlFile)
            .then(response => response.text())
            .then(data => {
                container.innerHTML = data;
                const sectionElement = container.querySelector('.section');
                if (sectionElement) {
                    const observer = new IntersectionObserver(entries => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('visible');
                                observer.unobserve(entry.target);
                                if (sectionConfig.init) {
                                    sectionConfig.init(sectionElement);
                                }
                            }
                        });
                    }, { threshold: 0.1 });
                    observer.observe(sectionElement);
                }
            }).catch(error => console.error(`Error loading ${sectionConfig.htmlFile}:`, error));
    }

    function initAboutSection(sectionElement) {
        // --- Floating dots animation for profile picture ---
        const aboutCircle = sectionElement.querySelector('.about-animated-circle');
        if (aboutCircle && aboutCircle.children.length <= 1) {
            const colors = ['#34d399', '#60a5fa', '#f472b6'];
            const numDots = 3;
            const radius = 175;
            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('div');
                dot.classList.add('about-floating-dot');
                aboutCircle.appendChild(dot);
                dot.style.backgroundColor = colors[i % colors.length];
                const angle = (2 * Math.PI / numDots) * i;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                dot.style.setProperty('--x', `${x}px`);
                dot.style.setProperty('--y', `${y}px`);
                const duration = 10 + Math.random() * 10;
                dot.style.animation = `float ${duration}s infinite alternate ease-in-out`;
            }
        }

        // --- Re-triggering stat counting animation ---
        const statsContainer = sectionElement.querySelector('.about-stats');
        if (statsContainer) {
            const statNumbers = statsContainer.querySelectorAll('h4[data-target]');

            const statObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        statNumbers.forEach(num => {
                            const target = +num.getAttribute('data-target');
                            let current = 0;
                            const duration = 1500; // Animation duration in ms
                            const stepTime = 15; // Update interval
                            const totalSteps = duration / stepTime;
                            const increment = target / totalSteps;

                            const updateCount = () => {
                                current += increment;
                                if (current < target) {
                                    num.innerText = Math.ceil(current) + '+';
                                    setTimeout(updateCount, stepTime);
                                } else {
                                    num.innerText = target + '+';
                                }
                            };
                            updateCount();
                        });
                    } else {
                        // Reset numbers when out of view
                        statNumbers.forEach(num => {
                            num.innerText = '0+';
                        });
                    }
                });
            }, { threshold: 0.5 });

            statObserver.observe(statsContainer);
        }
    }

    function initEducationSection(sectionElement) {
        // --- Tab Switcher Logic ---
        const switcherBtns = sectionElement.querySelectorAll('.switcher-btn');
        const contentPanels = sectionElement.querySelectorAll('.content-panel');
        switcherBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                switcherBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const contentId = btn.getAttribute('data-content');
                contentPanels.forEach(panel => {
                    panel.classList.toggle('active', panel.id === contentId);
                });
            });
        });

        // --- Dynamic Certificate Generation & "See More" Logic ---
        const certificatesGrid = sectionElement.querySelector('.certificates-grid');
        const seeMoreBtn = sectionElement.querySelector('#see-more-certs');
        const certsToShow = 3;

        if (certificatesGrid && typeof certificateData !== 'undefined' && seeMoreBtn) {
            certificatesGrid.innerHTML = ''; // Clear existing certificates
            const certificateIds = Object.keys(certificateData);

            certificateIds.forEach((certId, index) => {
                const cert = certificateData[certId];
                const certItem = document.createElement('div');
                certItem.className = 'certificate-item';
                certItem.setAttribute('data-certificate-id', certId);

                // Add 'hidden' class to certificates beyond the initial view
                if (index >= certsToShow) {
                    certItem.classList.add('hidden');
                }

                certItem.innerHTML = `
                    <div class="certificate-card">
                        <img src="${cert.img}" alt="${cert.title}">
                        <div class="certificate-overlay">
                            <button class="btn-quick-view">Quick View</button>
                        </div>
                    </div>
                    <div class="certificate-info">
                        <h4>${cert.title}</h4>
                        <p>${cert.issuer}</p>
                    </div>
                `;
                certificatesGrid.appendChild(certItem);
            });

            // Hide the 'See More' button if there are not enough certificates
            if (certificateIds.length <= certsToShow) {
                seeMoreBtn.style.display = 'none';
            } else {
                seeMoreBtn.style.display = 'inline-block';
            }

            let allVisible = false;
            seeMoreBtn.addEventListener('click', () => {
                allVisible = !allVisible;
                const certificateItems = certificatesGrid.querySelectorAll('.certificate-item');
                certificateItems.forEach((item, index) => {
                    if (index >= certsToShow) {
                        item.classList.toggle('hidden', !allVisible);
                    }
                });
                seeMoreBtn.innerHTML = allVisible ? 'See Less <i class="fas fa-chevron-up"></i>' : 'See More <i class="fas fa-chevron-down"></i>';
                seeMoreBtn.classList.toggle('less', allVisible);
            });
        }

        // --- Certificate Modal Logic ---
        // Re-query for buttons after they are dynamically created
        const quickViewBtns = sectionElement.querySelectorAll('#certificates .btn-quick-view');
        const modalContainer = document.getElementById('certificate-modal');
        const modalBody = modalContainer.querySelector('.modal-body');
        const closeModalBtn = modalContainer.querySelector('.modal-close');

        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const certificateId = btn.closest('.certificate-item').dataset.certificateId;
                const data = certificateData[certificateId];

                if (data) {
                    modalBody.innerHTML = `
                        <img src="${data.img}" alt="${data.title}" class="project-image-large">
                        <h2>${data.title}</h2>
                        <p>Issued by: <strong>${data.issuer}</strong></p>
                        <div class="certificate-links">
                            <a href="${data.downloadLink}" class="btn btn-primary" download="${data.title.replace(/ /g, '_')}-Certificate">
                                <i class="fas fa-download"></i> Download Certificate
                            </a>
                        </div>
                    `;
                    modalContainer.classList.add('visible');
                }
            });
        });

        closeModalBtn.addEventListener('click', () => {
            modalContainer.classList.remove('visible');
        });

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.classList.remove('visible');
            }
        });
    }

    function initSkillsSection(sectionElement) {
        const primarySwitcherBtns = sectionElement.querySelectorAll('.primary-switcher .switcher-btn');
        const secondaryFilterContainer = sectionElement.querySelector('.secondary-filter');
        const filterBtns = sectionElement.querySelectorAll('.filter-btn');
        const skillCards = sectionElement.querySelectorAll('.skill-card');

        let activeCategory = 'development';
        let activeSubCategory = 'all';

        function filterSkills() {
            skillCards.forEach(card => {
                const cardCategory = card.dataset.category;
                const cardSubCategory = card.dataset.subcategory;

                const categoryMatch = cardCategory === activeCategory;
                const subCategoryMatch = activeSubCategory === 'all' || cardSubCategory === activeSubCategory;

                const shouldBeVisible = categoryMatch && subCategoryMatch;
                const isVisible = card.classList.contains('visible');

                if (shouldBeVisible && !isVisible) {
                    card.classList.remove('hiding');
                    card.classList.add('visible');
                } else if (!shouldBeVisible && isVisible) {
                    card.classList.add('hiding');
                    card.addEventListener('animationend', () => {
                        card.classList.remove('visible');
                        card.classList.remove('hiding');
                    }, { once: true });
                }
            });
        }

        primarySwitcherBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                primarySwitcherBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = btn.dataset.category;
                
                // For now, we only have sub-filters for 'development'
                if (activeCategory === 'development') {
                    secondaryFilterContainer.classList.add('visible');
                } else {
                    secondaryFilterContainer.classList.remove('visible');
                }

                // Reset sub-category filter to 'all' when switching main category
                filterBtns.forEach(fbtn => fbtn.classList.remove('active'));
                secondaryFilterContainer.querySelector('[data-filter="all"]').classList.add('active');
                activeSubCategory = 'all';

                filterSkills();
            });
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeSubCategory = btn.dataset.filter;
                filterSkills();
            });
        });

        // Initial filter
        secondaryFilterContainer.classList.add('visible');
        filterSkills();
    }

    function initContactSection(sectionElement) {
        const contactForm = sectionElement.querySelector('#contact-form');
        const formStatus = sectionElement.querySelector('#form-status');

        if (contactForm && formStatus) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = new FormData(contactForm);
                
                // Show a temporary pending message
                formStatus.textContent = 'Sending...';
                formStatus.className = 'pending';

                try {
                    const response = await fetch(contactForm.action, {
                        method: 'POST',
                        body: data,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        formStatus.textContent = "Thanks for your message! I'll get back to you soon.";
                        formStatus.className = 'success';
                        contactForm.reset();
                    } else {
                        const responseData = await response.json();
                        if (Object.hasOwn(responseData, 'errors')) {
                            formStatus.textContent = responseData["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.textContent = "Oops! There was a problem submitting your form.";
                        }
                        formStatus.className = 'error';
                    }
                } catch (error) {
                    formStatus.textContent = "Oops! There was a network error.";
                    formStatus.className = 'error';
                }
            });
        }
    }

    function initProjectsSection(sectionElement) {
        // --- Dynamic Project Card Generation & "See More" Logic ---
        const projectsGrid = sectionElement.querySelector('.projects-grid');
        const seeMoreBtn = sectionElement.querySelector('#see-more-projects');
        const projectsToShow = 3;

        if (projectsGrid && typeof projects !== 'undefined' && seeMoreBtn) {
            projectsGrid.innerHTML = ''; // Clear existing projects
            projects.forEach((project, index) => {
                const projectItem = document.createElement('div');
                projectItem.className = 'project-item';
                projectItem.setAttribute('data-project-id', project.id);
                
                // Add 'hidden' class to projects beyond the initial view
                if (index >= projectsToShow) {
                    projectItem.classList.add('hidden');
                }
                
                const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

                projectItem.innerHTML = `
                    <div class="project-card">
                        <img src="${project.img}" alt="${project.title}">
                        <div class="project-overlay">
                            <button class="btn-quick-view">Quick View</button>
                        </div>
                    </div>
                    <div class="project-info">
                        <h3 class="project-title">${project.title}</h3>
                        <div class="project-tags">
                            ${tagsHtml}
                        </div>
                    </div>
                `;
                projectsGrid.appendChild(projectItem);
            });

            // Hide the 'See More' button if there are not enough projects
            if (projects.length <= projectsToShow) {
                seeMoreBtn.style.display = 'none';
            } else {
                seeMoreBtn.style.display = 'inline-block';
            }

            let allVisible = false;
            seeMoreBtn.addEventListener('click', () => {
                allVisible = !allVisible;
                const projectItems = projectsGrid.querySelectorAll('.project-item');
                projectItems.forEach((item, index) => {
                    if (index >= projectsToShow) {
                        item.classList.toggle('hidden', !allVisible);
                    }
                });
                seeMoreBtn.innerHTML = allVisible ? 'See Less <i class="fas fa-chevron-up"></i>' : 'See More <i class="fas fa-chevron-down"></i>';
                seeMoreBtn.classList.toggle('less', allVisible);
            });
        }

        // --- Staggered Animation for Project Cards ---
        const projectItems = projectsGrid.querySelectorAll('.project-item');
        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    projectItems.forEach((item, index) => {
                        // Set a custom property for the delay
                        item.style.setProperty('--delay', `${index * 100}ms`);
                        item.classList.add('visible');
                    });
                    projectObserver.unobserve(projectsGrid); // Stop observing once animated
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the grid is visible

        projectObserver.observe(projectsGrid);

        // --- Project Modal Logic ---
        // Re-query for buttons after they are dynamically created
        const quickViewBtns = sectionElement.querySelectorAll('.btn-quick-view');
        const modalContainer = document.getElementById('project-modal');
        const modalBody = modalContainer.querySelector('.modal-body');
        const closeModalBtn = modalContainer.querySelector('.modal-close');

        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectId = e.target.closest('.project-item').dataset.projectId;
                const data = projects.find(p => p.id === projectId);

                if (data) {
                    modalBody.innerHTML = `
                        <img src="${data.img}" alt="${data.title}" class="project-image-large">
                        <h2>${data.title}</h2>
                        <div class="project-tags-modal">
                            ${data.tags.map(tag => `<span>${tag}</span>`).join('')}
                        </div>
                        <p>${data.description}</p>
                        <div class="project-links">
                            <a href="${data.liveLink}" class="btn btn-primary" target="_blank"><i class="fas fa-eye"></i> Live</a>
                            <a href="${data.sourceLink}" class="btn btn-secondary" target="_blank"><i class="fab fa-github"></i> Source</a>
                        </div>
                    `;
                    modalContainer.classList.add('visible');
                }
            });
        });

        closeModalBtn.addEventListener('click', () => {
            modalContainer.classList.remove('visible');
        });

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.classList.remove('visible');
            }
        });
    }

    function initLocationSection(sectionElement) {
        const mapContainer = sectionElement.querySelector('.map-container');
        const mapOverlay = sectionElement.querySelector('.map-overlay');
    
        if (mapOverlay && mapContainer) {
            mapOverlay.addEventListener('click', () => {
                mapContainer.classList.add('map-active');
            });
        }
    }

    sectionsToLoad.forEach(loadSection);

    // --- Scroll-to-Top Button Logic ---
    const scrollTopBtn = document.querySelector('.scroll-to-top');

    if (scrollTopBtn && mainContent) {
        const handleScroll = () => {
            if (window.scrollY > 300 || mainContent.scrollTop > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', handleScroll);
        mainContent.addEventListener('scroll', handleScroll);

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            mainContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
