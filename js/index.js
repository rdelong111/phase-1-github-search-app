document.addEventListener('DOMContentLoaded', () => {
	const userlist = document.getElementById('user-list');
	const searchbar = document.getElementById('search');
	const repolist = document.getElementById('repos-list');

	const togglebtn = document.createElement('button');
	togglebtn.textContent = 'Switch to RepoSearch';
	document.querySelector('form').after(togglebtn);

	document.querySelector('form').addEventListener('submit', (e) => {
		e.preventDefault();

		if (togglebtn.textContent === 'Switch to RepoSearch') {
			search();
		}
		else {
			userlist.innerHTML = '';
			reposearch();
		}

		document.querySelector('form').reset();
	});

	togglebtn.addEventListener('click', () => {
		userlist.innerHTML = '';

		if (togglebtn.textContent === 'Switch to RepoSearch') {
			repolist.innerHTML = '';
			togglebtn.textContent = 'Switch to UserSearch';
			searchbar.placeholder = 'Repo Search';
		}
		else {
			togglebtn.textContent = 'Switch to RepoSearch';
			searchbar.placeholder = 'User Search';
		}
	});
});

function search() {
	const user = document.getElementById('search').value;

	fetch(`https://api.github.com/search/users?q=${user}`)
	.then((r) => r.json())
	.then((object) => {
		for (result of object.items) {
			addUser(result);
		}
	});
}

function reposearch() {
	const repo = document.getElementById('search').value;

	fetch(`https://api.github.com/search/repositories?q=${repo}`)
	.then((r) => r.json())
	.then((object) => {
		for (result of object.items) {
			RSadd(result);
		}
	});
}

function userrepo(name) {
	fetch(`https://api.github.com/users/${name}/repos`)
	.then((r) => r.json())
	.then((object) => {
		document.getElementById('repos-list').innerHTML = `<b>${name}'s repo list</b><br>`;
		for (result of object) {
			addRepo(result);
		}
	});
}

function addUser(info) {
	const ulist = document.getElementById('user-list');
	const userimg = document.createElement('img');
	const username = document.createElement('li');
	const profile = document.createElement('a');
	const deletebtn = document.createElement('button');

	userimg.setAttribute('src', info.avatar_url);
	username.setAttribute('id', info.login);
	username.innerHTML = `<span class='repopoint'>${info.login}</span>`;
	profile.setAttribute('href', info.html_url);
	profile.textContent = 'Profile Link';
	deletebtn.setAttribute('id', info.id);
	deletebtn.textContent = 'X';

	username.appendChild(userimg);
	username.appendChild(profile);
	username.appendChild(deletebtn);
	ulist.appendChild(username);

	document.getElementById(`${info.id}`).addEventListener('click', () => {
		username.remove();
	});

	document.querySelector(`#${info.login} span.repopoint`).addEventListener('click', () => {
		userrepo(info.login);
	});
}

function addRepo(info) {
	const repoList = document.getElementById('repos-list');
	const repoName = document.createElement('a');

	repoName.setAttribute('href', info.html_url);
	repoName.innerHTML = `${info.name}<br>`;

	repoList.appendChild(repoName);
}

function RSadd(info) {
	const repolist = document.getElementById('user-list');
	const repoName = document.createElement('a');

	repoName.setAttribute('href', info.html_url);
	repoName.innerHTML = `${info.full_name}<br>`;

	repolist.appendChild(repoName);
}