(function() {
	const tooltip = document.createElement('div');
	tooltip.className = 'tooltip';
	document.body.appendChild(tooltip);

	let activeElem = null;

	function showTooltip(elem) {
		const title = elem.getAttribute('title');
		if (!title) return;
		elem.dataset._title = title;
		elem.removeAttribute('title');

		tooltip.textContent = title;
		tooltip.classList.add('tooltip_active');

		const rect = elem.getBoundingClientRect();
		let left = rect.left;
		let top = rect.top + rect.height + 8;

		tooltip.style.left = left + 'px';
		tooltip.style.top = top + 'px';

		const ttRect = tooltip.getBoundingClientRect();
		const overflowRight = ttRect.right - window.innerWidth;
		if (overflowRight > 0) {
			left = Math.max(8, left - overflowRight - 8);
			tooltip.style.left = left + 'px';
		}

		activeElem = elem;
	}

	function hideTooltip() {
		if (!activeElem) return;
		if (activeElem.dataset._title) {
			activeElem.setAttribute('title', activeElem.dataset._title);
			delete activeElem.dataset._title;
		}
		tooltip.classList.remove('tooltip_active');
		tooltip.style.left = '-9999px';
		tooltip.style.top = '-9999px';
		tooltip.textContent = '';
		activeElem = null;
	}

	document.addEventListener('click', function(e) {
		const target = e.target.closest('.has-tooltip');
		if (target) {
			e.preventDefault();
			if (activeElem === target) {
				hideTooltip();
				return;
			}
			hideTooltip();
			showTooltip(target);
		} else {
			if (!e.target.closest('.tooltip')) hideTooltip();
		}
	});

	window.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') hideTooltip();
	});
	window.addEventListener('resize', hideTooltip);
	window.addEventListener('scroll', hideTooltip, true);
})();
