// ==UserScript==
// @name         BGA/BGG connector
// @namespace    https://boardgamearena.com/gamelist*
// @version      1.0
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
        // Main entry point
        run: function() {
            // Get our local storage data
            var localData = window.localStorage.getItem('bga');
            if (localData) {
                try {
                    this.myData = JSON.parse(localData);
                } catch (e) {
                    console.log('Local Storage for bga is corrupt. Resetting.',localData);
                    this.myData = {};
                }
            }

            // We mark up BGA
            if (window.location.href.match(/boardgamearena.com\/gamelist/)) {
                this.waitForBga();
                return;
            }
            // Which may link us through to BGG's search
            if (window.location.href.match(/boardgamegeek.com\/geeksearch.php/)) {
                var hash = window.location.hash;
                var matches = hash.match(/#bgaid=(.*)&bganame=(.*)$/);
                if (!matches) return;
                this.myData.target = {
                    id: decodeURIComponent(matches[1]),
                    name: decodeURIComponent(matches[2])
                }
                this.save();
                return;
            }
            // We then open a detail page
            if (window.location.href.match(/boardgamegeek.com/)) {
                this.waitForBgg();
                return;
            }
            // And link back to BGA
            if (window.location.href.match(/boardgamearena.com\/gamepanel/)) {
                this.waitforBgaGamePanel();
            }
        },
        save: function() {
            window.localStorage.setItem('bga',JSON.stringify(this.myData));
        },
        linktoBga: function() {
            console.log('linking to BGA');
            var rating = jQuery(this.gameHeaderBody).find('.rating-overall-callout span.ng-binding')[0];
            rating = jQuery.trim(rating.innerHTML);
            var matches = window.location.href.match(/boardgamegeek.com\/boardgame\/([\d]+)\/(.*)$/);
            var id = matches[1];
            var name = matches[2];
            console.log('Rating',rating,id,name);
            window.location.href = [
                'https://boardgamearena.com/gamepanel?game=',this.myData.target.id,'#',
                'rating=',rating,
                '&bggid=',id,
                '&bggname=',name].join('');
        },
        waitForBgg: function() {
            console.log('wait for BGG');
            var self = this;
            this.waitForKeyElements(".game-header-body", function(node) {
                console.log('Waited for',node);
                var gameHeaderBody = node[0];
                self.gameHeaderBody = gameHeaderBody;

                jQuery(gameHeaderBody).prepend(['<div style="margin:25px 5px">',
                                                '<button class="bgaLinkButton btn btn-xs btn-white">Link to BGA\'s ',self.myData.target.name,'</button>',
                                                ' Link to BGA\'s <a style="color:#fff" href="https://boardgamearena.com/gamepanel?game=',self.myData.target.id,'">',self.myData.target.name,'</a>',
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

                // Go through each game
                jQuery.each(games,function(index, game) {
                    self.annotateGame(game);
                });

                // Update our local storage
                self.save();
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
            var gameName = jQuery(game).find('.gamename')[0].innerHTML;
            gameName = jQuery.trim(gameName);
            var myData = this.myData[gameid];
            if (!myData) {
                myData = {name: gameName};
                this.myData[gameid] = myData;
            }

            // Annotate.
            //console.log(game);
            jQuery(game).css('height','255px');
            var bgglink = ['https://boardgamegeek.com/geeksearch.php?action=search&q=',encodeURIComponent(gameName),'&objecttype=boardgame#bgaid=',gameid,'&bganame=',gameName].join('');
            if (myData.bgg) {
                bgglink = ['https://boardgamegeek.com/boardgame/',myData.bgg.id,'/',myData.bgg.name].join('');
            }

            jQuery(game).append(['<div style="padding:10px;display:flex;justify-content:space-between">',
                                 '<a class="bggLink" href="',bgglink,'" title="Open/Search in Board Game Geek">BGG</a>',
                                 '<span title="The BGG rating. If not yet set, search for it and use the &quot;Link to BGA&quot; buttons added by this TampleMonkey script">Rating: ',myData.bgg ? myData.bgg.rating : '?','</span>',
                                 '</div>'].join(''));
            console.log(gameid,myData);

            jQuery(game).find('.bggLink').click(function() {
                self.openBgg(gameid);
            });
        },
        waitforBgaGamePanel: function() {
            // Get the BGA id from the url
            var matches = window.location.href.match(/gamepanel\?game=(.*)#/);
            if (!matches) return;
            var gameid = matches[1];
            // Get the BGG data from the hash fragment
            var hash = window.location.hash;
            matches = hash.match(/#rating=(.*)&bggid=(.*)&bggname=(.*)$/);
            if (!matches) return;
            var bgg = {
                id: decodeURIComponent(matches[2]),
                name: decodeURIComponent(matches[3]),
                rating: matches[1]
            }
            this.myData[gameid].bgg = bgg;
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