(function() {
	const loader = document.getElementById('loader');
	const items = document.getElementById('items');

	function render(rates) {
		items.innerHTML = '';
		rates.forEach(rate => {
			const el = document.createElement('div');
			el.className = 'item';

			const code = document.createElement('div');
			code.className = 'item__code';
			code.textContent = rate.code;

			const value = document.createElement('div');
			value.className = 'item__value';
			value.textContent = rate.value;

			const cur = document.createElement('div');
			cur.className = 'item__currency';
			cur.textContent = 'руб.';

			el.appendChild(code);
			el.appendChild(value);
			el.appendChild(cur);
			items.appendChild(el);
		});
	}

	function renderError(message) {
		items.innerHTML = '';
		const el = document.createElement('div');
		el.className = 'item item_error';
		el.textContent = message;
		items.appendChild(el);
	}

	function showLoader() {
		loader.classList.add('loader_active');
		if (items) items.style.display = 'none';
	}

	function hideLoader() {
		loader.classList.remove('loader_active');
		if (items) items.style.display = '';
	}

	async function loadRates() {
		showLoader();
		try {
			const resp = await fetch('https://students.netoservices.ru/nestjs-backend/slow-get-courses');
			if (!resp.ok) throw new Error('Network error');
			const json = await resp.json();
			const valutes = json.response && json.response.Valute ? Object.values(json.response.Valute) : [];
			const rates = valutes.map(entry => {
				const code = entry.CharCode || '';
				const nominal = entry.Nominal || 1;
				const value = entry.Value ? (entry.Value / nominal).toFixed(2) : 'N/A';
				return { code, value };
			});
			render(rates);
		} catch (e) {
			console.error('Failed to load rates:', e);
			renderError('Ошибка загрузки данных. Попробуйте позже.');
		} finally {
			hideLoader();
		}
	}

	document.addEventListener('DOMContentLoaded', loadRates);
})();
