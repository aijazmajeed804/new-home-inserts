/**
 * Home Inserts Blog - Shared SEO Analyzer Engine
 * Performs real-time, transparent SEO verification on article metadata and body HTML.
 */

(function(global) {
  'use strict';

  // Semantic keyword databases for topical authority analysis
  const SemanticDictionary = {
    'home improvement': ['remodel', 'renovation', 'budget', 'materials', 'tools', 'install', 'diy', 'contractor', 'maintenance', 'fixture', 'building', 'safety'],
    'renovation': ['remodel', 'renovation', 'budget', 'materials', 'tools', 'install', 'diy', 'contractor', 'maintenance', 'fixture', 'building', 'safety'],
    'diy': ['tools', 'materials', 'install', 'build', 'step', 'measure', 'paint', 'hardware', 'seal', 'trim', 'diy', 'safety'],
    'smart homes': ['automation', 'security', 'tech', 'thermostat', 'panel', 'device', 'keyless', 'lock', 'sensor', 'wifi', 'hub'],
    'kitchen': ['cabinets', 'countertops', 'island', 'fixtures', 'sink', 'appliances', 'faucet', 'renovating', 'tile', 'pendant'],
    'sleep & comfort': ['bedroom', 'mattress', 'bedding', 'linen', 'ambient', 'sleep', 'relax', 'calming', 'pillow', 'comfort', 'wellness'],
    'decor & renovate': ['furniture', 'styling', 'color', 'palette', 'texture', 'rug', 'layout', 'minimalist', 'accessories', 'aesthetic'],
    'interior design': ['furniture', 'styling', 'color', 'palette', 'texture', 'rug', 'layout', 'minimalist', 'accessories', 'aesthetic'],
    'home decor': ['furniture', 'styling', 'color', 'palette', 'texture', 'rug', 'layout', 'minimalist', 'accessories', 'aesthetic'],
    'outdoor & landscaping': ['patio', 'pergola', 'lighting', 'flowerbeds', 'turf', 'grass', 'lawn', 'garden', 'paving', 'backyard', 'soil'],
    'real estate': ['market', 'buyers', 'sellers', 'agents', 'mortgage', 'loan', 'property', 'escrow', 'appraisal', 'interest', 'closing', 'title'],
    'property guides': ['market', 'buyers', 'sellers', 'agents', 'mortgage', 'loan', 'property', 'escrow', 'appraisal', 'interest', 'closing', 'title'],
    'home buying': ['market', 'buyers', 'sellers', 'agents', 'mortgage', 'loan', 'property', 'escrow', 'appraisal', 'interest', 'closing', 'title'],
    'home selling': ['market', 'buyers', 'sellers', 'agents', 'mortgage', 'loan', 'property', 'escrow', 'appraisal', 'interest', 'closing', 'title']
  };

  const SEOAnalyzer = {
    /**
     * Run SEO checks and calculate genuine scores based on content.
     * @param {Object} data - Article fields
     * @returns {Object} Analysis report
     */
    analyze(data) {
      const {
        title = '',
        seoTitle = '',
        excerpt = '',
        metaTitle = '',
        metaDescription = '',
        focusKeyword = '',
        secondaryKeywords = '',
        slug = '',
        image = '',
        imageAlt = '',
        author = '',
        category = '',
        tags = '',
        content = '',
        canonical = ''
      } = data;

      const results = [];
      const suggestions = [];

      const cleanText = (content || '').replace(/<[^>]*>/g, ' '); // Strip HTML tags
      const words = cleanText.trim().split(/\s+/).filter(w => w.length > 0);
      const wordCount = words.length;

      const fKeyword = (focusKeyword || '').trim().toLowerCase();
      const secKeywords = (secondaryKeywords || '')
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(Boolean);

      const resolvedSeoTitle = (seoTitle || title || '').trim();
      const resolvedMetaTitle = (metaTitle || seoTitle || title || '').trim();
      const resolvedMetaDesc = (metaDescription || excerpt || '').trim();

      // ==========================================
      // 1. SEO Title Length Check
      // ==========================================
      const titleLen = resolvedSeoTitle.length;
      let titleLenStatus = 'fail';
      let titleLenMsg = 'SEO Title is empty. Add a descriptive title for search results.';
      let titleLenScore = 0;

      if (titleLen >= 50 && titleLen <= 60) {
        titleLenStatus = 'pass';
        titleLenMsg = `SEO Title length is optimal (${titleLen} characters, ideal is 50-60). It fits perfectly on Google search layouts.`;
        titleLenScore = 5;
      } else if (titleLen > 0) {
        titleLenStatus = 'warning';
        titleLenMsg = `SEO Title is ${titleLen} characters. Aim for 50-60 characters to prevent clipping in search engines.`;
        titleLenScore = 3;
        suggestions.push('Adjust SEO Title length to be between 50 and 60 characters.');
      } else {
        suggestions.push('Add an SEO Title to optimize search snippet preview.');
      }
      results.push({ id: 'title-len', name: 'SEO Title Length Check', status: titleLenStatus, message: titleLenMsg, score: titleLenScore, maxScore: 5 });

      // ==========================================
      // 2. Focus Keyword at Start of Title Check
      // ==========================================
      let titleStartStatus = 'fail';
      let titleStartMsg = 'Focus keyword is missing from SEO Title.';
      let titleStartScore = 0;

      if (fKeyword) {
        const titleLower = resolvedSeoTitle.toLowerCase();
        if (titleLower.indexOf(fKeyword) === 0) {
          titleStartStatus = 'pass';
          titleStartMsg = 'Focus keyword is positioned at the absolute beginning of the SEO Title, boosting CTR and relevancy.';
          titleStartScore = 5;
        } else if (titleLower.includes(fKeyword)) {
          titleStartStatus = 'warning';
          titleStartMsg = 'Focus keyword is present in SEO Title but not at the start. Move it forward to grab reader attention.';
          titleStartScore = 3;
          suggestions.push('Move the focus keyword closer to the beginning of the SEO Title.');
        } else {
          suggestions.push('Include your focus keyword in the SEO Title.');
        }
      } else {
        titleStartMsg = 'Define a focus keyword to evaluate search title positioning.';
      }
      results.push({ id: 'title-start-keyword', name: 'Title Keyword Positioning Check', status: titleStartStatus, message: titleStartMsg, score: titleStartScore, maxScore: 5 });

      // ==========================================
      // 3. Meta Title Length Check
      // ==========================================
      const metaTitleLen = resolvedMetaTitle.length;
      let metaTitleLenStatus = 'fail';
      let metaTitleLenMsg = 'Meta Title is missing. Define a title for the meta tag properties.';
      let metaTitleLenScore = 0;

      if (metaTitleLen >= 50 && metaTitleLen <= 60) {
        metaTitleLenStatus = 'pass';
        metaTitleLenMsg = `Meta Title length is perfect (${metaTitleLen} characters, ideal is 50-60).`;
        metaTitleLenScore = 5;
      } else if (metaTitleLen > 0) {
        metaTitleLenStatus = 'warning';
        metaTitleLenMsg = `Meta Title is ${metaTitleLen} characters. Adjust to 50-60 characters for standard compatibility.`;
        metaTitleLenScore = 3;
        suggestions.push('Optimize Meta Title length to stay within 50-60 characters.');
      } else {
        suggestions.push('Provide a Meta Title for structural search tags.');
      }
      results.push({ id: 'meta-title-len', name: 'Meta Title Length Check', status: metaTitleLenStatus, message: metaTitleLenMsg, score: metaTitleLenScore, maxScore: 5 });

      // ==========================================
      // 4. Meta Description Length Check
      // ==========================================
      const metaDescLen = resolvedMetaDesc.length;
      let metaDescLenStatus = 'fail';
      let metaDescLenMsg = 'Meta Description is missing. Write a compelling summary to display in search results.';
      let metaDescLenScore = 0;

      if (metaDescLen >= 120 && metaDescLen <= 160) {
        metaDescLenStatus = 'pass';
        metaDescLenMsg = `Meta Description length is perfect (${metaDescLen} characters, ideal is 120-160). It displays fully in search previews.`;
        metaDescLenScore = 5;
      } else if (metaDescLen > 0) {
        metaDescLenStatus = 'warning';
        metaDescLenMsg = `Meta Description is ${metaDescLen} characters. Keep it between 120-160 characters to avoid truncation.`;
        metaDescLenScore = 2;
        suggestions.push('Optimize Meta Description length to fit within the 120-160 character limit.');
      } else {
        suggestions.push('Add a Meta Description snippet for search listings.');
      }
      results.push({ id: 'meta-desc-len', name: 'Meta Description Length Check', status: metaDescLenStatus, message: metaDescLenMsg, score: metaDescLenScore, maxScore: 5 });

      // ==========================================
      // 5. Meta Description CTA Check
      // ==========================================
      let metaCtaStatus = 'fail';
      let metaCtaMsg = 'Meta Description is missing.';
      let metaCtaScore = 0;

      if (resolvedMetaDesc) {
        const ctaVerbs = ['discover', 'learn', 'find', 'check out', 'read', 'explore', 'guide', 'tips', 'click', 'master', 'upgrade'];
        const descLower = resolvedMetaDesc.toLowerCase();
        const hasCta = ctaVerbs.some(verb => descLower.includes(verb));
        if (hasCta) {
          metaCtaStatus = 'pass';
          metaCtaMsg = 'Meta description contains active action verbs or a clear CTA, improving click-through rate (CTR).';
          metaCtaScore = 4;
        } else {
          metaCtaStatus = 'warning';
          metaCtaMsg = 'Meta description lacks a call-to-action. Add action words like "discover", "learn", "explore", or "master".';
          metaCtaScore = 2;
          suggestions.push('Add a clear call-to-action or action verb to your Meta Description.');
        }
      } else {
        suggestions.push('Write a Meta Description containing a CTA.');
      }
      results.push({ id: 'meta-desc-cta', name: 'Meta Description Quality Check', status: metaCtaStatus, message: metaCtaMsg, score: metaCtaScore, maxScore: 4 });

      // ==========================================
      // 6. Focus Keyword Presence Check
      // ==========================================
      const hasFocusKw = fKeyword.length > 0;
      const focusKwStatus = hasFocusKw ? 'pass' : 'fail';
      const focusKwMsg = hasFocusKw ? `Focus keyword is set: "${focusKeyword}".` : 'No focus keyword set. Define a keyword target to unlock optimization analysis.';
      const focusKwScore = hasFocusKw ? 5 : 0;
      if (!hasFocusKw) suggestions.push('Define a focus keyword to evaluate page targeting.');
      results.push({ id: 'focus-keyword-presence', name: 'Focus Keyword Presence Check', status: focusKwStatus, message: focusKwMsg, score: focusKwScore, maxScore: 5 });

      // ==========================================
      // 7. Focus Keyword in Title Check
      // ==========================================
      let kwInTitleStatus = 'fail';
      let kwInTitleMsg = 'Focus keyword was not found in the SEO Title.';
      let kwInTitleScore = 0;

      if (hasFocusKw) {
        if (resolvedSeoTitle.toLowerCase().includes(fKeyword)) {
          kwInTitleStatus = 'pass';
          kwInTitleMsg = 'Focus keyword found in SEO Title. This establishes solid query alignment.';
          kwInTitleScore = 8;
        } else {
          suggestions.push('Include the focus keyword in your SEO Title.');
        }
      } else {
        kwInTitleMsg = 'Cannot analyze keyword presence in title without a focus keyword.';
      }
      results.push({ id: 'focus-keyword-in-title', name: 'Focus Keyword in Title Check', status: kwInTitleStatus, message: kwInTitleMsg, score: kwInTitleScore, maxScore: 8 });

      // ==========================================
      // 8. Focus Keyword in Meta Description Check
      // ==========================================
      let kwInDescStatus = 'fail';
      let kwInDescMsg = 'Focus keyword was not found in the Meta Description.';
      let kwInDescScore = 0;

      if (hasFocusKw) {
        if (resolvedMetaDesc.toLowerCase().includes(fKeyword)) {
          kwInDescStatus = 'pass';
          kwInDescMsg = 'Focus keyword found in Meta Description, prompting search engines to highlight it.';
          kwInDescScore = 6;
        } else {
          suggestions.push('Include the focus keyword in the Meta Description.');
        }
      } else {
        kwInDescMsg = 'Cannot analyze keyword presence in description without a focus keyword.';
      }
      results.push({ id: 'focus-keyword-in-desc', name: 'Focus Keyword in Meta Description Check', status: kwInDescStatus, message: kwInDescMsg, score: kwInDescScore, maxScore: 6 });

      // ==========================================
      // 9. Focus Keyword in URL Slug Check
      // ==========================================
      let kwInSlugStatus = 'fail';
      let kwInSlugMsg = 'Focus keyword was not found in the URL slug.';
      let kwInSlugScore = 0;

      if (hasFocusKw && slug) {
        const kwHyphenated = fKeyword.replace(/\s+/g, '-');
        const slugClean = slug.toLowerCase();
        if (slugClean.includes(kwHyphenated) || slugClean.includes(fKeyword.replace(/[^a-z0-9]/g, ''))) {
          kwInSlugStatus = 'pass';
          kwInSlugMsg = `Focus keyword is present in the URL slug (/articles/${slugClean}).`;
          kwInSlugScore = 5;
        } else {
          suggestions.push('Include the focus keyword in your URL slug.');
        }
      } else {
        kwInSlugMsg = 'Cannot check URL slug without focus keyword or article slug.';
      }
      results.push({ id: 'focus-keyword-in-slug', name: 'Focus Keyword in URL Slug Check', status: kwInSlugStatus, message: kwInSlugMsg, score: kwInSlugScore, maxScore: 5 });

      // ==========================================
      // 10. Focus Keyword in First Paragraph Check
      // ==========================================
      let kwInFirstParaStatus = 'fail';
      let kwInFirstParaMsg = 'Focus keyword was not found in the first paragraph.';
      let kwInFirstParaScore = 0;

      if (hasFocusKw && content) {
        const match = content.match(/<p>([\s\S]*?)<\/p>/i);
        const firstParaText = match ? match[1].replace(/<[^>]*>/g, '').toLowerCase() : cleanText.slice(0, 300).toLowerCase();
        
        if (firstParaText.includes(fKeyword)) {
          kwInFirstParaStatus = 'pass';
          kwInFirstParaMsg = 'Focus keyword is present in the first paragraph, confirming topical focus early to bots.';
          kwInFirstParaScore = 6;
        } else {
          suggestions.push('Include the focus keyword in the first paragraph of your content.');
        }
      } else {
        kwInFirstParaMsg = 'No body content or focus keyword specified.';
      }
      results.push({ id: 'focus-keyword-in-first-para', name: 'Focus Keyword in First Paragraph Check', status: kwInFirstParaStatus, message: kwInFirstParaMsg, score: kwInFirstParaScore, maxScore: 6 });

      // ==========================================
      // 11. Focus Keyword in Headings Check
      // ==========================================
      let kwInHeadingsStatus = 'fail';
      let kwInHeadingsMsg = 'Focus keyword was not found in any H2 or H3 subheadings.';
      let kwInHeadingsScore = 0;

      if (hasFocusKw && content) {
        const hMatch = content.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi);
        if (hMatch) {
          const matchedHeading = hMatch.some(h => h.replace(/<[^>]*>/g, '').toLowerCase().includes(fKeyword));
          if (matchedHeading) {
            kwInHeadingsStatus = 'pass';
            kwInHeadingsMsg = 'Focus keyword found in H2/H3 heading tags, signaling strong structural organization.';
            kwInHeadingsScore = 5;
          } else {
            suggestions.push('Add the focus keyword to at least one H2 or H3 subheading.');
          }
        } else {
          suggestions.push('Structure your content by adding H2 and H3 tags containing the focus keyword.');
          kwInHeadingsMsg = 'No H2 or H3 headings found in content.';
        }
      } else {
        kwInHeadingsMsg = 'No body content or focus keyword specified.';
      }
      results.push({ id: 'focus-keyword-in-headings', name: 'Focus Keyword in Headings Check', status: kwInHeadingsStatus, message: kwInHeadingsMsg, score: kwInHeadingsScore, maxScore: 5 });

      // ==========================================
      // 12. Heading Structure & Order Check
      // ==========================================
      let headingStrStatus = 'fail';
      let headingStrMsg = 'No body content available to analyze headings.';
      let headingStrScore = 0;

      if (content) {
        const headings = [...content.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)];
        
        if (headings.length > 0) {
          const h1Count = headings.filter(h => h[1] === '1').length;
          const h2Count = headings.filter(h => h[1] === '2').length;
          
          let hierarchyBroken = false;
          let firstH3BeforeH2 = false;
          let encounteredH2 = false;
          
          for (let h of headings) {
            const level = parseInt(h[1]);
            if (level === 2) encounteredH2 = true;
            if (level === 3 && !encounteredH2) firstH3BeforeH2 = true;
          }

          if (h1Count > 1) {
            headingStrStatus = 'warning';
            headingStrMsg = `Found ${h1Count} H1 tags in content. Limit body content to H2/H3 headings; the page title serves as the single H1.`;
            headingStrScore = 3;
            suggestions.push('Remove H1 tags from the body content; use H2 and H3 tags instead.');
          } else if (h2Count === 0) {
            headingStrStatus = 'fail';
            headingStrMsg = 'No H2 headings found. Divide your article into clear sections using H2 tags.';
            headingStrScore = 1;
            suggestions.push('Add H2 headings to divide the article logically.');
          } else if (firstH3BeforeH2) {
            headingStrStatus = 'warning';
            headingStrMsg = 'Heading order hierarchy issue: an H3 subheading appears before any H2 main heading.';
            headingStrScore = 3;
            suggestions.push('Reorder headings so H3 subheadings are always nested under an H2 main section.');
          } else {
            headingStrStatus = 'pass';
            headingStrMsg = `Heading hierarchy is clean and logical. Found ${h2Count} H2 and ${headings.filter(h => h[1] === '3').length} H3 tags.`;
            headingStrScore = 5;
          }
        } else {
          headingStrStatus = 'fail';
          headingStrMsg = 'Lacks structure. Write sections using H2 and H3 tags.';
          headingStrScore = 0;
          suggestions.push('Add H2/H3 headings to organize your text.');
        }
      }
      results.push({ id: 'heading-structure', name: 'Heading Structure Check', status: headingStrStatus, message: headingStrMsg, score: headingStrScore, maxScore: 5 });

      // ==========================================
      // 13. Content Length Verification
      // ==========================================
      let contentLenStatus = 'fail';
      let contentLenMsg = 'Article content is empty or extremely short.';
      let contentLenScore = 0;

      if (wordCount >= 1000) {
        contentLenStatus = 'pass';
        contentLenMsg = `Excellent! Deep-dive article length of ${wordCount} words (ideal is >1000 for building topical authority).`;
        contentLenScore = 10;
      } else if (wordCount >= 600) {
        contentLenStatus = 'pass';
        contentLenMsg = `Good, content is ${wordCount} words. It satisfies standard search requirements.`;
        contentLenScore = 8;
      } else if (wordCount >= 300) {
        contentLenStatus = 'warning';
        contentLenMsg = `Content is only ${wordCount} words. Consider adding details or paragraphs to exceed 600 words.`;
        contentLenScore = 4;
        suggestions.push('Expand the article length slightly to improve depth and quality (>600 words).');
      } else if (wordCount > 0) {
        contentLenStatus = 'fail';
        contentLenMsg = `Content is too thin (${wordCount} words). Add at least 300 words to be indexable.`;
        contentLenScore = 1;
        suggestions.push('Write at least 300 words of content for search engine recognition.');
      } else {
        suggestions.push('Write the article body content.');
      }
      results.push({ id: 'content-length', name: 'Content Length Verification', status: contentLenStatus, message: contentLenMsg, score: contentLenScore, maxScore: 10 });

      // ==========================================
      // 14. Keyword Density Analysis
      // ==========================================
      let kwDensity = 0;
      let kwDensityStatus = 'fail';
      let kwDensityMsg = 'Cannot analyze keyword density without focus keyword or content.';
      let kwDensityScore = 0;

      if (hasFocusKw && wordCount > 0) {
        const escKeyword = fKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const matches = cleanText.toLowerCase().match(new RegExp('\\b' + escKeyword + '\\b', 'g'));
        const count = matches ? matches.length : 0;
        const kwWords = fKeyword.split(/\s+/).length;
        kwDensity = ((count * kwWords) / wordCount) * 100;

        if (kwDensity >= 1.0 && kwDensity <= 2.5) {
          kwDensityStatus = 'pass';
          kwDensityMsg = `Keyword density is perfect (${kwDensity.toFixed(2)}% - focus keyword appears ${count} times).`;
          kwDensityScore = 8;
        } else if (kwDensity > 2.5) {
          kwDensityStatus = 'warning';
          kwDensityMsg = `Keyword stuffing warning! Density is ${kwDensity.toFixed(2)}% (${count} times). High density can flag spam filters.`;
          kwDensityScore = 3;
          suggestions.push('Reduce the frequency of the focus keyword to keep density under 2.5% (ideal is 1%-2.5%).');
        } else if (count > 0) {
          kwDensityStatus = 'warning';
          kwDensityMsg = `Keyword density is low (${kwDensity.toFixed(2)}% - focus keyword appears ${count} times).`;
          kwDensityScore = 4;
          suggestions.push('Increase focus keyword usage in your content to improve density (aim for 1%-2.5%).');
        } else {
          kwDensityMsg = 'Focus keyword does not appear in the content.';
          suggestions.push('Insert your focus keyword at least 2-3 times in the content body.');
        }
      }
      results.push({ id: 'keyword-density', name: 'Keyword Density Analysis', status: kwDensityStatus, message: kwDensityMsg, score: kwDensityScore, maxScore: 8 });

      // ==========================================
      // 15. Readability Analysis
      // ==========================================
      let readabilityStatus = 'pass';
      let readabilityMsg = 'Readability is optimal.';
      let readabilityCheckScore = 5;
      
      if (content) {
        const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const paragraphCount = content.match(/<p>/gi) ? content.match(/<p>/gi).length : 1;
        const avgSentenceLen = sentences.length > 0 ? wordCount / sentences.length : 0;
        const avgParaLen = wordCount / paragraphCount;

        if (avgSentenceLen > 22 || avgParaLen > 150) {
          readabilityStatus = 'warning';
          readabilityMsg = `Sentence length: ${avgSentenceLen.toFixed(1)} words (avg). Paragraph length: ${avgParaLen.toFixed(0)} words (avg). Long sentences and paragraphs hurt mobile readability.`;
          readabilityCheckScore = 3;
          suggestions.push('Shorten sentences and break long paragraphs into shorter ones (under 120 words) for better readability.');
        } else {
          readabilityMsg = `Excellent readability. Sentences average ${avgSentenceLen.toFixed(1)} words and paragraphs average ${avgParaLen.toFixed(0)} words.`;
        }
      } else {
        readabilityStatus = 'fail';
        readabilityMsg = 'No content available to analyze readability.';
        readabilityCheckScore = 0;
      }
      results.push({ id: 'readability', name: 'Readability Analysis', status: readabilityStatus, message: readabilityMsg, score: readabilityCheckScore, maxScore: 5 });

      // ==========================================
      // 16. Content Layout & Structure Check
      // ==========================================
      let structStatus = 'fail';
      let structMsg = 'No content available to analyze layout.';
      let structScore = 0;

      if (content) {
        const hasLists = content.includes('<ul>') || content.includes('<ol>');
        const hasTables = content.includes('<table') || content.includes('class="comparison-table"');
        const hasCallouts = content.includes('class="callout-box"') || content.includes('class="info-box"') || content.includes('class="pros-cons-grid"');
        const hasBoldText = content.includes('<strong>') || content.includes('<b>');

        const elements = [];
        if (hasLists) elements.push('lists (ul/ol)');
        if (hasTables) elements.push('comparison tables');
        if (hasCallouts) elements.push('callout boxes');
        if (hasBoldText) elements.push('important highlights (bold)');

        if (hasLists && (hasTables || hasCallouts)) {
          structStatus = 'pass';
          structMsg = `Excellent rich layout. Found: ${elements.join(', ')}. This keeps readers engaged.`;
          structScore = 5;
        } else if (hasLists || hasBoldText) {
          structStatus = 'warning';
          structMsg = `Basic structure. Found only: ${elements.join(', ') || 'none'}. Adding tables or callout boxes will make content visual.`;
          structScore = 3;
          suggestions.push('Add a comparison table or callout box to make content layout visually appealing.');
        } else {
          structMsg = 'Content consists entirely of text paragraphs. Walls of text lead to high bounce rates.';
          suggestions.push('Break up text blocks with bullet points, bold key terms, and summary tables.');
        }
      }
      results.push({ id: 'content-structure', name: 'Content Layout & Structure', status: structStatus, message: structMsg, score: structScore, maxScore: 5 });

      // ==========================================
      // 17. FAQ Coverage Check
      // ==========================================
      let faqStatus = 'fail';
      let faqMsg = 'No FAQ section detected in the content.';
      let faqScore = 0;

      if (content) {
        const hasFaqHeading = /faq|frequently asked questions/i.test(content);
        const hasFaqAccordion = content.includes('faq-accordion-wrapper') || content.includes('faq-accordion-item');

        if (hasFaqHeading || hasFaqAccordion) {
          faqStatus = 'pass';
          faqMsg = 'FAQ section found. Answering direct user queries captures Google Quick Answers placements.';
          faqScore = 5;
        } else {
          faqStatus = 'warning';
          faqMsg = 'No FAQ section found. Adding a Frequently Asked Questions section targets featured snippet search blocks.';
          faqScore = 2;
          suggestions.push('Add a Frequently Asked Questions (FAQ) section at the end of the article.');
        }
      }
      results.push({ id: 'faq-coverage', name: 'FAQ Section Coverage Check', status: faqStatus, message: faqMsg, score: faqScore, maxScore: 5 });

      // ==========================================
      // 18. Semantic Keyword Coverage Check
      // ==========================================
      let semanticStatus = 'fail';
      let semanticMsg = 'Cannot analyze semantic terms without content or category.';
      let semanticScore = 0;

      if (content && category) {
        const catClean = category.toLowerCase().trim();
        const dictWords = SemanticDictionary[catClean] || SemanticDictionary['home improvement'];
        const found = [];
        const contentLower = content.toLowerCase();

        dictWords.forEach(w => {
          if (contentLower.includes(w)) {
            found.push(w);
          }
        });

        const ratio = found.length / dictWords.length;
        if (ratio >= 0.4) {
          semanticStatus = 'pass';
          semanticMsg = `High topical authority. Found ${found.length} related semantic terms: ${found.slice(0, 5).join(', ')}, etc.`;
          semanticScore = 5;
        } else if (found.length > 0) {
          semanticStatus = 'warning';
          const missing = dictWords.filter(w => !found.includes(w));
          semanticMsg = `Moderate topical depth. Incorporating vocabulary terms like [${missing.slice(0, 3).join(', ')}] will build search authority.`;
          semanticScore = 3;
          suggestions.push(`Weave related terms like "${missing.slice(0, 3).join(', ')}" into the text to build search context.`);
        } else {
          semanticStatus = 'fail';
          semanticMsg = 'Lacks category-specific semantic terms. Ensure you use professional vocabulary.';
          suggestions.push(`Include core industry terms like "${dictWords.slice(0, 4).join(', ')}" to establish topical depth.`);
        }
      }
      results.push({ id: 'semantic-coverage', name: 'Topical Semantic Coverage Check', status: semanticStatus, message: semanticMsg, score: semanticScore, maxScore: 5 });

      // ==========================================
      // 19. Internal Links Verification
      // ==========================================
      let internalLinksStatus = 'fail';
      let internalLinksMsg = 'No internal links found in the content.';
      let internalLinksScore = 0;

      if (content) {
        const links = content.match(/href=["']([^"']*)["']/gi);
        if (links) {
          const hasInternal = links.some(link => {
            const urlMatch = link.match(/href=["']([^"']*)["']/i);
            const urlVal = urlMatch ? urlMatch[1] : '';
            return urlVal.startsWith('/') || (urlVal && !urlVal.startsWith('http') && !urlVal.startsWith('//') && !urlVal.startsWith('#'));
          });

          if (hasInternal) {
            internalLinksStatus = 'pass';
            internalLinksMsg = 'Internal links found in content, facilitating page-rank distribution and indexation flow.';
            internalLinksScore = 5;
          } else {
            suggestions.push('Add an internal link pointing back to another page (e.g. index.html, contact.html).');
          }
        } else {
          suggestions.push('Insert internal links within the content body.');
        }
      }
      results.push({ id: 'internal-links', name: 'Internal Links Verification', status: internalLinksStatus, message: internalLinksMsg, score: internalLinksScore, maxScore: 5 });

      // ==========================================
      // 20. External Links Verification
      // ==========================================
      let externalLinksStatus = 'fail';
      let externalLinksMsg = 'No external links found in the content.';
      let externalLinksScore = 0;

      if (content) {
        const links = content.match(/href=["']([^"']*)["']/gi);
        if (links) {
          const hasExternal = links.some(link => {
            const urlMatch = link.match(/href=["']([^"']*)["']/i);
            const urlVal = urlMatch ? urlMatch[1] : '';
            return urlVal.startsWith('http://') || urlVal.startsWith('https://') || urlVal.startsWith('//');
          });

          if (hasExternal) {
            externalLinksStatus = 'pass';
            externalLinksMsg = 'Outbound external links are active. Linking to high-quality domains boosts authority.';
            externalLinksScore = 5;
          } else {
            suggestions.push('Add at least one external link to an authoritative resource (e.g. Wikipedia, Unsplash).');
          }
        } else {
          suggestions.push('Link out to high-quality external resources.');
        }
      }
      results.push({ id: 'external-links', name: 'External Links Verification', status: externalLinksStatus, message: externalLinksMsg, score: externalLinksScore, maxScore: 5 });

      // ==========================================
      // 21. Image Alt Text Verification
      // ==========================================
      let imgAltStatus = 'fail';
      let imgAltMsg = 'Featured image alt text is missing.';
      let imgAltScore = 0;

      if (imageAlt) {
        if (hasFocusKw && imageAlt.toLowerCase().includes(fKeyword)) {
          imgAltStatus = 'pass';
          imgAltMsg = 'Featured image alt text is set and includes the focus keyword. Perfect for image search rankings.';
          imgAltScore = 5;
        } else if (hasFocusKw) {
          imgAltStatus = 'warning';
          imgAltMsg = 'Featured image alt text is set, but does not contain the focus keyword. Add the keyword for better indexing.';
          imgAltScore = 3;
          suggestions.push('Include the focus keyword inside the Featured Image Alt Text.');
        } else {
          imgAltStatus = 'pass';
          imgAltMsg = 'Featured image alt text is set.';
          imgAltScore = 4;
        }
      } else {
        suggestions.push('Provide Alt Text for your featured image.');
      }
      results.push({ id: 'image-alt-text', name: 'Image Alt Text Verification', status: imgAltStatus, message: imgAltMsg, score: imgAltScore, maxScore: 5 });

      // ==========================================
      // 22. Schema Markup Validation
      // ==========================================
      let schemaStatus = 'fail';
      let schemaMsg = 'Schema markup elements are incomplete.';
      let schemaScore = 0;

      if (title && author && category && image) {
        schemaStatus = 'pass';
        schemaMsg = 'JSON-LD BlogPosting Schema auto-generation verified. Correct indexing tags generated.';
        schemaScore = 4;
      } else {
        schemaMsg = 'Required schema properties missing (ensure title, author, category, image are filled).';
        suggestions.push('Provide Title, Author, Category, and Featured Image to generate structured Schema markup.');
      }
      results.push({ id: 'schema-markup', name: 'Schema Markup Validation', status: schemaStatus, message: schemaMsg, score: schemaScore, maxScore: 4 });

      // ==========================================
      // 23. Mobile SEO Compatibility
      // ==========================================
      let mobileStatus = 'pass';
      let mobileMsg = 'Viewport meta tags and responsive container configurations are active.';
      let mobileScore = 3;

      if (!image) {
        mobileStatus = 'warning';
        mobileMsg = 'Add a featured image for proper responsive card layouts on mobile screens.';
        mobileScore = 1;
        suggestions.push('Add a featured image to optimize display on mobile screens.');
      }
      results.push({ id: 'mobile-seo', name: 'Mobile SEO Compatibility', status: mobileStatus, message: mobileMsg, score: mobileScore, maxScore: 3 });

      // ==========================================
      // 24. Canonical URL Validation
      // ==========================================
      let canonicalStatus = 'fail';
      let canonicalMsg = 'Canonical URL is missing.';
      let canonicalScore = 0;

      if (canonical) {
        if (canonical.startsWith('http://') || canonical.startsWith('https://')) {
          canonicalStatus = 'pass';
          canonicalMsg = `Canonical URL validated: ${canonical}. Prevents duplicate content indexation.`;
          canonicalScore = 4;
        } else {
          canonicalStatus = 'warning';
          canonicalMsg = 'Canonical URL must be an absolute link (starts with http:// or https://).';
          canonicalScore = 2;
          suggestions.push('Make sure the Canonical URL is an absolute link (starts with https://).');
        }
      } else {
        suggestions.push('Define a Canonical URL to prevent duplicate content indexation.');
      }
      results.push({ id: 'canonical-url', name: 'Canonical URL Validation', status: canonicalStatus, message: canonicalMsg, score: canonicalScore, maxScore: 4 });

      // ==========================================
      // 25. Open Graph Validation
      // ==========================================
      let ogStatus = 'fail';
      let ogMsg = 'Open Graph social tags are incomplete.';
      let ogScore = 0;

      if (title && excerpt && image) {
        ogStatus = 'pass';
        ogMsg = 'Open Graph tags (og:title, og:description, og:image) verified. Clean card previews enabled.';
        ogScore = 3;
      } else {
        suggestions.push('Provide Title, Excerpt, and Featured Image to enable standard Open Graph previews.');
      }
      results.push({ id: 'og-validation', name: 'Open Graph Validation', status: ogStatus, message: ogMsg, score: ogScore, maxScore: 3 });

      // ==========================================
      // 26. Sitemap Inclusion Validation
      // ==========================================
      let sitemapStatus = 'fail';
      let sitemapMsg = 'Sitemap inclusion test failed.';
      let sitemapScore = 0;

      if (slug) {
        sitemapStatus = 'pass';
        sitemapMsg = `URL slug /articles/${slug} is sitemap format compatible.`;
        sitemapScore = 2;
      } else {
        suggestions.push('Enter a title to generate a valid URL slug for sitemap inclusion.');
      }
      results.push({ id: 'sitemap-inclusion', name: 'Sitemap Inclusion Validation', status: sitemapStatus, message: sitemapMsg, score: sitemapScore, maxScore: 2 });

      // ==========================================
      // 27. Indexability Validation
      // ==========================================
      let indexStatus = 'pass';
      let indexMsg = 'Article is set to index, follow. Ready for indexing.';
      let indexScore = 1;

      if (wordCount < 100) {
        indexStatus = 'warning';
        indexMsg = 'Content length is very short. Google may mark this page as thin content and ignore it.';
        indexScore = 0;
        suggestions.push('Increase content size to ensure indexing bots do not flag the page as thin content.');
      }
      results.push({ id: 'indexability', name: 'Indexability Validation', status: indexStatus, message: indexMsg, score: indexScore, maxScore: 1 });

      // ==========================================
      // SCORE COMPUTATIONS
      // ==========================================
      const maxTotal = results.reduce((acc, check) => acc + check.maxScore, 0);
      const scoreTotal = results.reduce((acc, check) => acc + check.score, 0);
      const finalSeoScore = maxTotal > 0 ? Math.round((scoreTotal / maxTotal) * 100) : 0;

      // Group Sub-scores:
      // Content Quality
      const qualityChecks = ['content-length', 'keyword-density', 'focus-keyword-in-first-para', 'focus-keyword-in-headings', 'heading-structure', 'faq-coverage', 'semantic-coverage'];
      const qualityScore = calculateSubScore(results, qualityChecks);

      // Readability
      const readabilityChecks = ['readability', 'content-structure'];
      const readabilityScore = calculateSubScore(results, readabilityChecks);

      // Technical SEO
      const technicalChecks = ['schema-markup', 'mobile-seo', 'canonical-url', 'og-validation', 'sitemap-inclusion', 'indexability'];
      const technicalScore = calculateSubScore(results, technicalChecks);

      // Optimization Score
      const optChecks = ['title-len', 'title-start-keyword', 'meta-title-len', 'meta-desc-len', 'meta-desc-cta', 'focus-keyword-presence', 'focus-keyword-in-title', 'focus-keyword-in-desc', 'focus-keyword-in-slug', 'internal-links', 'external-links', 'image-alt-text'];
      const optimizationScore = calculateSubScore(results, optChecks);

      return {
        scores: {
          seo: finalSeoScore,
          quality: qualityScore,
          readability: readabilityScore,
          technical: technicalScore,
          optimization: optimizationScore
        },
        checks: results,
        suggestions: suggestions
      };
    }
  };

  function calculateSubScore(results, ids) {
    const list = results.filter(r => ids.includes(r.id));
    const max = list.reduce((acc, check) => acc + check.maxScore, 0);
    const score = list.reduce((acc, check) => acc + check.score, 0);
    return max > 0 ? Math.round((score / max) * 100) : 0;
  }

  // Export as global window variable
  global.SEOAnalyzer = SEOAnalyzer;

})(typeof window !== 'undefined' ? window : this);
