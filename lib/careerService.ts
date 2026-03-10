import { Career } from '@/types/user';

// India-localized careers with ₹ LPA salaries
const sampleCareers: Career[] = [
  {
    $id: '1',
    title: 'Full Stack Developer',
    description: 'Build end-to-end web applications from React frontends to Node.js backends and databases.',
    category: 'Technology',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
    averageSalary: '₹4–10 LPA',
    seniorSalary: '₹18–40 LPA',
    growthRate: '22%',
    demandInIndia: '80k+ openings/month',
    roadmap: [
      {
        id: 'fs-1',
        title: 'HTML, CSS & JavaScript Basics',
        description: 'Build a strong foundation in web fundamentals',
        duration: '6–8 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r1', title: 'freeCodeCamp', type: 'course', url: 'https://freecodecamp.org', description: 'Free 300-hour web dev curriculum', isFree: true },
          { id: 'r2', title: 'The Odin Project', type: 'course', url: 'https://theodinproject.com', description: 'Full stack open curriculum', isFree: true },
        ],
      },
      {
        id: 'fs-2',
        title: 'React.js Development',
        description: 'Learn React and build dynamic single-page applications',
        duration: '6–8 weeks',
        prerequisites: ['fs-1'],
        isCompleted: false,
        resources: [
          { id: 'r3', title: 'React Official Docs', type: 'article', url: 'https://react.dev', description: 'Interactive React tutorials', isFree: true },
        ],
      },
      {
        id: 'fs-3',
        title: 'Node.js & REST APIs',
        description: 'Build scalable backend services and REST APIs',
        duration: '6–8 weeks',
        prerequisites: ['fs-1'],
        isCompleted: false,
        resources: [
          { id: 'r4', title: 'NodeJS.org Docs', type: 'article', url: 'https://nodejs.org/docs', description: 'Official Node.js docs', isFree: true },
        ],
      },
      {
        id: 'fs-4',
        title: 'Databases (SQL + MongoDB)',
        description: 'Learn relational and NoSQL databases',
        duration: '4–6 weeks',
        prerequisites: ['fs-3'],
        isCompleted: false,
        resources: [
          { id: 'r5', title: 'SQLBolt', type: 'course', url: 'https://sqlbolt.com', description: 'Interactive SQL lessons', isFree: true },
          { id: 'r6', title: 'MongoDB University', type: 'course', url: 'https://learn.mongodb.com', description: 'Free MongoDB courses', isFree: true },
        ],
      },
      {
        id: 'fs-5',
        title: 'Build Portfolio Projects',
        description: 'Create 2–3 real-world full stack projects (auth, dashboards, payments) that you can show to recruiters.',
        duration: '4–6 weeks',
        prerequisites: ['fs-2', 'fs-3', 'fs-4'],
        isCompleted: false,
        resources: [
          { id: 'r30', title: 'Full Stack Open', type: 'course', url: 'https://fullstackopen.com', description: 'Project-based full stack course', isFree: true },
          { id: 'r31', title: 'Frontend Mentor', type: 'project', url: 'https://frontendmentor.io', description: 'Realistic UI challenges to clone', isFree: true },
        ],
      },
      {
        id: 'fs-6',
        title: 'Interview Prep & Job Search',
        description: 'Practice DSA basics, system design fundamentals and apply to internships / entry-level roles.',
        duration: '3–4 weeks',
        prerequisites: ['fs-5'],
        isCompleted: false,
        resources: [
          { id: 'r32', title: 'NeetCode 150', type: 'course', url: 'https://neetcode.io', description: 'Curated DSA practice list', isFree: true },
          { id: 'r33', title: 'CS50 Tech Interview', type: 'video', url: 'https://youtube.com', description: 'Interview tips and mock sessions', isFree: true },
        ],
      },
    ],
    isHot: true,
  },
  {
    $id: '2',
    title: 'Data Analyst',
    description: 'Transform raw data into actionable business insights using Python, SQL, and visualisation tools.',
    category: 'Data Science',
    requiredSkills: ['Python', 'SQL', 'Excel', 'Power BI', 'Statistics'],
    averageSalary: '₹3.5–8 LPA',
    seniorSalary: '₹15–30 LPA',
    growthRate: '25%',
    demandInIndia: '60k+ openings/month',
    roadmap: [
      {
        id: 'da-1',
        title: 'Python for Data Analysis',
        description: 'Master pandas, NumPy, matplotlib and seaborn',
        duration: '6 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r7', title: 'Kaggle Python', type: 'course', url: 'https://kaggle.com/learn/python', description: 'Free Python for DS', isFree: true },
        ],
      },
      {
        id: 'da-2',
        title: 'SQL & Data Querying',
        description: 'Write complex queries, joins, and aggregations',
        duration: '4 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r8', title: 'SQLBolt', type: 'course', url: 'https://sqlbolt.com', description: 'Interactive SQL', isFree: true },
        ],
      },
      {
        id: 'da-3',
        title: 'Data Visualisation (Power BI / Tableau)',
        description: 'Build dashboards and visual reports',
        duration: '4 weeks',
        prerequisites: ['da-1'],
        isCompleted: false,
        resources: [
          { id: 'r9', title: 'Microsoft Power BI Learning', type: 'course', url: 'https://learn.microsoft.com/power-bi', description: 'Free Microsoft training', isFree: true },
        ],
      },
      {
        id: 'da-4',
        title: 'Statistics & Experimentation',
        description: 'Learn hypothesis testing, confidence intervals, regression and A/B testing used in analytics roles.',
        duration: '4–6 weeks',
        prerequisites: ['da-1', 'da-2'],
        isCompleted: false,
        resources: [
          { id: 'r34', title: 'Khan Academy Statistics', type: 'course', url: 'https://www.khanacademy.org/math/statistics-probability', description: 'Solid stats foundation, free', isFree: true },
        ],
      },
      {
        id: 'da-5',
        title: 'Case Studies & Portfolio',
        description: 'Solve 2–3 business case studies and publish dashboards / notebooks on GitHub and LinkedIn.',
        duration: '3–4 weeks',
        prerequisites: ['da-3', 'da-4'],
        isCompleted: false,
        resources: [
          { id: 'r35', title: 'Maven Analytics Portfolio Ideas', type: 'article', url: 'https://mavenanalytics.io', description: 'Analytics project inspirations', isFree: true },
        ],
      },
    ],
    isHot: true,
  },
  {
    $id: '3',
    title: 'UI/UX Designer',
    description: 'Design intuitive digital experiences using Figma, conduct user research and prototype flows.',
    category: 'Design',
    requiredSkills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Wireframing'],
    averageSalary: '₹4–9 LPA',
    seniorSalary: '₹16–35 LPA',
    growthRate: '18%',
    demandInIndia: '35k+ openings/month',
    roadmap: [
      {
        id: 'ux-1',
        title: 'Design Fundamentals',
        description: 'Colour theory, typography, layout, visual hierarchy',
        duration: '4 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r10', title: 'Google UX Design Certificate', type: 'course', url: 'https://grow.google/product-design/', description: 'Beginner UX fundamentals', isFree: false },
        ],
      },
      {
        id: 'ux-2',
        title: 'Figma Mastery',
        description: 'Components, auto-layout, prototyping in Figma',
        duration: '4–6 weeks',
        prerequisites: ['ux-1'],
        isCompleted: false,
        resources: [
          { id: 'r11', title: 'Figma Official Tutorials', type: 'video', url: 'https://figma.com/resources/learn-design/', description: 'Free Figma tutorials', isFree: true },
        ],
      },
      {
        id: 'ux-3',
        title: 'User Research & Testing',
        description: 'User interviews, usability tests, affinity mapping',
        duration: '4 weeks',
        prerequisites: ['ux-1'],
        isCompleted: false,
        resources: [
          { id: 'r12', title: 'NNG UX Articles', type: 'article', url: 'https://nngroup.com/articles/', description: 'World-class UX research', isFree: true },
        ],
      },
      {
        id: 'ux-4',
        title: 'Design Systems & Handoff',
        description: 'Create reusable design systems and handoff clean specs to developers.',
        duration: '3–4 weeks',
        prerequisites: ['ux-2'],
        isCompleted: false,
        resources: [
          { id: 'r36', title: 'Figma Design Systems', type: 'article', url: 'https://www.figma.com/blog/design-systems', description: 'Best practices for design systems', isFree: true },
        ],
      },
      {
        id: 'ux-5',
        title: 'Portfolio & Interviews',
        description: 'Craft case studies, present UX process and prepare for design challenges.',
        duration: '3–4 weeks',
        prerequisites: ['ux-3', 'ux-4'],
        isCompleted: false,
        resources: [
          { id: 'r37', title: 'UX Case Study Examples', type: 'article', url: 'https://uxdesign.cc', description: 'Inspiring UX portfolios and case studies', isFree: true },
        ],
      },
    ],
    isHot: false,
  },
  {
    $id: '4',
    title: 'Machine Learning Engineer',
    description: 'Build and deploy ML models that power intelligent applications — one of India\'s hottest roles.',
    category: 'Data Science',
    requiredSkills: ['Python', 'TensorFlow/PyTorch', 'Math & Statistics', 'ML Algorithms', 'Cloud (AWS/GCP)'],
    averageSalary: '₹8–18 LPA',
    seniorSalary: '₹25–60 LPA',
    growthRate: '40%',
    demandInIndia: '45k+ openings/month',
    roadmap: [
      {
        id: 'ml-1',
        title: 'Python & Math Foundations',
        description: 'Linear algebra, statistics, probability, Python',
        duration: '8 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r13', title: 'fast.ai Practical DL', type: 'course', url: 'https://fast.ai', description: 'Hands-on deep learning, free', isFree: true },
        ],
      },
      {
        id: 'ml-2',
        title: 'ML Algorithms & Scikit-learn',
        description: 'Supervised, unsupervised learning, model evaluation',
        duration: '8 weeks',
        prerequisites: ['ml-1'],
        isCompleted: false,
        resources: [
          { id: 'r14', title: 'Kaggle ML Course', type: 'course', url: 'https://kaggle.com/learn', description: 'Free ML micro-courses', isFree: true },
        ],
      },
      {
        id: 'ml-3',
        title: 'Deep Learning (TensorFlow/PyTorch)',
        description: 'Neural networks, CNNs, NLP, LLMs',
        duration: '10 weeks',
        prerequisites: ['ml-2'],
        isCompleted: false,
        resources: [
          { id: 'r15', title: 'DeepLearning.AI', type: 'course', url: 'https://deeplearning.ai', description: 'Andrew Ng\'s free audit courses', isFree: true },
        ],
      },
      {
        id: 'ml-4',
        title: 'MLOps & Deployment',
        description: 'Serve models with APIs, monitor performance and manage experiments.',
        duration: '4–6 weeks',
        prerequisites: ['ml-3'],
        isCompleted: false,
        resources: [
          { id: 'r38', title: 'Made With ML - MLOps', type: 'article', url: 'https://madewithml.com', description: 'Practical MLOps guides', isFree: true },
        ],
      },
      {
        id: 'ml-5',
        title: 'End-to-End ML Projects',
        description: 'Build 1–2 full ML products (data, model, API, UI) and publish them.',
        duration: '4–6 weeks',
        prerequisites: ['ml-4'],
        isCompleted: false,
        resources: [
          { id: 'r39', title: 'Kaggle Competitions', type: 'project', url: 'https://kaggle.com/competitions', description: 'Realistic ML problems to solve', isFree: true },
        ],
      },
    ],
    isHot: true,
  },
  {
    $id: '5',
    title: 'Cloud & DevOps Engineer',
    description: 'Manage cloud infrastructure, CI/CD pipelines, and automate deployment for modern software teams.',
    category: 'Technology',
    requiredSkills: ['AWS/Azure/GCP', 'Docker', 'Kubernetes', 'Linux', 'CI/CD'],
    averageSalary: '₹6–14 LPA',
    seniorSalary: '₹22–50 LPA',
    growthRate: '35%',
    demandInIndia: '55k+ openings/month',
    roadmap: [
      {
        id: 'devops-1',
        title: 'Linux & Networking Basics',
        description: 'Command line, file system, networking fundamentals',
        duration: '4 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r16', title: 'Linux Journey', type: 'article', url: 'https://linuxjourney.com', description: 'Free interactive Linux learning', isFree: true },
        ],
      },
      {
        id: 'devops-2',
        title: 'Docker & Containerisation',
        description: 'Build, run, and manage Docker containers',
        duration: '4 weeks',
        prerequisites: ['devops-1'],
        isCompleted: false,
        resources: [
          { id: 'r17', title: 'Docker Official Tutorial', type: 'article', url: 'https://docker.com/get-started', description: 'Free official Docker guide', isFree: true },
        ],
      },
      {
        id: 'devops-3',
        title: 'AWS/Azure Cloud Fundamentals',
        description: 'EC2, S3, Lambda, VPC — core cloud services',
        duration: '6 weeks',
        prerequisites: ['devops-1'],
        isCompleted: false,
        resources: [
          { id: 'r18', title: 'AWS Free Tier + Training', type: 'course', url: 'https://aws.amazon.com/training/', description: 'Free AWS training and practice', isFree: true },
        ],
      },
      {
        id: 'devops-4',
        title: 'CI/CD Pipelines',
        description: 'Automate build, test and deployment using GitHub Actions, GitLab CI or Jenkins.',
        duration: '4 weeks',
        prerequisites: ['devops-2', 'devops-3'],
        isCompleted: false,
        resources: [
          { id: 'r40', title: 'GitHub Actions Docs', type: 'article', url: 'https://docs.github.com/actions', description: 'Build CI/CD pipelines on GitHub', isFree: true },
        ],
      },
      {
        id: 'devops-5',
        title: 'Monitoring & Reliability',
        description: 'Set up logging, monitoring and alerts; learn SRE basics.',
        duration: '3–4 weeks',
        prerequisites: ['devops-4'],
        isCompleted: false,
        resources: [
          { id: 'r41', title: 'Google SRE Workbook', type: 'book', url: 'https://sre.google/workbook/', description: 'Free online SRE practices book', isFree: true },
        ],
      },
    ],
    isHot: true,
  },
  {
    $id: '6',
    title: 'Cybersecurity Analyst',
    description: 'Protect organisations\' systems, networks, and data from cyber threats and breaches.',
    category: 'Technology',
    requiredSkills: ['Network Security', 'Linux', 'Ethical Hacking', 'SIEM', 'Incident Response'],
    averageSalary: '₹5–12 LPA',
    seniorSalary: '₹20–45 LPA',
    growthRate: '30%',
    demandInIndia: '30k+ openings/month',
    roadmap: [
      {
        id: 'sec-1',
        title: 'Networking & Linux Fundamentals',
        description: 'TCP/IP, DNS, HTTP, Linux commands',
        duration: '6 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r19', title: 'CompTIA Network+ Study', type: 'video', url: 'https://youtube.com/@professormesser', description: 'Free Network+ prep', isFree: true },
        ],
      },
      {
        id: 'sec-2',
        title: 'Ethical Hacking & Penetration Testing',
        description: 'Tools: Nmap, Metasploit, Burp Suite',
        duration: '8 weeks',
        prerequisites: ['sec-1'],
        isCompleted: false,
        resources: [
          { id: 'r20', title: 'TryHackMe', type: 'course', url: 'https://tryhackme.com', description: 'Gamified cybersecurity practice', isFree: true },
        ],
      },
    ],
    isHot: false,
    isEmerging: true,
  },
  {
    $id: '7',
    title: 'Digital Marketing Specialist',
    description: 'Drive brand growth through SEO, paid ads, social media, email campaigns, and content marketing.',
    category: 'Business',
    requiredSkills: ['SEO/SEM', 'Google Ads', 'Social Media', 'Analytics', 'Content Strategy'],
    averageSalary: '₹3–7 LPA',
    seniorSalary: '₹12–25 LPA',
    growthRate: '20%',
    demandInIndia: '50k+ openings/month',
    roadmap: [
      {
        id: 'dm-1',
        title: 'Digital Marketing Fundamentals',
        description: 'SEO, SEM, social media, email marketing basics',
        duration: '4 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r21', title: 'Google Digital Garage', type: 'course', url: 'https://learndigital.withgoogle.com', description: 'Free Google certified course', isFree: true },
        ],
      },
      {
        id: 'dm-2',
        title: 'Google Ads & Analytics',
        description: 'Run and optimise paid search and display campaigns',
        duration: '4 weeks',
        prerequisites: ['dm-1'],
        isCompleted: false,
        resources: [
          { id: 'r22', title: 'Google Skillshop', type: 'course', url: 'https://skillshop.google.com', description: 'Free Google Ads certification', isFree: true },
        ],
      },
    ],
    isHot: false,
  },
  {
    $id: '8',
    title: 'Mobile App Developer',
    description: 'Build cross-platform iOS and Android apps using React Native or Flutter for India\'s massive mobile market.',
    category: 'Technology',
    requiredSkills: ['React Native / Flutter', 'JavaScript/Dart', 'REST APIs', 'App Store Publishing'],
    averageSalary: '₹5–12 LPA',
    seniorSalary: '₹20–45 LPA',
    growthRate: '20%',
    demandInIndia: '40k+ openings/month',
    roadmap: [
      {
        id: 'mob-1',
        title: 'JavaScript / Dart Basics',
        description: 'Language fundamentals for mobile development',
        duration: '4 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r23', title: 'freeCodeCamp JS', type: 'course', url: 'https://freecodecamp.org', description: 'Free JS curriculum', isFree: true },
        ],
      },
      {
        id: 'mob-2',
        title: 'React Native / Flutter',
        description: 'Build cross-platform mobile UIs and navigate between screens',
        duration: '8 weeks',
        prerequisites: ['mob-1'],
        isCompleted: false,
        resources: [
          { id: 'r24', title: 'React Native Docs', type: 'article', url: 'https://reactnative.dev', description: 'Official React Native guide', isFree: true },
          { id: 'r25', title: 'Flutter Docs', type: 'article', url: 'https://docs.flutter.dev', description: 'Official Flutter guide', isFree: true },
        ],
      },
    ],
    isHot: false,
    isEmerging: true,
  },
  {
    $id: '9',
    title: 'Product Manager',
    description: 'Lead product strategy, define roadmaps, and work cross-functionally between engineering, design, and business.',
    category: 'Business',
    requiredSkills: ['Product Strategy', 'Agile/Scrum', 'Data Analysis', 'Stakeholder Management', 'User Research'],
    averageSalary: '₹8–18 LPA',
    seniorSalary: '₹25–70 LPA',
    growthRate: '25%',
    demandInIndia: '25k+ openings/month',
    roadmap: [
      {
        id: 'pm-1',
        title: 'Product Thinking & Strategy',
        description: 'Jobs-to-be-done, product-market fit, OKRs',
        duration: '4 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r26', title: 'Product School Blog', type: 'article', url: 'https://productschool.com/blog/', description: 'Free PM resources', isFree: true },
        ],
      },
      {
        id: 'pm-2',
        title: 'Agile & Scrum',
        description: 'Sprint planning, backlog grooming, retrospectives',
        duration: '3 weeks',
        prerequisites: ['pm-1'],
        isCompleted: false,
        resources: [
          { id: 'r27', title: 'Scrum.org Guides', type: 'article', url: 'https://scrum.org/resources/scrum-guide', description: 'Free official Scrum guide', isFree: true },
        ],
      },
    ],
    isHot: true,
  },
  {
    $id: '10',
    title: 'AI Prompt Engineer',
    description: 'Design and optimise prompts for LLMs like ChatGPT, Gemini, and Claude to build AI-powered applications.',
    category: 'Emerging Tech',
    requiredSkills: ['Prompt Engineering', 'Python', 'LLM APIs', 'AI Fundamentals', 'Critical Thinking'],
    averageSalary: '₹6–15 LPA',
    seniorSalary: '₹20–50 LPA',
    growthRate: '50%',
    demandInIndia: '20k+ openings/month (rapidly growing)',
    roadmap: [
      {
        id: 'pe-1',
        title: 'AI & LLM Fundamentals',
        description: 'How transformers, tokenisation, and LLMs work',
        duration: '3 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r28', title: '3Blue1Brown Neural Nets', type: 'video', url: 'https://youtube.com/@3blue1brown', description: 'Visual deep learning explanations', isFree: true },
        ],
      },
      {
        id: 'pe-2',
        title: 'Prompt Engineering Techniques',
        description: 'Chain-of-thought, few-shot, RAG, structured output',
        duration: '4 weeks',
        prerequisites: ['pe-1'],
        isCompleted: false,
        resources: [
          { id: 'r29', title: 'Learn Prompting', type: 'article', url: 'https://learnprompting.org', description: 'Free comprehensive guide', isFree: true },
        ],
      },
    ],
    isHot: false,
    isEmerging: true,
  },
  {
    $id: '11',
    title: 'Backend Engineer (Go/Java)',
    description: 'Design and build the scalable server-side logic and high-performance APIs that power modern applications.',
    category: 'Technology',
    requiredSkills: ['Go', 'Java', 'Microservices', 'PostgreSQL', 'Kubernetes'],
    averageSalary: '₹6–15 LPA',
    seniorSalary: '₹20–45 LPA',
    growthRate: '28%',
    demandInIndia: '55k+ openings/month',
    roadmap: [
      {
        id: 'be-1',
        title: 'Backend Language Mastery',
        description: 'Choose Go or Java/Spring Boot and master core concepts, concurrency and memory management.',
        duration: '8 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r50', title: 'Go by Example', type: 'article', url: 'https://gobyexample.com', description: 'Hands-on introduction to Go', isFree: true },
          { id: 'r51', title: 'Baeldung for Java', type: 'article', url: 'https://baeldung.com', description: 'Advanced Java and Spring guides', isFree: true },
        ],
      },
      {
        id: 'be-2',
        title: 'SQL & Database Design',
        description: 'Deep dive into relational databases, indexing, transactions and query performance.',
        duration: '6 weeks',
        prerequisites: ['be-1'],
        isCompleted: false,
        resources: [
          { id: 'r52', title: 'Use The Index, Luke', type: 'article', url: 'https://use-the-index-luke.com', description: 'Guide to database indexing', isFree: true },
        ],
      },
      {
        id: 'be-3',
        title: 'System Architecture & Microservices',
        description: 'Build distributed systems, understand message queues (Kafka), and implement SOLID principles.',
        duration: '8 weeks',
        prerequisites: ['be-2'],
        isCompleted: false,
        resources: [
          { id: 'r53', title: 'Microservices.io', type: 'article', url: 'https://microservices.io', description: 'Patterns for microservices architecture', isFree: true },
        ],
      },
    ],
    isHot: true,
  },
  {
    $id: '12',
    title: 'Blockchain Developer',
    description: 'Build decentralized applications (dApps) and smart contracts on Ethereum and other Web3 platforms.',
    category: 'Technology',
    requiredSkills: ['Solidity', 'Rust', 'Web3.js', 'Smart Contracts', 'Cryptography'],
    averageSalary: '₹8–20 LPA',
    seniorSalary: '₹25–65 LPA',
    growthRate: '35%',
    demandInIndia: '15k+ openings/month (high growth)',
    roadmap: [
      {
        id: 'bc-1',
        title: 'Web3 & Blockchain Basics',
        description: 'Understand decentralization, consensus mechanisms, and how blocks are chained.',
        duration: '4 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r54', title: 'Learn Web3 DAO', type: 'course', url: 'https://learnweb3.io', description: 'Comprehensive Web3 curriculum', isFree: true },
        ],
      },
      {
        id: 'bc-2',
        title: 'Solidity & Smart Contracts',
        description: 'Learn Solidity programming, security patterns, and contract testing.',
        duration: '8 weeks',
        prerequisites: ['bc-1'],
        isCompleted: false,
        resources: [
          { id: 'r55', title: 'CryptoZombies', type: 'course', url: 'https://cryptozombies.io', description: 'Learn Solidity by building a game', isFree: true },
        ],
      },
      {
        id: 'bc-3',
        title: 'DApp Development',
        description: 'Connect your smart contracts to a React frontend using Ethers.js or Web3.js.',
        duration: '6 weeks',
        prerequisites: ['bc-2'],
        isCompleted: false,
        resources: [
          { id: 'r56', title: 'Alchemy University', type: 'course', url: 'https://university.alchemy.com', description: 'Advanced blockchain courses', isFree: true },
        ],
      },
    ],
    isHot: false,
    isEmerging: true,
  },
  {
    $id: '13',
    title: 'Software Development Engineer (SDE)',
    description: 'Master the core engineering principles required to scale products at top product-based companies (MNCs).',
    category: 'Technology',
    requiredSkills: ['Data Structures', 'Algorithms', 'System Design', 'OS/DBMS', 'C++/Java'],
    averageSalary: '₹12–25 LPA',
    seniorSalary: '₹35–90 LPA',
    growthRate: '15%',
    demandInIndia: '70k+ openings/month',
    roadmap: [
      {
        id: 'sde-1',
        title: 'Advanced DSA Mastery',
        description: 'Dynamic programming, graphs, trees, and advanced complexity analysis.',
        duration: '12 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r57', title: 'LeetCode Discuss', type: 'article', url: 'https://leetcode.com/discuss', description: 'DSA patterns and prep guides', isFree: true },
          { id: 'r58', title: 'Striver\'s A2Z Sheet', type: 'course', url: 'https://takeuforward.org', description: 'Complete DSA roadmap', isFree: true },
        ],
      },
      {
        id: 'sde-2',
        title: 'Low-Level Design (LLD)',
        description: 'Design patterns, SOLID principles, and object-oriented programming in depth.',
        duration: '6 weeks',
        prerequisites: ['sde-1'],
        isCompleted: false,
        resources: [
          { id: 'r59', title: 'Refactoring Guru', type: 'article', url: 'https://refactoring.guru', description: 'Design patterns and refactoring', isFree: true },
        ],
      },
      {
        id: 'sde-3',
        title: 'High-Level Design (HLD)',
        description: 'Load balancers, caching, sharding, and architecting for millions of users.',
        duration: '8 weeks',
        prerequisites: ['sde-2'],
        isCompleted: false,
        resources: [
          { id: 'r60', title: 'Grokking System Design', type: 'course', url: 'https://designgurus.org', description: 'System design interview prep', isFree: false },
        ],
      },
    ],
    isHot: true,
  },
  {
    $id: '14',
    title: 'QA & Automation Engineer',
    description: 'Ensure software quality by building automated testing frameworks for web, mobile, and APIs.',
    category: 'Technology',
    requiredSkills: ['Selenium', 'Playwright', 'Java/Python', 'API Automation', 'Jenkins'],
    averageSalary: '₹4–10 LPA',
    seniorSalary: '₹15–35 LPA',
    growthRate: '20%',
    demandInIndia: '40k+ openings/month',
    roadmap: [
      {
        id: 'qa-1',
        title: 'Software Testing Fundamentals',
        description: 'Manual testing, bug life cycle, and test case documentation.',
        duration: '4 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r61', title: 'Guru99 Testing', type: 'article', url: 'https://guru99.com/software-testing.html', description: 'Beginner testing concepts', isFree: true },
        ],
      },
      {
        id: 'qa-2',
        title: 'Web Automation (Selenium/Playwright)',
        description: 'Automate browser actions and verify UI elements using code.',
        duration: '8 weeks',
        prerequisites: ['qa-1'],
        isCompleted: false,
        resources: [
          { id: 'r62', title: 'Test Automation University', type: 'course', url: 'https://testautomationuniversity.applitools.com', description: 'Free automation courses', isFree: true },
        ],
      },
      {
        id: 'qa-3',
        title: 'API & Mobile Testing',
        description: 'Automate API requests and mobile app testing using Appium or RestAssured.',
        duration: '6 weeks',
        prerequisites: ['qa-2'],
        isCompleted: false,
        resources: [
          { id: 'r63', title: 'Postman Academy', type: 'course', url: 'https://postman.com/academy', description: 'Master API testing', isFree: true },
        ],
      },
    ],
    isHot: false,
  },
  {
    $id: '15',
    title: 'Data Engineer',
    description: 'Build the pipelines that transform raw data into useful information for analysts and ML engineers.',
    category: 'Data Science',
    requiredSkills: ['Apache Spark', 'Python', 'Airflow', 'Cloud DW (Snowflake)', 'ETL/ELT'],
    averageSalary: '₹7–16 LPA',
    seniorSalary: '₹22–55 LPA',
    growthRate: '35%',
    demandInIndia: '35k+ openings/month',
    roadmap: [
      {
        id: 'de-1',
        title: 'Advanced SQL & Data Modeling',
        description: 'Master window functions, CTEs, and dimensional modeling (Star/Snowflake schema).',
        duration: '6 weeks',
        prerequisites: [],
        isCompleted: false,
        resources: [
          { id: 'r64', title: 'SQLZoo', type: 'course', url: 'https://sqlzoo.net', description: 'Interactive SQL practice', isFree: true },
        ],
      },
      {
        id: 'de-2',
        title: 'Big Data Processing (Spark)',
        description: 'Process terabytes of data across clusters using PySpark or Scala.',
        duration: '10 weeks',
        prerequisites: ['de-1'],
        isCompleted: false,
        resources: [
          { id: 'r65', title: 'Spark by Examples', type: 'article', url: 'https://sparkbyexamples.com', description: 'Practical Spark guides', isFree: true },
        ],
      },
      {
        id: 'de-3',
        title: 'Data Pipelines & Orchestration',
        description: 'Master Airflow or Prefect to schedule and monitor complex data workflows.',
        duration: '6 weeks',
        prerequisites: ['de-2'],
        isCompleted: false,
        resources: [
          { id: 'r66', title: 'DataTalks.Club', type: 'course', url: 'https://datatalks.club', description: 'Data engineering zoomcamp', isFree: true },
        ],
      },
    ],
    isHot: true,
  },
];

export class CareerService {
  static async getCareers(): Promise<Career[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(sampleCareers), 300);
    });
  }

  static async getCareerById(id: string): Promise<Career | null> {
    const careers = await this.getCareers();
    return careers.find((c) => c.$id === id) || null;
  }

  static async getHotCareers(): Promise<Career[]> {
    const careers = await this.getCareers();
    return careers.filter((c) => c.isHot);
  }

  static async getEmergingCareers(): Promise<Career[]> {
    const careers = await this.getCareers();
    return careers.filter((c) => c.isEmerging);
  }

  static async getRecommendedCareers(
    interests: string[],
    background: string
  ): Promise<Career[]> {
    const careers = await this.getCareers();
    const matched = careers.filter((career) =>
      interests.some(
        (interest) =>
          career.category.toLowerCase().includes(interest.toLowerCase()) ||
          career.requiredSkills.some((skill) =>
            skill.toLowerCase().includes(interest.toLowerCase())
          )
      )
    );
    return matched.length > 0 ? matched : careers.filter((c) => c.isHot);
  }
}
