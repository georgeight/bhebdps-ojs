(function() {
	const slider = document.querySelector('.slider');
	if (!slider) return;

	const items = Array.from(slider.querySelectorAll('.slider__item'));
	const btnPrev = slider.querySelector('.slider__arrow_prev');
	const btnNext = slider.querySelector('.slider__arrow_next');

	let index = items.findIndex(it => it.classList.contains('slider__item_active'));
	if (index === -1) index = 0;

	function show(i) {
		items.forEach((it, idx) => {
			it.classList.toggle('slider__item_active', idx === i);
		});
	}

	function prev() {
		index = (index - 1 + items.length) % items.length;
		show(index);
	}

	function next() {
		index = (index + 1) % items.length;
		show(index);
	}

	btnPrev.addEventListener('click', function() {
		prev();
	});
	btnNext.addEventListener('click', function() {
		next();
	});

	document.addEventListener('keydown', function(e) {
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	});

	const dotsContainer = slider.querySelector('.slider__dots');
	if (dotsContainer) {
		const dots = Array.from(dotsContainer.querySelectorAll('.slider__dot'));
		function updateDots() {
			dots.forEach((d, idx) => d.classList.toggle('slider__dot_active', idx === index));
		}
		dots.forEach((d, idx) => d.addEventListener('click', function() {
			index = idx;
			show(index);
			updateDots();
		}));
		show(index);
		updateDots();
	}
})();
