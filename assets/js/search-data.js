// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-home",
    title: "Home",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "All publications from the Data Systems Lab.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-github-lt-i-class-quot-fa-fa-external-link-small-p-1-quot-aria-hidden-quot-true-quot-gt-lt-i-gt",
          title: "GitHub&lt;i class=&quot;fa fa-external-link small p-1&quot; aria-hidden=&quot;true&quot;&gt;&lt;/i&gt;",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/https:/github.com/utndatasystems";
          },
        },{id: "news-hello-world-andreas-kipf-has-been-appointed-professor-of-data-systems-at-the-university-of-technology-nuremberg-read-the-announcement",
          title: 'Hello, world! Andreas Kipf has been appointed Professor of Data Systems at the...',
          description: "",
          section: "News",},{id: "news-a-warm-welcome-to-mihail-stoian-who-joins-the-data-systems-lab-as-a-doctoral-researcher",
          title: 'A warm welcome to Mihail Stoian, who joins the Data Systems Lab as...',
          description: "",
          section: "News",},{id: "news-we-are-excited-to-welcome-alexander-van-renen-to-the-data-systems-lab-as-our-first-postdoctoral-researcher",
          title: 'We are excited to welcome Alexander van Renen to the Data Systems Lab...',
          description: "",
          section: "News",},{id: "news-our-doctoral-researcher-andi-zimmerer-has-been-accepted-into-the-software-campus-program-securing-115-000-in-funding-to-explore-new-research-directions",
          title: 'Our doctoral researcher Andi Zimmerer has been accepted into the Software Campus program,...',
          description: "",
          section: "News",},{id: "news-after-contributing-part-time-since-the-lab-s-inception-andi-zimmerer-is-now-officially-joining-us-full-time-as-a-doctoral-researcher-welcome-aboard-andi",
          title: 'After contributing part-time since the lab’s inception, Andi Zimmerer is now officially joining...',
          description: "",
          section: "News",},{id: "news-our-paper-virtual-compressing-data-lake-files-by-mihail-stoian-et-al-received-a-best-demo-award-at-edbt-in-barcelona",
          title: 'Our paper “Virtual: Compressing Data Lake Files” by Mihail Stoian et al. received...',
          description: "",
          section: "News",},{id: "news-our-lab-will-present-three-paper-at-this-year-s-sigmod-in-berlin-dpconv-super-polynomially-faster-join-ordering-by-mihail-stoian-and-andreas-kipf-pruning-in-snowflake-working-smarter-not-harder-by-andreas-zimmerer-et-al-and-redbench-a-benchmark-reflecting-real-workloads-by-skander-krid-et-al",
          title: 'Our lab will present three paper at this year’s SIGMOD in Berlin: “DPconv:...',
          description: "",
          section: "News",},{id: "news-our-lab-received-an-honorable-mention-at-sigmod-for-the-paper-dpconv-super-polynomially-faster-join-ordering-by-mihail-stoian-and-andreas-kipf",
          title: 'Our lab received an Honorable Mention at SIGMOD for the paper “DPconv: Super-Polynomially...',
          description: "",
          section: "News",},{id: "news-our-lab-presented-two-paper-at-this-year-s-vldb-in-london-instance-optimized-string-fingerprints-and-parachute-single-pass-bi-directional-information-passing-both-by-mihail-stoian-et-al",
          title: 'Our lab presented two paper at this year’s VLDB in London: “Instance-Optimized String...',
          description: "",
          section: "News",},{id: "projects-dataloom",
          title: 'DataLoom',
          description: "Using the Power of AI to Democratize Data Science through Agentic Data Pipelines",
          section: "Projects",handler: () => {
              window.location.href = "/projects/dataloom/";
            },},{id: "projects-seehaus",
          title: 'Seehaus',
          description: "A Database With Waves",
          section: "Projects",handler: () => {
              window.location.href = "/projects/seehaus/";
            },},{id: "projects-spectra",
          title: 'Spectra',
          description: "Taking LLM-Based Semantic SQL Operators to the Limit With Our Own Multi-Modal Data Engine",
          section: "Projects",handler: () => {
              window.location.href = "/projects/spectra/";
            },},{id: "projects-virtual",
          title: 'Virtual',
          description: "Compressing Data Lake Storage Files Using Functional Inter-Column Dependencies",
          section: "Projects",handler: () => {
              window.location.href = "/projects/virtual/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%64%61%74%61-%73%79%73%74%65%6D%73@%75%74%6E.%64%65", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/utndatasystems", "_blank");
        },
      },{
        id: 'social-bluesky',
        title: 'Bluesky',
        section: 'Socials',
        handler: () => {
          window.open("https://bsky.app/profile/utndatasystems.bsky.social", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },];
