const API_KEY = 'e352047dcf674b34ba42a75e26cbc30c';
const newsList = document.querySelector('.news-list');
const title = document.querySelector('.title');
const formSearch = document.querySelector('.form-search');
const choicesElem = document.querySelector('.js-choice');

const declOfNum = (n, titles) => titles[n % 10 === 1 && n % 100 !== 11 ?
	  0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

const choises = new Choices(choicesElem, {
	searchEnabled: false,
	itemSelectText: '',
});

const getData = async (url) => {
	const response = await fetch(url, {
		headers: {
			'x-api-key': API_KEY,
		},
	});
	const data = await response.json();

	return data;
};

const getDateCorrectFormat = (isoDate) => {
	const date = new Date(isoDate);
	const fullDate = date.toLocaleString('en-GB', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	});

	const fullTime = date.toLocaleString('en-GB', {
		hour: 'numeric',
		minute: 'numeric',
	});

	return `<span>${fullDate}</span> ${fullTime}`;
};

const getImage = (url) =>
	new Promise((resolve) => {
		const image = new Image(270, 200);

		image.addEventListener('load', () => {
			resolve(image);
		});

		image.addEventListener('error', () => {
            image.src = 'img/nophoto.jpg';
			resolve(image);
		});

		image.src = url || 'img/nophoto.jpg';
		image.classList.add('news-image');

		return image;
	});

const renderCard =  (data) => {
	newsList.textContent = '';
	data.forEach(async (news) => {
		const card = document.createElement('li');
		card.classList.add('news-item');

		const image = await getImage(news.urlToImage);
		card.append(image);

		card.insertAdjacentHTML(
			'beforeend',
			`
            <h3 class="news-title">
                <a class="news-link" href="${news.url}" target="_blank">
                    ${news.title || ''}
                </a>
            </h3>
            <p class="news-description">${news.decsription || ''}</p>
            <div class="news-footer">
                <time class="news-datetime" datetime="${news.publishedAt}">
                    ${getDateCorrectFormat(news.publishedAt)}
                </time>
                <div class="news-author">${news.author || ''}</div>
            </div>
        `
		);

		newsList.append(card);
	});
};

const loadNews = async () => {
	newsList.innerHTML = '<li class="proload"></li>';
	const country = localStorage.getItem('country') || 'ru';
	choises.setChoiceByValue(country);
	title.classList.add('hide');
	const data = await getData(
		`https://newsapi.org/v2/top-headlines?country=${country}&category=technology`
	);
	renderCard(data.articles);
};

const loadSearch = async (value) => {
    newsList.innerHTML = '<li class="proload"></li>';
	const data = await getData(
		`https://newsapi.org/v2/everything?q=${value}
	`
	);
	title.classList.remove('hide');
    const arr1 = ['????????????', '??????????????', '??????????????'];
    const arr2 = ['??????????????????', '????????????????????', '??????????????????????'];
    const count = data.articles.length;
	title.textContent = `
        ???? ???????????? ?????????????? ${value} ${declOfNum(count, arr1)}  ${count} ${declOfNum(
		count, arr2
	)}  
    `;
	choises.setChoiceByValue('');
	renderCard(data.articles);
};

choicesElem.addEventListener('change', (e) => {
	const value = e.detail.value;
	localStorage.setItem('country', value);
	loadNews();
});

formSearch.addEventListener('submit', (e) => {
	e.preventDefault();

	loadSearch(formSearch.search.value);
	formSearch.reset();
});

loadNews();
