/**
 * Home Inserts - Local AI Content Studio Generation Engine
 * Generates SEO-optimized articles, outlines, metadata, and image prompts programmatically.
 */

(function(global) {
  'use strict';

  // Niche-specific templates and data pools
  const NicheData = {
    'Home Improvement': {
      intros: [
        "Undertaking a home improvement project can feel both exciting and overwhelming. Whether you are aiming to increase your property's market value or simply want to create a more comfortable living environment, making informed choices is key to success. In this comprehensive guide, we will walk you through the essential steps to execute your next project flawlessly.",
        "Your home is your sanctuary, but keeping it in prime condition requires consistent effort and smart upgrades. From structural repairs to modern efficiency upgrades, the right home improvement strategies can transform how you live. Let's delve into the top professional tips that will save you time, money, and stress."
      ],
      h2s: [
        "Essential Planning and Budgeting for Your Project",
        "Top High-ROI DIY Upgrades You Can Do This Weekend",
        "When to Hire a Professional vs. Going DIY",
        "Modern Efficiency: Energy-Saving Upgrades to Consider"
      ],
      h3s: {
        "Essential Planning and Budgeting for Your Project": [
          "Defining Your Scope of Work",
          "Creating a Contingency Fund for Hidden Expenses"
        ],
        "Top High-ROI DIY Upgrades You Can Do This Weekend": [
          "Smart Thermostat Installation",
          "Kitchen Cabinet Refacing and Hardware Upgrades"
        ]
      },
      paragraphs: [
        "Before swinging a hammer or buying supplies, a successful project starts with a detailed blueprint. Analyzing the structural requirements and establishing a clear budget prevents scope creep. Professionals recommend adding at least 15% as a contingency buffer for unexpected discoveries behind drywall or under floorboards.",
        "Not all home upgrades require contracting professional labor. Simple actions like sealing drafts, adding insulation, and updating hardware can reduce utility bills by up to 20%. These high-yield, low-cost enhancements provide immediate comfort and long-term financial returns.",
        "Choosing between DIY and professional contracting is a balancing act of time, skill, and safety. For electrical, plumbing, and structural modifications, hiring licensed professionals is paramount to ensure code compliance and safety. For cosmetics like painting and landscaping, DIY is an excellent way to personalize your space."
      ],
      ctas: [
        "Need professional guidance on your next home upgrade? Contact our certified home consultants today for a free project estimate!",
        "Transform your home into an energy-efficient oasis. Subscribe to our newsletter to receive weekly, step-by-step DIY guides directly in your inbox!"
      ],
      faqs: [
        { q: "What home improvements add the most value?", a: "Kitchen remodels, bathroom updates, and curb appeal enhancements (like landscaping and new siding) consistently yield the highest return on investment." },
        { q: "How do I calculate a home improvement budget?", a: "Gather quotes for materials and labor, then add a 15-20% contingency fund to cover unexpected repairs that may arise during demolition." },
        { q: "Do I need a permit for minor home improvements?", a: "Minor cosmetic changes like painting, tiling, or replacing fixtures usually do not require permits. Major structural, electrical, or plumbing changes almost always do." }
      ]
    },
    'Real Estate': {
      intros: [
        "Navigating the real estate market requires a blend of timing, research, and financial literacy. Whether you are a first-time homebuyer looking for a starter property or an experienced investor expanding your portfolio, understanding current market patterns is crucial. Here is what you need to know to make sound property decisions.",
        "The real estate landscape is constantly evolving, driven by economic changes and local demand shifts. Securing the best deal on a property demands a proactive approach and a clear understanding of the buying or selling process. In this guide, we reveal the insider secrets to winning in today's market."
      ],
      h2s: [
        "Analyzing Current Market Trends and Interest Rates",
        "Key Factors to Inspect Before Making an Offer",
        "Understanding Closing Costs and Hidden Fees",
        "Negotiation Tactics for Buyers and Sellers"
      ],
      h3s: {
        "Analyzing Current Market Trends and Interest Rates": [
          "How Rate Hikes Impact Your Purchasing Power",
          "Identifying Buyers' vs. Sellers' Markets"
        ],
        "Key Factors to Inspect Before Making an Offer": [
          "The Importance of a Professional Home Inspection",
          "Evaluating Neighborhood Demographics and School Districts"
        ]
      },
      paragraphs: [
        "Interest rates dictate your monthly mortgage payment and overall purchasing capacity. Monitoring rate indicators and securing a pre-approval letter from a reputable lender are critical first steps. A solid pre-approval shows sellers you are a serious buyer, giving you a competitive edge in multi-offer situations.",
        "A property might look perfect during a walkthrough, but hidden issues like foundation cracks, faulty wiring, or outdated plumbing can cost thousands to repair. A professional inspection report outlines these deficiencies, giving you leverage to negotiate price reductions or request repairs before closing.",
        "Closing costs typically range from 2% to 5% of the loan amount and cover lender fees, title insurance, appraisal fees, and taxes. Fulfilling these financial requirements upfront prevents last-minute transaction delays. Ensure you review the Loan Estimate and Closing Disclosure forms thoroughly."
      ],
      ctas: [
        "Ready to find your dream property? Connect with our top-rated local real estate agents to get access to exclusive off-market listings!",
        "Planning to sell your home soon? Download our free Home Valuation Guide to find out how much your property is worth in today's market!"
      ],
      faqs: [
        { q: "What is the first step in the home buying process?", a: "The first step is checking your credit score and obtaining a mortgage pre-approval letter to determine your actual purchase budget." },
        { q: "How much down payment do I really need?", a: "While 20% is ideal to avoid paying private mortgage insurance (PMI), many conventional and FHA loans allow down payments as low as 3% to 3.5%." },
        { q: "What is title insurance and why do I need it?", a: "Title insurance protects lenders and homebuyers against financial loss from disputes over property ownership, liens, or undocumented easements." }
      ]
    },
    'Interior Design': {
      intros: [
        "Interior design is more than just making a space look beautiful; it is about harmonizing aesthetics with functionality. By strategically utilizing color palettes, lighting configurations, and layout placements, you can dramatically shift the mood and utility of any room. Let's explore the core principles of professional spatial styling.",
        "Creating a home that feels cohesive and reflective of your personal style requires a thoughtful approach to interior layouts. Modern design embraces clean lines, sustainable materials, and personalized touches. Here is how you can elevate your space into a professional-grade interior masterpiece."
      ],
      h2s: [
        "Selecting a Cohesive Color Palette and Texture Mix",
        "Symmetry vs. Asymmetry: Balancing Room Layouts",
        "The Power of Layered Lighting: Task, Ambient, and Accent",
        "Choosing Statement Furniture Pieces for Small Spaces"
      ],
      h3s: {
        "Selecting a Cohesive Color Palette and Texture Mix": [
          "Applying the 60-30-10 Design Rule",
          "Mixing Raw Wood, Metals, and Soft Textiles"
        ],
        "The Power of Layered Lighting: Task, Ambient, and Accent": [
          "Optimizing Natural Light Ingress",
          "Selecting the Right Color Temperatures (Kelvins)"
        ]
      },
      paragraphs: [
        "The 60-30-10 color rule is a classic interior formula: 60% of the room should be a dominant base color, 30% a secondary texture or color, and 10% an accent color. Mixing organic textures like linen, oak, and brushed brass creates visual depth and warmth without cluttering the space.",
        "Lighting is the unsung hero of interior architecture. Ambient lighting provides general illumination, task lighting aids specific activities like reading or cooking, and accent lighting highlights structural details or artwork. Dimmer switches allow you to adjust the lighting temperature and intensity to suit different times of day.",
        "In small spaces, scaling furniture is vital. Selecting items with exposed legs, multi-functional storage compartments, and light-toned upholstery makes the room feel airy and open. Avoid over-furnishing; leave clear traffic pathways to maintain a natural spatial flow."
      ],
      ctas: [
        "Book a one-on-one virtual consultation with our lead interior designer today to customize your home layout!",
        "Want to stay ahead of the design curve? Sign up for our design digest to receive modern styling tips and exclusive decor discounts!"
      ],
      faqs: [
        { q: "How do I make a small room feel larger?", a: "Use light paint colors, hang mirrors to reflect light, select low-profile furniture with legs, and keep clutter to a minimum." },
        { q: "What is the difference between interior design and interior decorating?", a: "Interior design involves spatial planning and structural changes, whereas decorating focuses purely on aesthetic adornments like furniture and accessories." },
        { q: "How do I choose the right rug size for my living room?", a: "Make sure at least the front legs of your sofa and key chairs sit on the rug to anchor the seating arrangement cohesively." }
      ]
    }
  };

  // Fallback for categories not explicitly configured
  const DefaultTemplates = {
    intros: [
      "Creating a beautiful, functional living space is a universal goal for homeowners and design enthusiasts alike. To achieve this, it helps to understand the foundational principles that govern modern properties. In this expert guide, we discuss key strategies to help you optimize your home layout and lifestyle.",
      "Every property holds hidden potential waiting to be unlocked. With the right techniques and a clear execution plan, you can turn any standard space into an extraordinary sanctuary. Let's dive deep into the essential rules and methods you should adopt."
    ],
    h2s: [
      "Foundational Principles and Planning Steps",
      "Essential Tools and Materials You Will Need",
      "Key Techniques for Flawless Execution",
      "Maintenance and Long-Term Value Protection"
    ],
    h3s: {
      "Foundational Principles and Planning Steps": [
        "Setting Realistic Milestone Goals",
        "Assessing Structural and Zoning Regulations"
      ],
      "Key Techniques for Flawless Execution": [
        "Optimizing Work Sequences to Avoid Rework",
        "Quality Control Inspections and Troubleshooting"
      ]
    },
    paragraphs: [
      "Any project, big or small, begins with proper scoping. By analyzing the site requirements and cataloging necessary items, you set yourself up for a stress-free execution. Industry standards recommend conducting a thorough inspection before commencing.",
      "Acquiring high-quality materials ensures durability and performance. It is always best to prioritize sustainable, premium-grade items that can withstand wear and tear. Utilizing the correct tools prevents damage and guarantees clean results.",
      "Long-term maintenance is the key to protecting your investment. Regular check-ups, cleaning, and prompt repairs prevent minor wear from turning into costly replacements. Create a seasonal maintenance checklist to keep your property in top-tier shape."
    ],
    ctas: [
      "Explore more expert tips by checking out our curated articles and property guides on Home Inserts!",
      "Subscribing to our updates is the easiest way to stay informed. Join thousands of homeowners receiving our expert tips weekly!"
    ],
    faqs: [
      { q: "How do I start planning my project?", a: "Begin by writing down your goals, researching design inspiration, creating a budget checklist, and consulting local building codes." },
      { q: "How can I maintain my home's value over time?", a: "Consistently inspect for roof leaks, maintain exterior paint, update HVAC filters, and keep landscaping trimmed and healthy." },
      { q: "Should I buy premium materials or standard ones?", a: "For structural and high-traffic areas, always invest in premium materials. For purely cosmetic, low-traffic areas, standard materials are usually sufficient." }
    ]
  };

  // Map user categories to template keys
  function getTemplateData(category) {
    if (NicheData[category]) return NicheData[category];
    
    // Group similar categories
    if (['Home Decor', 'Interior Design'].includes(category)) return NicheData['Interior Design'];
    if (['Real Estate', 'Property Guides', 'Home Buying', 'Home Selling'].includes(category)) return NicheData['Real Estate'];
    if (['Home Improvement', 'Renovation', 'Architecture', 'Smart Homes', 'Kitchen', 'Sleep & Comfort', 'Outdoor & Landscaping'].includes(category)) {
      return NicheData['Home Improvement'];
    }
    
    return DefaultTemplates;
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
        tone = 'Professional',
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
      const h2s = [...data.h2s];
      // Inject focus keyword into at least one H2
      if (pKeyword && h2s.length > 0) {
        h2s[1] = `${h2s[1]}: Integrating ${pKeyword}`;
      }

      const outlineStructure = [];
      h2s.forEach(h2 => {
        const subHeadings = data.h3s[h2] || [
          `Key Factors for ${h2}`,
          `Common Mistakes to Avoid`
        ];
        outlineStructure.push({
          heading: h2,
          level: 2,
          subHeadings: subHeadings.map(h3 => ({ heading: h3, level: 3 }))
        });
      });

      // Midjourney / DALL-E Image Prompts
      const featuredImagePrompt = `A high-end architectural photo of a beautifully lit, modern room themed around ${category.toLowerCase()}, displaying clean design, realistic textures, highly detailed, photorealistic, 8k resolution, shot on 35mm lens --ar 16:9`;
      const socialImagePrompt = `Modern social sharing banner representing ${topicClean}, clean minimalist background, vibrant accent colors, typography overlay placeholder --ar 1.91:1`;
      const thumbnailPrompt = `Close-up shot of architectural details representing ${pKeyword || category}, soft lighting, warm depth of field, minimalist card asset --ar 1:1`;

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
        imagePrompts: {
          featured: featuredImagePrompt,
          social: socialImagePrompt,
          thumbnail: thumbnailPrompt
        }
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
        tone = 'Professional',
        outline = [],
        faqs = [],
        cta = '',
        inputs = {}
      } = blueprint;

      const pKeyword = focusKeyword || 'modern home upgrades';
      const secKeywords = secondaryKeywords.length > 0 ? secondaryKeywords : ['home optimization'];
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

      // 2. Introduction (Paragraph 1 - must include focus keyword in first para)
      const introSeed = data.intros[0];
      const introText = `When focusing on **${pKeyword}**, ${introSeed.charAt(0).toLowerCase() + introSeed.slice(1)}`;
      html += `<p>${introText}</p>\n\n`;

      // Key Takeaways Box
      html += `<div class="callout-box info-box">\n  <h5>💡 Key Takeaways</h5>\n  <ul>\n`;
      html += `    <li>Always establish a firm budget checklist before beginning any project targeting ${pKeyword}.</li>\n`;
      html += `    <li>Leverage high-ROI upgrades like energy-efficient lighting and localized spatial modifications first.</li>\n`;
      html += `    <li>Incorporate secondary keywords like <strong>${secKeywords[0]}</strong> to maintain search relevance.</li>\n`;
      html += `  </ul>\n</div>\n\n`;

      // 3. Body H2 & H3 Sections
      outline.forEach((section, idx) => {
        const anchor = `section-${idx}`;
        html += `<h2 id="${anchor}">${section.heading}</h2>\n`;
        
        // Add a body paragraph for H2
        const paraIndex = idx % data.paragraphs.length;
        let pText = data.paragraphs[paraIndex];
        // Inject keyword randomly
        if (pKeyword && idx === 1) {
          pText = `To maximize the impact of **${pKeyword}**, it helps to implement structured approaches. ${pText}`;
        }
        html += `<p>${pText}</p>\n\n`;

        // Render H3 Subheadings
        section.subHeadings.forEach((sub, subIdx) => {
          html += `<h3>${sub.heading}</h3>\n`;
          html += `<p>Properly exploring the sub-topic of ${sub.heading.toLowerCase()} allows homeowners to avoid common pitfalls. Ensure you measure twice and cut once, and double-check all clearances. Using high-grade materials makes a noticeable difference in long-term longevity and performance.</p>\n\n`;
          
          // Inject a structured list or custom visual element
          if (idx === 0 && subIdx === 0) {
            html += `<ul>\n  <li><strong>Planning Phase:</strong> Draft blueprints and list tools.</li>\n  <li><strong>Procurement:</strong> Source sustainable wood, metal hardware, and accessories.</li>\n  <li><strong>Execution:</strong> Apply layouts methodically, starting from corner junctions.</li>\n</ul>\n\n`;
          }
          
          // Inject a Table
          if (idx === 1 && subIdx === 0) {
            html += `<table class="comparison-table">\n  <thead>\n    <tr><th>Upgrade Aspect</th><th>Expected Cost</th><th>Value Addition</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Cosmetic Refacing</td><td>Low</td><td>Medium</td></tr>\n    <tr><td>Hardware & Smart Tech</td><td>Medium</td><td>High</td></tr>\n    <tr><td>Structural Changes</td><td>High</td><td>High</td></tr>\n  </tbody>\n</table>\n\n`;
          }
        });
      });

      // 4. Pros & Cons Block
      html += `<div class="pros-cons-grid">\n  <div class="pros-box">\n    <h5>✅ Pros</h5>\n    <ul>\n      <li>Substantially raises the aesthetic and functional appeal of your residence.</li>\n      <li>Delivers notable energy savings and utility bill reductions over time.</li>\n      <li>Increases property equity, which is vital for future resale.</li>\n    </ul>\n  </div>\n  <div class="cons-box">\n    <h5>❌ Cons</h5>\n    <ul>\n      <li>Requires upfront capital planning and temporary disruption of space.</li>\n      <li>Some DIY attempts can lead to sub-optimal results if not carefully researched.</li>\n    </ul>\n  </div>\n</div>\n\n`;

      // 5. FAQ Accordion Section (Schema-ready)
      html += `<h2 id="faq-section">Frequently Asked Questions (FAQ)</h2>\n`;
      html += `<div class="faq-accordion-wrapper">\n`;
      faqs.forEach((faq, fIdx) => {
        html += `  <div class="faq-accordion-item">\n    <button type="button" class="faq-accordion-header">❓ ${faq.q}</button>\n    <div class="faq-accordion-content">\n      <p>${faq.a}</p>\n    </div>\n  </div>\n`;
      });
      html += `</div>\n\n`;

      // 6. Conclusion and CTA
      html += `<h2>Conclusion</h2>\n`;
      html += `<p>In conclusion, taking the time to plan out your ${category.toLowerCase()} projects is the single most effective way to ensure a high-quality finish. By adhering to the principles outlined above—and keeping your focus keyword <strong>${pKeyword}</strong> at the front of your strategies—you will enjoy a beautiful, efficient, and valuable property for years to come.</p>\n\n`;

      html += `<div class="callout-box cta-box">\n  <h5>📞 Get Started Today</h5>\n  <p>${cta}</p>\n  <p>For more home renovation and lifestyle ideas, explore our full library of articles on <a href="index.html">Home Inserts</a>, or contact our team via <a href="contact.html">our Contact Page</a>.</p>\n</div>\n`;

      return html;
    }
  };

  // Export to global window context
  global.AIGenerator = AIGenerator;

})(typeof window !== 'undefined' ? window : this);
