// Инициализация TON Connect
const connector = new TonConnect.TonConnect({
    manifestUrl: 'https://testpugnasaitprobaski.com/tonconnect-manifest.json'
});

// Элементы DOM
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');
const walletInfo = document.getElementById('wallet-info');
const walletAddress = document.getElementById('wallet-address');
const connectionStatus = document.getElementById('connection-status');

// Проверка подключения при загрузке страницы
async function checkConnection() {
    const walletConnectionSource = {
        jsBridgeKey: 'tonconnect'
    };

    if (connector.connected) {
        updateUI(connector.account);
    } else {
        // Проверяем, есть ли предыдущее подключение
        const connected = await connector.restoreConnection();
        if (connected) {
            updateUI(connector.account);
        }
    }
}

// Обновление интерфейса
function updateUI(account) {
    if (account) {
        walletAddress.textContent = account.address;
        walletInfo.classList.remove('hidden');
        connectBtn.classList.add('hidden');
        connectionStatus.textContent = 'Кошелек успешно подключен!';
        connectionStatus.style.color = 'green';
    } else {
        walletInfo.classList.add('hidden');
        connectBtn.classList.remove('hidden');
    }
}

// Подключение кошелька
connectBtn.addEventListener('click', async () => {
    try {
        connectionStatus.textContent = 'Открывается диалог подключения...';
        connectionStatus.style.color = 'blue';

        const wallets = await connector.getWallets();
        const wallet = wallets[0]; // Можно добавить выбор кошелька

        await connector.connect({ jsBridgeKey: wallet.jsBridgeKey });
        
        updateUI(connector.account);
    } catch (error) {
        console.error('Connection error:', error);
        connectionStatus.textContent = 'Ошибка подключения: ' + error.message;
        connectionStatus.style.color = 'red';
    }
});

// Отключение кошелька
disconnectBtn.addEventListener('click', async () => {
    try {
        await connector.disconnect();
        updateUI(null);
        connectionStatus.textContent = 'Кошелек отключен';
        connectionStatus.style.color = 'gray';
    } catch (error) {
        console.error('Disconnection error:', error);
        connectionStatus.textContent = 'Ошибка отключения: ' + error.message;
        connectionStatus.style.color = 'red';
    }
});

// Обработка изменений подключения
connector.onStatusChange((wallet) => {
    updateUI(wallet);
});

// Инициализация
checkConnection();