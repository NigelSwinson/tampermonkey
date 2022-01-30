// ==UserScript==
// @name         BGA/BGG connector
// @namespace    https://boardgamearena.com/gamelist*
// @version      1.7
// @description  Improve search experience working with the board gamearea game list
// @author       nigel@swinson.com
// Start on BGA's game list
// @match        https://boardgamearena.com/gamelist*
// Search in BGG
// @match        https://boardgamegeek.com/geeksearch.php*
// Open a BGG game and "Link to BGA"
// @match        https://boardgamegeek.com/boardgame/*
// The state is then updated on the game panel
// @match        https://boardgamearena.com/gamepanel*
// @icon         https://www.google.com/s2/favicons?domain=boardgamearena.com
// @grant        none
// ==/UserScript==

// Class object for annotating BGA
function annotator() {
    return {
        // Our local storage data object. Read at startup, written after changes
        // Note this is domain specific, so on BGG it will be the BGG local storage. On BGA it will be the BGA local storage
        myData: {},
        // This is some starter data to speed up the initialisation process
        bgaSourceData: JSON.parse(`{
            "abalone":{"bgg":{"id":"526","name":"abalone","rating":"6.5","duration":"30  Min","weight":"2.18"}},
            "abandonallartichokes":{"bgg":{"id":"302260","name":"abandon-all-artichokes","rating":"6.8","duration":"20  Min","weight":"1.35"}},
            "abyss":{"bgg":{"id":"155987","name":"abyss","rating":"7.3","duration":"30–60  Min","weight":"2.33"}},
            "akeruption":{"bgg":{"id":"88594","name":"eruption","rating":"6.2","duration":"30–60  Min","weight":"2.02"}},
            "aknile":{"bgg":{"id":"40213","name":"nile","rating":"6.1","duration":"30  Min","weight":"1.56"}},
            "alhambra":{"bgg":{"id":"6249","name":"alhambra","rating":"7.0","duration":"45–60  Min","weight":"2.10"}},
            "almadi":{"bgg":{"id":"341233","name":"almadi","rating":"7.0","duration":"30–45  Min","weight":"1.67"}},
            "alveole":{"bgg":{"id":"343687","name":"alveole","rating":"4.0","duration":"30  Min","weight":"0.00"}},
            "amyitis":{"bgg":{"id":"29934","name":"amyitis","rating":"6.9","duration":"60–120  Min","weight":"3.22"}},
            "apocalypseazcc":{"bgg":{"id":"234834","name":"apocalypse-au-zoo-de-carson-city","rating":"5.9","duration":"10–15  Min","weight":"1.17"}},
            "armadora":{"bgg":{"id":"8229","name":"armadora","rating":"6.3","duration":"30  Min","weight":"1.97"}},
            "arnak":{"bgg":{"id":"312484","name":"lost-ruins-arnak","rating":"8.1","duration":"30–120  Min","weight":"2.85"}},
            "artdecko":{"bgg":{"id":"260316","name":"art-decko","rating":"7.2","duration":"45–60  Min","weight":"2.50"}},
            "assyria":{"bgg":{"id":"43152","name":"assyria","rating":"6.8","duration":"45–90  Min","weight":"3.01"}},
            "automobiles":{"bgg":{"id":"180680","name":"automobiles","rating":"7.3","duration":"45–75  Min","weight":"2.18"}},
            "azul":{"bgg":{"id":"230802","name":"azul","rating":"7.8","duration":"30–45  Min","weight":"1.76"}},
            "backgammon":{"bgg":{"id":"2397","name":"backgammon","rating":"6.5","duration":"30  Min","weight":"2.02"}},
            "balloonpop":{"bgg":{"id":"212027","name":"balloon-pop","rating":"5.1","duration":"10  Min","weight":"1.00"}},
            "bandido":{"bgg":{"id":"191925","name":"bandido","rating":"6.5","duration":"10–15  Min","weight":"1.10"}},
            "bang":{"bgg":{"id":"3955","name":"bang","rating":"6.5","duration":"20–40  Min","weight":"1.63"}},
            "barbu":{"bgg":{"id":"6974","name":"barbu","rating":"6.8","duration":"180  Min","weight":"2.29"}},
            "battleforhill":{"bgg":{"id":"32484","name":"battle-hill-218","rating":"6.6","duration":"15–30  Min","weight":"1.71"}},
            "battleoflits":{"bgg":{"id":"105265","name":"battle-lits","rating":"6.0","duration":"20  Min","weight":"1.67"}},
            "battleship":{"bgg":{"id":"27190","name":"battleships","rating":"4.7","duration":"60  Min","weight":"1.00"}},
            "belote":{"bgg":{"id":"15722","name":"belote","rating":"6.6","duration":"20  Min","weight":"2.63"}},
            "beyondthesun":{"bgg":{"id":"317985","name":"beyond-sun","rating":"8.0","duration":"60–120  Min","weight":"3.10"}},
            "bids":{"bgg":{"id":"296420","name":"bids","rating":"6.0","duration":"20–50  Min","weight":"1.67"}},
            "bigtimesoccer":{"bgg":{"id":"212436","name":"big-time-soccer","rating":"3.5","duration":"30–60  Min","weight":"1.50"}},
            "biyi":{"bgg":{"id":"316581","name":"biyi","rating":"4.3","duration":"20–45  Min","weight":"3.00"}},
            "blaze":{"bgg":{"id":"332317","name":"blaze","rating":"5.6","duration":"20  Min","weight":"0.00"}},
            "blooms":{"bgg":{"id":"249095","name":"blooms","rating":"6.7","duration":"10–30  Min","weight":"2.00"}},
            "blueskies":{"bgg":{"id":"309000","name":"blue-skies","rating":"6.3","duration":"45  Min","weight":"2.00"}},
            "bobail":{"bgg":{"id":"310888","name":"bobail","rating":"6.0","duration":"15  Min","weight":"2.00"}},
            "bombay":{"bgg":{"id":"40214","name":"bombay","rating":"6.3","duration":"30–60  Min","weight":"2.05"}},
            "boomerangaustralia":{"bgg":{"id":"296167","name":"boomerang-australia","rating":"7.0","duration":"15–30  Min","weight":"1.45"}},
            "bossquest":{"bgg":{"id":"285892","name":"boss-quest","rating":"6.4","duration":"20  Min","weight":"1.50"}},
            "briscola":{"bgg":{"id":"11733","name":"briscola","rating":"6.3","duration":"30  Min","weight":"1.56"}},
            "bubbleepop":{"bgg":{"id":"192343","name":"bubblee-pop","rating":"6.4","duration":"20  Min","weight":"1.46"}},
            "bug":{"bgg":{"id":"240835","name":"bug","rating":"6.9","duration":"10–30  Min","weight":"2.00"}},
            "butterfly":{"bgg":{"id":"284229","name":"butterfly","rating":"6.7","duration":"30–60  Min","weight":"1.18"}},
            "buttons":{"bgg":{"id":"181390","name":"buttons","rating":"5.7","duration":"20–30  Min","weight":"1.15"}},
            "buyword":{"bgg":{"id":"8920","name":"buyword","rating":"6.3","duration":"45  Min","weight":"1.81"}},
            "cacao":{"bgg":{"id":"171499","name":"cacao","rating":"7.1","duration":"45  Min","weight":"1.82"}},
            "canosa":{"bgg":{"id":"288648","name":"canosa","rating":"5.9","duration":"15–25  Min","weight":"0.00"}},
            "cantstop":{"bgg":{"id":"41","name":"cant-stop","rating":"6.9","duration":"30  Min","weight":"1.16"}},
            "cantstopexpress":{"bgg":{"id":"217547","name":"cant-stop-express","rating":"6.2","duration":"30  Min","weight":"1.29"}},
            "caravan":{"bgg":{"id":"269789","name":"caravan","rating":"6.7","duration":"45  Min","weight":"1.75"}},
            "carcassonne":{"bgg":{"id":"822","name":"carcassonne","rating":"7.4","duration":"30–45  Min","weight":"1.91"}},
            "carcassonnehuntersandgatherers":{"bgg":{"id":"4390","name":"carcassonne-hunters-and-gatherers","rating":"7.1","duration":"35  Min","weight":"1.92"}},
            "cardiceo":{"bgg":{"id":"337503","name":"cardiceo","rating":"3.3","duration":"30–60  Min","weight":"1.00"}},
            "caribbeanallfours":{"bgg":{"id":"10789","name":"pitch","rating":"6.8","duration":"30  Min","weight":"1.77"}},
            "carnegie":{"bgg":{"id":"310873","name":"carnegie","rating":"7.8","duration":"120–180  Min","weight":"3.81"}},
            "carrara":{"bgg":{"id":"129948","name":"palaces-carrara","rating":"7.2","duration":"60  Min","weight":"2.62"}},
            "castlesofburgundy":{"bgg":{"id":"84876","name":"castles-burgundy","rating":"8.1","duration":"30–90  Min","weight":"3.00"}},
            "caylus":{"bgg":{"id":"18602","name":"caylus","rating":"7.8","duration":"60–150  Min","weight":"3.80"}},
            "celestia":{"bgg":{"id":"175117","name":"celestia","rating":"7.0","duration":"30  Min","weight":"1.33"}},
            "chakra":{"bgg":{"id":"267378","name":"chakra","rating":"7.0","duration":"30  Min","weight":"1.79"}},
            "checkers":{"bgg":{"id":"2083","name":"checkers","rating":"4.9","duration":"30  Min","weight":"1.76"}},
            "chess":{"bgg":{"id":"171","name":"chess","rating":"7.1","duration":"60  Min","weight":"3.69"}},
            "chinagold":{"bgg":{"id":"13928","name":"chinagold","rating":"5.9","duration":"30  Min","weight":"2.32"}},
            "chinesecheckers":{"bgg":{"id":"2386","name":"chinese-checkers","rating":"5.1","duration":"30  Min","weight":"1.60"}},
            "chocolatefactory":{"bgg":{"id":"240567","name":"chocolate-factory","rating":"7.2","duration":"45–90  Min","weight":"2.86"}},
            "cinco":{"bgg":{"id":"87288","name":"cinco","rating":"5.7","duration":"10  Min","weight":"1.38"}},
            "circleoflife":{"bgg":{"id":"184730","name":"circle-life","rating":"6.7","duration":"20–40  Min","weight":"2.00"}},
            "cityofthebigshoulders":{"bgg":{"id":"214880","name":"city-big-shoulders","rating":"7.9","duration":"120–180  Min","weight":"4.06"}},
            "clansofcaledonia":{"bgg":{"id":"216132","name":"clans-caledonia","rating":"8.0","duration":"30–120  Min","weight":"3.46"}},
            "clashofdecks":{"bgg":{"id":"334307","name":"clash-decks-starter-kit","rating":"7.4","duration":"15–30  Min","weight":"1.82"}},
            "classicgo":{"bgg":{"id":"188","name":"go","rating":"7.6","duration":"30–180  Min","weight":"3.95"}},
            "cloudcity":{"bgg":{"id":"313963","name":"cloud-city","rating":"6.9","duration":"30–60  Min","weight":"1.20"}},
            "codexnaturalis":{"bgg":{"id":"314503","name":"codex-naturalis","rating":"7.2","duration":"20–30  Min","weight":"1.90"}},
            "coinche":{"bgg":{"id":"15722","name":"belote","rating":"6.6","duration":"20  Min","weight":"2.63"}},
            "coloretto":{"bgg":{"id":"5782","name":"coloretto","rating":"7.0","duration":"30  Min","weight":"1.28"}},
            "colorpop":{"bgg":{"id":"125028","name":"colorpop","rating":"5.5","duration":"10–20  Min","weight":"1.21"}},
            "coltexpress":{"bgg":{"id":"158899","name":"colt-express","rating":"7.1","duration":"30–40  Min","weight":"1.82"}},
            "concept":{"bgg":{"id":"147151","name":"concept","rating":"6.8","duration":"40  Min","weight":"1.40"}},
            "connectfour":{"bgg":{"id":"2719","name":"connect-four","rating":"4.9","duration":"10  Min","weight":"1.20"}},
            "connectsix":{"bgg":{"id":"22847","name":"connect6","rating":"6.5","duration":"30  Min","weight":"2.67"}},
            "consonar":{"bgg":{"id":"308357","name":"con-sonar","rating":"3.6","duration":"10–30  Min","weight":"2.00"}},
            "conspiracy":{"bgg":{"id":"697","name":"conspiracy","rating":"6.2","duration":"90  Min","weight":"1.91"}},
            "coupcitystate":{"bgg":{"id":"131357","name":"coup","rating":"7.0","duration":"15  Min","weight":"1.41"}},
            "crazyfarmers":{"bgg":{"id":"302238","name":"crazy-farmers-and-clotures-electriques","rating":"5.9","duration":"30–60  Min","weight":"2.25"}},
            "cribbage":{"bgg":{"id":"2398","name":"cribbage","rating":"7.1","duration":"30  Min","weight":"1.90"}},
            "cubirds":{"bgg":{"id":"245476","name":"cubirds","rating":"7.0","duration":"20  Min","weight":"1.27"}},
            "darkagent":{"bgg":{"id":"189201","name":"dark-agent","rating":"4.6","duration":"20–40  Min","weight":"3.50"}},
            "detectivepoker":{"bgg":{"id":"329640","name":"detective-poker","rating":"3.9","duration":"25–50  Min","weight":"0.00"}},
            "deus":{"bgg":{"id":"162082","name":"deus","rating":"7.3","duration":"60–90  Min","weight":"2.85"}},
            "diams":{"bgg":{"id":"116975","name":"diams","rating":"5.2","duration":"20  Min","weight":"1.86"}},
            "dicedtomatoes":{"bgg":{"id":"259708","name":"diced-tomatoes","rating":"5.0","duration":"15–30  Min","weight":"2.00"}},
            "diceforge":{"bgg":{"id":"194594","name":"dice-forge","rating":"7.3","duration":"45  Min","weight":"1.96"}},
            "dicehospital":{"bgg":{"id":"218121","name":"dice-hospital","rating":"7.2","duration":"45–90  Min","weight":"2.32"}},
            "dicesummoners":{"bgg":{"id":"252544","name":"dice-summoners","rating":"5.7","duration":"30–60  Min","weight":"2.00"}},
            "dingosdreams":{"bgg":{"id":"182116","name":"dingos-dreams","rating":"6.1","duration":"20–30  Min","weight":"1.10"}},
            "dinosaurteaparty":{"bgg":{"id":"247160","name":"dinosaur-tea-party","rating":"6.5","duration":"15–30  Min","weight":"1.29"}},
            "djambi":{"bgg":{"id":"17691","name":"djambi","rating":"6.7","duration":"60  Min","weight":"3.33"}},
            "dodo":{"bgg":{"id":"344017","name":"dodo","rating":"4.9","duration":"","weight":"1.00"}},
            "downforce":{"bgg":{"id":"215311","name":"downforce","rating":"7.3","duration":"20–40  Min","weight":"1.74"}},
            "draftosaurus":{"bgg":{"id":"264055","name":"draftosaurus","rating":"7.2","duration":"15  Min","weight":"1.24"}},
            "dragoncastle":{"bgg":{"id":"232219","name":"dragon-castle","rating":"7.2","duration":"30–45  Min","weight":"1.97"}},
            "dragonheart":{"bgg":{"id":"66171","name":"dragonheart","rating":"6.5","duration":"30  Min","weight":"1.37"}},
            "dragonkeeper":{"bgg":{"id":"185344","name":"dragon-keeper-dungeon","rating":"6.1","duration":"20–30  Min","weight":"2.00"}},
            "dragonline":{"bgg":{"id":"156576","name":"dragon-line","rating":"4.1","duration":"20  Min","weight":"2.00"}},
            "dragonwood":{"bgg":{"id":"172933","name":"dragonwood","rating":"6.7","duration":"20  Min","weight":"1.39"}},
            "dudo":{"bgg":{"id":"45","name":"perudo","rating":"6.9","duration":"15–30  Min","weight":"1.26"}},
            "dungeonpetz":{"bgg":{"id":"97207","name":"dungeon-petz","rating":"7.5","duration":"90  Min","weight":"3.62"}},
            "dungeonroll":{"bgg":{"id":"138788","name":"dungeon-roll","rating":"6.1","duration":"15  Min","weight":"1.33"}},
            "dungeontwister":{"bgg":{"id":"12995","name":"dungeon-twister","rating":"6.8","duration":"60  Min","weight":"2.88"}},
            "eightmastersrevenge":{"bgg":{"id":"147474","name":"8-masters-revenge","rating":"6.3","duration":"15–45  Min","weight":"2.50"}},
            "elfenland":{"bgg":{"id":"10","name":"elfenland","rating":"6.7","duration":"60  Min","weight":"2.16"}},
            "emdomicrocosm":{"bgg":{"id":"163640","name":"eminent-domain-microcosm","rating":"6.4","duration":"15  Min","weight":"1.96"}},
            "eminentdomain":{"bgg":{"id":"68425","name":"eminent-domain","rating":"7.0","duration":"45  Min","weight":"2.51"}},
            "escapefromthehiddencastle":{"bgg":{"id":"23435","name":"hugo","rating":"3.4","duration":"30  Min","weight":"1.00"}},
            "evl":{"bgg":{"id":"340377","name":"evl","rating":"5.3","duration":"10–20  Min","weight":"2.00"}},
            "evogamenoname":{"bgg":{"id":"23228","name":"evo","rating":"5.4","duration":"30  Min","weight":"2.00"}},
            "explorationwarzone":{"bgg":{"id":"299556","name":"exploration-warzone","rating":"3.6","duration":"5–15  Min","weight":"0.00"}},
            "faifo":{"bgg":{"id":"288920","name":"hoi-pho","rating":"5.5","duration":"15–30  Min","weight":"1.00"}},
            "filters":{"rating":"0"},"agricola":{"bgg":{"id":"31260","name":"agricola","rating":"7.9","duration":"30–150  Min","weight":"3.64"}},
            "finity":{"bgg":{"id":"290506","name":"finity","rating":"5.2","duration":"15–120  Min","weight":"3.00"}},
            "fistfulofgold":{"bgg":{"id":"305980","name":"fistful-gold","rating":"5.1","duration":"10–15  Min","weight":"1.33"}},
            "flamingpyramids":{"bgg":{"id":"236639","name":"flaming-pyramids","rating":"5.4","duration":"10–20  Min","weight":"1.17"}},
            "fleet":{"bgg":{"id":"121297","name":"fleet","rating":"6.9","duration":"30–45  Min","weight":"2.24"}},
            "florenzacardgame":{"bgg":{"id":"143484","name":"florenza-card-game","rating":"6.8","duration":"60  Min","weight":"2.52"}},
            "fluxx":{"bgg":{"id":"258","name":"fluxx","rating":"5.7","duration":"5–30  Min","weight":"1.39"}},
            "forbiddenisland":{"bgg":{"id":"65244","name":"forbidden-island","rating":"6.8","duration":"30  Min","weight":"1.74"}},
            "forex":{"bgg":{"id":"227605","name":"ex","rating":"6.5","duration":"90  Min","weight":"3.93"}},
            "forsale":{"bgg":{"id":"172","name":"sale","rating":"7.2","duration":"30  Min","weight":"1.26"}},
            "fourcolorcards":{"bgg":{"id":"22501","name":"see-sek","rating":"4.9","duration":"10  Min","weight":"2.00"}},
            "frenchtarot":{"bgg":{"id":"4505","name":"tarot","rating":"6.8","duration":"30  Min","weight":"2.49"}},
            "gaia":{"bgg":{"id":"163920","name":"gaia","rating":"6.2","duration":"30  Min","weight":"1.98"}},
            "gearnpiston":{"bgg":{"id":"140613","name":"gear-piston","rating":"5.7","duration":"30–60  Min","weight":"2.13"}},
            "goldwest":{"bgg":{"id":"154086","name":"gold-west","rating":"7.4","duration":"45–60  Min","weight":"2.44"}},
            "gomoku":{"bgg":{"id":"11929","name":"go-moku","rating":"6.0","duration":"5  Min","weight":"1.88"}},
            "gonutsfordonuts":{"bgg":{"id":"184346","name":"go-nuts-donuts","rating":"6.5","duration":"20  Min","weight":"1.11"}},
            "gopher":{"bgg":{"id":"334824","name":"gopher","rating":"5.0","duration":"","weight":"2.00"}},
            "gorami":{"bgg":{"id":"121011","name":"gurami-das-spiel","rating":"4.3","duration":"15  Min","weight":"0.00"}},
            "gosu":{"bgg":{"id":"66587","name":"gosu","rating":"6.5","duration":"45  Min","weight":"2.40"}},
            "grandbazaar":{"bgg":{"id":"189489","name":"grand-bazaar","rating":"3.4","duration":"30–45  Min","weight":"1.40"}},
            "guildes":{"bgg":{"id":"220276","name":"guildes","rating":"6.1","duration":"20–35  Min","weight":"1.25"}},
            "guile":{"bgg":{"id":"138091","name":"guile","rating":"5.5","duration":"20  Min","weight":"1.00"}},
            "gyges":{"bgg":{"id":"10527","name":"gyges","rating":"6.6","duration":"15  Min","weight":"2.45"}},
            "hacktrick":{"bgg":{"id":"181440","name":"hack-trick","rating":"6.4","duration":"15–25  Min","weight":"1.42"}},
            "haggis":{"bgg":{"id":"37628","name":"haggis","rating":"7.0","duration":"45  Min","weight":"2.11"}},
            "haiclue":{"bgg":{"id":"286062","name":"haiclue","rating":"6.2","duration":"30  Min","weight":"1.25"}},
            "hanabi":{"bgg":{"id":"98778","name":"hanabi","rating":"7.1","duration":"25  Min","weight":"1.70"}},
            "handandfoot":{"bgg":{"id":"7475","name":"hand-and-foot","rating":"5.9","duration":"120  Min","weight":"1.92"}},
            "happycity":{"bgg":{"id":"319793","name":"happy-city","rating":"6.6","duration":"20–30  Min","weight":"1.28"}},
            "harbour":{"bgg":{"id":"155969","name":"harbour","rating":"6.5","duration":"30–60  Min","weight":"2.09"}},
            "hardback":{"bgg":{"id":"223750","name":"hardback","rating":"7.3","duration":"45–90  Min","weight":"2.10"}},
            "hawaii":{"bgg":{"id":"106217","name":"hawaii","rating":"7.1","duration":"90  Min","weight":"2.90"}},
            "hearts":{"bgg":{"id":"6887","name":"hearts","rating":"6.5","duration":"30  Min","weight":"1.77"}},
            "herooj":{"bgg":{"id":"127304","name":"herooj","rating":"5.5","duration":"30  Min","weight":"0.00"}},
            "herrlof":{"bgg":{"id":"286081","name":"herrlof","rating":"6.9","duration":"30–45  Min","weight":"1.33"}},
            "hex":{"bgg":{"id":"4112","name":"hex","rating":"6.7","duration":"20  Min","weight":"3.24"}},
            "hive":{"bgg":{"id":"2655","name":"hive","rating":"7.3","duration":"20  Min","weight":"2.33"}},
            "hoarders":{"bgg":{"id":"281417","name":"hoarders","rating":"5.5","duration":"10–15  Min","weight":"1.00"}},
            "homesteaders":{"bgg":{"id":"26566","name":"homesteaders","rating":"7.2","duration":"60–90  Min","weight":"3.04"}},
            "hungariantarokk":{"bgg":{"id":"101723","name":"hungarian-tarokk","rating":"6.7","duration":"30  Min","weight":"3.33"}},
            "icecoldicehockey":{"bgg":{"id":"154753","name":"ice-cold-ice-hockey","rating":"5.0","duration":"60  Min","weight":"2.00"}},
            "illustori":{"bgg":{"id":"308532","name":"illustori","rating":"4.6","duration":"10–30  Min","weight":"1.00"}},
            "imhotep":{"bgg":{"id":"191862","name":"imhotep","rating":"7.2","duration":"40  Min","weight":"2.00"}},
            "incangold":{"bgg":{"id":"15512","name":"diamant","rating":"6.8","duration":"30  Min","weight":"1.11"}},
            "innovation":{"bgg":{"id":"63888","name":"innovation","rating":"7.3","duration":"45–60  Min","weight":"2.75"}},
            "insert":{"bgg":{"id":"341358","name":"insert","rating":"6.4","duration":"","weight":"1.50"}},
            "intheyearofthedragon":{"bgg":{"id":"31594","name":"year-dragon","rating":"7.3","duration":"75–100  Min","weight":"3.10"}},
            "inventors":{"bgg":{"id":"200785","name":"legendary-inventors","rating":"6.4","duration":"30–40  Min","weight":"1.97"}},
            "isaac":{"bgg":{"id":"88113","name":"isaac","rating":"6.3","duration":"15  Min","weight":"2.50"}},
            "iwari":{"bgg":{"id":"270109","name":"iwari","rating":"7.3","duration":"45  Min","weight":"2.18"}},
            "jaipur":{"bgg":{"id":"54043","name":"jaipur","rating":"7.5","duration":"30  Min","weight":"1.49"}},
            "jekyllvshide":{"bgg":{"id":"297129","name":"jekyll-vs-hyde","rating":"7.1","duration":"30  Min","weight":"1.73"}},
            "jumpgate":{"bgg":{"id":"62809","name":"jump-gate","rating":"6.1","duration":"45  Min","weight":"2.25"}},
            "justdesserts":{"bgg":{"id":"18946","name":"just-desserts","rating":"5.9","duration":"25  Min","weight":"1.32"}},
            "k2":{"bgg":{"id":"73761","name":"k2","rating":"7.0","duration":"30–60  Min","weight":"2.26"}},
            "kabaleo":{"bgg":{"id":"94891","name":"kabaleo","rating":"5.3","duration":"15  Min","weight":"1.40"}},
            "kahuna":{"bgg":{"id":"394","name":"kahuna","rating":"6.6","duration":"30–40  Min","weight":"2.06"}},
            "kalah":{"bgg":{"id":"2448","name":"kalah","rating":"5.9","duration":"10  Min","weight":"1.62"}},
            "kami":{"bgg":{"id":"280107","name":"kami","rating":"6.1","duration":"20  Min","weight":"1.67"}},
            "keyflower":{"bgg":{"id":"122515","name":"keyflower","rating":"7.8","duration":"90–120  Min","weight":"3.35"}},
            "khronos":{"bgg":{"id":"25674","name":"khronos","rating":"6.3","duration":"90  Min","weight":"3.57"}},
            "kingdombuilder":{"bgg":{"id":"107529","name":"kingdom-builder","rating":"7.0","duration":"45  Min","weight":"2.06"}},
            "kingdomino":{"bgg":{"id":"204583","name":"kingdomino","rating":"7.4","duration":"15  Min","weight":"1.22"}},
            "kingofthepitch":{"bgg":{"id":"329641","name":"king-pitch","rating":"5.3","duration":"30–45  Min","weight":"1.50"}},
            "kingoftokyo":{"bgg":{"id":"70323","name":"king-tokyo","rating":"7.2","duration":"30  Min","weight":"1.49"}},
            "kingsguild":{"bgg":{"id":"206327","name":"kings-guild","rating":"7.2","duration":"60–120  Min","weight":"2.41"}},
            "klaverjassen":{"bgg":{"id":"26468","name":"klaverjassen","rating":"7.1","duration":"75  Min","weight":"2.81"}},
            "koikoi":{"bgg":{"id":"11865","name":"koi-koi","rating":"6.6","duration":"15–30  Min","weight":"1.57"}},
            "koryo":{"bgg":{"id":"140535","name":"kory","rating":"6.6","duration":"10–20  Min","weight":"1.87"}},
            "kqj":{"bgg":{"id":"224381","name":"kqj","rating":"4.8","duration":"","weight":"0.00"}},
            "krosmasterarena":{"bgg":{"id":"112138","name":"krosmaster-arena","rating":"6.8","duration":"45–60  Min","weight":"2.67"}},
            "krosmasterblast":{"bgg":{"id":"256940","name":"krosmaster-blast","rating":"7.6","duration":"30  Min","weight":"2.00"}},
            "ladyschoice":{"bgg":{"id":"347086","name":"ladys-choice","rating":"5.1","duration":"10–30  Min","weight":"2.00"}},
            "lagranja":{"bgg":{"id":"146886","name":"la-granja","rating":"7.7","duration":"90–120  Min","weight":"3.58"}},
            "lama":{"bgg":{"id":"266083","name":"llm","rating":"6.5","duration":"20  Min","weight":"1.05"}},
            "ledernierpeuple":{"bgg":{"id":"189203","name":"le-dernier-peuple","rating":"4.7","duration":"15–30  Min","weight":"1.33"}},
            "lettertycoon":{"bgg":{"id":"169147","name":"letter-tycoon","rating":"6.8","duration":"30  Min","weight":"2.04"}},
            "lewisclark":{"bgg":{"id":"140620","name":"lewis-clark-expedition","rating":"7.5","duration":"120  Min","weight":"3.34"}},
            "libertalia":{"bgg":{"id":"125618","name":"libertalia","rating":"7.2","duration":"40–60  Min","weight":"2.24"}},
            "linesofaction":{"bgg":{"id":"3406","name":"lines-action","rating":"7.1","duration":"20  Min","weight":"2.72"}},
            "linkage":{"bgg":{"id":"41149","name":"linkage","rating":"6.6","duration":"10  Min","weight":"2.25"}},
            "liverpoolrummy":{"bgg":{"id":"40004","name":"contract-rummy","rating":"6.4","duration":"120  Min","weight":"1.85"}},
            "logger":{"bgg":{"id":"36985","name":"logger","rating":"5.9","duration":"30  Min","weight":"2.14"}},
            "lostcities":{"bgg":{"id":"50","name":"lost-cities","rating":"7.2","duration":"30  Min","weight":"1.49"}},
            "lostexplorers":{"bgg":{"id":"311918","name":"lost-explorers","rating":"5.7","duration":"40  Min","weight":"1.75"}},
            "loveletter":{"bgg":{"id":"233867","name":"welcome","rating":"7.6","duration":"25  Min","weight":"1.82"}},
            "lox":{"bgg":{"id":"156566","name":"lords-xidit","rating":"7.1","duration":"90  Min","weight":"2.62"}},
            "luckynumbers":{"bgg":{"id":"118247","name":"lucky-numbers","rating":"6.3","duration":"20  Min","weight":"1.05"}},
            "luxor":{"bgg":{"id":"245643","name":"luxor","rating":"7.2","duration":"45  Min","weight":"1.91"}},
            "machiavelli":{"bgg":{"id":"152359","name":"machiavelli","rating":"5.6","duration":"20  Min","weight":"1.71"}},
            "madeira":{"bgg":{"id":"95527","name":"madeira","rating":"7.6","duration":"60–150  Min","weight":"4.29"}},
            "mammalath":{"bgg":{"id":"281429","name":"mammalath","rating":"5.8","duration":"","weight":"1.00"}},
            "mapmaker":{"bgg":{"id":"252997","name":"mapmaker-gerrymandering-game","rating":"6.8","duration":"30–45  Min","weight":"1.50"}},
            "marcopolo":{"bgg":{"id":"171623","name":"voyages-marco-polo","rating":"7.8","duration":"40–100  Min","weight":"3.19"}},
            "marcopolotwo":{"bgg":{"id":"283948","name":"marco-polo-ii-service-khan","rating":"8.1","duration":"60–120  Min","weight":"3.37"}},
            "marrakech":{"bgg":{"id":"29223","name":"marrakech","rating":"6.7","duration":"30  Min","weight":"1.37"}},
            "marram":{"bgg":{"id":"287002","name":"marram","rating":"4.2","duration":"25–60  Min","weight":"0.00"}},
            "martiandice":{"bgg":{"id":"99875","name":"martian-dice","rating":"6.2","duration":"10  Min","weight":"1.07"}},
            "mascarade":{"bgg":{"id":"139030","name":"mascarade","rating":"6.6","duration":"30  Min","weight":"1.53"}},
            "mattock":{"bgg":{"id":"320505","name":"mattock","rating":"6.2","duration":"5–40  Min","weight":"2.50"}},
            "medina":{"bgg":{"id":"167270","name":"medina-second-edition","rating":"7.2","duration":"60  Min","weight":"2.33"}},
            "mercadodelisboaste":{"bgg":{"id":"262477","name":"mercado-de-lisboa","rating":"7.0","duration":"30–45  Min","weight":"2.09"}},
            "metromaniab":{"bgg":{"id":"23908","name":"metromania","rating":"5.8","duration":"45  Min","weight":"2.43"}},
            "mijnlieff":{"bgg":{"id":"72667","name":"mijnlieff","rating":"7.2","duration":"10  Min","weight":"1.70"}},
            "monsterfactory":{"bgg":{"id":"112598","name":"monster-factory","rating":"6.0","duration":"30  Min","weight":"1.16"}},
            "mrjack":{"bgg":{"id":"21763","name":"mr-jack","rating":"7.0","duration":"30  Min","weight":"2.18"}},
            "murusgallicus":{"bgg":{"id":"55131","name":"murus-gallicus","rating":"7.2","duration":"20  Min","weight":"2.92"}},
            "nangaparbat":{"bgg":{"id":"300305","name":"nanga-parbat","rating":"6.9","duration":"30  Min","weight":"2.00"}},
            "nautilus":{"bgg":{"id":"131616","name":"nautilus","rating":"6.1","duration":"25  Min","weight":"1.69"}},
            "neutreeko":{"bgg":{"id":"3319","name":"neutreeko","rating":"5.5","duration":"10  Min","weight":"2.00"}},
            "newfrontiers":{"bgg":{"id":"255692","name":"new-frontiers","rating":"7.6","duration":"45–75  Min","weight":"2.87"}},
            "niagara":{"bgg":{"id":"13308","name":"niagara","rating":"6.5","duration":"30–45  Min","weight":"1.83"}},
            "nicodemus":{"bgg":{"id":"334644","name":"nicodemus","rating":"6.2","duration":"45–60  Min","weight":"2.33"}},
            "nidavellir":{"bgg":{"id":"293014","name":"nidavellir","rating":"7.7","duration":"45  Min","weight":"2.15"}},
            "ninemensmorris":{"bgg":{"id":"3886","name":"nine-mens-morris","rating":"5.4","duration":"20  Min","weight":"1.83"}},
            "ninetynine":{"bgg":{"id":"6688","name":"ninety-nine","rating":"7.2","duration":"60  Min","weight":"2.12"}},
            "ninetynineaddition":{"bgg":{"id":"101420","name":"ninety-nine","rating":"4.7","duration":"20  Min","weight":"1.50"}},
            "nippon":{"bgg":{"id":"154809","name":"nippon","rating":"7.7","duration":"60–120  Min","weight":"3.79"}},
            "noirkvi":{"bgg":{"id":"102148","name":"noir-deductive-mystery-game","rating":"6.5","duration":"15–60  Min","weight":"1.62"}},
            "northwestpassage":{"bgg":{"id":"71074","name":"expedition-northwest-passage","rating":"7.0","duration":"60  Min","weight":"2.70"}},
            "notalone":{"bgg":{"id":"194879","name":"not-alone","rating":"7.0","duration":"30–45  Min","weight":"1.98"}},
            "nothanks":{"bgg":{"id":"12942","name":"no-thanks","rating":"7.1","duration":"20  Min","weight":"1.14"}},
            "numberdrop":{"bgg":{"id":"337784","name":"number-drop","rating":"6.2","duration":"20  Min","weight":"2.00"}},
            "nxs":{"bgg":{"id":"182274","name":"nxs","rating":"7.0","duration":"15–60  Min","weight":"2.00"}},
            "offtherails":{"bgg":{"id":"210008","name":"rails","rating":"6.4","duration":"30–60  Min","weight":"1.89"}},
            "ohhell":{"bgg":{"id":"1116","name":"oh-hell","rating":"6.8","duration":"30  Min","weight":"1.73"}},
            "ohseven":{"bgg":{"id":"84864","name":"insidious-sevens","rating":"6.3","duration":"30  Min","weight":"1.78"}},
            "onceuponaforest":{"bgg":{"id":"151467","name":"il-etait-une-foret","rating":"5.0","duration":"15  Min","weight":"1.50"}},
            "one":{"bgg":{"id":"325413","name":"one","rating":"5.2","duration":"10–180  Min","weight":"0.00"}},
            "onitama":{"bgg":{"id":"160477","name":"onitama","rating":"7.4","duration":"15–20  Min","weight":"1.69"}},
            "oriflamme":{"bgg":{"id":"287084","name":"oriflamme","rating":"7.2","duration":"15–30  Min","weight":"1.63"}},
            "origin":{"bgg":{"id":"127095","name":"origin","rating":"6.7","duration":"45–60  Min","weight":"2.15"}},
            "outlaws":{"bgg":{"id":"204504","name":"outlaws-last-man-standing","rating":"6.2","duration":"15–20  Min","weight":"1.86"}},
            "palace":{"bgg":{"id":"20528","name":"palace","rating":"6.0","duration":"20  Min","weight":"1.11"}},
            "pandemic":{"bgg":{"id":"30549","name":"pandemic","rating":"7.6","duration":"45  Min","weight":"2.41"}},
            "papayoo":{"bgg":{"id":"73365","name":"papayoo","rating":"6.1","duration":"30  Min","weight":"1.00"}},
            "parisconnection":{"bgg":{"id":"75358","name":"paris-connection","rating":"6.7","duration":"30  Min","weight":"1.81"}},
            "parks":{"bgg":{"id":"266524","name":"parks","rating":"7.8","duration":"30–60  Min","weight":"2.16"}},
            "patchwork":{"bgg":{"id":"163412","name":"patchwork","rating":"7.6","duration":"15–30  Min","weight":"1.63"}},
            "pedro":{"bgg":{"id":"6912","name":"cinch","rating":"6.3","duration":"60  Min","weight":"2.50"}},
            "penaltychallenge":{"bgg":{"id":"321928","name":"penalty-challenge","rating":"3.6","duration":"20–40  Min","weight":"1.00"}},
            "pennypress":{"bgg":{"id":"148205","name":"penny-press","rating":"6.5","duration":"45–60  Min","weight":"2.19"}},
            "pente":{"bgg":{"id":"1295","name":"pente","rating":"6.6","duration":"30  Min","weight":"2.11"}},
            "phat":{"bgg":{"id":"10789","name":"pitch","rating":"6.8","duration":"30  Min","weight":"1.77"}},
            "pi":{"bgg":{"id":"129050","name":"pi","rating":"6.7","duration":"45–60  Min","weight":"2.26"}},
            "piratenkapern":{"bgg":{"id":"117663","name":"piraten-kapern","rating":"6.3","duration":"30  Min","weight":"1.10"}},
            "polis":{"bgg":{"id":"69779","name":"polis-fight-hegemony","rating":"7.6","duration":"90–120  Min","weight":"3.69"}},
            "pontedeldiavolo":{"bgg":{"id":"27172","name":"ponte-del-diavolo","rating":"6.5","duration":"25  Min","weight":"2.36"}},
            "potionexplosion":{"bgg":{"id":"180974","name":"potion-explosion","rating":"7.1","duration":"30–45  Min","weight":"1.75"}},
            "president":{"bgg":{"id":"6748","name":"scum-food-chain-game","rating":"5.7","duration":"45  Min","weight":"1.36"}},
            "puertorico":{"bgg":{"id":"3076","name":"puerto-rico","rating":"8.0","duration":"90–150  Min","weight":"3.28"}},
            "pylos":{"bgg":{"id":"1419","name":"pylos","rating":"6.3","duration":"10  Min","weight":"1.96"}},
            "pyramidpoker":{"bgg":{"id":"213953","name":"pyramid-poker","rating":"6.6","duration":"10–30  Min","weight":"1.22"}},
            "quantik":{"bgg":{"id":"286295","name":"quantik","rating":"5.9","duration":"20  Min","weight":"1.60"}},
            "quantum":{"bgg":{"id":"143519","name":"quantum","rating":"7.3","duration":"60  Min","weight":"2.46"}},
            "quarto":{"bgg":{"id":"681","name":"quarto","rating":"6.9","duration":"20  Min","weight":"1.93"}},
            "queenskings":{"bgg":{"id":"279769","name":"queens-kings-checkers-game","rating":"4.3","duration":"30–90  Min","weight":"0.00"}},
            "quetzal":{"bgg":{"id":"300700","name":"quetzal","rating":"6.8","duration":"30–75  Min","weight":"2.09"}},
            "quinque":{"bgg":{"id":"255027","name":"quinque","rating":"5.4","duration":"10–20  Min","weight":"2.50"}},
            "quoridor":{"bgg":{"id":"624","name":"quoridor","rating":"6.7","duration":"15  Min","weight":"1.87"}},
            "raceforthegalaxy":{"bgg":{"id":"28143","name":"race-galaxy","rating":"7.8","duration":"30–60  Min","weight":"2.99"}},
            "rage":{"bgg":{"id":"568","name":"rage","rating":"6.2","duration":"45  Min","weight":"1.47"}},
            "railroadink":{"bgg":{"id":"245654","name":"railroad-ink-deep-blue-edition","rating":"7.3","duration":"20–30  Min","weight":"1.48"}},
            "railwaysoftheworld":{"bgg":{"id":"17133","name":"railways-world","rating":"7.7","duration":"120  Min","weight":"3.02"}},
            "rallymangt":{"bgg":{"id":"256589","name":"rallyman-gt","rating":"7.3","duration":"45–60  Min","weight":"2.24"}},
            "redsevengame":{"bgg":{"id":"161417","name":"red7","rating":"6.9","duration":"5–30  Min","weight":"1.69"}},
            "rememberwhen":{"bgg":{"id":"185769","name":"remember-when","rating":"6.1","duration":"30–60  Min","weight":"1.50"}},
            "resarcana":{"bgg":{"id":"262712","name":"res-arcana","rating":"7.7","duration":"20–60  Min","weight":"2.61"}},
            "restinpeace":{"bgg":{"id":"319680","name":"rest-peace","rating":"6.2","duration":"15  Min","weight":"1.60"}},
            "reversi":{"bgg":{"id":"2389","name":"othello","rating":"6.1","duration":"30  Min","weight":"2.09"}},
            "rolledwest":{"bgg":{"id":"280041","name":"rolled-west","rating":"6.1","duration":"20–30  Min","weight":"1.50"}},
            "rollforthegalaxy":{"bgg":{"id":"132531","name":"roll-galaxy","rating":"7.7","duration":"45  Min","weight":"2.77"}},
            "roomtwentyfive":{"bgg":{"id":"127024","name":"room-25","rating":"6.7","duration":"30  Min","weight":"1.93"}},
            "ruhr":{"bgg":{"id":"226254","name":"ruhr-story-coal-trade","rating":"6.9","duration":"120  Min","weight":"3.61"}},
            "russianrailroads":{"bgg":{"id":"144733","name":"russian-railroads","rating":"7.8","duration":"90–120  Min","weight":"3.41"}},
            "saboteur":{"bgg":{"id":"9220","name":"saboteur","rating":"6.6","duration":"30  Min","weight":"1.32"}},
            "saintpetersburg":{"bgg":{"id":"9217","name":"saint-petersburg","rating":"7.3","duration":"45–60  Min","weight":"2.47"}},
            "saintpoker":{"bgg":{"id":"251060","name":"saint-poker","rating":"6.1","duration":"10–20  Min","weight":"1.50"}},
            "santorini":{"bgg":{"id":"194655","name":"santorini","rating":"7.5","duration":"20  Min","weight":"1.73"}},
            "sapiens":{"bgg":{"id":"169649","name":"sapiens","rating":"6.4","duration":"45  Min","weight":"2.65"}},
            "schroedingerscats":{"bgg":{"id":"172235","name":"schrodingers-cats","rating":"5.7","duration":"10–30  Min","weight":"1.25"}},
            "seasons":{"bgg":{"id":"108745","name":"seasons","rating":"7.4","duration":"60  Min","weight":"2.77"}},
            "sechsnimmt":{"bgg":{"id":"432","name":"6-nimmt","rating":"6.9","duration":"45  Min","weight":"1.21"}},
            "secretmoon":{"bgg":{"id":"162660","name":"secret-moon","rating":"5.7","duration":"10  Min","weight":"1.18"}},
            "senet":{"bgg":{"id":"2399","name":"senet","rating":"5.8","duration":"30  Min","weight":"1.48"}},
            "senshi":{"bgg":{"id":"247143","name":"senshi","rating":"6.3","duration":"15–20  Min","weight":"1.89"}},
            "sevenwonders":{"bgg":{"id":"68448","name":"7-wonders","rating":"7.7","duration":"30  Min","weight":"2.33"}},
            "sevenwondersduel":{"bgg":{"id":"173346","name":"7-wonders-duel","rating":"8.1","duration":"30  Min","weight":"2.23"}},
            "sheepboombah":{"bgg":{"id":"259310","name":"sheep-boom-bah","rating":"5.6","duration":"20–30  Min","weight":"0.00"}},
            "siam":{"bgg":{"id":"20782","name":"siam","rating":"6.7","duration":"15  Min","weight":"2.16"}},
            "signorie":{"bgg":{"id":"177678","name":"signorie","rating":"7.4","duration":"90–120  Min","weight":"3.55"}},
            "similo":{"bgg":{"id":"268620","name":"similo","rating":"7.0","duration":"10–15  Min","weight":"1.07"}},
            "simplicity":{"bgg":{"id":"288254","name":"simplicity","rating":"6.3","duration":"20–40  Min","weight":"2.00"}},
            "skat":{"bgg":{"id":"6819","name":"skat","rating":"7.2","duration":"30  Min","weight":"3.07"}},
            "skull":{"bgg":{"id":"92415","name":"skull","rating":"7.2","duration":"15–45  Min","weight":"1.13"}},
            "smallislands":{"bgg":{"id":"236248","name":"small-islands","rating":"6.8","duration":"30  Min","weight":"2.04"}},
            "sobek":{"bgg":{"id":"67185","name":"sobek","rating":"6.7","duration":"40  Min","weight":"1.85"}},
            "sobektwoplayers":{"bgg":{"id":"332944","name":"sobek-2-players","rating":"7.2","duration":"10–30  Min","weight":"2.00"}},
            "solarstorm":{"bgg":{"id":"274037","name":"solar-storm","rating":"7.2","duration":"30–60  Min","weight":"2.03"}},
            "solo":{"bgg":{"id":"3347","name":"solo","rating":"5.3","duration":"30  Min","weight":"1.04"}},
            "solowhist":{"bgg":{"id":"13337","name":"whist","rating":"6.4","duration":"60  Min","weight":"2.03"}},
            "soluna":{"bgg":{"id":"131199","name":"soluna","rating":"5.3","duration":"10  Min","weight":"1.22"}},
            "spades":{"bgg":{"id":"592","name":"spades","rating":"6.8","duration":"60  Min","weight":"2.03"}},
            "sparts":{"bgg":{"id":"24778","name":"hearts-spades","rating":"6.0","duration":"","weight":"2.00"}},
            "splendor":{"bgg":{"id":"148228","name":"splendor","rating":"7.4","duration":"30  Min","weight":"1.80"}},
            "splits":{"bgg":{"id":"54137","name":"battle-sheep","rating":"6.6","duration":"15  Min","weight":"1.47"}},
            "spyrium":{"bgg":{"id":"137269","name":"spyrium","rating":"7.1","duration":"75  Min","weight":"2.90"}},
            "squadro":{"bgg":{"id":"245222","name":"squadro","rating":"6.5","duration":"20  Min","weight":"1.33"}},
            "starfluxx":{"bgg":{"id":"102104","name":"star-fluxx","rating":"6.4","duration":"10–40  Min","weight":"1.43"}},
            "steamworks":{"bgg":{"id":"143176","name":"steam-works","rating":"6.9","duration":"90–120  Min","weight":"3.17"}},
            "stirfryeighteen":{"bgg":{"id":"193122","name":"stir-fry-eighteen","rating":"6.2","duration":"5–12  Min","weight":"1.17"}},
            "stoneage":{"bgg":{"id":"34635","name":"stone-age","rating":"7.6","duration":"60–90  Min","weight":"2.47"}},
            "superfantasybrawl":{"bgg":{"id":"194517","name":"super-fantasy-brawl","rating":"7.8","duration":"30–40  Min","weight":"2.26"}},
            "sushigo":{"bgg":{"id":"133473","name":"sushi-go","rating":"7.0","duration":"15  Min","weight":"1.16"}},
            "tablut":{"bgg":{"id":"6121","name":"tablut","rating":"6.3","duration":"45  Min","weight":"2.50"}},
            "takaraisland":{"bgg":{"id":"150599","name":"takara-island","rating":"5.8","duration":"45  Min","weight":"1.67"}},
            "takenoko":{"bgg":{"id":"70919","name":"takenoko","rating":"7.3","duration":"45  Min","weight":"1.98"}},
            "taluva":{"bgg":{"id":"24508","name":"taluva","rating":"7.2","duration":"45  Min","weight":"2.27"}},
            "targi":{"bgg":{"id":"118048","name":"targi","rating":"7.6","duration":"60  Min","weight":"2.35"}},
            "tashkalar":{"bgg":{"id":"146278","name":"tash-kalar-arena-legends","rating":"7.2","duration":"30–60  Min","weight":"2.85"}},
            "teatime":{"bgg":{"id":"121015","name":"tea-time","rating":"5.9","duration":"15–30  Min","weight":"1.20"}},
            "teotihuacan":{"bgg":{"id":"229853","name":"teotihuacan-city-gods","rating":"7.9","duration":"90–120  Min","weight":"3.76"}},
            "terramystica":{"bgg":{"id":"120677","name":"terra-mystica","rating":"8.1","duration":"60–150  Min","weight":"3.96"}},
            "thatslife":{"bgg":{"id":"17240","name":"s-life","rating":"6.5","duration":"30  Min","weight":"1.31"}},
            "theboss":{"bgg":{"id":"85005","name":"boss","rating":"6.8","duration":"40  Min","weight":"1.79"}},
            "thebuilders":{"bgg":{"id":"144553","name":"builders-middle-ages","rating":"6.5","duration":"30  Min","weight":"1.80"}},
            "thebuildersantiquity":{"bgg":{"id":"161226","name":"builders-antiquity","rating":"6.7","duration":"30  Min","weight":"1.92"}},
            "thecrew":{"bgg":{"id":"284083","name":"crew-quest-planet-nine","rating":"8.0","duration":"20  Min","weight":"1.99"}},
            "thecrewdeepsea":{"bgg":{"id":"324856","name":"crew-mission-deep-sea","rating":"8.5","duration":"20  Min","weight":"2.13"}},
            "thejellymonsterlab":{"bgg":{"id":"142615","name":"jelly-monster-lab","rating":"4.4","duration":"45  Min","weight":"1.00"}},
            "thermopyles":{"bgg":{"id":"141019","name":"thermopyles","rating":"4.0","duration":"20  Min","weight":"1.27"}},
            "thirteenclues":{"bgg":{"id":"208766","name":"13-clues","rating":"6.7","duration":"30  Min","weight":"1.89"}},
            "throughtheages":{"bgg":{"id":"25613","name":"through-ages-story-civilization","rating":"7.9","duration":"120  Min","weight":"4.18"}},
            "throughtheagesnewstory":{"bgg":{"id":"182028","name":"through-ages-new-story-civilization","rating":"8.4","duration":"120  Min","weight":"4.41"}},
            "thurnandtaxis":{"bgg":{"id":"21790","name":"thurn-and-taxis","rating":"7.1","duration":"60  Min","weight":"2.26"}},
            "tichu":{"bgg":{"id":"215","name":"tichu","rating":"7.6","duration":"60  Min","weight":"2.34"}},
            "tiki":{"bgg":{"id":"214910","name":"tiki","rating":"6.1","duration":"10–20  Min","weight":"2.13"}},
            "timemasters":{"bgg":{"id":"148759","name":"time-masters","rating":"6.3","duration":"35  Min","weight":"2.55"}},
            "tobago":{"bgg":{"id":"42215","name":"tobago","rating":"7.1","duration":"60  Min","weight":"2.13"}},
            "toc":{"bgg":{"id":"98426","name":"super-tock-6","rating":"5.6","duration":"45  Min","weight":"0.00"}},
            "toeshambo":{"bgg":{"id":"258723","name":"toeshambo","rating":"5.2","duration":"5–10  Min","weight":"1.00"}},
            "tokaido":{"bgg":{"id":"123540","name":"tokaido","rating":"7.0","duration":"45  Min","weight":"1.75"}},
            "tournay":{"bgg":{"id":"105037","name":"tournay","rating":"7.0","duration":"30–60  Min","weight":"2.90"}},
            "tranquility":{"bgg":{"id":"288513","name":"tranquility","rating":"7.0","duration":"15–20  Min","weight":"1.55"}},
            "trekkingtheworld":{"bgg":{"id":"300442","name":"trekking-world","rating":"7.1","duration":"30–60  Min","weight":"1.86"}},
            "trektwelve":{"bgg":{"id":"303672","name":"trek-12-himalaya","rating":"7.0","duration":"15–30  Min","weight":"1.38"}},
            "trickoftherails":{"bgg":{"id":"118497","name":"trick-rails","rating":"6.6","duration":"20  Min","weight":"2.30"}},
            "troyes":{"bgg":{"id":"73439","name":"troyes","rating":"7.8","duration":"90  Min","weight":"3.47"}},
            "troyesdice":{"bgg":{"id":"284584","name":"troyes-dice","rating":"7.2","duration":"20–30  Min","weight":"2.33"}},
            "turnthetide":{"bgg":{"id":"1403","name":"turn-tide","rating":"6.8","duration":"30  Min","weight":"1.52"}},
            "twintinbots":{"bgg":{"id":"126239","name":"twin-tin-bots","rating":"6.3","duration":"50  Min","weight":"2.41"}},
            "tzolkin":{"bgg":{"id":"126163","name":"tzolk-mayan-calendar","rating":"7.9","duration":"90  Min","weight":"3.67"}},
            "ultimaterailroads":{"bgg":{"id":"329591","name":"ultimate-railroads","rating":"8.4","duration":"90–120  Min","weight":"3.45"}},
            "unclechestnuttablegype":{"bgg":{"id":"66643","name":"uncle-chestnuts-table-gype","rating":"6.1","duration":"30  Min","weight":"2.00"}},
            "unconditionalsurrender":{"bgg":{"id":"61487","name":"unconditional-surrender-world-war-2-europe","rating":"8.2","duration":"60–3000  Min","weight":"3.73"}},
            "unitedsquare":{"bgg":{"id":"119316","name":"united-square","rating":"5.3","duration":"15  Min","weight":"1.71"}},
            "uptown":{"bgg":{"id":"29073","name":"blockers","rating":"6.7","duration":"30–40  Min","weight":"1.70"}},
            "veggiegarden":{"bgg":{"id":"211533","name":"veggie-garden","rating":"5.9","duration":"20–30  Min","weight":"1.33"}},
            "veletas":{"bgg":{"id":"151224","name":"veletas","rating":"6.5","duration":"45  Min","weight":"2.00"}},
            "veronatwist":{"bgg":{"id":"255029","name":"verona-twist","rating":"6.4","duration":"20–30  Min","weight":"1.67"}},
            "viamagica":{"bgg":{"id":"300936","name":"magica","rating":"6.8","duration":"30  Min","weight":"1.33"}},
            "viticulture":{"bgg":{"id":"128621","name":"viticulture","rating":"7.6","duration":"90  Min","weight":"2.93"}},
            "vultureculture":{"bgg":{"id":"150754","name":"vulture-culture","rating":"5.1","duration":"45  Min","weight":"0.00"}},
            "welcometo":{"bgg":{"id":"233867","name":"welcome","rating":"7.6","duration":"25  Min","weight":"1.82"}},
            "welcometonewlasvegas":{"bgg":{"id":"281075","name":"welcome-new-las-vegas","rating":"7.0","duration":"35  Min","weight":"2.94"}},
            "werewolves":{"bgg":{"id":"25821","name":"werewolves-millers-hollow","rating":"6.7","duration":"30  Min","weight":"1.32"}},
            "whisttwentytwo":{"bgg":{"id":"75668","name":"whist-22","rating":"6.2","duration":"20  Min","weight":"1.33"}},
            "wizard":{"bgg":{"id":"245654","name":"railroad-ink-deep-blue-edition","rating":"7.3","duration":"20–30  Min","weight":"1.48"}},
            "xiangqi":{"bgg":{"id":"2393","name":"xiangqi","rating":"7.1","duration":"60  Min","weight":"3.59"}},
            "yatzy":{"bgg":{"id":"2243","name":"yahtzee","rating":"5.4","duration":"30  Min","weight":"1.19"}},
            "yinyang":{"bgg":{"id":"5236","name":"yin-yang","rating":"5.2","duration":"20  Min","weight":"0.00"}},
            "yokai":{"bgg":{"id":"269146","name":"ykai","rating":"6.8","duration":"15–35  Min","weight":"1.61"}},
            "yokohama":{"bgg":{"id":"196340","name":"yokohama","rating":"7.8","duration":"90  Min","weight":"3.28"}},
            "zener":{"bgg":{"id":"248430","name":"zener","rating":"5.5","duration":"10–15  Min","weight":"0.00"}},
            "zola":{"bgg":{"id":"331666","name":"zola","rating":"4.9","duration":"","weight":"2.00"}}
            }`),

        // Main entry point
        run: function() {
            // Get our local storage data
            var localData = window.localStorage.getItem('bga');
            if (localData) {
                try {
                    this.myData = JSON.parse(localData);
                    jQuery.extend(this.bgaSourceData, this.myData);
                } catch (e) {
                    console.log('Local Storage for bga is corrupt. Resetting.',localData);
                    this.myData = this.bgaSourceData;
                }
            } else {
                this.myData = this.bgaSourceData;
            }

            // We mark up BGA
            if (window.location.href.match(/boardgamearena.com\/gamelist/)) {
                this.waitForBga();
                return;
            }
            // Which may link us through to BGG's search
            if (window.location.href.match(/boardgamegeek.com\/geeksearch.php/)) {
                this.grabBGAhash();
                return;
            }
            // We then open a detail page
            if (window.location.href.match(/boardgamegeek.com/)) {
                this.grabBGAhash();
                this.waitForBgg();
                return;
            }
            // And link back to BGA
            if (window.location.href.match(/boardgamearena.com\/gamepanel/)) {
                this.waitforBgaGamePanel();
            }
        },
        grabBGAhash: function() {
            var hash = window.location.hash;
            var matches = hash.match(/#bgaid=(.*)&bganame=(.*)$/);
            if (!matches) return;
            this.myData.target = {
                id: decodeURIComponent(matches[1]),
                name: decodeURIComponent(matches[2])
            }
            this.save();
        },
        save: function() {
            window.localStorage.setItem('bga',JSON.stringify(this.myData));
        },
        linktoBga: function() {
            console.log('linking to BGA');
            var rating = jQuery(this.gameHeaderBody).find('.rating-overall-callout span.ng-binding')[0];
            rating = jQuery.trim(rating.innerHTML);
            var duration = jQuery(this.gameHeaderBody).find("[min='::geekitemctrl.geekitem.data.item.minplaytime']").parent().text().trim();
            var weight = jQuery(this.gameHeaderBody).find("[item-poll-button='boardgameweight'] span").first().text().trim();
            var matches = window.location.href.match(/boardgamegeek.com\/boardgame\/([\d]+)\/([^#]*)(#.*)?$/);
            var id = matches[1];
            var name = matches[2];
            var aAttributes = {
                'id':id,
                'name':name,
                'rating':rating,
                'duration':duration,
                'weight':weight,
            };
            console.log(aAttributes);
            var attributes = jQuery.map(Object.keys(aAttributes), function(entry,index) {
                return entry+'='+aAttributes[entry];
            });
            // Now that we have linked the data, drop the button
            var bgaid = this.myData.target.id;
            this.myData.target = {};
            this.save();
            window.location.href = [
                'https://boardgamearena.com/gamepanel?game=',bgaid,'#',
                attributes.join('&')
            ].join('');
        },
        waitForBgg: function() {
            console.log('wait for BGG');
            var self = this;
            this.waitForKeyElements(".game-header-body", function(node) {
                console.log('Waited for',node);
                var gameHeaderBody = node[0];
                self.gameHeaderBody = gameHeaderBody;

                jQuery(gameHeaderBody).prepend(['<div style="margin:25px 5px">',
                                                '<button class="bgaLinkButton btn btn-xs btn-white" title="Store the attributes about this game, in your browsers local storage, connected to ',self.myData.target.name,' on Board Game Arena.">Link to BGA\'s ',self.myData.target.name,'</button>',
                                                ' BGA\'s <a style="color:#fff" href="https://boardgamearena.com/gamepanel?game=',self.myData.target.id,'">',self.myData.target.name,'</a>',
                                                '</div>'].join(''));
                jQuery(gameHeaderBody).find('.bgaLinkButton').click(function() {
                    self.linktoBga();
                });
            });
        },
        waitForBga: function() {
            var self = this;
            this.waitForKeyElements("#gamelist_itemrow_inner_all", function(node) {
                console.log('Waited for',node);
                var gamelist = node[0];
                var games = jQuery(gamelist).find('div.gamelist_item')
                console.log('Found',games.length,'games');

                // Go through each game and annotate
                jQuery.each(games,function(index, game) {
                    self.annotateGame(game);
                });
                self.applyFilters();

                // Add in our filter
                var bggFilter = [
                    '<div class="col-md-2" id="col_filter_bgg_rating">',
                    '	<div class="row-data row-data-smallwidth" style="border-bottom: none;">',
                    '		<div class="row-label">',
                    '			<i class="fa fa-lightbulb-o" aria-hidden="true"></i>',
                    '			BGG Rating',
                    '		</div>',
                    '		<div class="row-value">',
                    '			<select id="filter_bgg_rating">',
                    '				<option value="0">Any</option>',
                    '				<option value="6">Ok (6+)</option>',
                    '				<option value="7">Better (7+)</option>',
                    '				<option value="7.5">Good (7.5+)</option>',
                    '				<option value="8">Excellent (8+)</option>',
                    '			</select>',
                    '		</div>',
                    '	</div>',
                    '	<div class="row-data row-data-smallwidth" style="border-bottom: none;">',
                    '		<div class="row-label">',
                    '			<i class="fa fa-lightbulb-o" aria-hidden="true"></i>',
                    '			BGG Weight',
                    '		</div>',
                    '		<div class="row-value">',
                    '			<select id="filter_bgg_weight">',
                    '				<option value="0">All</option>',
                    '				<option value="1.5">Trivial (1.5+)</option>',
                    '				<option value="2">Ok (2+)</option>',
                    '				<option value="2.5">Hard (2.5+)</option>',
                    '				<option value="3">Heavy (3+)</option>',
                    '			</select>',
                    '		</div>',
                    '	</div>',
                    '</div>'].join('');
                jQuery(bggFilter).insertAfter('#col_filter_complexity');
                if (self.myData.filters && self.myData.filters.rating) {
                    jQuery(['#filter_bgg_rating option[value="',self.myData.filters.rating,'"]'].join('')).attr('selected',true);
                }
                if (self.myData.filters && self.myData.filters.weight) {
                    jQuery(['#filter_bgg_weight option[value="',self.myData.filters.weight,'"]'].join('')).attr('selected',true);
                }

                jQuery('#filter_bgg_rating').on('change',function() {
                    self.changeFilters();
                    self.applyFilters();
                });

                jQuery('#filter_bgg_weight').on('change',function() {
                    self.changeFilters();
                    self.applyFilters();
                });

                jQuery('#col_filter_more_filter').width('30px');

                // Update our local storage
                self.save();
            });
        },
        changeFilters: function() {
            var bggRatingOption = jQuery('#filter_bgg_rating').find('option').filter(function(index,option) {
                return option.selected;
            })
            var bggRating = bggRatingOption[0].value;
            var bggWeightOption = jQuery('#filter_bgg_weight').find('option').filter(function(index,option) {
                return option.selected;
            })
            var bggWeight = bggWeightOption[0].value;
            if (!this.myData.filters) {
                this.myData.filters = {}
            }
            this.myData.filters.rating = bggRating;
            this.myData.filters.weight = bggWeight;
            this.save();
        },
        applyFilters: function() {
            var self = this;
            var games = jQuery('#gamelist_itemrow_inner_all').find('div.gamelist_item')
            var filters = self.myData.filters;
            if (!filters) return;
            console.log('Found',games.length,'games');

            // Go through each game and annotate
            jQuery.each(games,function(index, game) {
                var anchor = jQuery(game).children('a')[0].href;
                var matches = anchor.match(/gamepanel\?game=(.*)$/);
                if (!matches) return;
                var gameid = matches[1];
                if (!self.myData[gameid]) return;
                var myData = self.myData[gameid];
                if (!myData.bgg) return;

                var visible = true;
                if (filters.rating) {
                    if (myData.bgg.rating) {
                        if (myData.bgg.rating < filters.rating) {
                            visible = false;
                        }
                    }
                }
                if (filters.weight) {
                    if (myData.bgg.weight) {
                        if (myData.bgg.weight < filters.weight) {
                            visible = false;
                        }
                    }
                }
                if (!visible) {
                    jQuery(game).hide();
                } else {
                    jQuery(game).show();
                }
            });
        },
        openBgg: function(gameid) {
            return;
            console.log('Open Bgg',gameid,this.myData[gameid].name);
            this.myData.targetGame = gameid;
            window.localStorage.setItem('bga',JSON.stringify(this.myData));
        },
        annotateGame: function(game) {
            var self = this;
            var anchor = jQuery(game).children('a')[0].href;
            var matches = anchor.match(/gamepanel\?game=(.*)$/);
            if (!matches) return;
            var gameid = matches[1];
            var gameName = jQuery(game).find('div.gamename')[0].innerHTML;
            gameName = jQuery.trim(gameName);
            var myData = this.myData[gameid];
            if (!myData) {
                myData = {};
                delete this.myData[gameid];
            }

            // Annotate.
            //console.log('Found game:',gameid,gameName,game);
            jQuery(game).css('height','285px');
            jQuery(game).find('.gamename').css('height', '2rem');
            var content = ['<div><span title="The BGG rating. If not yet set, search for it and use the &quot;Link to BGA&quot; buttons added by this TampleMonkey script">Rating: ',bgg ? bgg.rating : '?','</span></div>'].join('');
            var bgglink = ['https://boardgamegeek.com/geeksearch.php?action=search&q=',encodeURIComponent(gameName),'&objecttype=boardgame#bgaid=',gameid,'&bganame=',gameName].join('');

            if (myData.bgg) {
                var bgg = myData.bgg;
                bgglink = ['https://boardgamegeek.com/boardgame/',bgg.id,'/',bgg.name,'#bgaid=',gameid,'&bganame=',gameName].join('');
                content = ['<div style="text-align:right;font-weight:bold">',
                           '<div title="The rating out of 10. Anything above 7 will be ok. 8+ is exceptional"><span style="font-weight:normal">Rating:</span>',bgg.rating,'</div>',
                           '<div>',bgg.duration,'</div>',
                           '<div title="The weight is out of 5. Anything above 3 will be &quot;interesting&quot;"><span style="font-weight:normal">Weight:</span>',bgg.weight,'</div>',
                           '</div>'
                ].join('');
                console.log(gameid,bgg);
            }

            jQuery(game).append(['<div style="padding:10px;display:flex;justify-content:space-between;background:#3f3a60;padding:15px;color:white;align-items:center">',
                                 // The raw image is 80x38.
                                 '<a href="',bgglink,'" title="Open/Search in Board Game Geek"><img src="https://cf.geekdo-static.com/images/logos/navbar-logo-bgg-b2.svg" style="margin-bottom:0;width:40px;height:19px"></a>',
                                 content,
                                 '</div>'].join(''));

            jQuery(game).find('.bggLink').click(function() {
                self.openBgg(gameid);
            });
        },
        waitforBgaGamePanel: function() {
            // Get the BGA id from the url
            var matches = window.location.href.match(/gamepanel\?game=([^#.]*)#?/);
            if (!matches) return;
            var gameid = matches[1];
            // Get the BGG data from the hash fragment
            var hash = window.location.hash;
            var bgg = {}
            if (hash) {
                jQuery.each(window.location.hash.substring(1).split('&'), function(index, attribute) {
                    var tokens = attribute.split('=');
                    bgg[tokens[0]] = decodeURIComponent(tokens[1]);
                });
                console.log('Extracted',bgg);
                this.myData[gameid] = {};
                this.myData[gameid].bgg = bgg;
            } else {
                bgg = this.myData[gameid].bgg || {};
            }
            var target = jQuery('#game_name').parent().closest('div').closest('div');
            var bgglink = ['https://boardgamegeek.com/boardgame/',bgg.id,'/',bgg.name].join('');
            target.append([
                '<div style="font-weight: bold; position: relative; padding-left: 0px; line-height: 1.8em;background:#3f3a60;padding:15px;color:white;display:flex;justify-content:space-between;align-items:center">',
                '<a href="',bgglink,'"><img src="https://cf.geekdo-static.com/images/logos/navbar-logo-bgg-b2.svg" style="margin-bottom:0"></a>',
                '<div>',bgg.duration,'</div>',
                '<div><span style="font-weight:normal">Rating:</span>',bgg.rating,'/10</div>',
                '<div><span style="font-weight:normal">Weight:</span>',bgg.weight,'/5</div>',
                '</div>'
            ].join(''));
            this.save();
            return;
        },
        // State for the wait loop
        waitControlObj: {},
        // A utility function, for Greasemonkey scripts
        // Derived from https://gist.github.com/raw/2625891/waitForKeyElements.js
        // selectorTxt: Required: The jQuery selector string that specifies the desired element(s).
        // actionFunction: Required: The code to run when elements are found. It is passed a jNode to the matched element.
        // bWaitOnce: Optional: If false, will continue to scan for new elements even after the first match is found.
        // iframeSelector: Optional: If set, identifies the iframe to search.
        waitForKeyElements: function(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
            var self = this;
            // Look for target notes in the given scope, of the given iFrame
            var targetNodes = null;
            if (typeof iframeSelector == "undefined") {
                targetNodes = jQuery(selectorTxt);
            } else {
                targetNodes = jQuery(iframeSelector).contents().find(selectorTxt);
            }

            // If we found nodes
            var btargetsFound = false;
            if (targetNodes && targetNodes.length > 0) {
                // Go through each and act if they are new.
                btargetsFound = true;
                targetNodes.each(function () {
                    var jThis = jQuery(this);
                    // If we have found this already, then skip it.
                    var alreadyFound = jThis.data('alreadyFound') || false;
                    if (alreadyFound) return;
                    // Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound) {
                        // If they have asked us to stop, then record this.
                        btargetsFound = false;
                        return;
                    }
                    // Record that we have found it, so we don't call it again.
                    jThis.data('alreadyFound', true);
                });
            }

            // Get the timer-control variable for this selector.
            var controlObj = this.waitControlObj;
            var controlKey = selectorTxt.replace(/[^\w]/g, "_");
            var timeControl = controlObj[controlKey];

            // If we found targets, and have already started a timer, and were told to only wait once
            // Now set or clear the timer as appropriate.
            if (btargetsFound && bWaitOnce && timeControl) {
                // Then stop the existing timer
                clearInterval(timeControl);
                delete controlObj[controlKey]
            } else {
                // Set a timer, if needed.
                if (!timeControl) {
                    timeControl = setInterval(function () {
                        self.waitForKeyElements(selectorTxt, actionFunction, bWaitOnce,iframeSelector);
                    },300);
                    controlObj[controlKey] = timeControl;
                }
            }
            this.waitControlObj = controlObj;
        }
    }
}

(function() {
    'use strict';

    var engine = new annotator();
    engine.run();
})();
