import HeroAvatar from '@/public/images/hero-avatar.jpg';
import ClientLogo from '@/public/images/client-logo.jpg';
import BlogImg from '@/public/images/blog-img.jpg'
import BlogImg2x from '@/public/images/blog-img@2x.jpg'
import BlogImgWide from '@/public/images/blog-img-wide.jpg'
import PortfolioImg from '@/public/images/portfolio-img.jpg';
import PortfolioImgWide from '@/public/images/portfolio-img-wide.jpg';
import TestimonialAvatar from '@/public/images/review.jpg';
import TestimonialAvatar1 from '@/public/images/review1.jpg';


export const headerData = {
    logo: 'Nirmal',
    navlinks: [
        {
            url: '/#about',
            title: 'About',
        },
        {
            url: '/#services',
            title: 'Services',
        },
        {
            url: '/#portfolio',
            title: 'Portfolio',
        },
        {
            url: '/#awards',
            title: 'Awards',
        },
        {
            url: '/#testimonial',
            title: 'Testimonial',
        },
        {
            url: '/#blog',
            title: 'Blog',
        },
        {
            url: '/#contact',
            title: 'Contact',
        },
    ],
};

export const aboutData = {
    mainData: {
        name: "Nirmal Dangi",
        heroAvatar: HeroAvatar,
        biography: "I'm a tech enthusiast passionate about AI, data engineering, and DevOps. I build smart systems by transforming raw data into insights, developing machine learning models, and deploying scalable infrastructure. I enjoy solving real-world problems through automation, intelligent design, and continuous learning across the data-to-deployment pipeline.",
        projectsDone: "50",
        yearsOfExperience: "4",
        projectSatisfaction: "100%",
    },
    skills: [
        { name: 'AI & Machine Learning', iconClass: 'bi-cpu' },
        { name: 'Deep Learning', iconClass: 'bi-diagram-3' },
        { name: 'DevOps', iconClass: 'bi-gear' },
        { name: 'Cloud & Containers', iconClass: 'bi-cloud' },
        { name: 'Python & SQL', iconClass: 'bi-code-slash' },
        { name: 'Web Development', iconClass: 'bi-window' },
        { name: 'Data Engineering', iconClass: 'bi-database' },
        { name: 'MLOps', iconClass: 'bi-kanban' },
        { name: 'API Design', iconClass: 'bi-link-45deg' },
      ],
    connect: [
        {
            url: '#',
            bootstrapIcon: 'bi bi-facebook',
        },
        {
            url: '#',
            bootstrapIcon: 'bi bi-twitter-x',
        },
        {
            url: '#',
            bootstrapIcon: 'bi bi-instagram',
        },
    ]
};

export const servicesData = {
    mainData: {
        title: "Services",
        title2: "What I",
        title2Span: "Do",
    },
    services: [
        {
          number: '01',
          bootstrapIcon: 'bi bi-cpu',
          title: 'AI Engineering',
          description: 'Building smart AI-powered solutions.',
        },
        {
          number: '02',
          bootstrapIcon: 'bi bi-gear',
          title: 'DevOps',
          description: 'CI/CD, automation, and infrastructure.',
        },
        {
          number: '03',
          bootstrapIcon: 'bi bi-kanban',
          title: 'MLOps',
          description: 'Machine learning operations and deployment.',
        },
        {
          number: '04',
          bootstrapIcon: 'bi bi-database',
          title: 'Data Engineering',
          description: 'Data pipelines and analytics.',
        },
      ]
};

export const clientsData = {
    clients: [
        {
            url: '#',
            logo: ClientLogo,
        },
        {
            url: '#',
            logo: ClientLogo,
        },
        {
            url: '#',
            logo: ClientLogo,
        },
        {
            url: '#',
            logo: ClientLogo,
        },
        {
            url: '#',
            logo: ClientLogo,
        },
        {
            url: '#',
            logo: ClientLogo,
        },
    ]
};

export const portfolioData = {
    mainData: {
        title: "Portfolio",
        title2: "Recent",
        title2Span: "Works",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
    },
    projects: [
        {
            title: 'Project Title 1',
            slug: 'project-title-1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit',
            keywords: 'key1, key2, key3',
            categories: [
                { name: 'Category' },
                { name: 'Category' },
                { name: 'Category' }
            ],
            services: [
                { name: 'Item' },
                { name: 'Item' },
            ],
            client: 'FlaTheme',
            duration: '235 Hours',
            projectLink: {
                title: 'www.flatheme.net',
                url: 'https://www.flatheme.net'
            },
            content: '<p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> <h5 class="text-2xl font-outfit font-medium text-white mt-6 mb-2">Heading</h5> <p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            mainImage: PortfolioImg,
            wideImage: PortfolioImgWide,
            imagesLightbox: {
                image: PortfolioImg,
                alt: 'Image Alt'
            },
            video: {
                thumbnail: PortfolioImg,
                url: 'https://www.youtube.com/watch?v=V8yu12uRpBA'
            },
            trending: true
        },
        {
            title: 'Project Title 2',
            slug: 'project-title-2',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit',
            keywords: 'key1, key2, key3',
            categories: [
                { name: 'Category' },
                { name: 'Category' },
                { name: 'Category' }
            ],
            services: [
                { name: 'Item' },
                { name: 'Item' },
            ],
            client: 'FlaTheme',
            duration: '235 Hours',
            projectLink: {
                title: 'www.flatheme.net',
                url: 'https://www.flatheme.net'
            },
            content: '<p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> <h5 class="text-2xl font-outfit font-medium text-white mt-6 mb-2">Heading</h5> <p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            mainImage: PortfolioImg,
            wideImage: PortfolioImgWide,
            imagesLightbox: {
                image: PortfolioImg,
                alt: 'Image Alt'
            },
            video: {
                thumbnail: PortfolioImg,
                url: 'https://www.youtube.com/watch?v=V8yu12uRpBA'
            },
            trending: true
        },
        {
            title: 'Project Title 3',
            slug: 'project-title-3',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit',
            keywords: 'key1, key2, key3',
            categories: [
                { name: 'Category' },
                { name: 'Category' },
                { name: 'Category' }
            ],
            services: [
                { name: 'Item' },
                { name: 'Item' },
            ],
            client: 'FlaTheme',
            duration: '235 Hours',
            projectLink: {
                title: 'www.flatheme.net',
                url: 'https://www.flatheme.net'
            },
            content: '<p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> <h5 class="text-2xl font-outfit font-medium text-white mt-6 mb-2">Heading</h5> <p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            mainImage: PortfolioImg,
            wideImage: PortfolioImgWide,
            imagesLightbox: {
                image: PortfolioImg,
                alt: 'Image Alt'
            },
            video: {
                thumbnail: PortfolioImg,
                url: 'https://www.youtube.com/watch?v=V8yu12uRpBA'
            },
            trending: true
        },
        {
            title: 'Project Title 4',
            slug: 'project-title-4',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit',
            keywords: 'key1, key2, key3',
            categories: [
                { name: 'Category' },
                { name: 'Category' },
                { name: 'Category' }
            ],
            services: [
                { name: 'Item' },
                { name: 'Item' },
            ],
            client: 'FlaTheme',
            duration: '235 Hours',
            projectLink: {
                title: 'www.flatheme.net',
                url: 'https://www.flatheme.net'
            },
            content: '<p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> <h5 class="text-2xl font-outfit font-medium text-white mt-6 mb-2">Heading</h5> <p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            mainImage: PortfolioImg,
            wideImage: PortfolioImgWide,
            imagesLightbox: {
                image: PortfolioImg,
                alt: 'Image Alt'
            },
            video: {
                thumbnail: PortfolioImg,
                url: 'https://www.youtube.com/watch?v=V8yu12uRpBA'
            },
            trending: true
        },
        {
            title: 'Project Title 5',
            slug: 'project-title-5',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit',
            keywords: 'key1, key2, key3',
            categories: [
                { name: 'Category' },
                { name: 'Category' },
                { name: 'Category' }
            ],
            services: [
                { name: 'Item' },
                { name: 'Item' },
            ],
            client: 'FlaTheme',
            duration: '235 Hours',
            projectLink: {
                title: 'www.flatheme.net',
                url: 'https://www.flatheme.net'
            },
            content: '<p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> <h5 class="text-2xl font-outfit font-medium text-white mt-6 mb-2">Heading</h5> <p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            mainImage: PortfolioImg,
            wideImage: PortfolioImgWide,
            imagesLightbox: {
                image: PortfolioImg,
                alt: 'Image Alt'
            },
            video: {
                thumbnail: PortfolioImg,
                url: 'https://www.youtube.com/watch?v=V8yu12uRpBA'
            },
            trending: false
        },
        {
            title: 'Project Title 6',
            slug: 'project-title-6',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit',
            keywords: 'key1, key2, key3',
            categories: [
                { name: 'Category' },
                { name: 'Category' },
                { name: 'Category' }
            ],
            services: [
                { name: 'Item' },
                { name: 'Item' },
            ],
            client: 'FlaTheme',
            duration: '235 Hours',
            projectLink: {
                title: 'www.flatheme.net',
                url: 'https://www.flatheme.net'
            },
            content: '<p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> <h5 class="text-2xl font-outfit font-medium text-white mt-6 mb-2">Heading</h5> <p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            mainImage: PortfolioImg,
            wideImage: PortfolioImgWide,
            imagesLightbox: {
                image: PortfolioImg,
                alt: 'Image Alt'
            },
            video: {
                thumbnail: PortfolioImg,
                url: 'https://www.youtube.com/watch?v=V8yu12uRpBA'
            },
            trending: false
        },
    ]
};

export const blogData = {
    mainData: {
        title: "Journal",
        title2: "Blog",
        title2Span: "Posts",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
    },
    posts: [
        {
            title: 'Blog Post Title',
            slug: 'blog-post-title',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit',
            keywords: 'key1, key2, key3',
            category: 'Category',
            date: 'Jan 12',
            postedBy: 'admin',
            content: '<p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> <h5 class="text-2xl font-outfit font-medium text-white mt-6 mb-2">Heading</h5> <p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            mainImage: BlogImg,
            wideImage: BlogImgWide,
            imagesLightbox: {
                image: BlogImg2x,
                alt: 'Image Alt'
            },
            video: {
                thumbnail: BlogImg2x,
                url: 'https://www.youtube.com/watch?v=V8yu12uRpBA'
            },
            tags: [
                { name: 'Tag1' },
                { name: 'Tag2' },
            ]
        },
        {
            title: 'Blog Post Title',
            slug: 'blog-post-title-1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit',
            keywords: 'key1, key2, key3',
            category: 'Category',
            date: 'Jan 12',
            postedBy: 'admin',
            content: '<p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> <h5 class="text-2xl font-outfit font-medium text-white mt-6 mb-2">Heading</h5> <p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            mainImage: BlogImg,
            wideImage: BlogImgWide,
            imagesLightbox: {
                image: BlogImg2x,
                alt: 'Image Alt'
            },
            video: {
                thumbnail: BlogImg2x,
                url: 'https://www.youtube.com/watch?v=V8yu12uRpBA'
            },
            tags: [
                { name: 'Tag1' },
                { name: 'Tag2' },
            ]
        },
        {
            title: 'Blog Post Title',
            slug: 'blog-post-title-2',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit',
            keywords: 'key1, key2, key3',
            category: 'Category',
            date: 'Jan 12',
            postedBy: 'admin',
            content: '<p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> <h5 class="text-2xl font-outfit font-medium text-white mt-6 mb-2">Heading</h5> <p class="text-white/70">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            mainImage: BlogImg,
            wideImage: BlogImgWide,
            imagesLightbox: {
                image: BlogImg2x,
                alt: 'Image Alt'
            },
            video: {
                thumbnail: BlogImg2x,
                url: 'https://www.youtube.com/watch?v=V8yu12uRpBA'
            },
            tags: [
                { name: 'Tag1' },
                { name: 'Tag2' },
            ]
        },
    ],
};

export const awardsData = {
    mainData: {
        title: "Achievements",
        title2: "Awa",
        title2Span: "rds",
    },
    awards: [
        {
            title: 'Best Designer of the Month',
            date: '2024',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore',
        },
        {
            title: 'The True Gem',
            date: '2023',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et',
        },
        {
            title: 'First Class Performer',
            date: '2022',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore',
        },
        {
            title: 'Customers Favourite',
            date: '2021',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore',
        },
    ]
};


export const testimonialData = {
    testimonial: [
        {
            name: 'Anlisha Maharjan',
            avatar: TestimonialAvatar,
            jobTitle: 'Team Lead',
            description: 'I’m amazed by Nirmal’s ability to take initiative. He is a highly focused person as well as analytical and can add to any team he is a part of. He started working with me as a Front End Intern, which included understanding a legacy code-base to increase debugging skills and dive into refactoring possibilities and gain experience with React terminologies, and later expanded his role into Front End Developer. He is well organized, diligent, and a fast learner. All these attributes were critical when trying to manage the software workflow and optimize user experience. Being a fast learner helped him understand the extensive research required for the task at hand and quickly choose the right path to success. I am sure Nirmal will achieve great things in his career. I wish him the best in all his endeavors.',
        },
        {
            name: 'Mitramani Khanal',
            avatar: TestimonialAvatar1,
            jobTitle: 'DevOPS Enginner',
            description: 'Nirmal consistently demonstrates deep expertise across DevOps, AI, and Data Engineering. He has a strong grasp of CI/CD pipelines, automates infrastructure efficiently, and ensures robust deployment processes. In AI, he builds reliable, scalable models with solid ML pipelines. His data engineering work is equally commendable—he designs clean, efficient data flows that support analytics and ML workflows. A reliable and collaborative team member who drives results.',
        },
    ]
};

export const contactData = {
    mainData: {
        title: "Contact",
        title2: "Let's",
        title2Span: "Talk",
        phone: "+123 456 7890",
        email: "contact@flatheme.net",
    }
};

export const mapData = {
    mainData: {
        lat: -3.745,
        lng: -38.523,
    },
};

export const footerData = {
    copyWriteText: 'Nirmal Dangi 2025 all rights reserved',
};
