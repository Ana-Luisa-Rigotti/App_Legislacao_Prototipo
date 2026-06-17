const app = document.querySelector('#app');
const screens = [...document.querySelectorAll('.screen')];
const navButtons = [...document.querySelectorAll('.bottom-nav button')];
const toast = document.querySelector('#toast');
let currentScreen = 'login';
let historyStack = [];
let toastTimer;

const navMap = {
  home: 'home',
  pesquisa: 'pesquisa',
  alertas: 'alertas',
  perfil: 'perfil',
  resenha: 'pesquisa',
  detalhe: 'pesquisa',
  login: ''
};

function showScreen(screenName, saveHistory = true) {
  const next = document.querySelector(`[data-screen="${screenName}"]`);
  if (!next || screenName === currentScreen) return;

  if (saveHistory && currentScreen !== 'login') {
    historyStack.push(currentScreen);
  }

  screens.forEach(screen => {
    screen.classList.toggle('active', screen.dataset.screen === screenName);
  });

  currentScreen = screenName;
  updateNav(screenName);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function updateNav(screenName) {
  const activeNav = navMap[screenName] || screenName;
  navButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.go === activeNav);
  });
}

function goBack() {
  const previous = historyStack.pop();
  showScreen(previous || 'home', false);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
}

function formatCPF(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

app.addEventListener('click', event => {
  const backButton = event.target.closest('[data-back]');
  const goButton = event.target.closest('[data-go]');
  const toastButton = event.target.closest('[data-toast]');

  if (backButton) {
    goBack();
    return;
  }

  if (goButton) {
    event.preventDefault();
    showScreen(goButton.dataset.go);
    return;
  }

  if (toastButton) {
    showToast(toastButton.dataset.toast);
  }
});

document.querySelector('#loginForm').addEventListener('submit', event => {
  event.preventDefault();
  historyStack = [];
  showScreen('home', false);
});

const cpfInput = document.querySelector('#cpfLogin');
cpfInput.addEventListener('input', event => {
  event.target.value = formatCPF(event.target.value);
});

const chips = document.querySelector('#chips');
const keywordInput = document.querySelector('#keywordInput');
const keywordCount = document.querySelector('#keywordCount');
const addKeyword = document.querySelector('#addKeyword');

function refreshKeywordCount() {
  keywordCount.textContent = chips.querySelectorAll('span').length;
}

addKeyword.addEventListener('click', () => {
  const keyword = keywordInput.value.trim();

  if (!keyword) {
    showToast('Digite uma palavra-chave primeiro.');
    return;
  }

  const chip = document.createElement('span');
  chip.innerHTML = `${keyword} <button type="button" aria-label="Remover ${keyword}">×</button>`;
  chips.appendChild(chip);
  keywordInput.value = '';
  refreshKeywordCount();
  showToast('Palavra-chave adicionada.');
});

chips.addEventListener('click', event => {
  const removeButton = event.target.closest('button');
  if (!removeButton) return;
  removeButton.parentElement.remove();
  refreshKeywordCount();
});

updateNav(currentScreen);
