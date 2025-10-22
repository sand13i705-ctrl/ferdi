
        // Application State
        const gameState = {
            score: 0,
            timeLeft: 30,
            gameActive: false,
            gameTimer: null,
            balloonTimer: null,
            balloons: [],
            gameWon: false
        };

        // Progress State - Track completion of each stage
        const progressState = {
            homeCompleted: true,  // Always unlocked
            gameCompleted: false, // Unlocked after game completion
            memoriesViewed: false, // Unlocked after memory book viewed
            messagesViewed: false, // Final stage
            currentStage: 1 // 1=Home, 2=Game, 3=Memories, 4=Messages
        };

        // Birthday Data
        const birthdayData = {
            messages: [
                {
                    message: "Semoga di hari spesialmu ini, semua impianmu terwujud! Terima kasih sudah menjadi teman yang luar biasa.",
                    sender: "Sarah"
                },
                {
                    message: "Happy Birthday! Semoga tahun ini membawa lebih banyak kebahagiaan, kesuksesan, dan momen indah untukmu!",
                    sender: "Budi"
                },
                {
                    message: "Selamat ulang tahun! Terima kasih sudah selalu ada dan menjadi inspirasi bagi banyak orang.",
                    sender: "Dina"
                },
                {
                    message: "Di hari spesialmu, aku ingin mengucapkan: Selamat ulang tahun! Semoga panjang umur dan sehat selalu!",
                    sender: "Riko"
                },
                {
                    message: "Selamat ulang tahun! Semoga semua yang kamu inginkan tercapai. You deserve all the happiness!",
                    sender: "Maya"
                },
                {
                    message: "Happy Birthday! Semoga hari ini menjadi awal dari tahun yang penuh berkah dan kesempatan baru!",
                    sender: "Andi"
                }
            ],
            memories: [
                {
                    title: "Kenangan Pertama Kita",
                    description: "Saat pertama kali kita bertemu, aku tahu kamu adalah orang yang spesial. Terima kasih untuk semua momen indah!",
                    icon: "🎈"
                },
                {
                    title: "Momen Lucu Bersama",
                    description: "Semua tawa dan candaan kita selalu menjadi penghibur di hari-hari sulit. Kamu selalu bisa bikin suasana jadi ceria!",
                    icon: "😂"
                },
                {
                    title: "Petualangan Tak Terlupakan",
                    description: "Dari traveling bareng sampai nongkrong seru, setiap petualangan bersama selalu menjadi cerita yang tak terlupakan.",
                    icon: "🌟"
                },
                {
                    title: "Dukungan di Saat Sulit",
                    description: "Terima kasih sudah selalu ada saat aku membutuhkan. Kamu adalah teman yang sangat berharga!",
                    icon: "💪"
                },
                {
                    title: "Prestasi yang Membanggakan",
                    description: "Melihat kamu mencapai semua impianmu selalu membuatku bangga. Terus maju dan jangan pernah menyerah!",
                    icon: "🏆"
                },
                {
                    title: "Harapan untuk Masa Depan",
                    description: "Semoga kita bisa terus menciptakan kenangan indah bersama. Selamat ulang tahun, sahabatku!",
                    icon: "🎂"
                }
            ],
            balloonColors: ['#ff69b4', '#ff9ed4', '#ffc0e0', '#ffd1e3', '#ffb3d9', '#ff8cc8']
        };

        // In-memory storage for custom messages and progress
        let customMessages = [];
        let savedProgressState = {
            gameCompleted: false,
            memoriesViewed: false,
            messagesAdded: false
        };
        
        // Load saved state from memory
        function loadProgressState() {
            progressState.gameCompleted = savedProgressState.gameCompleted;
            progressState.memoriesViewed = savedProgressState.memoriesViewed;
            progressState.messagesAdded = savedProgressState.messagesAdded;
        }
        
        function saveProgressState() {
            savedProgressState.gameCompleted = progressState.gameCompleted;
            savedProgressState.memoriesViewed = progressState.memoriesViewed;
            savedProgressState.messagesAdded = progressState.messagesAdded;
        }
        
        function loadCustomMessages() {
            return customMessages;
        }
        
        function saveCustomMessages(messages) {
            customMessages = messages;
        }
        
        // Progressive Navigation Functions
        function navigateToPage(pageId) {
            // Check if page is unlocked
            if (!isPageUnlocked(pageId)) {
                alert('🔒 Halaman ini terkunci! Selesaikan tahap sebelumnya terlebih dahulu.');
                return;
            }
            
            showPage(pageId);
        }
        
        function isPageUnlocked(pageId) {
            switch(pageId) {
                case 'home': return true;
                case 'game': return true; // Game is always accessible after home
                case 'memories': return progressState.gameCompleted;
                case 'form': return progressState.memoriesViewed;
                case 'messages': return progressState.messagesAdded;
                default: return false;
            }
        }
        
        function showPage(pageId) {
            console.log(`📄 Navigating to page: ${pageId}`);
            
            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Update navigation
            updateNavigation();
            
            // Update progress indicator
            updateProgressIndicator(pageId);
            
            // Initialize page-specific content
            if (pageId === 'memories') {
                setTimeout(renderMemories, 100);
            } else if (pageId === 'form') {
                setTimeout(initializeForm, 100);
            } else if (pageId === 'messages') {
                setTimeout(() => {
                    renderMessages();
                    setTimeout(createMassiveConfetti, 500);
                }, 100);
            }
        }
        
        function updateNavigation() {
            const navLinks = document.querySelectorAll('.nav-link');
            
            // Reset all nav links
            navLinks.forEach(link => {
                link.classList.remove('active', 'completed', 'locked');
            });
            
            // Update each nav link based on progress
            navLinks[0].classList.add(getCurrentPage() === 'home' ? 'active' : 'completed');
            
            if (progressState.gameCompleted) {
                navLinks[1].classList.add(getCurrentPage() === 'game' ? 'active' : 'completed');
                navLinks[1].innerHTML = '🎮 Step 2 <span class="lock-icon">✅</span>';
            } else {
                navLinks[1].classList.add(getCurrentPage() === 'game' ? 'active' : 'locked');
                navLinks[1].innerHTML = getCurrentPage() === 'game' ? '🎮 Step 2' : '🎮 Step 2 <span class="lock-icon">🔒</span>';
            }
            
            if (progressState.memoriesViewed) {
                navLinks[2].classList.add(getCurrentPage() === 'memories' ? 'active' : 'completed');
                navLinks[2].innerHTML = '📚 Step 3 <span class="lock-icon">✅</span>';
            } else if (progressState.gameCompleted) {
                navLinks[2].classList.add(getCurrentPage() === 'memories' ? 'active' : 'locked');
                navLinks[2].innerHTML = getCurrentPage() === 'memories' ? '📚 Step 3' : '📚 Step 3 <span class="lock-icon">🔒</span>';
            }
            
            if (progressState.messagesAdded) {
                navLinks[3].classList.add(getCurrentPage() === 'form' ? 'active' : 'completed');
                navLinks[3].innerHTML = '✏️ Step 4 <span class="lock-icon">✅</span>';
            } else if (progressState.memoriesViewed) {
                navLinks[3].classList.add(getCurrentPage() === 'form' ? 'active' : 'locked');
                navLinks[3].innerHTML = getCurrentPage() === 'form' ? '✏️ Step 4' : '✏️ Step 4 <span class="lock-icon">🔒</span>';
            }
            
            if (progressState.messagesAdded) {
                if (getCurrentPage() === 'messages') {
                    navLinks[4].classList.add('active');
                    navLinks[4].innerHTML = '💌 Step 5';
                } else {
                    navLinks[4].classList.add('unlocked');
                    navLinks[4].innerHTML = '💌 Step 5 <span class="lock-icon">✅</span>';
                }
            } else {
                navLinks[4].classList.add('locked');
                navLinks[4].innerHTML = '💌 Step 5 <span class="lock-icon">🔒</span>';
            }
        }
        
        function getCurrentPage() {
            const activePage = document.querySelector('.page.active');
            return activePage ? activePage.id : 'home';
        }
        
        function updateProgressIndicator(pageId) {
            const progressText = document.getElementById('progressText');
            const stepMap = {
                'home': 'Step 1 of 5 - Beranda',
                'game': 'Step 2 of 5 - Main Game',
                'memories': 'Step 3 of 5 - Buku Kenangan', 
                'form': 'Step 4 of 5 - Tulis Pesan',
                'messages': 'Step 5 of 5 - Lihat Semua Pesan'
            };
            
            progressText.textContent = stepMap[pageId] || 'Step 1 of 5';
        }
        
        // Journey Control Functions
        function startJourney() {
            console.log('🚀 Start Journey button clicked!');
            showPage('game');
        }
        
        function completeGame() {
            progressState.gameCompleted = true;
            progressState.currentStage = 3;
            showPage('memories');
        }
        
        function completeMemories() {
            progressState.memoriesViewed = true;
            progressState.currentStage = 4;
            saveProgressState();
            showPage('form');
        }
        
        function completeForm() {
            progressState.messagesAdded = true;
            progressState.currentStage = 5;
            saveProgressState();
            showPage('messages');
        }
        
        function goBackToForm() {
            showPage('form');
        }
        
        function restartJourney() {
            // Reset all progress
            progressState.gameCompleted = false;
            progressState.memoriesViewed = false;
            progressState.messagesAdded = false;
            progressState.currentStage = 1;
            gameState.gameWon = false;
            
            // Reset game state
            resetGame();
            
            // Save reset progress
            saveProgressState();
            
            // Go back to home
            showPage('home');
        }
        
        function resetProgress() {
            if (confirm('Apakah kamu yakin ingin menghapus semua progress dan pesan? Tindakan ini tidak dapat dibatalkan.')) {
                // Clear all in-memory data
                customMessages = [];
                savedProgressState = {
                    gameCompleted: false,
                    memoriesViewed: false,
                    messagesAdded: false
                };
                
                // Reset state
                progressState.gameCompleted = false;
                progressState.memoriesViewed = false;
                progressState.messagesAdded = false;
                progressState.currentStage = 1;
                gameState.gameWon = false;
                
                // Reset game
                resetGame();
                
                // Go to home
                showPage('home');
                
                alert('Semua progress dan pesan telah dihapus!');
            }
        }

        // Game Functions
        function startGame() {
            console.log('🎮 Starting balloon pop game!');
            if (gameState.gameActive) return;
            
            gameState.gameActive = true;
            gameState.score = 0;
            gameState.timeLeft = 30;
            gameState.balloons = [];
            
            document.getElementById('startBtn').disabled = true;
            document.getElementById('score').textContent = gameState.score;
            document.getElementById('timer').textContent = gameState.timeLeft;
            
            // Clear game area
            const gameArea = document.getElementById('gameArea');
            gameArea.innerHTML = '';
            
            // Start timer
            gameState.gameTimer = setInterval(updateTimer, 1000);
            
            // Start balloon spawning
            gameState.balloonTimer = setInterval(spawnBalloon, 800);
        }

        function updateTimer() {
            gameState.timeLeft--;
            document.getElementById('timer').textContent = gameState.timeLeft;
            
            if (gameState.timeLeft <= 0) {
                endGame();
            }
        }

        function spawnBalloon() {
            if (!gameState.gameActive) return;
            
            const gameArea = document.getElementById('gameArea');
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            
            // Random position and pink color
            const left = Math.random() * (gameArea.offsetWidth - 50);
            const color = birthdayData.balloonColors[Math.floor(Math.random() * birthdayData.balloonColors.length)];
            
            balloon.style.left = left + 'px';
            balloon.style.bottom = '0px';
            balloon.style.backgroundColor = color;
            
            // Add click handler
            balloon.onclick = () => popBalloon(balloon);
            
            gameArea.appendChild(balloon);
            gameState.balloons.push(balloon);
            
            // Animate balloon rising
            let bottom = 0;
            const riseInterval = setInterval(() => {
                bottom += 2;
                balloon.style.bottom = bottom + 'px';
                
                if (bottom > gameArea.offsetHeight) {
                    clearInterval(riseInterval);
                    if (balloon.parentNode) {
                        balloon.parentNode.removeChild(balloon);
                    }
                    const index = gameState.balloons.indexOf(balloon);
                    if (index > -1) {
                        gameState.balloons.splice(index, 1);
                    }
                }
            }, 50);
        }

        function popBalloon(balloon) {
            if (!gameState.gameActive) return;
            
            gameState.score += 10;
            document.getElementById('score').textContent = gameState.score;
            
            // Add pop animation
            balloon.classList.add('popped');
            
            setTimeout(() => {
                if (balloon.parentNode) {
                    balloon.parentNode.removeChild(balloon);
                }
                const index = gameState.balloons.indexOf(balloon);
                if (index > -1) {
                    gameState.balloons.splice(index, 1);
                }
            }, 300);
            
            // Add some confetti
            createConfetti(balloon.offsetLeft + 25, balloon.offsetTop + 35);
        }

        function endGame() {
            gameState.gameActive = false;
            
            clearInterval(gameState.gameTimer);
            clearInterval(gameState.balloonTimer);
            
            document.getElementById('startBtn').disabled = false;
            
            // Check win condition (10+ balloons)
            const balloonsPopped = gameState.score / 10;
            const gameResult = document.getElementById('gameResult');
            const winMessage = document.getElementById('winMessage');
            const loseMessage = document.getElementById('loseMessage');
            const finalScore = document.getElementById('finalScore');
            
            gameResult.style.display = 'block';
            
            if (balloonsPopped >= 10) {
                // Player won!
                gameState.gameWon = true;
                finalScore.textContent = balloonsPopped;
                winMessage.style.display = 'block';
                loseMessage.style.display = 'none';
                createMassiveConfetti();
            } else {
                // Player lost, need to retry
                winMessage.style.display = 'none';
                loseMessage.style.display = 'block';
            }
        }

        function resetGame() {
            gameState.gameActive = false;
            gameState.score = 0;
            gameState.timeLeft = 30;
            gameState.gameWon = false;
            
            clearInterval(gameState.gameTimer);
            clearInterval(gameState.balloonTimer);
            
            document.getElementById('startBtn').disabled = false;
            document.getElementById('score').textContent = gameState.score;
            document.getElementById('timer').textContent = gameState.timeLeft;
            
            // Hide game result
            document.getElementById('gameResult').style.display = 'none';
            
            // Clear game area
            const gameArea = document.getElementById('gameArea');
            gameArea.innerHTML = '';
            gameState.balloons = [];
        }

        // Confetti Functions
        function createConfetti(x, y) {
            for (let i = 0; i < 10; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = (x + Math.random() * 50 - 25) + 'px';
                confetti.style.top = y + 'px';
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }
        }

        function createMassiveConfetti() {
            for (let i = 0; i < 100; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * window.innerWidth + 'px';
                    confetti.style.top = '-10px';
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => {
                        if (confetti.parentNode) {
                            confetti.parentNode.removeChild(confetti);
                        }
                    }, 3000);
                }, i * 100);
            }
        }

        // Memory Book Functions
        function renderMemories() {
            const memoryGrid = document.getElementById('memoryGrid');
            memoryGrid.innerHTML = '';
            
            birthdayData.memories.forEach((memory, index) => {
                const memoryCard = document.createElement('div');
                memoryCard.className = 'memory-card';
                memoryCard.style.animationDelay = (index * 0.2) + 's';
                
                memoryCard.innerHTML = `
                    <span class="memory-icon">${memory.icon}</span>
                    <h3 class="memory-title">${memory.title}</h3>
                    <p class="memory-description">${memory.description}</p>
                `;
                
                memoryGrid.appendChild(memoryCard);
            });
        }

        // Form Functions
        let messageIdCounter = 1;
        
        function initializeForm() {
            // Set up character counter
            const messageTextarea = document.getElementById('messageText');
            messageTextarea.addEventListener('input', updateCharCounter);
            
            // Render existing messages
            renderAddedMessages();
            updateFinishButton();
            
            // Reset form
            document.getElementById('senderName').value = '';
            document.getElementById('messageText').value = '';
            updateCharCounter();
        }
        
        function updateCharCounter() {
            const messageTextarea = document.getElementById('messageText');
            const charCount = document.getElementById('charCount');
            const counter = messageTextarea.parentElement.querySelector('.char-counter');
            
            const remaining = 200 - messageTextarea.value.length;
            charCount.textContent = remaining;
            
            // Update styling based on remaining characters
            counter.classList.remove('warning', 'danger');
            if (remaining < 50) {
                counter.classList.add('warning');
            }
            if (remaining < 20) {
                counter.classList.add('danger');
            }
        }
        
        function addMessage() {
            const senderName = document.getElementById('senderName').value.trim();
            const messageText = document.getElementById('messageText').value.trim();
            
            // Validation
            if (!senderName || !messageText) {
                showFormFeedback('Semua field harus diisi!', 'error');
                return;
            }
            
            if (messageText.length > 200) {
                showFormFeedback('Pesan terlalu panjang! Maksimal 200 karakter.', 'error');
                return;
            }
            
            // Add new message
            const newMessage = {
                id: Date.now(), // Use timestamp as ID
                sender: senderName,
                message: messageText
            };
            
            customMessages.push(newMessage);
            saveCustomMessages(customMessages);
            
            // Clear form
            document.getElementById('senderName').value = '';
            document.getElementById('messageText').value = '';
            updateCharCounter();
            
            // Show success message
            showFormFeedback('Pesan berhasil ditambahkan! ✨', 'success');
            
            // Re-render messages
            renderAddedMessages();
            updateFinishButton();
        }
        
        function deleteMessage(messageId) {
            if (confirm('Apakah kamu yakin ingin menghapus pesan ini?')) {
                customMessages = customMessages.filter(msg => msg.id !== messageId);
                saveCustomMessages(customMessages);
                renderAddedMessages();
                updateFinishButton();
                showFormFeedback('Pesan berhasil dihapus!', 'success');
            }
        }
        
        function renderAddedMessages() {
            const messagesList = document.getElementById('addedMessagesList');
            
            if (customMessages.length === 0) {
                messagesList.innerHTML = '<p class="no-messages">Belum ada pesan. Yuk tambahkan pesan pertama!</p>';
                return;
            }
            
            messagesList.innerHTML = '';
            customMessages.forEach((msg, index) => {
                const messageCard = document.createElement('div');
                messageCard.className = 'added-message-card';
                messageCard.style.animationDelay = (index * 0.1) + 's';
                
                messageCard.innerHTML = `
                    <div class="message-preview">
                        <div class="message-preview-text">"${msg.message}"</div>
                        <div class="message-preview-sender">${msg.sender}</div>
                    </div>
                    <button class="delete-message-btn" onclick="deleteMessage(${msg.id})" title="Hapus pesan">
                        🗑️
                    </button>
                `;
                
                messagesList.appendChild(messageCard);
            });
        }
        
        function updateFinishButton() {
            const finishBtn = document.getElementById('finishFormBtn');
            if (customMessages.length > 0) {
                finishBtn.style.display = 'block';
            } else {
                finishBtn.style.display = 'none';
            }
        }
        
        function showFormFeedback(message, type) {
            const feedback = document.getElementById('formFeedback');
            feedback.textContent = message;
            feedback.className = `form-feedback ${type}`;
            
            // Hide after 3 seconds
            setTimeout(() => {
                feedback.className = 'form-feedback';
            }, 3000);
        }
        
        // Messages Functions
        function renderMessages() {
            const messagesGrid = document.getElementById('messagesGrid');
            messagesGrid.innerHTML = '';
            
            // Load custom messages from memory
            const customMessages = loadCustomMessages();
            
            // Use custom messages if available, otherwise use default messages
            const messagesToShow = customMessages.length > 0 ? customMessages : birthdayData.messages;
            
            messagesToShow.forEach((msg, index) => {
                const messageCard = document.createElement('div');
                messageCard.className = 'message-card';
                messageCard.style.animationDelay = (index * 0.15) + 's';
                
                messageCard.innerHTML = `
                    <p class="message-text">"${msg.message}"</p>
                    <div class="message-sender">${msg.sender}</div>
                `;
                
                messagesGrid.appendChild(messageCard);
            });
        }

        // Enhanced button click handling
        function attachButtonListeners() {
            console.log('🔧 Attaching enhanced button listeners...');
            
            // Primary start button
            const startBtn = document.getElementById('startAdventureBtn');
            if (startBtn) {
                startBtn.addEventListener('click', function(e) {
                    console.log('🚀 Start Adventure button clicked via event listener!');
                    e.preventDefault();
                    e.stopPropagation();
                    startJourney();
                });
                console.log('✅ Start button listener attached');
            }
            
            // Game start button
            const gameStartBtn = document.getElementById('startBtn');
            if (gameStartBtn) {
                gameStartBtn.addEventListener('click', function(e) {
                    console.log('🎮 Game start button clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    startGame();
                });
            }
            
            // All continue buttons
            document.querySelectorAll('.btn-continue').forEach((btn, index) => {
                btn.style.cursor = 'pointer';
                btn.style.pointerEvents = 'auto';
                btn.style.zIndex = '100';
                btn.style.position = 'relative';
                console.log(`✅ Enhanced button ${index + 1}`);
            });
        }

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🎉 Birthday App Loading...');
            
            // Load saved progress
            loadProgressState();
            
            // Initialize navigation and progress
            updateNavigation();
            updateProgressIndicator('home');
            
            // Attach enhanced button listeners
            setTimeout(attachButtonListeners, 100);
            
            // Add some initial confetti
            setTimeout(createMassiveConfetti, 1000);
            
            console.log('✅ Birthday App Ready!');
        });
