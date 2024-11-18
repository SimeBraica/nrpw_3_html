// Dohvacam canvas po njegovom idu te dohvacam njegov kontekts pomocu getContext metode
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


// Definiram objekt platform te mu pridodajem vrijednosti x y width height speed
const platform = {
    x: 131,
    y: 140,
    width: 40,  
    height: 3, 
    speed: 7,
};


// Definiram objekt loptice te kao svojstva objekta definiram x y radium te dx i dy (koji su sa horizontalnu i vertikalnu brzinu), dx i dyy
// ce poprimiti vrijednosti rezultata getRandomDirection funckcije
const ball = {
    x: 150,
    y: 135,
    radius: 2,
    dx: getRandomDirection(0, 2),
    dy: getRandomDirection(-2, -0) 
};

// Definiram objekt blok te u njemu definiram svojstva width height te padding. Padding je dodan da svi blokovi nebudu zbijeni zajedno
const block = {
    width: 30,  
    height: 10,
    padding: 5
};

// Polje bloks koje će sadržavati sve generirane blokove
const blocks = [];
// Koliko ce biti blokova po redu
const blocksPerRow = 8;
// Koliko ce biti redaka
const totalRows = 5;
// Score koji uvijek zapocinje od 0 te se sprema u localstorage kasnije
let score = 0;
// Zastavica koja će se kasnije provjeravati da li je igra zavrsena
let isGameOver = false;
// Dohvati iz localstoragea najbolji rezultat do sad ako nema do sada nikakvnog bestscorea u localstoragaeu postavi ga na 0
let bestScore = localStorage.getItem('bestScore') || 0;

// Za ssvaki redak od svih redova kreiraj novi redak
for (let row = 0; row < totalRows; row++) {
    blocks[row] = [];
    // Za svaki stupac u retku kreiraj blok na mjestu row col
    for (let col = 0; col < blocksPerRow; col++) {
        // Za svaki blok na mjestu row col dajemo mu x y kordinate te visible svojstvo koje je postavljeno na true koje ce 
        // se kasnije koristiti za detekciju sudara. Ovaj dio koda ne crta sve blokove.
        blocks[row][col] = { 
                            x: 0, 
                            y: 0, 
                            visible: true 
                        };
    }
}

// Funkcija koja prima 2 argumenta min max te kreira broj izmedu ta dva broja
function getRandomDirection(min, max) {
    // Math random vraca broj izmedu 0 i 1. Ako je broj manji od 0.5 onda je varijabla direction postavljena na -1. Inace je postavljena na 1
    const direction = Math.random() < 0.5 ? -1 : 1; 
    // Funckija vraca direkciju unutar raspona max i min sa nasumicnim smjerom jer direction je ili -1 ili 1
    return direction * (Math.random() * (max - min) + min);
}


// Funkcija koja crta sve blokove
function drawBlocks() {
    // Iteriraj kroz sve retke
    for (let row = 0; row < totalRows; row++) {
        // Iteriraj kroz sve stupce
        for (let col = 0; col < blocksPerRow; col++) {
            // Za svaki blok na svakoj poziciji provjeri da li je vidljiv
            if (blocks[row][col].visible) {
                // Blockx varijabla se racuna tako da svaki blok je postavljen na svoju unikatnu poziciju. Zbraja duljinu bloka sa 
                // njegovim paddingom te mnozi sa stupcem u kojem se nalazi
                const blockX = col * (block.width + block.padding);
                // Blocky istu stvar radi kao i blockx ali samo za y varijablu.
                const blockY = row * (block.height + block.padding);
                // Primjenjujemo na svojstva objekta blok varijable blockx i blocky za svaki blok.
                blocks[row][col].x = blockX;
                blocks[row][col].y = blockY;
                
                // Dodajemo boju pozadine na svaki blok te ta boja je bijela.
                ctx.fillStyle = 'white';
                ctx.fillRect(blockX, blockY, block.width, block.height);
                
                // Dodavanje sjencanja rubova svakog bloka te ta boja je zuta.
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 2;
                ctx.strokeRect(blockX, blockY, block.width, block.height);
            }
        }
    }
}

// Funckija za crtanje platforme kojom mozemo upravljati
function drawPlatform() {
    // Dodajemo pozadinsku boju platformi u ovom slucaju crvena
    ctx.fillStyle = 'red';
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    
    // Dodajemo sjencanje rubova na platformu u ovom slucaju ljubicasta
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 2;
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
}

// Funkcija za crtanje loptice koja se krece
function drawBall() {
    // Kreiram novu putanju za crtanje
    ctx.beginPath();
    // Loptica poprima oblik kruga.
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    
    // Dajem pozadinsku boju loptici u ovom slucaju bijela
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Dajem loptici sjencanje rubova u ovom slucaju plava
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Zatvara trenutno crtanje oblika (putanje)
    ctx.closePath();
}

// Funckija koja crta trenutni rezultat u gornjem desnom kutu
function drawScore() {
    // Oznacavam font ovog teksta i velicinu
    ctx.font = '16px Arial';
    // Dajem tekstu crvenu boju
    ctx.fillStyle = 'red';
    // Postavljam tekst desno
    ctx.textAlign = 'right';
    // Ispisujem tekst na mjestu canvas.width -10, 20 sto znaci da ce x koordinata ovog teksta bili za 10px udaljena od 
    // desnog ruba ali 20px od gornjeg dijela kanvasa
    ctx.fillText('Score: ' + score, canvas.width - 10, 20);
    // Isto kao gornji ispis teksta samo sto je ovaj tekst za 40 udaljen od gornjeg dijela kanvasa
    ctx.fillText('Best: ' + bestScore, canvas.width - 10, 40);
}

// Funkcija koja ispisuje GAME OVER na sredini ekrana
function drawGameOver() {
    // Font će biti tipa Arial te 40px
    ctx.font = '40px Arial';
    // Crvene boje
    ctx.fillStyle = 'red';
    // Te u centru
    ctx.textAlign = 'center';
    // Tekst će biti pozicioniran na x koordinati pola duljine kanvasa te y koordinati pola visine kanvasa. 
    // S obzirom da kanvas zauzima cijeli ekran to će biti centrirano
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
}

// Funckija koja ispisuje YOU WIN na sredini ekrana
function drawYouWin() {
    // Font ce isto biti tipa arijal 40px kao i tekst za game over
    ctx.font = '40px Arial';
    // BOja teksta je crvena
    ctx.fillStyle = 'red';
    // Tekst je centriran na svojim koordinatama
    ctx.textAlign = 'center';
    // Tekst je centriran kao i u drawGameOver funkciji na sredini ekrana.
    ctx.fillText('YOU WIN', canvas.width / 2, canvas.height / 2);
}

// Funkcija koja omogućuje kretanje platforme lijevo i desno
function updatePosition(event) {
    switch (event.key) {
        case 'ArrowLeft':
            // Provjera da li se platforma moze pomaknuti ulijevo bez da iskoci sa kanvasa. Na primjeru to znaci 
            // da ako oduzmemu trenutnu koordinatu platforme x sa brzinom platforme prilikom klika i ako je te razlika
            // veca ili jednaka od 0 onda se platforma može jos micati u lijevo.
            if (platform.x - platform.speed >= 0) 
                // Ako ova provjera prolazi onda umanji vrijednost koordinate x za jednu brzinu platforme.
                platform.x = platform.x - platform.speed;
            break;
        case 'ArrowRight':
            // Ideja je ista kao kod pomicanja ulijevo samo štp ovdje moramo provjeriti da li pomicanjem u desno 
            // platforma iskace sa desne strane ekrana. Iskace u slucaju ako zbrojimo koordinatu x sa duljinom width
            // te brzinu platforme speed je vece od duljine kanvasa. Ovdje mormao zbrojiti i platform.width zato jer u
            // koordinata x platforme krece iz lijevog kuta platforme pa moramo dodati jos duljinu platforme da bi izracun
            // bio tocan
            if (platform.x + platform.width + platform.speed <= canvas.width)
                 // Ako ova provjera prolazi onda povecaj vrijednost koordinate x za jednu brzinu platforme.
                 platform.x += platform.speed;
            break;
    }
}

// Funkcija koja pomice loptu
function moveBall() {
    // Provjerava zastavicu isGameOver. Ako je izadi iz funkcije i prekini kretanje loptice
    if (isGameOver) return;

    // Povecavam vrijednost x i y loptice za njezino ubrzanje. Dx te dy oznacavaju brzinu kretanja loptice
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Provjera koja zbraja x vrijednost te radius odnosno oduzima x vrijednost sa radijusom te provjerava da li je loptica udarila 
    // u lijevi ili desni kut kanvasa te ako je onda postavi vrijednosot brzine na svoju negativnu vrijednost sto mijenja smjer loptice
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    // Slicna provjera kao ona opisana iznad samo sto ovdje provjeravamo da li je loptica udarila u gornji dio platna te ako je 
    // onda promjeni smjer na svoju obrnutu vrijednost
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Provjera da li je loptica udarila platformu
    if (
        // Vrijednost y zbrojena sa radiusom je veca od y koordinate platforme 
        ball.y + ball.radius > platform.y &&
        // te ako je loptica unutar sirine platforme 
        ball.x > platform.x &&
        ball.x < platform.x + platform.width
    ) {
        // Promjeni putanju loptice
        ball.dy = -ball.dy;
    }
    // za svaki red
    for (let row = 0; row < totalRows; row++) {
        // za svaki blok u svakom redu
        for (let col = 0; col < blocksPerRow; col++) {
            const b = blocks[row][col];
            // Ako je blok vidljiv
            if (b.visible) {
                // ako je 
                if (
                    // da li se loptica nalazi unutar x prostora trenutnog bloka
                    ball.x > b.x &&
                    // i da loptica jos nije usla kroz desni rub bloka 
                    ball.x < b.x + block.width &&
                    // i je li gornji dio loptica ispod donjeg ruba bloka
                    ball.y - ball.radius < b.y + block.height &&
                    // i je li je donji dio loptice iznad gornjeg ruba blokka
                    ball.y + ball.radius > b.y
                    ) 
                        {
                            // promjerni putanju loptice
                            ball.dy = -ball.dy;
                            // blok nestaje prilikom sudara
                            b.visible = false;
                            // poveaj score trenutnog igraca za 1
                            score++;
                            // provjeri da li je igra gotova
                            checkWinCondition();
                        }
            }
        }
    }
    // da li je loptica ispala sa donjeg ruba ekrana
    if (ball.y + ball.radius > canvas.height) {
        // postavi zastavicu isGameOver na true
        isGameOver = true;
        // provjerava trenutni score te ako je veci postavi scrore kao bestscore u localstorage
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
        }
        // ispisi velikim crvenim slovima da je igra gotova GAME OVER
        drawGameOver();
    }
}

// metoda koja provjerava sve moguce uvijete da li je igra gotova
function checkWinCondition() {
    // kreiram novo zastavicu allBlocksBroken te je inicijalnost postavljam na true jer idem pretpostavkom da je igra gotova
    let allBlocksBroken = true;
    // za svaki red
    for (let row = 0; row < totalRows; row++) {
        // za svaki blok u redu
        for (let col = 0; col < blocksPerRow; col++) {
            // za svaki blok provjeri je li unisten 
            if (blocks[row][col].visible) {
                // ako je bar jedan blok unisten onda postavi zastavicu allBlockBroken na false te igra nije zavrsena
                allBlocksBroken = false;
                break;
            }
        }
    }

    // provjeri zastavicu allBlocksBroken
    if (allBlocksBroken) {
        // ako je igra zavrsena postavi zastavicu isGameOver na true 
        isGameOver = true;
        // u slucaju da trenutni score bolji od bestScorea iz localStoragea postavi bestScore na vrijednost scorea
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
        }
        // nacrataj velikimk slovima da je igrac pobjedio
        drawYouWin();
    }
}

// funckija za upravljanje game loopa te upravljanje animacija igre
function draw() {
    // prije ikakve promjene na ekranu moramo opet nacrtati cijeli kanvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // koristim funkciju drawBlocks te nacrtam sve trenutne blokove
    drawBlocks();
    // koristim funkciju drawPlatform te nacrtam platformu na trenutnoj poziciji
    drawPlatform();
    // koristim funkciju drawBall te nacrtam lopticu na trenuntnoj poziciji
    drawBall();
    // koristim funkciju drawScroe te nacrtam trenutni rezultat
    drawScore();

    // stavim event handler te na prististak tipke pozivam funckiji updatePosition koja upravlja platformom
    window.addEventListener('keydown', updatePosition);
    // funckija zaduzena za pomicanje loptice
    moveBall();

    // provjeri da li je igra gotova ako nije pozivaj funkciju draw svaku milisekundu
    if (!isGameOver) {
        setTimeout(draw, 1); 
    }
}

// pozivanje funkcije draw i zapocinjenje igre
draw();
