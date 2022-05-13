const API_KEY = 'e352047dcf674b34ba42a75e26cbc30c';
const newsList = document.querySelector('.news-list');

const choicesElem = document.querySelector('.js-choice');

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
}

const renderCard = (data) => {
    newsList.textContent = '';
    data.forEach((news) => {
        const card = document.createElement('li');
        card.classList.add('news-item');
        card.innerHTML = `
             <img class="news-image" src="${news.urlToImage}" alt="img" width="270" height="200">
            <h3 class="news-title">
                <a class="news-link" href="${news.url}" target="_blank">
                    ${news.title}
                </a>
            </h3>
            <p class="news-description">${news.decsription}</p>
            <div class="news-footer">
                <time class="news-datetime" datetime="${news.publishedAt}">
                    <span>${news.publishedAt}</span> 11:06
                </time>
                <div class="news-author">${news.author}</div>
            </div>
        `;
        newsList.append(card);
    });
}

const loadNews = async (key) => {
    const data = await getData(`https://newsapi.org/v2/top-headlines?country=ru`);
    renderCard(data.articles);
}

loadNews();