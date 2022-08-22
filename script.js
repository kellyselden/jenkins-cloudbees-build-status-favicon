// ==UserScript==
// @name        Jenkins Build Status Favicon
// @namespace   https://github.com/kellyselden
// @description Monitor builds using tab icons
// @version     1
// @author      Kelly Selden
// @license     MIT
// @match       http*://*jenkins*/*
// ==/UserScript==

(() => {
    const icons = {
      running: '🔵',
      success: '🟢',
      failure: '🔴',
      aborted: '⚪️',
      queued: '⚪️',
    };
  
    const classicToBlueOcean = {
      'In progress': 'running',
      'Success': 'success',
      'Failed': 'failure',
      'Aborted': 'aborted',
    };
  
    function updateFavicon() {
      let statusText;
  
      let status = document.querySelector('.ResultPageHeader-indicator title');
  
      if (status) {
        statusText = status.textContent;
      } else {
        let statuses = document.body.querySelectorAll('.build-status-icon__outer > .svg-icon');
  
        for (let _status of statuses) {
          let tooltip = _status.getAttribute('tooltip');
  
          if (tooltip) {
            statusText = tooltip.match(/(.*?)(?: &gt;|$)/)[1];
  
            statusText = classicToBlueOcean[statusText];
  
            break;
          }
        }
      }
  
      let favicon = document.head.querySelector('link[rel="shortcut icon"]');
  
      if (!statusText) {
        if (favicon) {
          favicon.href = '/favicon.ico';
        }
  
        return;
      }
  
      // Sometimes the favicon gets stuck on the Jenkins logo,
      // even though the element is set to the status.
      // Doing this seems to jump start it into working.
      if (favicon) {
        document.head.removeChild(favicon);
  
        favicon = null;
      }
  
      if (!favicon) {
        favicon = document.createElement('link');
  
        favicon.rel = 'shortcut icon';
  
        document.head.appendChild(favicon);
      }
  
      let svg = document.createElement('svg');
  
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  
      let icon = document.createElement('text');
  
      icon.setAttribute('font-size', '13');
      icon.setAttribute('y', '13');
  
      icon.textContent = icons[statusText] ?? '❓';
  
      svg.appendChild(icon);
  
      favicon.href = `data:image/svg+xml,${svg.outerHTML}`;
    }
  
    updateFavicon();
  
    new MutationObserver(updateFavicon).observe(document.body, {
      subtree: true,
      childList: true,
      attributeFilter: ['tooltip'],
      characterData: true,
    });
  })();
  