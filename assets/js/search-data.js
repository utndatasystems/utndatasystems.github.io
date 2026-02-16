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
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "All publications from the Data Systems Lab.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Past and present research projects of the Data Systems Lab at UTN.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-github-lt-i-class-quot-fa-fa-external-link-small-p-1-quot-aria-hidden-quot-true-quot-gt-lt-i-gt",
          title: "GitHub&lt;i class=&quot;fa fa-external-link small p-1&quot; aria-hidden=&quot;true&quot;&gt;&lt;/i&gt;",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/https:/github.com/utndatasystems";
          },
        },{id: "post-benchmarking-semantic-query-processing-systems",
        
          title: "Benchmarking Semantic Query Processing Systems",
        
        description: "Semantic query processing is emerging as a new layer atop relational engines, elevating LLM-backed semantic operators to first-class SQL primitives for multimodal data. We present SemBench, the first benchmark to rigorously evaluate these systems end-to-end, and outline our roadmap towards our own system, Spectra, to make semantic operators affordable at scale.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/sembench/";
          
        },
      },{id: "post-democratizing-data-science",
        
          title: "Democratizing Data Science",
        
        description: "Our vision is to build an end-to-end agentic data platform, enabling domain experts to acquire, clean, analyze, and visualize data in a principled manner by combining the benefits of LLMs with decades of database research.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/dataloom/";
          
        },
      },{id: "post-launching-our-blog-and-wrapping-up-2025",
        
          title: "Launching Our Blog And Wrapping Up 2025",
        
        description: "I&#39;m super excited to launch our blog! We&#39;ll use this space to share what&#39;s happening in our lab, from research papers and systems to the day-to-day life of our team. To kick things off, let&#39;s look back at 2025.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/recap/";
          
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
          section: "News",},{id: "news-we-launched-our-blog-today-go-check-out-our-first-post",
          title: 'We launched our blog today. Go check out our first post!',
          description: "",
          section: "News",},{id: "news-luisa-neubauer-joins-our-team-as-a-doctoral-researcher-welcome-luisa",
          title: 'Luisa Neubauer joins our team as a doctoral researcher. Welcome, Luisa!',
          description: "",
          section: "News",},{id: "projects-spectra",
          title: 'Spectra',
          description: "Taking LLM-Based Semantic SQL Operators to the Limit With Our Own Multi-Modal Data Engine",
          section: "Projects",handler: () => {
              window.location.href = "/projects/spectra/";
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
