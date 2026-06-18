/**
 * Home Inserts Blog - Application Engine
 * Handles JSON fetching, rendering, routing, search, filtering, and simulated forms.
 */

// Global App State
const state = {
  posts: [],
  filteredPosts: [],
  activeCategory: 'All',
  searchQuery: '',
  currentPage: 1,
  postsPerPage: 6
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  seedUsers();
  setupActiveNavMenu();
  await loadPosts();
  initRouter();
  setupSidebarWidgets();
  setupGlobalSearch();
  setupNewsletter();
});

// Highlight the active page in the header navigation
function setupActiveNavMenu() {
  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  
  const navLinks = document.querySelectorAll('.nav-menu a, .header-top-menu a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === 'index.html' && href === '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Load posts from JSON and merge with local storage submissions
async function loadPosts() {
  try {
    const response = await fetch('./data/posts.json');
    if (!response.ok) throw new Error('Failed to load posts database.');
    const jsonPosts = await response.json();
    
    // Load submitted guest posts from localStorage
    const localPostsStr = localStorage.getItem('home_inserts_user_posts');
    const localPosts = localPostsStr ? JSON.parse(localPostsStr) : [];
    
    // Merge: Guest posts appear first as they are "new"
    let merged = [...localPosts, ...jsonPosts];
    
    // Filter out deleted/blocked posts
    const blockedStr = localStorage.getItem('home_inserts_blocked_posts') || '[]';
    const blocked = JSON.parse(blockedStr);
    if (blocked.length > 0) {
      merged = merged.filter(p => !blocked.includes(p.id));
    }
    
    state.posts = merged;
    state.filteredPosts = [...state.posts];
  } catch (error) {
    console.error('Error initializing data store:', error);
    showToast('Failed to load articles. Running in fallback mode.', 'error');
    
    // Fallback in case fetch fails due to absolute path issues in local file protocol
    state.posts = getFallbackPosts();
    state.filteredPosts = [...state.posts];
  }
}

// Route to the correct renderer based on the body data-page attribute
function initRouter() {
  const body = document.querySelector('body');
  const page = body.getAttribute('data-page');
  
  if (page === 'home') {
    renderHome();
    setupCategoryFilters();
  } else if (page === 'post') {
    renderPostDetail();
  } else if (page === 'contact') {
    setupContactForm();
  } else if (page === 'submit-guest') {
    setupGuestPostForm();
  } else if (page === 'author') {
    renderAuthor();
  }
}

// Set up Sidebar Widgets (Recent Posts, Categories list)
function setupSidebarWidgets() {
  const publishedPosts = state.posts.filter(p => !p.status || p.status === 'Published');

  // 1. Render Recent Posts in Sidebar (top 5 posts)
  const recentList = document.getElementById('recent-posts-list');
  if (recentList) {
    recentList.innerHTML = '';
    const recentPosts = publishedPosts.slice(0, 5);
    recentPosts.forEach(post => {
      const item = document.createElement('div');
      item.className = 'widget-post-item';
      item.innerHTML = `
        <img class="widget-post-thumb" src="${post.image}" alt="${post.title}">
        <div class="widget-post-info">
          <h4 class="widget-post-title">
            <a href="post.html?slug=${post.slug}">${post.title}</a>
          </h4>
          <span class="widget-post-date">${post.date}</span>
        </div>
      `;
      recentList.appendChild(item);
    });
  }

  // 2. Render Categories with post counts
  const catList = document.getElementById('categories-list');
  if (catList) {
    catList.innerHTML = '';
    const counts = {};
    
    // Count posts in each category
    publishedPosts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });

    // Sort categories alphabetically
    const sortedCats = Object.keys(counts).sort();
    sortedCats.forEach(cat => {
      const item = document.createElement('li');
      item.innerHTML = `
        <a href="index.html?category=${encodeURIComponent(cat)}">
          <span>${cat}</span>
          <span class="cat-count">${counts[cat]}</span>
        </a>
      `;
      catList.appendChild(item);
    });
  }
}

// Render Homepage (Grid & Pagination)
function renderHome() {
  const grid = document.getElementById('articles-grid');
  if (!grid) return;
  
  // Apply Category URL query filter if present
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  if (catParam && state.activeCategory === 'All') {
    state.activeCategory = catParam;
    // Set active button
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-category') === catParam) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  filterAndSearch();
  renderGridPage(state.currentPage);
}

// Filter posts according to active category and search input
function filterAndSearch() {
  state.filteredPosts = state.posts.filter(post => {
    // Check status
    const isPublished = !post.status || post.status === 'Published';
    if (!isPublished) return false;

    // Category match
    const categoryMatch = state.activeCategory === 'All' || post.category === state.activeCategory;
    
    // Search match
    const searchMatch = !state.searchQuery || 
      post.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()));
      
    return categoryMatch && searchMatch;
  });
}

// Helper to generate Featured Article Card HTML
function createFeaturedCardHTML(post) {
  return `
    <article class="featured-card">
      <div class="featured-media">
        <a href="post.html?slug=${post.slug}">
          <img src="${post.image}" alt="${post.title}">
        </a>
      </div>
      <div class="featured-body">
        <span class="featured-category">${post.category}</span>
        <h2 class="featured-title">
          <a href="post.html?slug=${post.slug}">${post.title}</a>
        </h2>
        <p class="featured-excerpt">${post.excerpt}</p>
        <div class="featured-meta">
          <span class="featured-author">${post.author}</span>
          <span class="featured-date">${post.date}</span>
        </div>
      </div>
    </article>
  `;
}

// Render specific page of cards
function renderGridPage(page) {
  const grid = document.getElementById('articles-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const total = state.filteredPosts.length;

  const featuredContainer = document.getElementById('featured-article-container');
  if (featuredContainer) {
    featuredContainer.innerHTML = '';
  }
  
  if (total === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <svg style="color:var(--color-body-light); margin-bottom:16px;" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 style="margin-bottom:8px; color:var(--color-heading);">No Articles Found</h3>
        <p style="color:var(--color-body-light);">We couldn't find any articles matching your selection. Try adjusting your search or filters.</p>
      </div>
    `;
    renderPagination(0);
    return;
  }

  let paginatedPosts = [];
  if (page === 1) {
    if (featuredContainer && total > 0) {
      // Render the most recent article in the Featured Article container
      const featuredPost = state.filteredPosts[0];
      featuredContainer.innerHTML = createFeaturedCardHTML(featuredPost);
      
      // Render the next 4 articles in the 2-column grid
      paginatedPosts = state.filteredPosts.slice(1, Math.min(state.postsPerPage - 1, total));
    } else {
      paginatedPosts = state.filteredPosts.slice(0, Math.min(state.postsPerPage, total));
    }
  } else {
    if (featuredContainer) {
      // For page > 1, start from post index 5 because page 1 consumed 5 posts (1 featured + 4 grid)
      const start = (page - 1) * state.postsPerPage - 1;
      const end = Math.min(start + state.postsPerPage, total);
      paginatedPosts = state.filteredPosts.slice(start, end);
    } else {
      const start = (page - 1) * state.postsPerPage;
      const end = Math.min(start + state.postsPerPage, total);
      paginatedPosts = state.filteredPosts.slice(start, end);
    }
  }

  paginatedPosts.forEach(post => {
    const card = document.createElement('article');
    card.className = 'entry-card';
    card.innerHTML = `
      <div class="card-media">
        <a href="post.html?slug=${post.slug}">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </a>
      </div>
      <div class="card-body">
        <span class="card-category">${post.category}</span>
        <h3 class="card-title">
          <a href="post.html?slug=${post.slug}">${post.title}</a>
        </h3>
        <p class="card-excerpt">${post.excerpt}</p>
        <div class="card-meta">
          <span class="meta-author">${post.author}</span>
          <span class="meta-date">${post.date}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  renderPagination(total);
}

// Render pagination control buttons
function renderPagination(totalPosts) {
  const container = document.getElementById('pagination-container');
  if (!container) return;

  container.innerHTML = '';
  
  const featuredContainer = document.getElementById('featured-article-container');
  let totalPages = 1;
  
  if (featuredContainer) {
    if (totalPosts <= state.postsPerPage - 1) {
      totalPages = 1;
    } else {
      totalPages = 1 + Math.ceil((totalPosts - (state.postsPerPage - 1)) / state.postsPerPage);
    }
  } else {
    totalPages = Math.ceil(totalPosts / state.postsPerPage);
  }
  
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `page-num ${state.currentPage === i ? 'active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      state.currentPage = i;
      renderGridPage(i);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    });
    container.appendChild(btn);
  }
}

// Set up Category Tab filters on Homepage
function setupCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      state.activeCategory = e.target.getAttribute('data-category');
      state.currentPage = 1;
      
      // Clean query parameter from URL
      const url = new URL(window.location);
      url.searchParams.delete('category');
      window.history.pushState({}, '', url);

      filterAndSearch();
      renderGridPage(1);
    });
  });
}

// Render single post page details
function renderPostDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  
  if (!slug) {
    redirectToHome();
    return;
  }

  // Find post
  const post = state.posts.find(p => p.slug === slug);
  if (!post) {
    showPostNotFound();
    return;
  }

  // Verify access for non-published posts
  const isPublished = !post.status || post.status === 'Published';
  if (!isPublished) {
    const currentUser = JSON.parse(sessionStorage.getItem('home_inserts_logged_in_user'));
    const isAuthor = currentUser && (currentUser.username === post.authorId || currentUser.name === post.author);
    const isAdminOrEditor = currentUser && ['Super Admin', 'Admin', 'Editor'].includes(currentUser.role);
    if (!isAuthor && !isAdminOrEditor) {
      showPostNotFound();
      return;
    }
  }

  // Set page SEO metadata, OG tags, Canonical, and Schema
  updatePageSEOMeta(post);

  // Render breadcrumbs
  const breadcrumbs = document.getElementById('breadcrumbs-nav');
  if (breadcrumbs) {
    breadcrumbs.innerHTML = `
      <a href="index.html">Home</a> &nbsp;&raquo;&nbsp;
      <a href="index.html?category=${encodeURIComponent(post.category)}">${post.category}</a> &nbsp;&raquo;&nbsp;
      <span>${post.title}</span>
    `;
  }

  // Populate Header elements
  document.getElementById('post-category-badge').textContent = post.category;
  document.getElementById('post-main-title').textContent = post.title;
  
  // Link author to author profile page
  const authorEl = document.getElementById('post-author');
  const authorSlug = (post.authorId || post.author || 'administrator').toLowerCase().replace(/\s+/g, '-');
  authorEl.innerHTML = `<a href="author.html?id=${authorSlug}" style="color:inherit; text-decoration:none; font-weight:700;">${post.author}</a>`;
  
  document.getElementById('post-date').textContent = post.date;
  document.getElementById('post-read-time').textContent = post.readTime;
  
  // Image
  const img = document.getElementById('post-featured-image');
  img.src = post.image;
  img.alt = post.title;

  // Article Content
  document.getElementById('post-body-content').innerHTML = post.content;

  // Append Author Bio Card
  renderPostAuthorCard(post);

  // Render Tags
  const tagsContainer = document.getElementById('post-tags-container');
  if (tagsContainer && post.tags && post.tags.length > 0) {
    tagsContainer.innerHTML = '<span>Tags:</span>';
    post.tags.forEach(tag => {
      const link = document.createElement('a');
      link.className = 'tag-link';
      link.href = '#';
      link.textContent = tag;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `index.html?search=${encodeURIComponent(tag)}`;
      });
      tagsContainer.appendChild(link);
    });
  }

  // Set up comments for this post
  setupComments(post.id);
  
  // Set up Social Share buttons
  setupShareButtons(post);
}

// Update page SEO title, canonical link, OG tags, and JSON-LD schema markup
function updatePageSEOMeta(post) {
  // 1. Title
  document.title = `${post.seoTitle || post.title} - Home Inserts`;

  // Helper for meta tags
  const setMeta = (nameOrProperty, content, isProperty = false) => {
    const selector = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`;
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      if (isProperty) el.setAttribute('property', nameOrProperty);
      else el.setAttribute('name', nameOrProperty);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 2. Meta Description
  setMeta('description', post.metaDescription || post.excerpt || '');

  // 3. Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', post.canonical || window.location.href);

  // 4. Open Graph
  setMeta('og:title', post.seoTitle || post.title, true);
  setMeta('og:description', post.metaDescription || post.excerpt || '', true);
  setMeta('og:image', post.ogImage || post.image || '', true);
  setMeta('og:url', window.location.href, true);
  setMeta('og:type', 'article', true);

  // 5. JSON-LD Schema
  let schemaEl = document.getElementById('post-schema-markup');
  if (schemaEl) {
    schemaEl.remove();
  }
  schemaEl = document.createElement('script');
  schemaEl.id = 'post-schema-markup';
  schemaEl.type = 'application/ld+json';
  
  // Format date
  let dateStr = new Date().toISOString().split('T')[0];
  if (post.date) {
    try {
      const parsedDate = new Date(post.date);
      if (!isNaN(parsedDate.getTime())) {
        dateStr = parsedDate.toISOString().split('T')[0];
      }
    } catch(e) {}
  }

  const cleanBody = (post.content || '').replace(/<[^>]*>/g, ' ');

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "headline": post.title,
    "description": post.metaDescription || post.excerpt || '',
    "image": post.image || '',
    "datePublished": dateStr,
    "author": {
      "@type": "Person",
      "name": post.author || 'Administrator'
    },
    "publisher": {
      "@type": "Organization",
      "name": "Home Inserts",
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800"
      }
    },
    "articleBody": cleanBody.length > 500 ? cleanBody.slice(0, 500) + '...' : cleanBody
  };

  schemaEl.text = JSON.stringify(schemaData, null, 2);
  document.head.appendChild(schemaEl);
}

function redirectToHome() {
  window.location.href = 'index.html';
}

function showPostNotFound() {
  const container = document.getElementById('single-post-container');
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 80px 20px;">
        <h2 style="margin-bottom:12px; color:var(--color-heading);">Article Not Found</h2>
        <p style="color:var(--color-body-light); margin-bottom:24px;">The article you are looking for does not exist or has been removed.</p>
        <a href="index.html" class="btn" style="display:inline-block; width:auto; padding:12px 30px;">Return to Homepage</a>
      </div>
    `;
  }
}

// Manage Comments Form and Rendering
function setupComments(postId) {
  const list = document.getElementById('comments-list');
  const form = document.getElementById('comment-form');
  const countEl = document.getElementById('comments-count-title');
  
  if (!list || !form) return;

  const getComments = () => {
    const commentsStr = localStorage.getItem(`post_${postId}_comments`);
    return commentsStr ? JSON.parse(commentsStr) : getSampleComments();
  };

  const saveComments = (comments) => {
    localStorage.setItem(`post_${postId}_comments`, JSON.stringify(comments));
  };

  const renderComments = () => {
    const comments = getComments();
    list.innerHTML = '';
    countEl.textContent = `${comments.length} Comments`;

    if (comments.length === 0) {
      list.innerHTML = '<p style="color:var(--color-body-light); text-align:center; padding: 20px 0;">No comments yet. Be the first to share your thoughts!</p>';
      return;
    }

    comments.forEach(comment => {
      const initials = comment.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML = `
        <div class="comment-avatar">${initials}</div>
        <div class="comment-content">
          <h4 class="comment-author">${comment.author}</h4>
          <div class="comment-date">${comment.date}</div>
          <p class="comment-text">${comment.text}</p>
        </div>
      `;
      list.appendChild(item);
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');

    if (!nameInput.value.trim() || !textInput.value.trim()) {
      showToast('Please fill out all fields.', 'error');
      return;
    }

    const newComment = {
      author: nameInput.value.trim(),
      text: textInput.value.trim(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    const comments = getComments();
    comments.push(newComment);
    saveComments(comments);
    
    // Reset inputs
    nameInput.value = '';
    textInput.value = '';

    renderComments();
    showToast('Comment posted successfully!', 'success');
  });

  renderComments();
}

function getSampleComments() {
  return [
    {
      author: "Jane Doe",
      text: "This article was incredibly helpful! The dimensions section cleared up a lot of doubts for our kitchen remodeling layout.",
      date: "June 1, 2026"
    },
    {
      author: "Robert Smith",
      text: "Awesome read. Highly recommend anti-fatigue mats. I bought one last year and it has completely saved my back during long prepping sessions.",
      date: "May 29, 2026"
    }
  ];
}

// Social share actions
function setupShareButtons(post) {
  const shareContainer = document.getElementById('post-share-container');
  if (!shareContainer) return;

  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(post.title);

  shareContainer.innerHTML = `
    <span class="share-title">Share Article:</span>
    <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" class="share-btn facebook" aria-label="Share on Facebook">F</a>
    <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}" target="_blank" class="share-btn twitter" aria-label="Share on X">X</a>
    <a href="https://pinterest.com/pin/create/button/?url=${url}&description=${title}" target="_blank" class="share-btn pinterest" aria-label="Share on Pinterest">P</a>
    <a href="https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}" target="_blank" class="share-btn linkedin" aria-label="Share on LinkedIn">L</a>
    <a href="mailto:?subject=${title}&body=${url}" class="share-btn email" aria-label="Share via Email">@</a>
  `;
}

// Live Search widget and search popup
function setupGlobalSearch() {
  const searchInputs = document.querySelectorAll('.search-input');
  
  searchInputs.forEach(input => {
    // Create dropdown panel dynamically for this input parent if it has search-form class
    const form = input.closest('.search-form');
    if (!form) return;
    
    const panel = document.createElement('div');
    panel.className = 'search-results-panel';
    form.appendChild(panel);

    // Keyup event for instant search results
    input.addEventListener('keyup', (e) => {
      const val = e.target.value.trim().toLowerCase();
      if (!val) {
        panel.style.display = 'none';
        return;
      }

      // Filter matching posts
      const matches = state.posts.filter(p => 
        p.title.toLowerCase().includes(val) || 
        p.excerpt.toLowerCase().includes(val) ||
        p.category.toLowerCase().includes(val)
      ).slice(0, 4); // Limit to top 4

      panel.innerHTML = '';
      if (matches.length === 0) {
        panel.innerHTML = '<div style="padding: 12px 16px; font-size:13px; color:var(--color-body-light); text-align:center;">No results found</div>';
      } else {
        matches.forEach(p => {
          const item = document.createElement('a');
          item.href = `post.html?slug=${p.slug}`;
          item.className = 'search-result-item';
          item.innerHTML = `
            <img class="search-result-img" src="${p.image}">
            <div class="search-result-info">
              <div class="search-result-title">${p.title}</div>
              <div class="search-result-meta">${p.category} &bull; ${p.date}</div>
            </div>
          `;
          panel.appendChild(item);
        });
      }
      panel.style.display = 'block';
    });

    // Close panel on click outside
    document.addEventListener('click', (e) => {
      if (!form.contains(e.target)) {
        panel.style.display = 'none';
      }
    });

    // Handle submit search (homepage filtering)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      panel.style.display = 'none';
      
      const body = document.querySelector('body');
      if (body.getAttribute('data-page') === 'home') {
        state.searchQuery = val;
        state.currentPage = 1;
        filterAndSearch();
        renderGridPage(1);
      } else {
        // Redirect to homepage with search query
        window.location.href = `index.html?search=${encodeURIComponent(val)}`;
      }
    });
  });

  // Check URL params for search queries on home page
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  if (searchParam) {
    const searchField = document.querySelector('.search-input');
    if (searchField) {
      searchField.value = searchParam;
    }
    state.searchQuery = searchParam;
    filterAndSearch();
    renderGridPage(1);
  }
}

// Setup newsletter signup forms
function setupNewsletter() {
  const form = document.getElementById('newsletter-subscribe');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value.trim();
    if (!email || !validateEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    showToast('Thank you! You have successfully subscribed to our newsletter.', 'success');
    document.getElementById('newsletter-email').value = '';
  });
}

// Contact Form Handler
function setupContactForm() {
  const form = document.getElementById('contact-form-element');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const captcha = document.getElementById('contact-captcha').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (captcha !== '7' && captcha !== 'seven') {
      showToast('Captcha verification failed. Please enter the correct mathematical answer.', 'error');
      return;
    }

    // Success response
    showToast('Your message has been sent successfully. We will get back to you shortly!', 'success');
    form.reset();
  });
}

// Guest Post Submission Portal & Live Preview Editor
function setupGuestPostForm() {
  const form = document.getElementById('guest-post-form');
  if (!form) return;

  const inputs = {
    title: document.getElementById('guest-title'),
    author: document.getElementById('guest-author'),
    category: document.getElementById('guest-category'),
    image: document.getElementById('guest-image'),
    excerpt: document.getElementById('guest-excerpt'),
    content: document.getElementById('guest-content')
  };

  const previews = {
    category: document.getElementById('p-category'),
    title: document.getElementById('p-title'),
    author: document.getElementById('p-author'),
    date: document.getElementById('p-date'),
    excerpt: document.getElementById('p-excerpt'),
    content: document.getElementById('p-content'),
    image: document.getElementById('p-image')
  };

  // Live updates
  const updatePreview = () => {
    previews.category.textContent = inputs.category.value || 'Category';
    previews.title.textContent = inputs.title.value || 'Your Article Title';
    previews.author.textContent = inputs.author.value || 'Author Name';
    previews.date.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    previews.excerpt.textContent = inputs.excerpt.value || 'A brief summary of your article will appear here...';
    previews.content.innerHTML = inputs.content.value ? inputs.content.value.replace(/\n/g, '<br>') : '<p>Your full article content will render here in real-time as you type...</p>';
    
    if (inputs.image.value) {
      previews.image.src = inputs.image.value;
      previews.image.style.display = 'block';
    } else {
      previews.image.style.display = 'none';
    }
  };

  // Hook inputs to update preview dynamically
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', updatePreview);
  });

  // Handle submit guest article
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const titleVal = inputs.title.value.trim();
    const authorVal = inputs.author.value.trim();
    const categoryVal = inputs.category.value;
    const imageVal = inputs.image.value.trim() || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';
    const excerptVal = inputs.excerpt.value.trim();
    const contentVal = inputs.content.value.trim();

    if (!titleVal || !authorVal || !categoryVal || !excerptVal || !contentVal) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    // Create unique slug
    const slug = titleVal
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-') // collapse whitespace to hyphens
      .replace(/-+/g, '-'); // collapse duplicate hyphens

    const newPost = {
      id: Date.now(),
      title: titleVal,
      slug: slug,
      category: categoryVal,
      tags: ["Guest Post", categoryVal],
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: authorVal,
      readTime: `${Math.max(2, Math.ceil(contentVal.split(' ').length / 200))} min read`,
      image: imageVal,
      excerpt: excerptVal,
      content: `<h2>Introduction</h2>${contentVal.replace(/\n/g, '<p></p>')}`
    };

    // Save to localStorage list of guest submissions for admin review
    const submissionsStr = localStorage.getItem('home_inserts_guest_submissions');
    const submissions = submissionsStr ? JSON.parse(submissionsStr) : [];
    submissions.unshift(newPost); // Add at the start
    localStorage.setItem('home_inserts_guest_submissions', JSON.stringify(submissions));

    showToast('Article submitted for review successfully!', 'success');
    form.reset();
    updatePreview();
    
    // Redirect to home after 1.5 seconds
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  });
}

// Helpers
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Premium Toast Alert Notification
function showToast(message, type = 'success') {
  let toast = document.getElementById('site-toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.className = `toast ${type} show`;
  toast.innerHTML = `
    <span style="font-weight:600;">${type === 'success' ? 'âœ“' : 'âœ—'}</span>
    <span>${message}</span>
  `;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Fallback Articles in case fetch fails
function getFallbackPosts() {
  return [
  {
    "id": 1,
    "title": "Best Tall Dresser Options for 2026: Complete Buying Guide",
    "slug": "best-tall-dresser-options-for-2026-complete-buying-guide",
    "category": "Decor & Renovate",
    "tags": ["Dresser", "Furniture", "Bedroom", "Storage"],
    "date": "June 4, 2026",
    "author": "Farhan Ellahi",
    "readTime": "6 min read",
    "image": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
    "excerpt": "Looking to maximize your bedroom storage without sacrificing floor space? Discover the best tall dresser designs, materials, and features dominating 2026 bedroom styling.",
    "content": "<h2>Introduction</h2><p>Maximizing bedroom storage is one of the greatest design challenges, especially in modern apartments and smaller homes. When floor space is at a premium, the only direction to go is up. That is where the <strong>tall dresser</strong> (often referred to as a chest of drawers or a highboy) becomes an essential piece of furniture.</p><p>In this comprehensive 2026 buying guide, we'll walk you through the top-rated tall dresser options, explore key materials, analyze spatial configurations, and share styling tips to help you select a piece that is both highly functional and visually striking.</p><h2>Why Choose a Tall Dresser?</h2><p>Unlike wide, double-column dressers that dominate wall space, a tall dresser offers vertical storage. It typically features five to seven drawers stacked vertically, requiring a footprint of only 30 to 36 inches in width while standing 48 to 60 inches tall.</p><ul><li><strong>Space Efficiency:</strong> Perfect for narrow walls, corners, or spaces between windows.</li><li><strong>Visual Height:</strong> Draws the eye upward, making ceilings feel higher.</li><li><strong>Organized Separation:</strong> Individual drawers allow you to segment different clothing types easily (e.g., socks, undergarments, shirts).</li></ul><h2>Key Styles Dominating 2026</h2><h3>1. Mid-Century Modern</h3><p>Characterized by tapered dowel legs, clean lines, and warm wood tones like walnut and teak. These dressers offer a timeless aesthetic that blends seamlessly with organic modern styling.</p><h3>2. Minimalist Contemporary</h3><p>Features handle-less designs (push-to-open mechanisms or integrated J-pull channels) and matte finishes. They often come in monochrome shadesâ€”soft beige, charcoal gray, or sleek matte white.</p><h3>3. Rustic Industrial</h3><p>Combines distressed solid wood drawer fronts with matte black steel framing. Ideal for adding texture and raw appeal to loft spaces or modern farmhouses.</p><h2>Important Buying Considerations</h2><table><thead><tr><th>Factor</th><th>Recommendation</th><th>Why It Matters</th></tr></thead><tbody><tr><td>Material</td><td>Solid wood or High-density MDF</td><td>Determines lifetime durability and weight capacity.</td></tr><tr><td>Safety</td><td>Must include Anti-Tip anchors</td><td>Crucial for tall furniture to prevent accidents.</td></tr><tr><td>Drawer Slides</td><td>Soft-close under-mount slides</td><td>Provides smooth glide and prevents slamming noise.</td></tr></tbody></table><p>Before purchasing, always measure your ceiling height and door clearances, and check that the drawers can fully extend without hitting your bed or other nearby items.</p>"
  },
  {
    "id": 2,
    "title": "Single Hole Bathroom Faucet Installation Guide: 8 Essential Steps for Modern Bathrooms",
    "slug": "single-hole-bathroom-faucet-installation-guide-8-essential-steps-for-modern-bathrooms",
    "category": "Decor & Renovate",
    "tags": ["Bathroom", "DIY", "Plumbing", "Faucet"],
    "date": "June 2, 2026",
    "author": "Aijaz Ahmad",
    "readTime": "5 min read",
    "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    "excerpt": "Ready to upgrade your vanity? Follow this step-by-step DIY guide to install a single-hole bathroom faucet like a professional plumber.",
    "content": "<h2>Introduction</h2><p>Upgrading your bathroom faucet is one of the quickest and most cost-effective ways to modernize your vanity. A single-hole faucet offers a clean, uncluttered profile that matches contemporary minimalist designs. Whether you are replacing an old faucet or installing a new one on a fresh countertop, this 8-step guide will help you achieve a leak-free, professional installation.</p><h2>Tools and Materials Needed</h2><ul><li>New single-hole faucet and matching escutcheon plate (if converting from a 3-hole setup)</li><li>Adjustable wrench & Basin wrench</li><li>Plumber's tape (Teflon tape)</li><li>Bucket and old towels</li><li>Silicone caulk (optional, for the drain assembly)</li></ul><h2>The 8 Installation Steps</h2><h3>Step 1: Shut Off the Water Valves</h3><p>Locate the hot and cold water shut-off valves underneath your sink. Turn them clockwise until they are fully closed. Open the old faucet to drain any remaining water in the lines.</p><h3>Step 2: Disconnect Supply Lines</h3><p>Place a bucket under the connections. Using an adjustable wrench, disconnect the supply lines from the shut-off valves, then disconnect them from the old faucet shank.</p><h3>Step 3: Remove the Old Faucet and Clean the Area</h3><p>Unscrew the mounting nut underneath the sink holding the old faucet in place. Lift the old faucet out from the top. Clean the sink surface thoroughly to remove any old plumber's putty, mold, or limescale buildup.</p><h3>Step 4: Prepare the New Faucet</h3><p>Feed the faucet supply lines and shank through the rubber gasket. If you are covering an old 3-hole layout, place the escutcheon deck plate over the sink holes first.</p><h3>Step 5: Position and Mount the Faucet</h3><p>Thread the supply lines and mounting shank down through the center hole. From underneath the sink, slide the metal washer and mounting nut onto the shank. Hand-tighten, align the faucet above, then secure tightly using a basin wrench.</p><h3>Step 6: Connect Supply Lines</h3><p>Wrap the shut-off valve threads with Teflon tape. Screw the supply lines onto the hot and cold valves, ensuring you connect hot-to-hot and cold-to-cold. Tighten gently with a wrenchâ€”do not over-tighten, as it can crack the rubber seals.</p><h3>Step 7: Install the Drain Assembly</h3><p>Remove the old drain flange and tailpiece. Install the new pop-up drain assembly that came with your faucet. Use silicone sealant under the new flange for a secure seal, and tighten the locknut underneath.</p><h3>Step 8: Flush the System and Check for Leaks</h3><p>Remove the aerator from your new faucet. Turn the water supply valves back on. Run the faucet for 1 minute to flush out any debris. Check all connections under the sink for signs of dampness. If everything is dry, reinstall the aerator, and celebrate your successful project!</p>"
  },
  {
    "id": 3,
    "title": "Kitchen Island with Seating: The Complete 2026 Design Guide",
    "slug": "kitchen-island-with-seating-the-complete-2026-design-guide",
    "category": "Decor & Renovate",
    "tags": ["Kitchen", "Interior Design", "Remodeling", "Furniture"],
    "date": "May 28, 2026",
    "author": "Farhan Ellahi",
    "readTime": "7 min read",
    "image": "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=800",
    "excerpt": "A kitchen island with seating is the ultimate hub for modern homes. Learn how to plan dimensions, clearance, bar stool height, and layout styles.",
    "content": "<h2>The Evolution of the Kitchen Island</h2><p>Today's kitchen is much more than a place to prep meals; it is the social center of the household. A well-designed kitchen island with seating bridges the gap between culinary work zone and casual dining space, facilitating conversation while the cook works.</p><p>Designing an island requires balancing aesthetics with functional clearances. This guide details the essential measurements, counter heights, and design considerations for 2026.</p><h2>Crucial Clearances & Spacing</h2><p>The number one mistake homeowners make when adding an island is restricting traffic flow. You must maintain sufficient walkways around all sides of the island.</p><ul><li><strong>Minimum Clearance:</strong> You need at least 36 inches of walkway space.</li><li><strong>Optimal Clearance:</strong> 42 inches is ideal for a single cook; 48 inches is recommended for multi-cook households to allow two people to pass comfortably.</li><li><strong>Seating Depth (Knee Room):</strong> Allow a minimum of 12 inches of overhang for counter-height seating, though 15 inches is far more comfortable.</li></ul><h2>Matching Island Height to Seating</h2><p>The height of your island countertop dictates the type of stools you must purchase:</p><table><thead><tr><th>Island Style</th><th>Countertop Height</th><th>Stool Seat Height</th></tr></thead><tbody><tr><td>Table Height</td><td>30 inches</td><td>18 to 20 inches</td></tr><tr><td>Standard Counter</td><td>36 inches</td><td>24 to 26 inches</td></tr><tr><td>Bar Height</td><td>42 inches</td><td>28 to 30 inches</td></tr></tbody></table><h2>Layout Inspirations for 2026</h2><h3>The Cantilevered Cant</h3><p>An elegant modern solution where a thick slab of stone (such as quartz or marble) extends unsupported over one side of the island base, creating a seamless, floating bar counter.</p><h3>The Double-Tiered Island</h3><p>Provides a 36-inch high counter for prep work on the cooking side, and a raised 42-inch high bar on the dining side. This hides kitchen clutter from view and creates a distinct boundary.</p>"
  },
  {
    "id": 4,
    "title": "Best Bedroom Colors for Better Sleep and Style in 2026",
    "slug": "best-bedroom-colors-for-better-sleep-and-style-in-2026",
    "category": "Sleep & Comfort",
    "tags": ["Bedroom", "Color Theory", "Sleep", "Wellness"],
    "date": "May 25, 2026",
    "author": "Dr. Sarah Jenkins",
    "readTime": "5 min read",
    "image": "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
    "excerpt": "Did you know your bedroom wall color can impact your sleep duration? Discover the top calming color palettes recommended by sleep psychologists for 2026.",
    "content": "<h2>Color Psychology and Sleep Quality</h2><p>Your surroundings have a direct impact on your nervous system. Bright, high-energy colors like red or vibrant yellow stimulate heart rate and mental activity, which is the exact opposite of what you want when winding down for bed. Sleep experts have found that cool colors with quiet, muted undertones promote calm by lowering blood pressure and slowing down your heart rate.</p><p>Let's look at the absolute best color schemes for sleep and style in 2026.</p><h2>Top Sleep-Promoting Colors</h2><h3>1. Slate Blue and Soft Teal</h3><p>Blue is universally recognized as the most soothing color. Receptors in our retinas (called ganglion cells) are highly sensitive to blue, which signals to our brain that we are in a calm environment. Opt for chalky, muted blue-grays or soft misty teals to keep the space sophisticated rather than child-like.</p><h3>2. Sage and Olive Greens</h3><p>Green represents nature, growth, and tranquility. Muted green shades like sage, olive, or eucalyptus establish an organic connection that grounds the mind, helping reduce stress and anxiety from the day.</p><h3>3. Warm Taupe and Oatmeal</h3><p>If you prefer neutrals, avoid stark cold whites, which can feel sterile and clinical. Instead, go for warm, earthy neutrals like taupe, soft sand, and oatmeal. These colors provide a cozy, cocoon-like atmosphere that feels inviting.</p><h2>Colors to Avoid in the Bedroom</h2><ul><li><strong>Crimson Red:</strong> Encourages excitement, passion, and alertness.</li><li><strong>Neon Colors:</strong> Visual noise that prevents the brain from entering low-activity states.</li><li><strong>Stark Dark Purple:</strong> Stimulates vivid dreaming and active thinking, which can cause you to wake up feeling unrefreshed.</li></ul>"
  },
  {
    "id": 5,
    "title": "Best Living Room Rugs for Style and Comfort in 2026",
    "slug": "best-living-room-rugs-for-style-and-comfort-in-2026",
    "category": "Decor & Renovate",
    "tags": ["Living Room", "Rugs", "Home Decor", "Textiles"],
    "date": "May 18, 2026",
    "author": "Farhan Ellahi",
    "readTime": "5 min read",
    "image": "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800",
    "excerpt": "A rug acts as the anchor of your living room. Discover the leading textures, materials, and size rules to select a perfect rug this year.",
    "content": "<h2>The Power of a Great Rug</h2><p>An empty living room can feel loud, echoey, and disconnected. Placing the right rug instantly pulls the furniture together, defines the zone, dampens acoustics, and adds physical warmth underfoot. A rug is often called the 'fifth wall' because it holds equal design weight to the paint colors or furniture layout.</p><h2>Material Comparison for Living Rooms</h2><table><thead><tr><th>Material</th><th>Pros</th><th>Cons</th><th>Best For</th></tr></thead><tbody><tr><td>Wool</td><td>Extremely durable, flame-resistant, luxurious feel</td><td>Higher cost, sheds initially</td><td>High-traffic family rooms</td></tr><tr><td>Jute / Sisal</td><td>Organic look, highly durable, affordable</td><td>Coarse texture, absorbs spills easily</td><td>Coastal and modern rustic styles</td></tr><tr><td>Polypropylene</td><td>Stain-resistant, easy to clean, budget-friendly</td><td>Synthetic feel, less lifespan</td><td>Homes with pets and kids</td></tr></tbody></table><h2>Getting the Rug Size Right</h2><p>The single most common decorating mistake is buying a rug that is too small. A tiny rug makes the whole room look cramped and disjointed.</p><ul><li><strong>The 'All Legs On' Rule:</strong> For large rooms, choose a rug (like a 9x12 or 10x14) where all major furniture pieces sit entirely on the rug.</li><li><strong>The 'Front Legs On' Rule:</strong> The most popular setup. Place a rug (typically 8x10) so that the front feet of the sofa and accent chairs sit on the rug, binding them together.</li><li><strong>Never do the 'Coffee Table Only' float:</strong> A small rug that only holds the coffee table and doesn't touch the sofa looks like a floating postage stamp. Avoid it!</li></ul>"
  },
  {
    "id": 6,
    "title": "Best Anti Fatigue Kitchen Mats 2026: Why Your Current Floor Solution Is Failing You",
    "slug": "best-anti-fatigue-kitchen-mats-2026",
    "category": "Kitchen",
    "tags": ["Kitchen", "Ergonomics", "Wellness", "Floor Mats"],
    "date": "May 12, 2026",
    "author": "Dr. Sarah Jenkins",
    "readTime": "4 min read",
    "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
    "excerpt": "Standing on hard kitchen floors causes joint stress and lower back fatigue. Find out why high-density polyurethane anti-fatigue mats are crucial for your health.",
    "content": "<h2>The Strain of Hardwood and Tile</h2><p>Many of us spend hours standing in the kitchenâ€”prepping veggies, cooking, washing dishes, and chatting around the island. If your kitchen has concrete, tile, or hardwood floors, you are placing enormous pressure on your heels, knees, hips, and lower back. Hard surfaces restrict blood circulation, leading to physical fatigue and joint soreness.</p><p>Anti-fatigue mats are engineered to solve this exact problem by providing micro-instability that forces your calves and feet to make subtle adjustments, keeping blood flowing and reducing joint load.</p><h2>What to Look for in an Anti-Fatigue Mat</h2><h3>1. Material Core</h3><p>Avoid cheap foam mats that collapse to the floor under your weight. Instead, seek out 100% high-density polyurethane. Polyurethane offers a perfect balance of soft cushioning and firm support, returning to its shape immediately.</p><h3>2. Beveled Edges</h3><p>Safety is key. Look for mats with beveled (slanted) edges that sit flat against the floor. This prevents the mat from becoming a tripping hazard while you move around with hot pots or sharp knives.</p><h3>3. Non-Slip Backing</h3><p>The kitchen is a splash-prone area. Ensure the mat has a textured, non-skid bottom that won't slide around on wet tile or polished wood.</p>"
  },
  {
    "id": 7,
    "title": "Protecting Your Charlotte Lawn: A Complete Guide to Grub Control and Prevention",
    "slug": "protecting-your-charlotte-lawn-complete-guide-to-grub-control-and-prevention",
    "category": "Outdoor & Landscaping",
    "tags": ["Lawn Care", "Gardening", "Pest Control", "Charlotte"],
    "date": "May 05, 2026",
    "author": "Marcus Thorne",
    "readTime": "6 min read",
    "image": "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?auto=format&fit=crop&q=80&w=800",
    "excerpt": "Grubs can destroy a healthy lawn in weeks. Learn how to identify grub damage and apply preventative solutions specifically suited for Charlotte's climate.",
    "content": "<h2>The Grub Threat in North Carolina</h2><p>For homeowners in the Charlotte metro area, maintaining a lush lawn is a point of pride. However, beneath the green blades, a silent destroyer could be chewing through your grass roots. White grubsâ€”the larval stage of beetles like Japanese Beetles, June Bugs, and Masked Chafersâ€”feed aggressively on roots, cutting off water and nutrients to your lawn.</p><h2>How to Identify Grub Damage</h2><p>Grub damage usually starts appearing in late summer (August through October) as beetles lay eggs in July. Look out for these warning signs:</p><ul><li><strong>Spongy Turf:</strong> The ground feels bouncy or spongy when walked on.</li><li><strong>Irregular Brown Patches:</strong> The lawn turns brown in random sections, even with adequate watering.</li><li><strong>The Carpet Test:</strong> You can pull the grass up easily like a carpet, as the root structure has been entirely chewed away.</li><li><strong>Wildlife Digging:</strong> Birds, raccoons, and moles digging up your lawn, as grubs are a delicious protein source for them.</li></ul><h2>Preventative vs. Curative Treatments</h2><p>Understanding the timing of grub treatments is critical to success:</p><h3>Preventative Treatments (Apply June to Mid-July)</h3><p>These are applied before the grub eggs hatch. Systemic insecticides sit in the soil and eliminate young larvae as they emerge. This is the most effective way to protect your grass.</p><h3>Curative Treatments (Apply August to September)</h3><p>If you already have active, mature grubs chewing your lawn, preventatives won't work. You must apply a contact curative insecticide (like dylox) and water it in immediately to kill the grubs on contact.</p>"
  },
  {
    "id": 8,
    "title": "Bathroom Remodel in Austin: What It Really Costs, How Long It Takes, and Who to Hire",
    "slug": "bathroom-remodel-in-austin-what-it-really-costs-how-long-it-takes-and-who-to-hire",
    "category": "Decor & Renovate",
    "tags": ["Bathroom", "Austin", "Remodeling", "Budget"],
    "date": "April 29, 2026",
    "author": "Marcus Thorne",
    "readTime": "7 min read",
    "image": "https://images.unsplash.com/photo-1620626011761-996317b69763?auto=format&fit=crop&q=80&w=800",
    "excerpt": "Renovating a bathroom in Austin, Texas? Get the realistic 2026 cost breakdown, timeline expectations, and local contractor hiring tips.",
    "content": "<h2>The Remodeling Boom in Austin</h2><p>Austin's housing market has seen massive growth, and homeowners are increasingly choosing to renovate their current spaces rather than buy new. The bathroom is the second most popular room to remodel (after the kitchen) and offers some of the highest returns on investment.</p><p>However, remodeling in Central Texas has unique variables. Let's look at the actual costs, permit rules, and timelines for Austin in 2026.</p><h2>Cost Breakdown by Project Scope</h2><table><thead><tr><th>Remodel Type</th><th>Average Cost Range (Austin)</th><th>Key Deliverables</th></tr></thead><tbody><tr><td>Cosmetic Refresh</td><td>$6,500 - $12,000</td><td>New vanity, fixtures, paint, toilet, and basic flooring overlay.</td></tr><tr><td>Mid-Range Remodel</td><td>$15,000 - $28,000</td><td>New tile tub surround, custom vanity, quartz counters, updated plumbing.</td></tr><tr><td>Luxury Wet-Room</td><td>$35,000 - $60,000+</td><td>Walk-in steam shower, standalone soaking tub, heated floors, smart mirrors.</td></tr></tbody></table><h2>Austin Timeline and Permitting</h2><p>A standard mid-range remodel takes between <strong>3 to 5 weeks</strong> of active construction. If your project involves moving plumbing lines or electrical panels, you will need a residential building permit from the City of Austin. This process can add 2 to 4 weeks of administrative review before work can begin.</p><h2>Questions to Ask Local Austin Contractors</h2><p>Before signing any agreements, ensure you vet your builder with these three questions:</p><ol><li>Are you licensed, bonded, and carry general liability insurance in Texas?</li><li>Will you handle the City of Austin permitting process and inspections?</li><li>Can you provide three references of completed projects in West Lake, South Lamar, or North Loop?</li></ol>"
  },
  {
    "id": 9,
    "title": "Commercial and Industrial Roofing Services in 2026",
    "slug": "commercial-and-industrial-roofing-services-in-2026",
    "category": "Home Improvement",
    "tags": ["Roofing", "Commercial", "Industrial", "Building Maintenance"],
    "date": "April 15, 2026",
    "author": "Marcus Thorne",
    "readTime": "5 min read",
    "image": "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=800",
    "excerpt": "Maintaining a commercial roof requires specialized materials and engineering. Explore TPO, EPDM, and metal roofing options for business assets.",
    "content": "<h2>Understanding Commercial Roofing Systems</h2><p>Commercial and industrial roofs differ fundamentally from residential steep-slope roofs. Most commercial structures feature flat or low-slope designs, which present distinct drainage, weight, and environmental challenges. Choosing the right roof system protects valuable inventory, equipment, and operations from structural damage.</p><h2>Top Commercial Materials in 2026</h2><h3>1. TPO (Thermoplastic Polyolefin)</h3><p>TPO is a single-ply reflective roofing membrane that has become incredibly popular. Its white surface reflects solar heat, significantly lowering HVAC utility bills during hot summer months. It is highly resistant to tears and chemical exposure.</p><h3>2. EPDM (Rubber Roofing)</h3><p>EPDM is made of synthetic rubber, offering outstanding durability and resistance to extreme cold and hail. EPDM has a lifespan of 30+ years, making it a reliable long-term investment for warehousing assets.</p><h3>3. Metal Roofing</h3><p>Typically used for industrial warehouses with low-sloped structures. Standing seam metal roofs provide excellent wind uplift resistance and longevity, though initial installation costs are higher.</p><h2>Preventative Maintenance Checklist</h2><p>Commercial roof warranties require regular inspections. Ensure your building manager performs these two actions yearly:</p><ul><li><strong>Clear Drainage Outlets:</strong> Scupper drains, gutters, and downspouts must be cleared of leaves, dirt, and gravel to prevent standing water.</li><li><strong>Inspect Membrane Seams:</strong> Thermoplastic seams should be checked for cracks, peeling, or splitting, which are the main sources of hidden leaks.</li></ul>"
  },
  {
    "id": 10,
    "title": "Common Funeral Etiquette Mistakes and How to Avoid Them",
    "slug": "common-funeral-etiquette-mistakes-and-how-to-avoid-them",
    "category": "Lifestyle",
    "tags": ["Etiquette", "Lifestyle", "Relationships", "Social Norms"],
    "date": "April 02, 2026",
    "author": "Dr. Sarah Jenkins",
    "readTime": "5 min read",
    "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    "excerpt": "Navigating grief and social gatherings can be difficult. Learn the essential dos and don'ts of funeral etiquette to support grieving families.",
    "content": "<h2>Navigating Grief with Respect</h2><p>A funeral or memorial service is a highly emotional event designed to celebrate a life and comfort the grieving. Because we do not attend funerals frequently, many people feel anxious about saying or doing the wrong thing. Good etiquette is simply about showing up, offering respect, and minimizing distractions for the family.</p><p>Here are the most common funeral etiquette mistakes and how you can easily avoid them.</p><h2>The Key Etiquette Dos and Don'ts</h2><h3>Mistake 1: Wearing Inappropriate Attire</h3><p>While black is no longer strictly required, you should still dress respectfully. Avoid athletic wear, loud neon patterns, or extremely casual beach clothing. Aim for business casual attire in muted, respectful tones.</p><h3>Mistake 2: Failing to Silencing Your Phone</h3><p>A ringing phone during a eulogy or silent prayer is a major distraction. Switch your phone to completely silent or turn it off before entering the chapel. Avoid checking text messages or taking photos during the service.</p><h3>Mistake 3: Saying ClichÃ©s That Minimize Grief</h3><p>Often, in an effort to comfort, people say things like 'They are in a better place' or 'I know exactly how you feel.' While well-intentioned, these statements can feel dismissive. Instead, stick to simple, genuine phrases: <em>'I am so sorry for your loss. I am thinking of you and your family.'</em></p><h3>Mistake 4: Arriving Late</h3><p>Always arrive 15 to 20 minutes before the scheduled start time. This allows you to sign the guest registry book and find a seat quietly without interrupting the family's processional entry.</p>"
  }
]
;
}

/* ════════════════════════════════════════════════
   MULTI-AUTHOR DATABASE SEED & RENDER ENGINE
════════════════════════════════════════════════ */

function seedUsers() {
  if (!localStorage.getItem('home_inserts_users')) {
    const defaultUsers = [
      {
        id: 'admin-1',
        name: 'Aijaz Majeed',
        username: 'aijaz-majeed',
        email: 'aijazmajeed804@gmail.com',
        password: 'aijazmajeed@@1243',
        role: 'Super Admin',
        bio: 'Founder & chief editor at Home Inserts. Passionate about home decor, renovations, and comfort styling.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        socials: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com',
          linkedin: 'https://linkedin.com'
        },
        status: 'Active'
      },
      {
        id: 'admin-2',
        name: 'Admin User',
        username: 'admin-user',
        email: 'admin@homeinserts.com',
        password: 'adminpassword',
        role: 'Admin',
        bio: 'System Administrator managing authors, reviews, and categories.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        socials: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com'
        },
        status: 'Active'
      },
      {
        id: 'editor-1',
        name: 'Dr. Sarah Jenkins',
        username: 'sarah-jenkins',
        email: 'sarah.jenkins@homeinserts.com',
        password: 'sarahpassword',
        role: 'Editor',
        bio: 'Dr. Sarah Jenkins is a sleep psychologist and home comfort specialist helping families design relaxing bedrooms.',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        socials: {
          linkedin: 'https://linkedin.com'
        },
        status: 'Active'
      },
      {
        id: 'author-1',
        name: 'Marcus Thorne',
        username: 'marcus-thorne',
        email: 'marcus.thorne@homeinserts.com',
        password: 'marcuspassword',
        role: 'Author',
        bio: 'Landscape designer and turf care expert focusing on outdoor living spaces and beautiful gardens in North Carolina.',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
        socials: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com'
        },
        status: 'Active'
      },
      {
        id: 'author-2',
        name: 'Jane Jenkins',
        username: 'jane-jenkins',
        email: 'jane.jenkins@homeinserts.com',
        password: 'janepassword',
        role: 'Author',
        bio: 'Interior designer specializing in space-saving hacks and mid-century modern living room styles.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        socials: {
          instagram: 'https://instagram.com'
        },
        status: 'Active'
      },
      {
        id: 'author-3',
        name: 'Farhan Ellahi',
        username: 'farhan-ellahi',
        email: 'farhan@homeinserts.com',
        password: 'farhanpassword',
        role: 'Author',
        bio: 'Home improvement specialist with extensive expertise in bathroom layouts, furnishings, and flooring products.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        socials: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com'
        },
        status: 'Active'
      },
      {
        id: 'author-4',
        name: 'Aijaz Ahmad',
        username: 'aijaz-ahmad',
        email: 'aijaz@homeinserts.com',
        password: 'aijazpassword',
        role: 'Author',
        bio: 'Professional plumber and DIY guide contributor. Specialist in kitchen and bathroom fixture installations.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
        socials: {
          linkedin: 'https://linkedin.com'
        },
        status: 'Active'
      }
    ];
    localStorage.setItem('home_inserts_users', JSON.stringify(defaultUsers));
  }
}

function renderPostAuthorCard(post) {
  const container = document.getElementById('post-body-content');
  if (!container) return;

  const users = JSON.parse(localStorage.getItem('home_inserts_users') || '[]');
  
  let author = null;
  if (post.authorId) {
    author = users.find(u => u.username === post.authorId);
  }
  if (!author && post.author) {
    author = users.find(u => u.name.toLowerCase() === post.author.toLowerCase());
  }

  if (!author) {
    author = {
      name: post.author || 'Home Inserts Writer',
      username: (post.author || 'writer').toLowerCase().replace(/\s+/g, '-'),
      role: 'Guest Author',
      bio: 'Regular contributor sharing insights on home improvements, renovations, and comfort styling.',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      socials: {}
    };
  }

  const cardDiv = document.createElement('div');
  cardDiv.className = 'author-bio-card';
  
  let socialLinksHTML = '';
  if (author.socials) {
    if (author.socials.facebook) socialLinksHTML += `<a href="${author.socials.facebook}" target="_blank">Facebook</a>`;
    if (author.socials.twitter) socialLinksHTML += `<a href="${author.socials.twitter}" target="_blank">Twitter</a>`;
    if (author.socials.linkedin) socialLinksHTML += `<a href="${author.socials.linkedin}" target="_blank">LinkedIn</a>`;
    if (author.socials.instagram) socialLinksHTML += `<a href="${author.socials.instagram}" target="_blank">Instagram</a>`;
  }

  cardDiv.innerHTML = `
    <img class="author-bio-avatar" src="${author.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}" alt="${author.name}">
    <div class="author-bio-info">
      <div class="author-bio-header">
        <h4><a href="author.html?id=${author.username}">${author.name}</a></h4>
        <span class="role-badge ${author.role.toLowerCase().replace(/\s+/g, '-')}">${author.role}</span>
      </div>
      <p class="author-bio-text">${author.bio || 'Professional writer and home enthusiast.'}</p>
      ${socialLinksHTML ? `<div class="author-bio-socials">${socialLinksHTML}</div>` : ''}
    </div>
  `;

  container.appendChild(cardDiv);
}

function renderAuthor() {
  const urlParams = new URLSearchParams(window.location.search);
  const authorId = urlParams.get('id');
  if (!authorId) {
    redirectToHome();
    return;
  }

  const users = JSON.parse(localStorage.getItem('home_inserts_users') || '[]');
  let author = users.find(u => u.username === authorId);

  if (!author) {
    const cleanName = authorId.replace(/-/g, ' ');
    author = users.find(u => u.name.toLowerCase() === cleanName.toLowerCase());
  }

  if (!author) {
    author = {
      name: authorId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      username: authorId,
      role: 'Guest Author',
      bio: 'Contributor sharing professional perspectives on home improvement, lifestyle, and decor.',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      socials: {}
    };
  }

  const loadingEl = document.getElementById('author-loading');
  if (loadingEl) loadingEl.style.display = 'none';
  
  const cardEl = document.getElementById('author-profile-card');
  if (cardEl) cardEl.style.display = 'block';

  const imgEl = document.getElementById('author-img');
  if (imgEl) {
    imgEl.src = author.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
    imgEl.alt = author.name;
  }

  const nameEl = document.getElementById('author-name');
  if (nameEl) nameEl.textContent = author.name;
  
  const roleEl = document.getElementById('author-role');
  if (roleEl) {
    roleEl.textContent = author.role;
    roleEl.className = `author-profile-role role-badge ${author.role.toLowerCase().replace(/\s+/g, '-')}`;
  }
  
  const bioEl = document.getElementById('author-bio');
  if (bioEl) bioEl.textContent = author.bio || 'Contributor sharing home improvement ideas.';

  const socialsContainer = document.getElementById('author-socials');
  if (socialsContainer) {
    socialsContainer.innerHTML = '';
    if (author.socials) {
      Object.entries(author.socials).forEach(([platform, url]) => {
        if (url) {
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.className = 'social-icon';
          link.textContent = platform.charAt(0).toUpperCase();
          link.setAttribute('aria-label', platform);
          socialsContainer.appendChild(link);
        }
      });
    }
  }

  // Load articles written by this author (only Published ones)
  const authorPosts = state.posts.filter(p => {
    const isPublished = !p.status || p.status === 'Published';
    const matchesAuthor = p.authorId === author.username || p.author.toLowerCase() === author.name.toLowerCase();
    return isPublished && matchesAuthor;
  });

  const headingEl = document.getElementById('author-articles-heading');
  if (headingEl) headingEl.textContent = `Articles by ${author.name} (${authorPosts.length})`;

  renderAuthorArticlesGrid(authorPosts);
}

function renderAuthorArticlesGrid(authorPosts) {
  const grid = document.getElementById('articles-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const total = authorPosts.length;
  
  if (total === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <svg style="color:var(--color-body-light); margin-bottom:16px;" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 style="margin-bottom:8px; color:var(--color-heading);">No Articles Published</h3>
        <p style="color:var(--color-body-light);">This author has not published any articles yet.</p>
      </div>
    `;
    return;
  }

  authorPosts.forEach(post => {
    const card = document.createElement('article');
    card.className = 'entry-card';
    card.innerHTML = `
      <div class="card-media">
        <a href="post.html?slug=${post.slug}">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </a>
      </div>
      <div class="card-body">
        <span class="card-category">${post.category}</span>
        <h3 class="card-title">
          <a href="post.html?slug=${post.slug}">${post.title}</a>
        </h3>
        <p class="card-excerpt">${post.excerpt}</p>
        <div class="card-meta">
          <span class="meta-author">${post.author}</span>
          <span class="meta-date">${post.date}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}


