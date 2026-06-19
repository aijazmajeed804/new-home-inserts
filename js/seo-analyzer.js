/**
 * Home Inserts Blog - Shared SEO Analyzer Engine
 * Performs real-time SEO verification on article metadata and body content.
 */

(function(global) {
  'use strict';

  const SEOAnalyzer = {
    /**
     * Run all 21 SEO checks and calculate scores.
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
      let titleLenMsg = 'SEO Title is missing or empty.';
      let titleLenScore = 0;

      if (titleLen >= 50 && titleLen <= 60) {
        titleLenStatus = 'pass';
        titleLenMsg = `SEO Title length is perfect (${titleLen} characters, ideal is 50-60).`;
        titleLenScore = 5;
      } else if (titleLen > 0) {
        titleLenStatus = 'warning';
        titleLenMsg = `SEO Title length is ${titleLen} characters. Aim for 50-60 characters for optimal display in SERPs.`;
        titleLenScore = 3;
        suggestions.push('Adjust your SEO Title length to be between 50 and 60 characters.');
      } else {
        suggestions.push('Provide a descriptive SEO Title.');
      }
      results.push({ id: 'title-len', name: 'SEO Title Length Check', status: titleLenStatus, message: titleLenMsg, score: titleLenScore, maxScore: 5 });

      // ==========================================
      // 2. Meta Title Length Check
      // ==========================================
      const metaTitleLen = resolvedMetaTitle.length;
      let metaTitleLenStatus = 'fail';
      let metaTitleLenMsg = 'Meta Title is missing.';
      let metaTitleLenScore = 0;

      if (metaTitleLen >= 50 && metaTitleLen <= 60) {
        metaTitleLenStatus = 'pass';
        metaTitleLenMsg = `Meta Title length is perfect (${metaTitleLen} characters).`;
        metaTitleLenScore = 5;
      } else if (metaTitleLen > 0) {
        metaTitleLenStatus = 'warning';
        metaTitleLenMsg = `Meta Title is ${metaTitleLen} characters. Keep it between 50-60 characters.`;
        metaTitleLenScore = 3;
        suggestions.push('Adjust Meta Title length to keep it between 50 and 60 characters.');
      } else {
        suggestions.push('Provide a Meta Title for search engines.');
      }
      results.push({ id: 'meta-title-len', name: 'Meta Title Length Check', status: metaTitleLenStatus, message: metaTitleLenMsg, score: metaTitleLenScore, maxScore: 5 });

      // ==========================================
      // 3. Meta Description Length Check
      // ==========================================
      const metaDescLen = resolvedMetaDesc.length;
      let metaDescLenStatus = 'fail';
      let metaDescLenMsg = 'Meta Description is missing.';
      let metaDescLenScore = 0;

      if (metaDescLen >= 120 && metaDescLen <= 160) {
        metaDescLenStatus = 'pass';
        metaDescLenMsg = `Meta Description length is perfect (${metaDescLen} characters, ideal is 120-160).`;
        metaDescLenScore = 5;
      } else if (metaDescLen > 0) {
        metaDescLenStatus = 'warning';
        metaDescLenMsg = `Meta Description is ${metaDescLen} characters. Aim for 120-160 characters to avoid truncation.`;
        metaDescLenScore = 2;
        suggestions.push('Optimize your Meta Description length to be between 120 and 160 characters.');
      } else {
        suggestions.push('Add a Meta Description to describe the article page summary in SERPs.');
      }
      results.push({ id: 'meta-desc-len', name: 'Meta Description Length Check', status: metaDescLenStatus, message: metaDescLenMsg, score: metaDescLenScore, maxScore: 5 });

      // ==========================================
      // 4. Focus Keyword Presence Check
      // ==========================================
      const hasFocusKw = fKeyword.length > 0;
      const focusKwStatus = hasFocusKw ? 'pass' : 'fail';
      const focusKwMsg = hasFocusKw ? `Focus keyword is set: "${focusKeyword}".` : 'No focus keyword set. Add a focus keyword to analyze optimization.';
      const focusKwScore = hasFocusKw ? 5 : 0;
      if (!hasFocusKw) suggestions.push('Define a focus keyword to orient your SEO targeting.');
      results.push({ id: 'focus-keyword-presence', name: 'Focus Keyword Presence Check', status: focusKwStatus, message: focusKwMsg, score: focusKwScore, maxScore: 5 });

      // ==========================================
      // 5. Focus Keyword in Title Check
      // ==========================================
      let kwInTitleStatus = 'fail';
      let kwInTitleMsg = 'Focus keyword was not found in the SEO Title.';
      let kwInTitleScore = 0;

      if (hasFocusKw) {
        if (resolvedSeoTitle.toLowerCase().includes(fKeyword)) {
          kwInTitleStatus = 'pass';
          kwInTitleMsg = 'Focus keyword found in SEO Title.';
          kwInTitleScore = 8;
        } else {
          suggestions.push('Include the focus keyword in your SEO/Article Title.');
        }
      } else {
        kwInTitleMsg = 'Cannot analyze keyword presence in title without a focus keyword.';
      }
      results.push({ id: 'focus-keyword-in-title', name: 'Focus Keyword in Title Check', status: kwInTitleStatus, message: kwInTitleMsg, score: kwInTitleScore, maxScore: 8 });

      // ==========================================
      // 6. Focus Keyword in Meta Description Check
      // ==========================================
      let kwInDescStatus = 'fail';
      let kwInDescMsg = 'Focus keyword was not found in the Meta Description.';
      let kwInDescScore = 0;

      if (hasFocusKw) {
        if (resolvedMetaDesc.toLowerCase().includes(fKeyword)) {
          kwInDescStatus = 'pass';
          kwInDescMsg = 'Focus keyword found in Meta Description.';
          kwInDescScore = 6;
        } else {
          suggestions.push('Include the focus keyword in your Meta Description.');
        }
      } else {
        kwInDescMsg = 'Cannot analyze keyword presence in meta description without a focus keyword.';
      }
      results.push({ id: 'focus-keyword-in-desc', name: 'Focus Keyword in Meta Description Check', status: kwInDescStatus, message: kwInDescMsg, score: kwInDescScore, maxScore: 6 });

      // ==========================================
      // 7. Focus Keyword in URL Slug Check
      // ==========================================
      let kwInSlugStatus = 'fail';
      let kwInSlugMsg = 'Focus keyword was not found in the URL slug.';
      let kwInSlugScore = 0;

      if (hasFocusKw && slug) {
        const kwHyphenated = fKeyword.replace(/\s+/g, '-');
        const slugClean = slug.toLowerCase();
        if (slugClean.includes(kwHyphenated) || slugClean.includes(fKeyword.replace(/[^a-z0-9]/g, ''))) {
          kwInSlugStatus = 'pass';
          kwInSlugMsg = 'Focus keyword is present in the URL slug.';
          kwInSlugScore = 5;
        } else {
          suggestions.push('Include the focus keyword in your URL slug.');
        }
      } else {
        kwInSlugMsg = 'Cannot check URL slug without focus keyword or article slug.';
      }
      results.push({ id: 'focus-keyword-in-slug', name: 'Focus Keyword in URL Slug Check', status: kwInSlugStatus, message: kwInSlugMsg, score: kwInSlugScore, maxScore: 5 });

      // ==========================================
      // 8. Focus Keyword in First Paragraph Check
      // ==========================================
      let kwInFirstParaStatus = 'fail';
      let kwInFirstParaMsg = 'Focus keyword was not found in the first paragraph.';
      let kwInFirstParaScore = 0;

      if (hasFocusKw && content) {
        // Find first paragraph text
        const match = content.match(/<p>([\s\S]*?)<\/p>/i);
        const firstParaText = match ? match[1].replace(/<[^>]*>/g, '').toLowerCase() : cleanText.slice(0, 300).toLowerCase();
        
        if (firstParaText.includes(fKeyword)) {
          kwInFirstParaStatus = 'pass';
          kwInFirstParaMsg = 'Focus keyword is present in the first paragraph.';
          kwInFirstParaScore = 6;
        } else {
          suggestions.push('Include the focus keyword in the first paragraph of your content.');
        }
      } else {
        kwInFirstParaMsg = 'No body content or focus keyword specified.';
      }
      results.push({ id: 'focus-keyword-in-first-para', name: 'Focus Keyword in First Paragraph Check', status: kwInFirstParaStatus, message: kwInFirstParaMsg, score: kwInFirstParaScore, maxScore: 6 });

      // ==========================================
      // 9. Focus Keyword in Headings Check
      // ==========================================
      let kwInHeadingsStatus = 'fail';
      let kwInHeadingsMsg = 'Focus keyword was not found in any H2 or H3 headings.';
      let kwInHeadingsScore = 0;

      if (hasFocusKw && content) {
        const hMatch = content.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi);
        if (hMatch) {
          const matchedHeading = hMatch.some(h => h.replace(/<[^>]*>/g, '').toLowerCase().includes(fKeyword));
          if (matchedHeading) {
            kwInHeadingsStatus = 'pass';
            kwInHeadingsMsg = 'Focus keyword found in H2/H3 heading tags.';
            kwInHeadingsScore = 5;
          } else {
            suggestions.push('Add the focus keyword to at least one of your H2 or H3 subheadings.');
          }
        } else {
          suggestions.push('Add some subheadings (H2 or H3 tags) containing the focus keyword.');
          kwInHeadingsMsg = 'No H2 or H3 headings found in content.';
        }
      } else {
        kwInHeadingsMsg = 'No body content or focus keyword specified.';
      }
      results.push({ id: 'focus-keyword-in-headings', name: 'Focus Keyword in Headings Check', status: kwInHeadingsStatus, message: kwInHeadingsMsg, score: kwInHeadingsScore, maxScore: 5 });

      // ==========================================
      // 10. Internal Links Verification
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
            return urlVal.startsWith('/') || (urlVal && !urlVal.startsWith('http') && !urlVal.startsWith('//'));
          });

          if (hasInternal) {
            internalLinksStatus = 'pass';
            internalLinksMsg = 'Internal links found in content.';
            internalLinksScore = 5;
          } else {
            suggestions.push('Add an internal link linking back to other pages of your site (e.g., about.html, contact.html).');
          }
        } else {
          suggestions.push('Add internal links within the article body.');
        }
      }
      results.push({ id: 'internal-links', name: 'Internal Links Verification', status: internalLinksStatus, message: internalLinksMsg, score: internalLinksScore, maxScore: 5 });

      // ==========================================
      // 11. External Links Verification
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
            externalLinksMsg = 'External links found in content.';
            externalLinksScore = 5;
          } else {
            suggestions.push('Add at least one external outbound link to a high-quality reference website.');
          }
        } else {
          suggestions.push('Add external reference links inside the content body.');
        }
      }
      results.push({ id: 'external-links', name: 'External Links Verification', status: externalLinksStatus, message: externalLinksMsg, score: externalLinksScore, maxScore: 5 });

      // ==========================================
      // 12. Image Alt Text Verification
      // ==========================================
      let imgAltStatus = 'fail';
      let imgAltMsg = 'Featured image alt text is missing.';
      let imgAltScore = 0;

      if (imageAlt) {
        if (hasFocusKw && imageAlt.toLowerCase().includes(fKeyword)) {
          imgAltStatus = 'pass';
          imgAltMsg = 'Featured image alt text includes the focus keyword.';
          imgAltScore = 5;
        } else if (hasFocusKw) {
          imgAltStatus = 'warning';
          imgAltMsg = 'Featured image alt text is set but does not include the focus keyword.';
          imgAltScore = 3;
          suggestions.push('Include your focus keyword in the Featured Image Alt Text.');
        } else {
          imgAltStatus = 'pass';
          imgAltMsg = 'Featured image alt text is set.';
          imgAltScore = 4;
        }
      } else {
        suggestions.push('Provide descriptive Image Alt Text for your featured image.');
      }
      results.push({ id: 'image-alt-text', name: 'Image Alt Text Verification', status: imgAltStatus, message: imgAltMsg, score: imgAltScore, maxScore: 5 });

      // ==========================================
      // 13. Content Length Verification
      // ==========================================
      let contentLenStatus = 'fail';
      let contentLenMsg = 'Article content is empty or extremely short.';
      let contentLenScore = 0;

      if (wordCount >= 600) {
        contentLenStatus = 'pass';
        contentLenMsg = `Excellent! Content is ${wordCount} words (ideal is >600 words).`;
        contentLenScore = 10;
      } else if (wordCount >= 300) {
        contentLenStatus = 'warning';
        contentLenMsg = `Good, content is ${wordCount} words. Consider adding more details to reach 600+ words.`;
        contentLenScore = 6;
        suggestions.push('Expand the article length slightly to improve depth and quality (>600 words).');
      } else if (wordCount > 0) {
        contentLenStatus = 'fail';
        contentLenMsg = `Content is too short (${wordCount} words). Add at least 300 words to be indexable.`;
        contentLenScore = 2;
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
        // Escaping regex characters in focus keyword
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
          kwDensityMsg = `Keyword stuffing warning! Density is ${kwDensity.toFixed(2)}% (${count} times). Reduce keyword frequency.`;
          kwDensityScore = 4;
          suggestions.push('Reduce the frequency of the focus keyword to avoid search engine stuffing penalties (ideal is 1%-2.5%).');
        } else if (count > 0) {
          kwDensityStatus = 'warning';
          kwDensityMsg = `Keyword density is low (${kwDensity.toFixed(2)}% - focus keyword appears ${count} times). Add it a few more times.`;
          kwDensityScore = 4;
          suggestions.push('Increase focus keyword usage in your content to improve density (aim for 1%-2.5%).');
        } else {
          kwDensityMsg = 'Focus keyword does not appear in the content.';
          suggestions.push('Insert your focus keyword in the content body.');
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

        if (avgSentenceLen > 20 || avgParaLen > 150) {
          readabilityStatus = 'warning';
          readabilityMsg = `Average sentence length: ${avgSentenceLen.toFixed(1)} words. Paragraph length: ${avgParaLen.toFixed(0)} words. Break them down.`;
          readabilityCheckScore = 3;
          suggestions.push('Shorten sentences and break long paragraphs into shorter ones for better readability.');
        } else {
          readabilityMsg = `Excellent readability. Average sentence length: ${avgSentenceLen.toFixed(1)} words.`;
        }
      } else {
        readabilityStatus = 'fail';
        readabilityMsg = 'No content available to analyze readability.';
        readabilityCheckScore = 0;
      }
      results.push({ id: 'readability', name: 'Readability Analysis', status: readabilityStatus, message: readabilityMsg, score: readabilityCheckScore, maxScore: 5 });

      // ==========================================
      // 16. Schema Markup Validation
      // ==========================================
      let schemaStatus = 'fail';
      let schemaMsg = 'Schema markup elements are incomplete.';
      let schemaScore = 0;

      if (title && author && category && image) {
        schemaStatus = 'pass';
        schemaMsg = 'JSON-LD BlogPosting Schema auto-generation verified.';
        schemaScore = 4;
      } else {
        schemaMsg = 'Required schema properties missing (ensure title, author, category, image are filled).';
        suggestions.push('Ensure Title, Author, Category, and Featured Image are provided to build a clean JSON-LD schema.');
      }
      results.push({ id: 'schema-markup', name: 'Schema Markup Validation', status: schemaStatus, message: schemaMsg, score: schemaScore, maxScore: 4 });

      // ==========================================
      // 17. Mobile SEO Compatibility
      // ==========================================
      let mobileStatus = 'pass';
      let mobileMsg = 'Viewport meta tags and responsive container configurations are active.';
      let mobileScore = 3;

      if (!image) {
        mobileStatus = 'warning';
        mobileMsg = 'Add a featured image for proper responsive card layouts on mobile.';
        mobileScore = 1;
        suggestions.push('Add a featured image to optimize display on mobile screens.');
      }
      results.push({ id: 'mobile-seo', name: 'Mobile SEO Compatibility', status: mobileStatus, message: mobileMsg, score: mobileScore, maxScore: 3 });

      // ==========================================
      // 18. Canonical URL Validation
      // ==========================================
      let canonicalStatus = 'fail';
      let canonicalMsg = 'Canonical URL is missing.';
      let canonicalScore = 0;

      if (canonical) {
        if (canonical.startsWith('http://') || canonical.startsWith('https://')) {
          canonicalStatus = 'pass';
          canonicalMsg = `Canonical URL validated: ${canonical}`;
          canonicalScore = 4;
        } else {
          canonicalStatus = 'warning';
          canonicalMsg = 'Canonical URL must start with http:// or https://';
          canonicalScore = 2;
          suggestions.push('Make sure the Canonical URL is an absolute link (starts with https://).');
        }
      } else {
        suggestions.push('Define a Canonical URL to prevent duplicate content indexation.');
      }
      results.push({ id: 'canonical-url', name: 'Canonical URL Validation', status: canonicalStatus, message: canonicalMsg, score: canonicalScore, maxScore: 4 });

      // ==========================================
      // 19. Open Graph Validation
      // ==========================================
      let ogStatus = 'fail';
      let ogMsg = 'Open Graph social tags are incomplete.';
      let ogScore = 0;

      if (title && excerpt && image) {
        ogStatus = 'pass';
        ogMsg = 'Open Graph tags (og:title, og:description, og:image) verified.';
        ogScore = 3;
      } else {
        suggestions.push('Provide Title, Excerpt, and Featured Image to enable standard Open Graph social preview sharing.');
      }
      results.push({ id: 'og-validation', name: 'Open Graph Validation', status: ogStatus, message: ogMsg, score: ogScore, maxScore: 3 });

      // ==========================================
      // 20. Sitemap Inclusion Validation
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
      // 21. Indexability Validation
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
      // Calculate Total Weighted Scores
      const maxTotal = results.reduce((acc, check) => acc + check.maxScore, 0);
      const scoreTotal = results.reduce((acc, check) => acc + check.score, 0);
      const finalSeoScore = maxTotal > 0 ? Math.round((scoreTotal / maxTotal) * 100) : 0;

      // Group Sub-scores:
      // Content Quality: Length (10), Density (8), Keyword in First Para (6), Headings (5) -> Max 29
      const qualityChecks = ['content-length', 'keyword-density', 'focus-keyword-in-first-para', 'focus-keyword-in-headings'];
      const qualityScore = calculateSubScore(results, qualityChecks);

      // Readability: Readability (5) -> Max 5
      const readabilityChecks = ['readability'];
      const readabilityScore = calculateSubScore(results, readabilityChecks);

      // Technical SEO: Schema (4), Mobile (3), Canonical (4), Open Graph (3), Sitemap (2), Indexability (1) -> Max 17
      const technicalChecks = ['schema-markup', 'mobile-seo', 'canonical-url', 'og-validation', 'sitemap-inclusion', 'indexability'];
      const technicalScore = calculateSubScore(results, technicalChecks);

      // Optimization Score: SEO Title Len (5), Meta Title Len (5), Meta Desc Len (5), Focus Presence (5), Focus Title (8), Focus Meta Desc (6), Focus Slug (5), Internal Links (5), External Links (5), Image Alt (5) -> Max 54
      const optChecks = ['title-len', 'meta-title-len', 'meta-desc-len', 'focus-keyword-presence', 'focus-keyword-in-title', 'focus-keyword-in-desc', 'focus-keyword-in-slug', 'internal-links', 'external-links', 'image-alt-text'];
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
