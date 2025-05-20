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
          description: "All publications from the UTN&#39;s Data Systems Group.",
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
        },{id: "news-hello-world-the-data-systems-lab-led-by-prof-andreas-kipf-is-officially-established-at-the-university-of-technology-nuremberg-announcement",
          title: 'Hello World! The Data Systems Lab led by Prof. Andreas Kipf is officially...',
          description: "",
          section: "News",},{id: "news-welcome-mihail-stoian-who-joins-the-data-systems-lab-as-a-doctoral-researcher",
          title: 'Welcome Mihail Stoian, who joins the Data Systems Lab as a Doctoral Researcher!...',
          description: "",
          section: "News",},{id: "news-welcome-alexander-van-renen-who-joins-the-data-systems-lab-as-its-first-postdoc",
          title: 'Welcome Alexander van Renen, who joins the Data Systems Lab as its first...',
          description: "",
          section: "News",},{id: "news-we-are-proud-to-announce-that-our-doctoral-researcher-andi-zimmerer-got-accepted-to-the-software-campus-program-an-accelerator-for-leadership-talents-the-additional-funding-of-115-000-will-help-us-to-focus-on-more-areas-of-interest",
          title: 'We are proud to announce that our doctoral researcher Andi Zimmerer got accepted...',
          description: "",
          section: "News",},{id: "news-welcome-back-andi-zimmerer-has-been-part-of-the-lab-since-its-inception-on-a-part-time-basis-but-now-we-are-happy-to-have-him-on-board-as-a-full-time-doctoral-researcher",
          title: 'Welcome back! Andi Zimmerer has been part of the lab since its inception...',
          description: "",
          section: "News",},{id: "news-our-paper-virtual-compressing-data-lake-files-by-mihail-stoian-et-al-received-a-best-demo-award-at-edbt-in-barcelona",
          title: 'Our paper “Virtual: Compressing Data Lake Files” by Mihail Stoian et al. received...',
          description: "",
          section: "News",},{id: "news-our-lab-received-a-honorable-mention-at-sigmod-for-the-paper-dpconv-super-polynomially-faster-join-ordering-by-mihail-stoian-and-prof-andreas-kipf",
          title: 'Our lab received a Honorable Mention at SIGMOD for the paper “DPconv: Super-Polynomially...',
          description: "",
          section: "News",},{
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
