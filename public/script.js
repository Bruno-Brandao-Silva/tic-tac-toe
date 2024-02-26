const newGameButton = document.getElementById('new-game-button');
const joinGameButton = document.getElementById('join-game-button');
const joinGameModal = document.getElementById('join-game-modal');
const joinGameInput = document.getElementById('join-game-input');
const joinGameSubmit = document.getElementById('join-game-submit');
const joinGameClose = document.getElementById('join-game-close');

newGameButton.addEventListener('click', () => {
    window.location.href = '/new-room';
});

joinGameButton.addEventListener('click', () => {
    joinGameModal.style.display = 'block';
});

joinGameSubmit.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = `/room/${joinGameInput.value}`;
});

joinGameClose.addEventListener('click', () => {
    joinGameModal.style.display = 'none';
});