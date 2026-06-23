/**
 * Home Inserts - Local AI Content Studio Generation Engine
 * Generates SEO-optimized articles, outlines, metadata, and image prompts programmatically.
 */

(function(global) {
  'use strict';

  // Niche-specific structural content databases
  const NicheData = {
    'Home Improvement': {
      intros: [
        "Undertaking a residential upgrade is a powerful way to enhance your living environment and boost your home's equity. However, navigating structural changes, budgeting, and material selection demands a clear strategic blueprint.",
        "Your home is your most valuable asset, and keeping it in peak condition requires a mix of routine maintenance and high-impact upgrades. Balancing modern aesthetics with functional durability is the secret to a successful renovation."
      ],
      headings: [
        "Planning and Budgeting for High-ROI Projects",
        "Top DIY Upgrades to Transform Your Space This Weekend",
        "Determining When to Hire a Professional Contractor",
        "Integrating Smart Energy-Saving Technologies"
      ],
      h3s: {
        "Planning and Budgeting for High-ROI Projects": [
          "Defining the Project Scope and Timeline",
          "Establishing a Contingency Fund for Hidden Costs"
        ],
        "Top DIY Upgrades to Transform Your Space This Weekend": [
          "Installing Programmable Smart Thermostats",
          "Refacing Cabinets and Upgrading Cabinet Hardware"
        ]
      },
      paragraphs: [
        "Before picking up tools or purchasing materials, successful home renovators start with a detailed architectural plan. Laying out exact milestones, spacing guidelines, and material specifications prevents scope creep. Industry experts suggest adding a 15% contingency buffer to your financial plan to cover unexpected structural elements, wiring anomalies, or plumbing issues hidden behind walls.",
        "Not all home enhancements require contracting professional labor. Simple, high-impact DIY tasks like upgrading light fixtures, sealing air leaks around doors, or applying fresh paint can elevate a room's aesthetic immediately. These modifications provide dual benefits by lowering monthly heating or cooling utility bills and increasing overall comfort.",
        "Deciding between executing a project yourself or hiring a licensed general contractor involves assessing safety, building codes, and time constraints. For minor cosmetic work, DIY offers creative control and budget savings. However, for structural framing, main electrical service panels, or gas plumbing lines, hiring certified professionals is critical to secure permits and ensure home safety."
      ],
      ctas: [
        "Thinking about upgrading your home? Contact our certified building consultants today for a free project scoping session and cost estimate!",
        "Maximize your home's potential. Subscribe to our newsletter to receive step-by-step DIY restoration guides directly in your inbox!"
      ],
      faqs: [
        { q: "What home improvement projects add the most resale value?", a: "Kitchen renovations, upscale bathroom remodels, and simple exterior curb appeal upgrades like siding or fresh landscaping consistently offer the highest return on investment." },
        { q: "How do I avoid contractor fraud or poor workmanship?", a: "Always request licensing numbers, proof of insurance, a written contract with milestone payments, and references from past projects in your local area." },
        { q: "Do I need a building permit for minor renovations?", a: "Cosmetic changes like flooring, painting, and changing fixtures typically do not require permits. Adding walls, changing structural beams, or running new pipes usually do." }
      ]
    },
    'Interior Design': {
      intros: [
        "Interior design is a delicate balance of spatial geometry, color psychology, and sensory textures. When properly aligned, these elements do not just make a room look beautiful—they shape the way you live and interact with your home.",
        "Creating a home that feels both cohesive and uniquely personal requires moving beyond simple decorating trends. It involves masterfully structuring light, scale, and functional layouts to create a seamless flow."
      ],
      headings: [
        "Selecting a Cohesive Color Palette and Texture Matrix",
        "Balancing Room Layouts: Symmetry vs. Asymmetry",
        "Layering Light: Ambient, Task, and Accent Configurations",
        "Selecting Multi-Functional Furniture for Cozy Spaces"
      ],
      h3s: {
        "Selecting a Cohesive Color Palette and Texture Matrix": [
          "Applying the 60-30-10 Design Rule",
          "Blending Wood Tones, Metals, and Textured Textiles"
        ],
        "Layering Light: Ambient, Task, and Accent Configurations": [
          "Maximizing Natural Daylight Ingress",
          "Selecting Ideal Kelvin Temperatures for Rooms"
        ]
      },
      paragraphs: [
        "The 60-30-10 rule serves as a reliable design guide for balance: 60% of the room consists of a dominant base color (walls), 30% acts as a secondary color (furniture and rugs), and 10% is reserved for accents (pillows and art). Blending contrasting textures—such as raw boucle linen, brushed brass, and natural oak—adds visual weight and warmth without cluttering the space.",
        "Lighting is the unsung hero of spatial design. Ambient light provides the baseline illumination, while task lighting targets specific actions like cooking or reading. Accent lights, such as picture frame downlights or LED under-cabinet strips, create focal highlights that draw the eye to architectural features. Installing dimmer switches allows you to adjust light levels to match your daily rhythms.",
        "When designing cozy or narrow spaces, choosing furniture with the correct proportions is paramount. Opting for low-profile couches with exposed legs, multi-functional storage benches, and light-reflecting glass coffee tables creates an airy, open feel. Leaving clear traffic pathways ensures a natural flow throughout your home."
      ],
      ctas: [
        "Ready to transform your home? Book a virtual design consultation with our lead interior architect today to personalize your layout!",
        "Want to stay ahead of the style curve? Sign up for our design digest to receive weekly mood boards and styling tips!"
      ],
      faqs: [
        { q: "How do I make a dark room feel brighter?", a: "Use light paint colors, hang large mirrors opposite windows to reflect light, choose low-profile furniture, and utilize light-filtering sheer curtains." },
        { q: "What is the difference between interior design and interior decorating?", a: "Interior design deals with structural changes, spatial planning, and building codes, while decorating focuses on furnishing and aesthetics like paint and drapery." },
        { q: "How do I choose the correct rug size for my living room?", a: "Ensure the rug is large enough so that at least the front legs of all major seating pieces—such as the sofa and accent chairs—sit on top of it." }
      ]
    },
    'Real Estate': {
      intros: [
        "Navigating the real estate market demands a sharp understanding of interest rates, localized pricing, and financing terms. Whether buying or selling, being informed is your greatest tool.",
        "Modern real estate transactions are fast-paced and financially complex. To secure a successful deal, you must approach the market with a clear timeline and robust negotiation strategies."
      ],
      headings: [
        "Analyzing Modern Market Trends and Mortgage Rates",
        "Key Property Areas to Evaluate Before Buying",
        "Understanding Closing Disclosures and Fees",
        "Advanced Negotiation Tactics for Buyers and Sellers"
      ],
      h3s: {
        "Analyzing Modern Market Trends and Mortgage Rates": [
          "Understanding How Interest Rates Shift Purchasing Power",
          "Differentiating Between Buyers' and Sellers' Markets"
        ],
        "Key Property Areas to Evaluate Before Buying": [
          "The Crucial Role of Professional Home Inspections",
          "Evaluating Neighborhood Demographics and School Districts"
        ]
      },
      paragraphs: [
        "Mortgage interest rates directly dictate your monthly housing costs and overall buying capacity. Monitoring macroeconomic indicators and securing a mortgage pre-approval from a verified lender are essential early steps. A formal pre-approval letter signals to sellers that you are a qualified buyer, giving you a distinct advantage in competitive multi-offer situations.",
        "While a home may appear flawless during a quick tour, underlying issues can become financial drains. A licensed inspector analyzes structural elements, roofing life, electrical panel safety, and sewer line conditions. The resulting inspection report outlines necessary repairs, giving you leverage to negotiate price concessions before signing the final contract.",
        "Closing costs typically represent 2% to 5% of the total loan balance. These costs cover title transfers, escrow services, home appraisals, and prepaying property taxes. Reviewing the formal Closing Disclosure document three days before settlement ensures there are no surprises and prevents escrow delays."
      ],
      ctas: [
        "Ready to buy your dream home? Connect with our local real estate experts to find off-market listings today!",
        "Curious about your home's current value? Get a comprehensive, professional valuation report from our local market agents!"
      ],
      faqs: [
        { q: "What is the very first step of the home buying process?", a: "Checking your credit score and obtaining a mortgage pre-approval letter are the essential first steps before viewing properties." },
        { q: "How much of a down payment do I really need to purchase a home?", a: "While 20% down avoids paying private mortgage insurance (PMI), many buyers qualify for FHA loans at 3.5% down or conventional loans at 3% down." },
        { q: "Why is title insurance necessary in a real estate transaction?", a: "Title insurance protects both the buyer and lender from past ownership claims, undiscovered liens, or boundary disputes that might threaten your ownership." }
      ]
    }
  };

  // Default templates to fall back on in case of other categories
  const DefaultTemplates = {
    intros: [
      "Optimizing your residential environment is a rewarding journey that enhances comfort and functional value. To succeed, you must approach your design and maintenance goals with structured planning.",
      "Every property has hidden potential. With the right tools, materials, and execution strategies, you can turn any standard layout into a highly organized and beautiful home."
    ],
    headings: [
      "Foundational Principles and Planning Steps",
      "Essential Tools and Quality Materials Required",
      "Key Techniques for Flawless Execution",
      "Long-Term Maintenance and Value Preservation"
    ],
    h3s: {
      "Foundational Principles and Planning Steps": [
        "Setting Realistic Milestone Budgets",
        "Assessing Local Zoning and Safety Regulations"
      ],
      "Key Techniques for Flawless Execution": [
        "Sequencing Construction Steps to Prevent Errors",
        "Conducting Quality Checks and Inspections"
      ]
    },
    paragraphs: [
      "Every successful upgrade starts with detailed planning. Defining your exact scope, measuring coordinates, and listing required supplies prevents mid-project delays. Planning ensures that all structural modifications comply with safety regulations and building codes.",
      "Using premium-grade materials is the best way to guarantee longevity and structural integrity. While budget-friendly alternatives are tempting, investing in high-durability items prevents frequent replacements and repairs. Quality tools also ensure clean lines and professional finishes.",
      "Protecting your property value over time requires consistent maintenance. Establishing a seasonal checklist—such as cleaning gutters, inspecting HVAC systems, and sealing exterior trim—keeps minor issues from developing into costly structural failures."
    ],
    ctas: [
      "Explore more expert home tips by checking out our curated articles on Home Inserts!",
      "Stay informed with the latest design tips. Subscribe to our weekly home newsletter today!"
    ],
    faqs: [
      { q: "How do I start planning my home project?", a: "Write down your goals, research inspirations, list your materials, calculate your budget, and consult local building codes." },
      { q: "How can I maintain my home's resale value?", a: "Address roof leaks immediately, maintain exterior paint, replace HVAC filters regularly, and keep your landscaping healthy." },
      { q: "Should I buy high-end materials or standard ones?", a: "For high-traffic, high-wear areas, always choose high-end, durable materials. For low-impact cosmetic details, standard materials are fine." }
    ]
  };

  // Helper to map and select the right category templates
  function getTemplateData(category) {
    if (NicheData[category]) return NicheData[category];
    
    // Group similar categories
    const catLower = (category || '').toLowerCase();
    if (catLower.includes('decor') || catLower.includes('design')) return NicheData['Interior Design'];
    if (catLower.includes('real estate') || catLower.includes('property') || catLower.includes('buying') || catLower.includes('selling') || catLower.includes('guide')) {
      return NicheData['Real Estate'];
    }
    if (catLower.includes('improvement') || catLower.includes('renovate') || catLower.includes('diy') || catLower.includes('architecture') || catLower.includes('smart') || catLower.includes('kitchen') || catLower.includes('comfort') || catLower.includes('outdoor') || catLower.includes('landscaping')) {
      return NicheData['Home Improvement'];
    }
    
    return DefaultTemplates;
  }

  // Selected premium high-quality Unsplash image pools by niche
  const ImagePools = {
    'Home Improvement': [
      '1600585154340-be6161a56a0c', // Luxury house / kitchen
      '1556911220-e15b29be8c8f', // Kitchen wood
      '1556912173-3bb406ef7e77', // Cabinetry
      '1564013799919-ab600027ffc6', // Kitchen remodel
      '1507089947368-19c1da9775ae', // Modern design counter
      '1600607687939-ce8a6c25118c', // Kitchen/dining area
      '1584622650111-993a426fbf0a', // Tiled bathroom
      '1552321554-5fefe8c9ef14', // Attic renovation
      '1600566753086-00f18fb6b3ea', // Modern bathroom remodel
      '1513694203232-719a280e022f', // Home construction/sunlight
    ],
    'Interior Design': [
      '1616486338812-3dadae4b4ace', // Living room cozy
      '1616594039964-ae9021a400a0', // Cozy bedroom
      '1540518614846-7eded433c457', // Bedroom neutral
      '1583847268964-b28dc8f51f92', // Minimalist layout
      '1586023492125-27b2c045efd7', // Design console
      '1600210492486-724fe5c67fb0', // Styled room
      '1615529182906-c4d52123b88a', // Scandinavian styling
      '1616046229478-9901c5536a45', // Cozy dining room
      '1617806118233-18e1db207f62', // Minimalist living room
      '1618221195710-dd6b41faaea6', // Modern interior living room
    ],
    'Real Estate': [
      '1600596542815-ffad4c1539a9', // Luxury exterior
      '1512917774080-9991f1c4c750', // Mansion exterior
      '1600585154526-990dced4db0d', // Modern house layout
      '1580587771525-78b9dba3b914', // Classic suburban house
      '1605276374104-dee2a0ed3cd6', // Facade
      '1628744504164-054a8523c14c', // Entrance
      '1600607687920-437a5b736737', // Modern architecture building
      '1512915922686-57c11dde9b6b', // Real estate agency / modern house
      '1600573472591-ee6b68d14c68', // Luxury villa
    ],
    'DIY': [
      '1508962914676-134849a727f0', // Hand tools
      '1530124560072-acab361097b6', // Painting a wall
      '1504148455328-c376907d081c', // Workshop space
      '1581092918056-0c4c3acd3789', // Repair works
    ],
    'Smart Homes': [
      '1558002038-1055907df827', // Smart keyless lock
      '1563720223185-11003d516935', // Touchscreen controls
      '1598908314732-07113901949e', // Solar panel house
    ],
    'Outdoor & Landscaping': [
      '1600585154526-990dced4db0d', // Backyard garden layout
      '1508962914676-134849a727f0', // Stone path
      '1598908314732-07113901949e', // Green roof / solar panels
    ]
  };

  function getUniqueNicheImage(category, topic, focusKeyword) {
    let pool = ImagePools['Home Improvement'];
    const catLower = (category || '').toLowerCase();
    if (catLower.includes('decor') || catLower.includes('design')) {
      pool = ImagePools['Interior Design'];
    } else if (catLower.includes('real estate') || catLower.includes('property') || catLower.includes('buying') || catLower.includes('selling') || catLower.includes('guide')) {
      pool = ImagePools['Real Estate'];
    } else if (catLower.includes('diy')) {
      pool = ImagePools['DIY'];
    } else if (catLower.includes('smart') || catLower.includes('tech') || catLower.includes('security')) {
      pool = ImagePools['Smart Homes'];
    } else if (catLower.includes('outdoor') || catLower.includes('landscaping') || catLower.includes('garden')) {
      pool = ImagePools['Outdoor & Landscaping'];
    }

    // Gather all currently used images in database
    const usedImages = new Set();
    const getPhotoId = (url) => {
      const match = (url || '').match(/photo-([a-zA-Z0-9-]+)/);
      return match ? match[1] : null;
    };

    const collectFromPosts = (posts) => {
      if (Array.isArray(posts)) {
        posts.forEach(p => {
          if (p.image) {
            const id = getPhotoId(p.image);
            if (id) usedImages.add(id);
          }
        });
      }
    };

    if (typeof state !== 'undefined' && Array.isArray(state.posts)) {
      collectFromPosts(state.posts);
    }
    const localPostsStr = localStorage.getItem('home_inserts_user_posts');
    if (localPostsStr) {
      try {
        collectFromPosts(JSON.parse(localPostsStr));
      } catch (e) {}
    }

    // Find first unused image in pool
    let selectedId = null;
    for (let id of pool) {
      if (!usedImages.has(id)) {
        selectedId = id;
        break;
      }
    }

    // Fallback to any unused image from any pool
    if (!selectedId) {
      const allPools = Object.values(ImagePools).flat();
      for (let id of allPools) {
        if (!usedImages.has(id)) {
          selectedId = id;
          break;
        }
      }
    }

    // If still none, pick one from the pool and add timestamp query for absolute uniqueness
    if (!selectedId) {
      const fallbackId = pool[Math.floor(Math.random() * pool.length)];
      const uniqueUrl = `https://images.unsplash.com/photo-${fallbackId}?auto=format&fit=crop&q=80&w=800&unique=${Date.now()}`;
      if (window.logDiagnosticAction) {
        window.logDiagnosticAction('AI Studio', `Assigned unique featured image (fallback): ${uniqueUrl} for topic: "${topic}"`, 'Success');
      }
      return uniqueUrl;
    }

    const uniqueUrl = `https://images.unsplash.com/photo-${selectedId}?auto=format&fit=crop&q=80&w=800`;
    if (window.logDiagnosticAction) {
      window.logDiagnosticAction('AI Studio', `Assigned unique featured image: ${uniqueUrl} for topic: "${topic}"`, 'Success');
    }
    return uniqueUrl;
  }

  // Generate highly detailed visual prompts for Midjourney / DALL-E
  function generateDetailedImagePrompts(category, topic, focusKeyword, secondaryKeywords, title, contentContext) {
    const cleanTopic = topic || focusKeyword || category;
    const cleanTitle = title || cleanTopic;
    const secKeywordsStr = (secondaryKeywords && secondaryKeywords.length > 0) ? secondaryKeywords.join(', ') : 'modern styling';
    const context = contentContext || 'architectural space';

    const cameras = [
      "Sony A7R V camera with 35mm lens, f/2.8 aperture",
      "Canon EOS R5 camera with 50mm f/1.2 lens",
      "Nikon Z9 camera with 24-70mm f/2.8 lens",
      "Fujifilm GFX 100S medium format camera",
      "Hasselblad H6D-100c camera, architectural photography"
    ];
    const lightings = [
      "warm morning sun streaming through large glass windows, soft shadows",
      "golden hour sunlight casting long warm glows, interior styling",
      "diffused soft twilight lighting, cinematic evening atmosphere",
      "bright, airy natural daylight, high-end design styling",
      "moody low-key architectural lighting, accent highlights"
    ];
    const angles = [
      "symmetrical architectural view, eye-level perspective",
      "low-angle wide-angle lens shot, spacious composition",
      "editorial interior design catalog framing, straight-on shot",
      "modern clean minimalist composition, rules of thirds layout",
      "high-end real estate showcase angle, clean vertical lines"
    ];

    // Compute simple hash from title to select configurations deterministically but uniquely
    let hash = 0;
    const combinedStr = `${cleanTitle}-${focusKeyword}-${category}`;
    for (let i = 0; i < combinedStr.length; i++) {
      hash = combinedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    const camera = cameras[hash % cameras.length];
    const lighting = lightings[(hash + 1) % lightings.length];
    const angle = angles[(hash + 2) % angles.length];

    const featuredPrompt = `A premium architectural photograph showcasing ${cleanTopic}. Concept theme: "${cleanTitle}". Weaved with details of ${secKeywordsStr}. Styled for ${category}, ${angle}, shot on ${camera}, illuminated by ${lighting}. Photorealistic textures, 8k resolution, award-winning home editorial design --ar 16:9`;

    const socialPrompt = `Professional social media share banner for: "${cleanTitle}". Features a modern layout of ${cleanTopic} in the style of a luxury ${category} guide. Clear composition, commercial design, high-end editorial look, negative space for text overlay, shot on ${camera} --ar 1.91:1`;

    const thumbnailPrompt = `Close-up detail macro shot focusing on "${focusKeyword || cleanTopic}". Context: ${context}. Shallow depth of field, sharp focus on textures (wood, metal, stone), warm atmospheric lighting, high-end blog card thumbnail, 8k resolution --ar 1:1`;

    if (window.logDiagnosticAction) {
      window.logDiagnosticAction('AI Studio', `Generated detailed image prompts for "${cleanTitle}"`, 'Info');
    }

    return {
      featured: featuredPrompt,
      social: socialPrompt,
      thumbnail: thumbnailPrompt
    };
  }

  // Dictionary of dynamic, context-specific paragraphs to make generation human-like
  function generateDynamicContextParagraph(category, heading, focusKeyword, secondaryKeywords, idx) {
    const fKeyword = focusKeyword || 'home styling';
    const secKeywords = secondaryKeywords && secondaryKeywords.length > 0 ? secondaryKeywords : ['quality materials', 'smart planning'];
    const sKeyword1 = secKeywords[idx % secKeywords.length];
    const sKeyword2 = secKeywords[(idx + 1) % secKeywords.length];

    const hLower = heading.toLowerCase();

    // Home Improvement Paragraphs
    if (hLower.includes('budget') || hLower.includes('plan')) {
      return `When executing a plan for **${fKeyword}**, establishing a clear project boundary is the most critical factor. Many homeowners find that skipping this phase leads directly to design drift. By incorporating **${sKeyword1}**, you build a solid foundation. Make sure to checklist your material pricing, shipping fees, and labor expenses early. We recommend keeping a spreadsheet detailing every item name, exact measurements, and supplier quotes to ensure full oversight.`;
    }
    if (hLower.includes('diy') || hLower.includes('upgrades') || hLower.includes('transform')) {
      return `For those looking to tackle modifications over a weekend, focusing on **${fKeyword}** can yield incredible results. Implementing **${sKeyword1}** allows you to customize the aesthetics without overspending. Consider focusing on focal updates—like bathroom sink faucets, cabinet hardware, or accent wall painting—which require minimal tool investment but completely change the room's energy. Remember, prep work is 80% of the job: clean surfaces, sand rough edges, and mask corners before starting.`;
    }
    if (hLower.includes('hire') || hLower.includes('professional') || hLower.includes('contractor')) {
      return `Determining whether a project calls for a DIY approach or professional licensing depends on safety risk. If you are modifying structural framing, running new gas lines, or adding circuits to the main breaker, prioritizing **${sKeyword1}** and hiring a general contractor is essential. They secure municipal permits, carry liability insurance, and guarantee that the work passes inspections. For aesthetic and cosmetic updates, however, a DIY project can save thousands in labor fees.`;
    }
    if (hLower.includes('energy') || hLower.includes('technology') || hLower.includes('smart')) {
      return `Modern homes benefit immensely from smart integration. By focusing on **${fKeyword}** alongside **${sKeyword2}**, you can create a highly efficient system. Smart thermostats, automated lighting panels, and high-efficiency windows reduce heat loss and lower carbon footprints. The upfront cost of these energy-efficient technologies is quickly recouped through lower monthly utility bills, making them smart upgrades for any forward-thinking homeowner.`;
    }

    // Interior Design Paragraphs
    if (hLower.includes('color') || hLower.includes('palette') || hLower.includes('texture')) {
      return `Creating a cohesive color scheme is the first step in successful interior design. When balancing **${fKeyword}**, the goal is to mix contrasting finishes to create depth. By weaving **${sKeyword1}** into your palette, you prevent rooms from looking flat. Pair organic textures like rough jute, raw linen, and matte solid oak with sleek elements like polished brass or polished marble. This contrast keeps the eye moving and makes the space feel layered and premium.`;
    }
    if (hLower.includes('balance') || hLower.includes('layout') || hLower.includes('symmetry')) {
      return `Spatial layout dictates the natural flow of a room. Whether you prefer formal symmetry (matching chairs flanking a fireplace) or the modern feel of asymmetry, keeping **${fKeyword}** in mind ensures that the furniture scales match. Always maintain standard clearances: walk passages should be 36 inches wide, and coffee tables should sit 18 inches from the sofa. This meticulous routing makes the space highly functional.`;
    }
    if (hLower.includes('light') || hLower.includes('ambient') || hLower.includes('task')) {
      return `Lighting should never be a single overhead fixture. High-end designers layer lighting in three distinct zones: ambient (general illumination), task (focused beams for reading or food prep), and accent (subtle LEDs highlights). Utilizing **${sKeyword2}** helps highlight architectural features. Make sure to choose bulb color temperatures that match the room's purpose: warm tones (2700K) for bedrooms and clean white (4000K) for kitchens.`;
    }

    // Real Estate Paragraphs
    if (hLower.includes('market') || hLower.includes('rates') || hLower.includes('trends')) {
      return `Macroeconomic trends dictate buying behaviors. For those monitoring **${fKeyword}**, tracking mortgage interest rate shifts is key to determining purchasing capacity. Integrating **${sKeyword1}** into your market research reveals whether local inventories favor buyers or sellers. Sellers' markets feature low inventory and bidding wars, while buyers' markets provide price negotiation flexibility and closing cost concessions.`;
    }
    if (hLower.includes('areas') || hLower.includes('evaluate') || hLower.includes('inspect')) {
      return `Evaluating property conditions before submitting a binding offer protects you from financial stress. Inspectors analyze crucial areas like structural foundations, roofing conditions, electrical wiring standards, and main plumbing drains. Discussing **${sKeyword2}** with your home inspector helps identify issues like foundation settlement or outdated wiring. This inspection report is your main tool to negotiate repairs or price deductions.`;
    }

    // Default Fallback Paragraphs
    return `Executing your strategies for **${fKeyword}** requires attention to detail. By prioritizing **${sKeyword1}** and sequencing your tasks methodically, you avoid costly rework. Ensure you select materials that balance immediate cost with long-term durability. Quality finishes, robust structural elements, and clear spatial planning are the keys to a project that looks professional and stands the test of time.`;
  }

  const AIGenerator = {
    /**
     * Generate an article outline and metadata blueprint
     * @param {Object} inputs - Stepper inputs
     * @returns {Object} Outline blueprint
     */
    generateOutline(inputs) {
      const {
        primaryKeyword = '',
        secondaryKeywords = '',
        topic = '',
        category = 'Home Improvement',
        author = 'Administrator',
        tone = 'Expert',
        length = 'Medium'
      } = inputs;

      const pKeyword = primaryKeyword.trim();
      const topicClean = topic.trim() || `The Ultimate Guide to ${pKeyword || 'Modern Home Upgrades'}`;
      const secKwList = secondaryKeywords.split(',').map(k => k.trim()).filter(Boolean);

      // Template selection
      const data = getTemplateData(category);

      // Generate Title (aim for ideal 50-60 chars)
      let seoTitle = `${topicClean} | Home Inserts`;
      if (seoTitle.length < 50) {
        seoTitle = `${topicClean} - Expert ${category} Guide`;
      }
      if (seoTitle.length > 60) {
        seoTitle = seoTitle.substring(0, 57) + '...';
      }

      const metaTitle = seoTitle;

      // Generate Meta Description (aim for 120-160 chars)
      const descSeed = `Learn how to master ${topicClean.toLowerCase()} using these professional ${tone.toLowerCase()} tips. Perfect for maximizing property value and styling.`;
      let metaDescription = descSeed;
      if (metaDescription.length < 120) {
        metaDescription = descSeed + " Read our full, step-by-step homeowner's guide to get started today.";
      }
      if (metaDescription.length > 160) {
        metaDescription = metaDescription.substring(0, 157) + '...';
      }

      // Generate URL Slug
      const slug = topicClean
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      // Outline Heading Tree
      const h1 = topicClean;
      const categoryHeadings = data.headings || DefaultTemplates.headings;
      
      const outlineStructure = [];
      categoryHeadings.forEach((h2, idx) => {
        // Inject focus keyword naturally into one H2 heading to avoid robotic patterns
        let headingText = h2;
        if (idx === 1 && pKeyword) {
          if (category.toLowerCase().includes('design') || category.toLowerCase().includes('decor')) {
            headingText = `How to Integrate ${pKeyword} into Your Styling`;
          } else if (category.toLowerCase().includes('real estate')) {
            headingText = `Evaluating ${pKeyword} in Today's Market`;
          } else {
            headingText = `Step-by-Step Guide to Implementing ${pKeyword}`;
          }
        }

        const subHeadings = data.h3s[h2] || [
          `Key Factors for ${h2}`,
          `Common Pitfalls to Avoid`
        ];
        
        outlineStructure.push({
          heading: headingText,
          level: 2,
          subHeadings: subHeadings.map(h3 => ({ heading: h3, level: 3 }))
        });
      });

      // Select unique niche-relevant image
      const image = getUniqueNicheImage(category, topicClean, pKeyword);

      // Generate detailed, premium visual prompts
      const imagePrompts = generateDetailedImagePrompts(
        category,
        topicClean,
        pKeyword,
        secKwList,
        seoTitle,
        metaDescription
      );

      return {
        inputs,
        focusKeyword: pKeyword,
        secondaryKeywords: secKwList,
        seoTitle,
        metaTitle,
        metaDescription,
        slug,
        h1,
        outline: outlineStructure,
        faqs: [...data.faqs],
        cta: data.ctas[0],
        excerpt: metaDescription.substring(0, 140),
        imagePrompts,
        image
      };
    },

    /**
     * Generate the complete HTML article content body based on an outline blueprint
     * @param {Object} blueprint - Output of generateOutline
     * @returns {String} HTML Content
     */
    generateArticle(blueprint) {
      const {
        focusKeyword = '',
        secondaryKeywords = [],
        category = 'Home Improvement',
        tone = 'Expert',
        outline = [],
        faqs = [],
        cta = ''
      } = blueprint;

      const pKeyword = focusKeyword || 'modern home upgrades';
      const secKeywords = secondaryKeywords.length > 0 ? secondaryKeywords : ['quality craftsmanship'];
      const data = getTemplateData(category);

      let html = '';

      // 1. Table of Contents
      html += `<div class="table-of-contents">\n  <h4>Table of Contents</h4>\n  <ul>\n`;
      outline.forEach((section, idx) => {
        const anchor = `section-${idx}`;
        html += `    <li><a href="#${anchor}">${section.heading}</a></li>\n`;
      });
      html += `    <li><a href="#faq-section">Frequently Asked Questions (FAQ)</a></li>\n`;
      html += `  </ul>\n</div>\n\n`;

      // 2. Introduction Paragraph (incorporating focus keyword naturally)
      const introSeed = data.intros[0];
      const introText = `For many homeowners, executing a successful project centered on **${pKeyword}** is a major goal. ${introSeed} By integrating components of **${secKeywords[0]}**, you can achieve professional results that stand the test of time. Let's delve into the essential principles and tips to get you started.`;
      html += `<p>${introText}</p>\n\n`;

      // 3. Key Takeaways Box
      html += `<div class="callout-box info-box">\n  <h5>💡 Key Takeaways</h5>\n  <ul>\n`;
      html += `    <li><strong>Smart Budgeting:</strong> Establish a detailed budget sheet and include a 15% contingency fund before purchasing materials.</li>\n`;
      html += `    <li><strong>Texture Pairing:</strong> When working with styling elements, combine natural wood tones, soft textiles, and matte metals for spatial depth.</li>\n`;
      html += `    <li><strong>Safety First:</strong> For main structural, electrical, and gas lines modifications, always hire a licensed professional.</li>\n`;
      html += `  </ul>\n</div>\n\n`;

      // 4. Body H2 & H3 Sections
      outline.forEach((section, idx) => {
        const anchor = `section-${idx}`;
        html += `<h2 id="${anchor}">${section.heading}</h2>\n`;
        
        // Dynamic, non-generic body paragraph
        const pText = generateDynamicContextParagraph(category, section.heading, pKeyword, secKeywords, idx);
        html += `<p>${pText}</p>\n\n`;

        // Render H3 Subheadings
        section.subHeadings.forEach((sub, subIdx) => {
          html += `<h3>${sub.heading}</h3>\n`;
          
          let h3Text = `Exploring the specifics of ${sub.heading.toLowerCase()} is vital to prevent errors. Homeowners should prioritize matching material durability to local climate conditions and traffic levels. Measuring structural clearances twice and purchasing correct installation supplies prevents delays and guarantees a seamless look.`;
          if (idx === 0 && subIdx === 0) {
            h3Text += ` Make sure to organize your milestones logically, allowing wet phases (like drywalling or tiling) to dry completely before installing final fixtures or trim.`;
          }
          html += `<p>${h3Text}</p>\n\n`;
          
          // Inject custom bullet list
          if (idx === 0 && subIdx === 0) {
            html += `<ul>\n  <li><strong>Preparation Stage:</strong> Measure exact clearances and cross-reference zoning regulations.</li>\n  <li><strong>Procurement Stage:</strong> Source high-grade materials and gather recommended safety gear.</li>\n  <li><strong>Installation Stage:</strong> Work methodically from structural corners out to the margins.</li>\n</ul>\n\n`;
          }
          
          // Inject comparison table
          if (idx === 1 && subIdx === 0) {
            html += `<table class="comparison-table">\n  <thead>\n    <tr><th>Renovation Aspect</th><th>Relative Cost</th><th>Value Addition</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Cosmetic Modifications</td><td>Low-Medium</td><td>Immediate Visual Appeal</td></tr>\n    <tr><td>Structural Updates</td><td>High</td><td>Long-Term Equity</td></tr>\n    <tr><td>Smart Tech Additions</td><td>Medium</td><td>Utility Efficiency</td></tr>\n  </tbody>\n</table>\n\n`;
          }
        });
      });

      // 5. Pros & Cons Block
      html += `<div class="pros-cons-grid">\n  <div class="pros-box">\n    <h5>✅ Advantages</h5>\n    <ul>\n      <li>Substantially increases structural and visual property value.</li>\n      <li>Enhances residential utility, space flow, and daily comfort.</li>\n      <li>Provides opportunities to lower energy costs through modern materials.</li>\n    </ul>\n  </div>\n  <div class="cons-box">\n    <h5>❌ Considerations</h5>\n    <ul>\n      <li>Requires upfront budgeting and scheduling to minimize home disruptions.</li>\n      <li>Demands high attention to material quality and contractor hiring vetting.</li>\n    </ul>\n  </div>\n</div>\n\n`;

      // 6. FAQ Accordion Section (Schema-ready)
      html += `<h2 id="faq-section">Frequently Asked Questions (FAQ)</h2>\n`;
      html += `<div class="faq-accordion-wrapper">\n`;
      faqs.forEach((faq) => {
        html += `  <div class="faq-accordion-item">\n    <button type="button" class="faq-accordion-header">❓ ${faq.q}</button>\n    <div class="faq-accordion-content">\n      <p>${faq.a}</p>\n    </div>\n  </div>\n`;
      });
      html += `</div>\n\n`;

      // 7. Conclusion and CTA
      html += `<h2>Conclusion</h2>\n`;
      html += `<p>In summary, achieving high-quality results when executing your plan for **${pKeyword}** relies on planning, selecting premium materials, and sequencing tasks methodically. By balancing structural safety with design aesthetics, you ensure a home that is both beautiful and structurally sound for years to come.</p>\n\n`;

      html += `<div class="callout-box cta-box">\n  <h5>📞 Let's Discuss Your Project</h5>\n  <p>${cta}</p>\n  <p>For more home renovation tips and design ideas, explore our full library of articles on <a href="index.html">Home Inserts</a>, or submit your questions through <a href="contact.html">our Contact Page</a>.</p>\n</div>\n`;

      return html;
    }
  };

  // Export to global window context
  global.AIGenerator = AIGenerator;

})(typeof window !== 'undefined' ? window : this);
