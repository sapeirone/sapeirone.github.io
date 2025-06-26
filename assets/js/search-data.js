// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-pubblications",
          title: "Pubblications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-posters",
          title: "Posters",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/posters/";
          },
        },{id: "nav-curriculum-vitae",
          title: "Curriculum Vitae",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "news-our-journal-article-egocentric-zone-aware-action-recognition-across-environments-was-accepted-at-pattern-recognition-letters",
          title: '🚀 Our journal article “Egocentric zone-aware action recognition across environments” was accepted at...',
          description: "",
          section: "News",},{id: "news-now-visiting-the-lts4-lab-at-epfl-under-the-supervision-of-prof-pascal-frossard-working-at-the-intersection-between-concepts-learning-and-video-understanding",
          title: '🎉 Now visiting the LTS4 lab at EPFL under the supervision of Prof....',
          description: "",
          section: "News",},{id: "news-️-i-presented-my-research-at-the-lts4-lab-you-can-find-the-slides-here",
          title: '🗣️ I presented my research at the LTS4 lab. You can find the...',
          description: "",
          section: "News",},{id: "news-we-are-presenting-hiero-and-hier-egopack-at-the-egovis-workshop-and-at-the-workshop-on-visual-concepts-cvpr-2025-see-you-there",
          title: '📢 We are presenting HiERO and Hier-EgoPack at the EgoVis Workshop and at...',
          description: "",
          section: "News",},{id: "news-our-paper-hiero-understanding-the-hierarchy-of-human-behavior-enhances-reasoning-on-egocentric-videos-was-accepted-at-iccv-2025-arxiv-here-see-you-in-honolulu",
          title: '🚀 Our paper “HiERO: understanding the hierarchy of human behavior enhances reasoning on...',
          description: "",
          section: "News",},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
