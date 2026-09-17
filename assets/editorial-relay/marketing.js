(() => {
  const tabs = [...document.querySelectorAll('[data-workflow-step]')];
  const panel = document.querySelector('#workflow-panel');
  if (!tabs.length || !panel) return;

  const stages = {
    review: {
      label: 'SAMPLE · REVIEW',
      title: 'Three topics, one immutable run scope',
      description: 'The operator reviews destination, draft status, enrichment and linker policy before the run begins.',
      facts: [['Source', 'Manual keywords'], ['Selection', '3 reviewed topics'], ['Destination', 'Ghost · Draft'], ['Safety', 'Live acknowledgement not required']],
    },
    generate: {
      label: 'SAMPLE · GENERATE',
      title: 'Each provider call leaves a usage record',
      description: 'Content and metadata stages return their original responses while tokens and event-time rates are recorded separately.',
      facts: [['Current stage', 'Article body'], ['Completed', 'Intent · Answer'], ['Usage basis', 'Metered'], ['Budget', 'Alert only']],
    },
    ghost: {
      label: 'SAMPLE · GHOST',
      title: 'A draft is reported as a draft',
      description: 'The write outcome keeps compatibility state separate from the effective Ghost publishing status.',
      facts: [['Write state', 'Confirmed'], ['Ghost status', 'Draft created'], ['Public URL', 'Not available'], ['Next action', 'Review in Ghost Admin']],
    },
    reconcile: {
      label: 'SAMPLE · RECONCILE',
      title: 'Uncertain writes pause before retry',
      description: 'A read-only lookup checks slug, normalized title and attempt window before another publish becomes eligible.',
      facts: [['Attempt', 'Single-shot'], ['Outcome', 'Recovered'], ['Matches', '1 exact post'], ['Duplicate write', 'Prevented']],
    },
    build: {
      label: 'SAMPLE · BUILD',
      title: 'Only published Ghost posts enter the artifact',
      description: 'The renderer reads a temporary Ghost snapshot, sanitizes post HTML and verifies the generated site before packaging.',
      facts: [['Ghost access', 'Read only'], ['Included', 'Published posts'], ['HTML', 'Sanitized'], ['Artifact', 'Verified']],
    },
    deliver: {
      label: 'SAMPLE · DELIVER',
      title: 'One artifact keeps one identity',
      description: 'GitHub receives the complete artifact first. Cloudflare then serves the canonical copy without rewriting it.',
      facts: [['Mirror', 'GitHub Pages'], ['Canonical', 'Cloudflare Pages'], ['Parity', 'Same artifact'], ['Retry', 'Cloudflare only']],
    },
  };

  function activate(tab, focus = false) {
    const data = stages[tab.dataset.workflowStep];
    if (!data) return;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    panel.innerHTML = `
      <div class="workflow-panel__copy">
        <p class="workflow-panel__label">${data.label}</p>
        <h3>${data.title}</h3>
        <p>${data.description}</p>
      </div>
      <dl class="workflow-panel__facts">${data.facts.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('')}</dl>`;
    if (focus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (event) => {
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(tabs[next], true);
    });
  });

  document.querySelectorAll('.marketing-article img[data-fallback]').forEach((image) => {
    image.addEventListener('error', () => {
      if (image.src !== image.dataset.fallback) image.src = image.dataset.fallback;
    }, { once: true });
  });
})();
