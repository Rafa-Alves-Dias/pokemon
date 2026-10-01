const btn = document.getElementById('btnBuscar');
const input = document.getElementById('pokemonInput');
const pokeInfo = document.getElementById('pokeInfo');
const form = document.getElementById('pokeForm');

/* ============================================
   FUNÇÃO PRINCIPAL
   ============================================ */
async function buscarPokemon() {
    try {
        clean();

        const pokemon = limpaString();

        const objResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemon)}`
        );

        if (!objResponse.ok) {
            throw new Error("Pokémon não encontrado 😕");
        }

        const dados = await objResponse.json();

        createImgTag(dados);
        createPTag(dados);

    } catch (erro) {
        pokeInfo.classList.add('error');
        pokeInfo.innerText = erro.message;
    }
}

/* ============================================
   RENDERIZAÇÃO
   ============================================ */
function clean() {
    pokeInfo.innerHTML = '';
    pokeInfo.classList.remove('error');
}

function createImgTag(dados) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('img-wrapper');

    const pokemonComum = document.createElement('img');
    pokemonComum.src = dados.sprites.front_default;
    pokemonComum.alt = dados.name;

    const pokemonShiny = document.createElement('img');
    pokemonShiny.src = dados.sprites.front_shiny;
    pokemonShiny.alt = `${dados.name} shiny`;

    wrapper.appendChild(pokemonComum);
    wrapper.appendChild(pokemonShiny);
    pokeInfo.appendChild(wrapper);
}

function createPTag(dados) {
    const pPokemon = document.createElement('p');
    pPokemon.innerText = dados.name;
    pokeInfo.appendChild(pPokemon);
}

/* ============================================
   VALIDAÇÃO / LIMPEZA DA STRING
   ============================================ */
function limpaString() {
    const frase = input.value.toLowerCase().trim();
    console.log("frase: " + frase);

    if (frase === '') {
        throw new Error("⚠️ Insira letras ou dígitos, por favor!");
    }

    const fraseNormalize = frase.normalize("NFD");
    const regexAcento = /[\u0300-\u036f]/g;
    const fraseSemAcento = fraseNormalize.replace(regexAcento, '');

    const regexSemSimbolos = /[^a-z0-9]/g;
    const fraseLimpa = fraseSemAcento.replace(regexSemSimbolos, '');

    if (fraseLimpa === '') {
        throw new Error("⚠️ Você digitou símbolos. Digite apenas números ou apenas letras!");
    }

    const regexLetrasMin = /[a-z]/;
    const regexNum = /[0-9]/;

    if (regexLetrasMin.test(fraseLimpa) && regexNum.test(fraseLimpa)) {
        throw new Error("⚠️ Digite apenas números ou apenas letras!");
    }

    return fraseLimpa;
}

/* ============================================
   EVENTOS
   ============================================ */
form.addEventListener('submit', function (e) {
    e.preventDefault();
    buscarPokemon();
});