
export const store = {
  name: "João Anes",
  title: "Software Engineer",
  subtitle:
    `${new Date().getFullYear() - 2014} years experience in product vision implementation, software engineering, client and end-user management, process refinement, technical leadership and incident response`,
  quote:
    "Computers are hard. Let me make them slightly easier for you to deal with.",
  description: [
    "Effective communicator, full-stack integrator, vision-focused and customer-oriented leader, with a feather touch.",
    "Firm believer in strong teams that own their features.",
  ],
  lookingFor: "Looking for staff, senior development and/or product-oriented roles.",
  skills: [
    [
      {
        Ruby:
          "Experience with Ruby both as a scripting language as well as extensive Rails/ActiveRecord knowledge acquired after maintaining multiple Rails services. Minitest > Rspec.",
        "Node.js":
          "Experience with Node.js from one-shot scripts to Next.js webapps with proper testing and support. Used extensively in personal web scraping projects and as glue code for when bash can't cut it.",
        Elixir:
          "Experience with Elixir as a back-end tool when high throughput and uptime safety is required. Phoenix LiveView is a great alternative to the modern frontend malaises. Used significantly in personal projects as GraphQL backend of choice.",
      },
      {
        Docker:
          "Experience with docker, image building, containerization, and debugging build pipelines. 'It works on my machine' - 'Then we'll ship your machine, here's a dockerfile.",
        "POSIX Bash":
          "Maintained and built bash cathedrals and trash fires alike. Will write bash scripts for automation if let run amok and will install oh-my-zsh on your whole team's machines.",
        Terraform:
          "Extensive experience configuring Linux-based servers, with a preference for Debian-like environments. Shell script advocate, nginx/caddy experience. Everything is a provider!",
        Kubernetes:
          "Experience with managing and managing K8s clusters and deployment pipelines, tuning of kubernetes monitors, and autoscaling. Once added an ssh server to a cluster just to ssh local port forward to another network!",
      },
    ],
    [
      {
        Mentorship:
          "Believer that companies and teams grow exponentially with the growth of its individual elements, and doer by 1:1 mentorship, strong, concise code reviews and plenty of appreciation. Plus, I only know what I know because someone told me once - need to pay it forward!"
      },
      {
        "Tech leadership":
          "Capable of providing and implementing the technical vision for solutions to the company's problems, from lower-level implementation details with the developers to the high-level coordination of releases, features and roadmap.",
        "Agile [(that works)]":
          "Strong experience with agile methodologies and implementations, from strong-willed complete SCRUM implementations, to SCRUM-lite skunkworks procedures. Strong believer that SCRUM is not a silver bullet, but motivated people are nigh unstoppable.",
        "Release Management":
          "Experience with coordinating release features with stakeholders, from task assignment, to acceptance criteria, to managing the technicalities of deployment procedures and keeping the team on a cycle.",
      },
      {
        "Typescript":
          "Proud user and evangelist for typescripts, love [destructuring], imports over requires, arrow functions, functional javascript (lodash-fp is my favourite import). Types aren't just important, they're a cornerstone.",
        "React.js":
          "Very strong evangelist for React.js as the best and most versatile frontend framework. Champion for functional components, hooks (to promote code reuse and clear splitting of logic/presentation) and higher-order-component composition.",
        "REST/gql":
          "Experience with REST/HATEOAS applications, self-describing APIs. Proud evangelist of GraphQL if performance isn't a massive concern.",

      },
    ],
    [
      {
        "Observability [& logs]":
          "Experience and steward of ensuring as much information possible is logged in order to understand unexpected behaviour and to properly categorize user metrics. Log levels are great.",
        "Metrics [& monitoring]":
          "From database load to average query resolution times, these numbers drive user experience. Keeping track of them is core if you care about your product. Dashboard maniac.",
      },

      {
        "AWS cloud":
          "Years experience with AWS. EC2, S3, Route 53, multi-az concerns, VPC configuration, Lambda, API Gateway, ECS, EKS, IAM",
        "devops":
          "Strong believer in “devops” culture, starting with every dev and ending with all the ops. Every engineer should be able to deploy from scratch without outside help.",
      },

      {
        "CI [& automation]":
          "Champion for automation whenever possible. The true job of the IT worker is to use technology to solve problems at scale - automation and being able to automate business processes is our key contribution to the business.",
        "design principles": "papyrus or comic sans? graphics design is my passion"
      },
    ],
  ],
  history: [
    {
      role: "Tech Lead",
      date: "2021",
      current: true,
      companyName: "Applied Blockchain Ltd",
      companyLink: "https://appliedblockchain.com",
      location: "Porto, PT / London, UK",
      whatDo:
        "Led project teams in implementing entirely novel solutions while adapting to market-fit. Managed product releases and headed development, while mentoring strong teams.",
      blurbs: [
        "Helmed 2 different projects in the finance space with regards to project direction and management of the development team",
        "Spearheaded the development of a live market platform that transacted $6M USD between users, artists and marketplaces",
        "Supported the integration of a blockchain based solution in parallel with the development of the core platform and coordinated QA efforts",
        "Architected onboarding of 5+ high profile clients each with bespoke platform requirements and modes of operation in a scalable and maintainable way",
        "Navigated a turbulent release period and provided effective post-release support and maintenance efforts",
        "Provided on-location support in critical project milestones and to ensure quick execution when dealing with difficult situations",
        "Grew a cross-functional team from 1 to 8 developers to deliver on the project's shifting needs",
        "Delivered time-critical milestones with heavily managed and controlled scope management",
        "Introduced client teams to processes to better manage product concerns and vision execution",
        "Promoted code ownership throught the development process, increasing quality and velocity",
        "Consulted on post-handover project development, architecturing and implementing major refactors of the original platform's behaviour",
        "Reviewed and produced documentation on project architecture for internal and external consumption",
        "Tutored teams on usage of devops tools in order to empower them to deliver changes to environments easily",
        "Met with clients and outside stakeholders constantly to capture requirements, demo features, advise on technical approaches and report results",
        "Inventoried and presented technical debt to managers, working alongside them to address it on an interative basis",
      ],
    },
    {
      role: "Lead Support Engineer",
      date: "2019",
      companyName: "Fractal GmbH",
      companyLink: "https://company.fractal.id",
      location: "Porto, PT / Berlin, DE",
      whatDo:
        "Led engineering support team, bridging the operations, product and engineering team’s focuses on handling user-level issues. Introduced automation to operation teams.",
      blurbs: [
        "Personally handled 6+ client accounts and informed on integration implementation, automatic reporting and support via text and video",
        "Working closely with support team, built custom software to support the operation team’s processes, increasing throughput and reducing response time",
        "Expanded testing efforts by introducing integration tests to platform, error monitoring and logging, improving system reliability",
        "Supported management and operations efforts via custom dashboards and reports via Metabase BI and a command line application",
        "Integrated company-critical efforts to implement user referraling and integration with referral services with haste",
        "Managed department deliverables, time-scoped features for the team and mentored colleagues on feature iteration",
        "Assisted development teams by contributing to the company command line application, focusing on automation ",
        "Thoroughly load tested production and staging services via serverless functions and Vegeta",
        "Created human readable documentation and quick explainers to bridge knowledge gap between internal teams",
        "Diligently scanned application logs for edge-case users and monitored error reporting to respond to incidents with haste",
        "Performed some regular engineering duties, such as feature planning,  bug-fixing and roadmapping",
        "Assisted team leaders and management with feature proposal, prototyping and roadmapping",
        "Maintained public developer documentation and example implementation on integration management via Gitbooks",
        "Built training materials for usage with 3+ partner support outsource partners regarding usage, features and quirks of application",
        "Assisted operations teams employing automation to look for sybil attacks after user growth spikes",
      ],
    },
    {
      role: "Senior Software Engineer",
      date: "2018",
      companyName: "Fractal GmbH",
      companyLink: "https://company.fractal.id",
      location: "Porto, PT / Berlin, DE",
      whatDo:
        "Helped build security-first KYC platform, with integration via OAuth and led time-scoped feature teams. Owned system-critical identity verification platform and improved support efficiency.",
      blurbs: [
        "Benchmarked and optimized both database usage avoiding pitfalls like n+1 and rewriting complex SQL queries into more manageable jobs",
        "Identified system weaknesses in regards to security and presented emergency implementation and followup plans to stakeholders and mgmt",
        "Pushed as a team for feature improvements related to usability and UI ease of use backed by user experience logs and user reports",
        "Remote-first work experience, integrating a team supporting the Berlin office with engineering direction, feature development updates and scoping",
        "Delivered software and artifacts on-site and provided support on key moments of our partners’ timelines",
        "Championed the adoption of technology like GraphQL, CI testing pipelines and integration testing (via Selenium)",
        "Owned ethereum/bitcoin/lisk custom solution for secure airgapped transactions used by 5+ partners that transacted close to $1M USD ",
        "Benchmarked and optimized both database usage avoiding pitfalls like n+1 and rewriting complex SQL queries into more manageable jobs",
        "Maintained frontend React codebases with a focus on functional component composability, usage of hooks and code reusability",
        "Directly supported operations team and was point of contact for understanding weird user bug reports and communicating a fix plan",
        "Created and managed core infrastructure nodes running application servers, blockchain services and staging areas via Terraform and Docker",
        "Built React SPAs backed by Rails microservices deployed to AWS Fargate that scaled to 10000+ concurrent users ",
        "Led community outreach, participated in 4+ conferences, managed 10+ summer interns with burocracy, direction and code direction and review",
        "Migrated existing support KYC software to integrate with newly built OAuth system, improving user flow and code maintainability forwards",
      ],
    },
    {
      role: "Software Engineer",
      date: "2016",
      companyName: "Life on Mars, S.A.",
      companyLink: "https://lifeonmars.io",
      location: "Porto, PT",
      whatDo:
        "Worked on multiple projects in areas such as VR, blockchain and education and delivered MVPs for a secure art trading platform and a mobile collectible card game. Acqui-hired by Fractal.",
      blurbs: [
        "Integrated skunkworks remote-only teams leading rapid application development alongside designers and business leads",
        "First employee, allowed to grow and influence company policy, direction, shared responsibilities and represented the company at industry events",
        "Created deployment pipelines for mobile application flight and release for the Play Store (with sideloading) and the App Store (with TestFlight)",
        "Frequently assisted with idea brainstorming and turning brainstorming results into proto-roadmaps for future consideration and development",
        "Key player in resolving multiple outages and incidents, from application server crashes, to queue congestion and network misconfiguration issues",
        "Participated in and influenced engineering discussion via github issues, pull request reviews and internal hackday presentations",
        "Pushed for efforts like more solid automated monitoring, tight code re-use and resolving data integrity issues in team meetings and town halls",
        "Assisted design teams and partners with usage and best practises of sketching tools such as Adobe XD and Sketch",
        "Introduced tooling such as Github Issues, JIRA/Trello, Asana to partners and mentored them on proper usage and workflows",
        "Assisted clients and partners in-situ with product releases, beta flights, brainstorming and design/interaction direction ",
        "Handled client infrastructure hand-offs via AWS and terraform Took ownership of community outreach efforts, actively participating in and sponsoring local events, in order to reach fresh talent",
        "Delivered and maintained 2 user facing and 4 administration-based React frontends with a focus on component-based reusability and composition",
        "Built and deployed backends in Elixir and Node.js scaled for 1000+ concurrent users, with extensive testing coverage and contract-based design",
        "Explored bleeding-edge tech such as React Native and Ethereum, turning them into delivered products after working closely with clients",
      ],
    },
    {
      role: "Lead Developer",
      date: "2014",
      companyName: "Mailcube, S.A.",
      companyLink:
        "http://web.archive.org/web/20160716182411/http://mailcube.com/",
      location: "Porto, PT",
      whatDo:
        "Led development team of next-gen performance and ease of use focused macOS email client with sophisticated features.",
      blurbs: [
        "Built Core-data powered performant application backend with a focus on tag search and cross-dimensional views",
        "Managed company infrastructure, from server instance acquisition to management of webserver and internal code repository nodes",
        "Mentored two MsC theses in the email field, aiding in language and tech review, suggesting research direction and references to previous work ",
        "Applied SCRUM methodologies to development, meeting with stakeholders weekly to present and review incremental results",
        "Led team of interns and senior year students, frequently consulting with management regarding scope and delivery dates",
        "Developed cocoa-based application in Objective-C, focusing on implementing pixel-perfect design specifications for look & feel",
        "Supported outsourced design team in tech and UI implementation / platform support issues, delivering 2 user-facing websites",
      ],
    },
    {
      role: "Masters in Informatics and Computing Engineering",
      date: "2009-2014",
      companyName: "Faculty of Engineering - University of Porto",
      companyLink:
        "https://sigarra.up.pt/feup/en/cur_geral.cur_view?pv_curso_id=742",
      location: "Porto, PT",
      whatDo:
        "Graduated 2014 with a curriculum that incentivizes self-learning and growth, gaining valuable self-learning and self-direction skills. 15.54 grade average.",
      blurbs: [
        "Served in the University Senate, fighting and achieving results in increasing student-worker rights",
        'Frequent team leader and "fixer" on team projects',
        "Gained experience in multiple languages, from C/C++ to Java, going even to Prolog.",
        "Learned about and gained hands-on experience with Agile methodologies",
        "Experience in seminar and conference management, having hosted 3+ seminars during college.",
        "4 year member of students association, gaining experience in team management, crisis handling, delegation and event management",
        "Attended multiple workshops/talks/hackathons, of note a 3 year run on the Codebits hackathon",
        "Deep involvement with university student groups as part of the Academic Affairs Council for 3 years",
        "Member of the Accompanying Committee, spearheading the creation of a yearly class feedback process that still goes on today",
      ],
    },
  ],
  tooling: {
    preamble: "Tools I shouldn't ever work without",
    rest: [
      [
        {
          Google:
            "The world's most powerful and complete repository of knowledge, used to mostly just understand what the error message I just got really means. Expert at search terms and knowing what to ask.",
          "VS Code":
            "Mainly due to the language server protocol, which enables very powerful code features, like semantic highlighting, really good autocomplete, symbol search, autodocumentation, etc. Better extension support than the leading brands (since nobody wants to deal with vimscript). Heavy code-server user.",
          "terminal emulator & zsh":
            "I keep a quake-like terminal on a system hotkey, since you can solve too many problems with bash scripts and pipes. Can exit from a vim window, and fork bomb your instances.",
          "git & Github":
            "Any VCS system is necessary nowadays, but the simplicity of git's model, workflows like the feature branch PR workflow, and code-review capabilities make git and github my favourite tool to develop software as a team (and by myself).",
          Terraform:
            'Primary reason why I like "devops" so much. Being able to setup your infrastructure and build/destroy it at will enables powerful things, such as easy personal developer environment setups and easy rollbacks in case of network config failure.',
          "ESLint & family":
            "Developers have much more to bicker about other than spaces vs tabs, bracket positioning and other silly details like it. Just code down how your code should be, as a team, then let the machines handle it on commit and enjoy peace of mind.",
        },
      ],
      [
        {
          asdf:
            "Amazing tool to setup dependencies from yarn to Node to erlang and keep them consistent across developer environments.",
          grep:
            "And ack. Find every needle in the haystack and sort it with a single bash line.",
          "CircleCI and CI in general":
            "Best integration and configuration capability, wether it's checking files for style issues or deploy a commit to production.",
          docker:
            "Or containerization in general, nothing like testing a script on linux by docker run -it ubuntu. K8s is gr8s",
          REPLs:
            "The core tool in my programmer arsenal. Having a proper REPL, specially allied to a powerful debugger suite, allows any developer to execute and inspect defects as they happen.",
          AWS:
            "My favoured cloud provider, even though it's hard making sure everything works neatly together. At least it does have provisioning availability.",
        },
      ],
      [
        {
          Asana:
            "Asana integrates with every service we could ask for, and its UI is unintrusive enough to power cross-functional-team coordination and project status visibility. But hey, I'll take Jira.",
          Slack:
            "Or Teams. Or Matrix. Or just plain ol' IRC. As long as it has channels, private messaging, webhook integration, voice and maybe video group calls and strong notification support, and as long as all the stakeholders are there, it works.",
          English:
            "Fluency with strong linguistic skills, being able to effectively communicate ideas across. Very very slight accent.",
          Illustrator:
            "Proeficient at media creation, settled on using Illustrator as a main driver (vs Photoshop) since vector design is way easier and manageable than raster design. Can step in a designer's shoes if need be.",
        },
      ],
    ],
  },
  talks: {
    preamble: "I like public speaking. Here's my best-recorded talks",
    rest: [
      {
        name: "React Natively",
        description:
          "A talk I gave at a couple of conferences about React Native, a framework to build snappy mobile apps with webdev-like technology. Went over the pros and cons of the framework, and live-demoed the development of a simple app to show off developer experience and MVP tool potential.",
        presentation: "https://www.youtube.com/watch?v=dSH7dDaA6pk",
        link: "https://brave-bartik-6be526.netlify.app/",
      },
      {
        name: 'A-Frame WebVR, aka "WebVR for people - even webdevs"',
        description:
          "Talk presented in Pixels Camp 2016 and a couple of meetups, about a WebVR framework, A-Frame, its uses (both in technical and not technical terms) and its future. I also share the insights we gained from developing a VR game MVP internally at Life on Mars.",
        presentation: "https://www.youtube.com/watch?v=30JiFcKkAHE",
        link: "https://laughing-varahamihira-06290f.netlify.app/#/",
      },
      {
        name: "A Server from Scratch -- A Devops Primer",
        description:
          "Workshop targetting entry-level devs and graduates, workshopping how the creation process of a webserver works via live demo and helping workshoppers personally. Used terraform and digital ocean to configure ~30 nodes and led workshoppers through the paces of installing a http server, a gitlab instance among other software.",
        link: "https://2017.makeorbreak.io/#workshops",
        image:
          "https://miro.medium.com/max/500/1*FJibZv-IEv5cxnJoCcKJgQ.jpeg",
      },
      {
        name: "Terraforming cloud cubed worlds - with one-liners and whimsy",
        description:
          "A talk intended for the cancelled Pixels Camp v4 in 2020, in which we 'live demo' the creation of something tangible from scratch - a fully featured minecraft server/administration platform - with a bit of flair and terraform.",
        link:
          "https://github.com/PixelsCamp/talks/blob/master/2020/terraforming-cubed-worlds_joao-anes.md",
      },
    ],
  },
  personalWork: {
    preamble:
      "I sometimes develop software for fun. Here's a couple of good examples.",
    rest: [
      {
        name: "raid.network",
        description:
          "Elixir-powered PWA to help Pokemon Go players find other players",
        blurbs: [
          "AWS-hosted, terraform managed infra-as-code",
          "Backend built with Elixir for scalability and developer experience",
          "Queue-based matchmaking systems",
          "Frontend managed and deployed with netlify",
          "React frontend web app, with simplified routing",
          "Heavy use of HTML5 notifications and service workers",
          "Heavy use of websockets for communication",
          "Clean backend separation of concerns, with http server and core services separated",
          "Backend tests for both app server and core modules",
          "Performant interactive frontend with inspired design and css animations",
          "Frontend testing via storybooks testing all application states",
        ],
        negs: [
          "No frontend logic testing",
          "Forthcoming chat support",
          "Needs a home and a community behind it",
        ],
        source: "https://github.com/joaoanes/autoraid"
      },
      {
        name: "shitpost.network",
        description:
          "Personal 9gag-like content aggregator, with a focus on link rot prevention",
        blurbs: [
          "AWS-hosted, terraform managed infra-as-code",
          "Backend built with Elixir for scalability and developer experience",
          "GraphQL-based API with mutations for interactibility",
          "SQS-based queues for post submission, categorization, tagging and spider work",
          "React frontend web app, optimized for media consumption and long-term storage",
          "Emoji-based reactions and tight, controlled user interaction",
          "Puppeteer-powered cost-effective scraping of multiple websites via AWS Lambda",
          "Heavy use of Node.js for scraping functions",
          "Module-based scraping system that allows for different websites to be scraped in multiple ways",
          "S3-backed file backup for content preservation",
          "Easy share links",
          "Telegram-based authentication via Telegram bot interaction",
          "Future focus on enabling content bots",
        ],
        negs: [
          "Barely any testing of core features",
          "Frankly confusing scraper backend modularization",
          "4-year development cruft and bad decision-making",
          "Currently on its fourth rewrite!",
        ],
        source: "https://github.com/joaoanes/shitposter"
      },
      {
        name: "This website!",
        description: "Svelte-based personal website",
        blurbs: [
          "Svelte-powered SPA",
          "Code-splitting (the code for the fancy background is 70% of the package so)",
          "100/100/100 Lighthouse score",
          "Fancy backgrounds enabled by three.js and WebGL",
          "Mobile support via grid system",
          "",
          "Static svelte site - which means it loads in <0.5 seconds",
          "Internationalization support",
          "Design inspired on existing CV design, adapted to mobile",
          "WebGL detection and custom shader background animation",
          "Entire text content stored in a single json file, allowing easy republishes"
        ],
        negs: [
          "Svelte isn't nearly as nice as React and I kind of don't like it",
          "CSS mix of component-scoped classes and a home-rolled tailwind-like class system",
          "No tests due to lack of imagination",
          "Uses sapper for static generation - but I'm sure I'm using it wrong",
          "I'm sure a Svelte dev can look at the code and guess my code heritage",
        ],
        source: "https://github.com/joaoanes/website",
      },
    ],
  },
  interests: {
    preamble: "Things I'm personally keeping tabs on (in no specific order)",
    rest: [
      "Full-stack development",
      "Mentoring in software",
      "ML-powered code creation and analysis",
      "Team management",
      "Release Planning and Management",
      "(useful) Agile methodologies",
      "Web frontend frameworks",
      "Concurrency management",
      "Scalability",
      "Engineering Code Standards",
      "User metrics research",
      "Product vision workmapping",
      "Gaming",
      "AI (in the \"classic\" 198ies sense)",
      "MLOps",
      "Culture sharing",
      "Fusion food",
      "Performance analysis",
      "ML-powered full-stack content creation",
      "Online community cultures",
      "Media preservation",
      "Event based architectures",
      "GraphQL",
      "Type systems",
    ],
  },
  cvCta: "Download my CV/Resume here in .pdf format",
  cvLink: "https://cv.joaoanes.website?redir=true",
  endQuote: "Thank you for your time and consideration",
  email: "hi@joaoanes.website",
  emailCta: "Drop me an email!",
}
