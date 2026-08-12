document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Nav shadow on scroll
  (function(){
    var nav = document.getElementById('nav');
    var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive:true });
  })();

  // Mobile menu
  (function(){
    var burger = document.getElementById('burger');
    var links = document.querySelector('.nav-links');
    if(!burger) return;
    function close(){
      links.removeAttribute('style'); burger.setAttribute('aria-expanded','false');
    }
    burger.addEventListener('click', function(){
      var open = links.getAttribute('style');
      if(open){ close(); return; }
      burger.setAttribute('aria-expanded','true');
      links.style.cssText = 'display:flex;position:absolute;top:78px;left:0;right:0;flex-direction:column;align-items:flex-start;gap:4px;background:#fff;padding:18px 22px 24px;border-bottom:1px solid var(--line);box-shadow:0 20px 40px rgba(16,42,67,.10);';
    });
    links.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
  })();

  // Service tabs
  (function(){
    var tabs = document.querySelectorAll('.svc-tab');
    var panels = document.querySelectorAll('.svc-panel');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        tabs.forEach(function(t){ t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        panels.forEach(function(p){ p.classList.remove('active'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        var target = document.querySelector('.svc-panel[data-panel="'+tab.dataset.svc+'"]');
        if(target){ target.classList.add('active'); }
      });
    });
  })();

  // Flow tabs
  (function(){
    var tabs = document.querySelectorAll('.flow-tab');
    var panels = document.querySelectorAll('.flow-panel');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        tabs.forEach(function(t){ t.classList.remove('active'); });
        panels.forEach(function(p){ p.classList.remove('active'); });
        tab.classList.add('active');
        var target = document.querySelector('.flow-panel[data-panel="'+tab.dataset.flow+'"]');
        if(target){ target.classList.add('active'); }
      });
    });
  })();

  // Site header tabs
  (function(){
    var tabs = document.querySelectorAll('.site-tab');
    var links = document.querySelectorAll('.outside-tabs a');
    var sections = [
      { id:'ai-home', tab:0 },
      { id:'demo', tab:1 },
      { id:'cases', tab:2 },
      { id:'packages', tab:3 },
      { id:'about', tab:4 },
      { id:'faq', tab:5 }
    ];

    function clearActive(){
      tabs.forEach(function(t){ t.classList.remove('active'); });
      links.forEach(function(l){ l.classList.remove('active'); });
    }

    tabs.forEach(function(tab){
      tab.addEventListener('click', function(e){
        e.preventDefault();
        var href = tab.getAttribute('href');
        var target = document.querySelector(href);
        if(target){
          target.scrollIntoView({ behavior:'smooth', block:'start' });
          clearActive();
          tab.classList.add('active');
        }
      });
    });

    links.forEach(function(link){
      link.addEventListener('click', function(e){
        e.preventDefault();
        var href = link.getAttribute('href');
        var target = document.querySelector(href);
        if(target){
          target.scrollIntoView({ behavior:'smooth', block:'start' });
          clearActive();
          link.classList.add('active');
          updateActiveIndicator();
        }
      });
    });

    function updateActiveIndicator(){
      var switcher = document.querySelector('.tab-switcher');
      if(!switcher) return;
      var active = switcher.querySelector('.site-tab.active');
      var marker = switcher.querySelector('.tab-indicator');
      if(!marker){
        marker = document.createElement('span');
        marker.className = 'tab-indicator';
        switcher.appendChild(marker);
      }
      if(!active){
        marker.style.width = '0';
        marker.style.left = '0';
        marker.style.opacity = '0';
        return;
      }
      var rect = active.getBoundingClientRect();
      var parentRect = switcher.getBoundingClientRect();
      marker.style.width = rect.width + 'px';
      marker.style.left = (rect.left - parentRect.left) + 'px';
      marker.style.opacity = '1';
    }

    tabs.forEach(function(tab){
      tab.addEventListener('click', function(e){
        e.preventDefault();
        var href = tab.getAttribute('href');
        var target = document.querySelector(href);
        if(target){
          target.scrollIntoView({ behavior:'smooth', block:'start' });
          clearActive();
          tab.classList.add('active');
          updateActiveIndicator();
        }
      });
    });

    if('IntersectionObserver' in window){
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(!entry.isIntersecting) return;
          var section = sections.find(function(s){ return s.id === entry.target.id; });
          if(!section) return;
          clearActive();
          if(section.tab === 0){
            tabs[0] && tabs[0].classList.add('active');
          } else {
            var link = links[section.tab - 1];
            if(link){ link.classList.add('active'); }
          }
          updateActiveIndicator();
        });
      }, { rootMargin:'-30% 0px -60% 0px', threshold:0.15 });
      sections.forEach(function(section){
        var el = document.getElementById(section.id);
        if(el){ observer.observe(el); }
      });
      window.addEventListener('resize', updateActiveIndicator);
      window.addEventListener('load', updateActiveIndicator);
    }
  })();

  // AI Attendance demo reel
  (function(){
    var reels = document.querySelectorAll('.reel-player');
    if(!reels.length) return;
    var meta = [
      { t:'Easy check-in', time:'0:05' },
      { t:'AI verification', time:'0:15' },
      { t:'Manager dashboard', time:'0:25' },
      { t:'AI assistant', time:'0:42' }
    ];
    var dur = [5200, 5200, 6400, 5600];
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var playIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z"/></svg>';
    var pauseIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';

    function initReel(reel){
      var scenes = reel.querySelectorAll('.reel-scene');
      var dots = reel.querySelectorAll('.reel-dot');
      var nowEl = reel.querySelector('.reel-now');
      var playBtn = reel.querySelector('.reel-play');
      if(!scenes.length || !dots.length || !nowEl || !playBtn) return;

      var i = 0, timer = null, paused = false, seen = false;

      function show(n){
        i = n;
        scenes.forEach(function(s, idx){ s.classList.toggle('active', idx === n); });
        dots.forEach(function(d, idx){ d.classList.toggle('active', idx === n); });
        nowEl.innerHTML = '<b>' + meta[n].t + '</b><span class="tm">' + meta[n].time + '</span>';
      }
      function replay(){
        var s = scenes[i];
        s.classList.remove('active'); void s.offsetWidth; s.classList.add('active');
      }
      function schedule(){
        clearTimeout(timer);
        if(paused || reduce) return;
        timer = setTimeout(function(){ show((i + 1) % scenes.length); schedule(); }, dur[i]);
      }
      function setPaused(p){
        paused = p;
        playBtn.innerHTML = p ? playIcon : pauseIcon;
        playBtn.setAttribute('aria-pressed', (!p).toString());
        playBtn.setAttribute('aria-label', p ? 'Play demo' : 'Pause demo');
        if(p){ clearTimeout(timer); } else { schedule(); }
      }

      dots.forEach(function(d){
        d.addEventListener('click', function(){ show(parseInt(d.dataset.i, 10)); schedule(); });
      });
      playBtn.addEventListener('click', function(){ setPaused(!paused); });

      show(0);
      if(reduce){
        setPaused(true);
      } else if('IntersectionObserver' in window){
        var frame = reel.querySelector('.reel-frame');
        if(frame){
          var io = new IntersectionObserver(function(entries){
            entries.forEach(function(e){
              if(e.isIntersecting){
                if(!seen){ seen = true; replay(); }
                if(!paused){ schedule(); }
              } else {
                clearTimeout(timer);
              }
            });
          }, { threshold:0.3 });
          io.observe(frame);
        } else {
          schedule();
        }
      } else {
        schedule();
      }
    }

    reels.forEach(initReel);
  })();

  // Reveal on scroll
  (function(){
    var els = document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)){
      els.forEach(function(el){ el.classList.add('in'); }); return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });
    els.forEach(function(el){ io.observe(el); });
  })();

  // Count-up stats
  (function(){
    var counted = false;
    var stats = document.querySelector('.stats');
    if(!stats) return;
    function run(){
      if(counted) return; counted = true;
      document.querySelectorAll('.stat b[data-count]').forEach(function(el){
        var target = parseInt(el.getAttribute('data-count'),10);
        var suffix = el.getAttribute('data-suffix') || '';
        var start = null, dur = 1100;
        function step(ts){
          if(!start) start = ts;
          var p = Math.min((ts-start)/dur, 1);
          var eased = 1 - Math.pow(1-p, 3);
          el.textContent = Math.round(eased*target) + suffix;
          if(p < 1){ requestAnimationFrame(step); } else { el.textContent = target + suffix; }
        }
        requestAnimationFrame(step);
      });
    }
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ run(); io.disconnect(); } });
      }, { threshold:0.4 });
      io.observe(stats);
    } else { run(); }
  })();

  // Prefill service when a "Request a proposal" button is used
  (function(){
    document.querySelectorAll('[data-service]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var svc = btn.getAttribute('data-service');
        // decode basic entity
        var t = document.createElement('textarea'); t.innerHTML = svc; svc = t.value;
        var sel = document.getElementById('fService');
        if(sel){
          for(var i=0;i<sel.options.length;i++){
            if(sel.options[i].text === svc){ sel.selectedIndex = i; break; }
          }
        }
      });
    });
  })();

  // Contact form
  (function(){
    var form = document.getElementById('enquiryForm');
    var success = document.getElementById('formSuccess');
    var reset = document.getElementById('successReset');
    if(!form) return;

    function setErr(id, show){
      var f = document.getElementById(id).closest('.field');
      f.classList.toggle('error', show);
    }
    ['fName','fCompany','fEmail'].forEach(function(id){
      document.getElementById(id).addEventListener('input', function(){ setErr(id, false); });
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = document.getElementById('fName').value.trim();
      var company = document.getElementById('fCompany').value.trim();
      var email = document.getElementById('fEmail').value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var valid = true;
      setErr('fName', !name); if(!name) valid = false;
      setErr('fCompany', !company); if(!company) valid = false;
      setErr('fEmail', !emailOk); if(!emailOk) valid = false;
      if(!valid) return;

      var g = function(id){ return document.getElementById(id).value.trim(); };
      var designation = g('fDesignation');
      var phone = g('fPhone');
      var industry = document.getElementById('fIndustry').value;
      var size = document.getElementById('fSize').value;
      var service = document.getElementById('fService').value;
      var message = g('fMessage');

      var btn = document.getElementById('formSubmit');
      var btnHTML = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Sending…';

      // Build a mailto: as a last-resort fallback if the server is unreachable.
      var mailtoFallback = function(){
        var subject = 'Consultation Request — ' + company + (service ? ' (' + service + ')' : '');
        var lines = [
          'Name: ' + name,
          'Company: ' + company,
          designation ? 'Designation: ' + designation : null,
          'Email: ' + email,
          phone ? 'Phone: ' + phone : null,
          industry ? 'Industry: ' + industry : null,
          size ? 'Company size: ' + size : null,
          service ? 'Service interested: ' + service : null,
          message ? '\nMessage:\n' + message : null
        ].filter(Boolean).join('\n');
        window.location.href = 'mailto:minsithuhtut2001@gmail.com?subject=' +
          encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines);
      };

      var showSuccess = function(){
        form.classList.add('hide');
        success.classList.add('show');
        btn.disabled = false;
        btn.innerHTML = btnHTML;
      };

      var showFormError = function(msg){
        btn.disabled = false;
        btn.innerHTML = btnHTML;
        var note = form.querySelector('.form-note');
        if(note){ note.textContent = msg || 'Something went wrong. Please try again or email us directly.'; note.classList.add('is-error'); }
      };

      // Submit to Netlify Forms. It accepts a url-encoded POST to the site root
      // and identifies the form via the hidden "form-name" field.
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function(res){
        if(res.ok){
          showSuccess();
        } else {
          // Netlify returns HTML, not JSON, so we only inspect the status.
          showFormError('Sorry, something went wrong sending your request. Please try again or email us directly.');
        }
      }).catch(function(){
        // Network unreachable — fall back to the user's email client so the
        // lead is not lost, then confirm.
        mailtoFallback();
        showSuccess();
      });
    });

    reset.addEventListener('click', function(){
      form.reset();
      form.classList.remove('hide');
      success.classList.remove('show');
    });
  })();

/* Replace the legacy demonstration reel with the approved content structure. */
  (function () {
    var demo = document.getElementById('demo');
    if (demo) demo.remove();

    var nav = document.querySelector('.nav-links');
    if (nav) {
      nav.innerHTML = [
        '<a class="nav-primary-tab" href="#ai-home">Agentic AI &amp; Workflows</a>',
        '<a href="#cases">Case Studies</a>',
        '<a href="#services">Practices</a>',
        '<a href="#packages">Packages</a>',
        '<a href="#about">About</a>',
        '<a href="#faq">FAQ</a>'
      ].join('');
    }

    document.querySelectorAll('a[href="#demo"]').forEach(function (link) {
      link.href = '#contact';
      if (/working example|live demo/i.test(link.textContent)) link.textContent = 'Talk to an AI specialist →';
    });

    var note = document.querySelector('.ac-note');
    if (note) note.textContent = 'Turn priority workflows into practical AI agents, with your team in control.';

    var cases = document.getElementById('cases');
    var solutions = document.getElementById('services');
    if (cases && solutions) cases.after(solutions);

    if (!document.getElementById('faq')) {
      var faq = document.createElement('section');
      faq.className = 'faq'; faq.id = 'faq';
      faq.innerHTML = '<div class="wrap"><div class="section-head center reveal in"><span class="eyebrow center">FAQ</span><h2>Questions before you begin.</h2><p>Clear answers for teams exploring Agentic AI and workflow improvement.</p></div><div class="faq-grid"><article class="faq-item"><h3>Where do we start?</h3><p>We begin with the workflow that causes the most friction, delay or repetitive work.</p></article><article class="faq-item"><h3>Will people stay in control?</h3><p>Yes. We design clear review points, approvals and escalation paths around every workflow.</p></article><article class="faq-item"><h3>Do we need to replace our systems?</h3><p>Usually not. We connect the tools and information your team already uses where practical.</p></article><article class="faq-item"><h3>How quickly can we see value?</h3><p>A focused pilot can be scoped and delivered in weeks, then expanded based on results.</p></article></div></div>';
      var contact = document.getElementById('contact');
      if (contact) contact.before(faq);
    }
  }());

  /* Menu bar: reading-progress bar, mobile hamburger, active-section highlight.
     Runs after the nav is rebuilt above so it sees the final links. */
  (function(){
    var nav = document.getElementById('nav');
    if(!nav) return;
    var links = nav.querySelector('.nav-links');

    // 1) Reading-progress bar
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    nav.appendChild(bar);
    var updateBar = function(){
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = pct + '%';
    };
    updateBar();
    window.addEventListener('scroll', updateBar, { passive:true });
    window.addEventListener('resize', updateBar, { passive:true });

    // 2) Mobile hamburger menu
    if(links){
      var burger = document.createElement('button');
      burger.className = 'nav-burger-btn';
      burger.setAttribute('aria-label', 'Open menu');
      burger.setAttribute('aria-expanded', 'false');
      burger.innerHTML = '<span></span><span></span><span></span>';
      var bookBtn = nav.querySelector('.book-btn');
      if(bookBtn && bookBtn.parentNode){ bookBtn.parentNode.insertBefore(burger, bookBtn.nextSibling); }
      else { var wrap = nav.querySelector('.nav-wrap'); if(wrap){ wrap.appendChild(burger); } }

      var setOpen = function(open){
        links.classList.toggle('open', open);
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      };
      burger.addEventListener('click', function(e){
        e.stopPropagation();
        setOpen(!links.classList.contains('open'));
      });
      links.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){ setOpen(false); });
      });
      document.addEventListener('click', function(e){
        if(links.classList.contains('open') && !nav.contains(e.target)){ setOpen(false); }
      });
      document.addEventListener('keydown', function(e){
        if(e.key === 'Escape'){ setOpen(false); }
      });
    }

    // 3) Highlight the current section in the menu while scrolling
    if(links && 'IntersectionObserver' in window){
      var map = {};
      links.querySelectorAll('a[href^="#"]').forEach(function(a){
        var id = a.getAttribute('href').slice(1);
        var el = id && document.getElementById(id);
        if(el){ map[id] = a; }
      });
      var ids = Object.keys(map);
      if(ids.length){
        var spy = new IntersectionObserver(function(entries){
          entries.forEach(function(en){
            if(!en.isIntersecting) return;
            links.querySelectorAll('a').forEach(function(a){ a.classList.remove('active'); });
            if(map[en.target.id]){ map[en.target.id].classList.add('active'); }
          });
        }, { rootMargin:'-45% 0px -50% 0px', threshold:0 });
        ids.forEach(function(id){ spy.observe(document.getElementById(id)); });
      }
    }
  }());