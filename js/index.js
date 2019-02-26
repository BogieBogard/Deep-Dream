console.clear();

/**
 * Choose Your Own Adventure-style data structure.
 *
 * Works on the principle of 'entries'/'chapters', like the oldschool 'turn to 100'
 * style Fighting Fantasy gamebooks - this is *not* a proper text adventure engine 
 * with full location, inventory and state management. It could probably be adapted
 * to that quite easily, though.
 *
 * Definition format:
 *
 * Content:
 * - id: unique string ID for use in 'goto'/'next'.
 * - text: body text for this entry.
 * - extra: array of additional paragraphs:
 *      - text: text for this paragraph
 *      - requires: string/array of item(s) required for this paragraph
 *                  to be included.  Use '!itemname' to invert logic.
 *
 * Inventory / state:
 * - gives: string/array of item(s) gained when entry is visited
 * - takes: string/array of item(s) lost when entry is visited
 * - gameover: if 'win' or 'lose', changes game state when entry is visited
 *
 * Navigation (ONE of the following):
 * - next: id of next entry (will convert to a single 'Continue...' option)
 * - options: array of options for this entry:
 *      - text: text used for option
 *      - goto: id of entry this option leads to
 *      - requires: string/array of item(s) required for this option
 *                  to be available.  Use '!itemname' to invert logic.
 * 
 **/

var ENTRIES = [{
        // Recreation room
        id: 'e_recroom',
        text: 'An Interactive Digital Story',
        extra: [{
            requires: '!mask',
            text: ''
        }],
        options: [{
            text: 'Start From the Beginning',
            goto: 'e_plushie',
            requires: '!mask'
        }, {
            text: 'Enter Chapter Code to Skip Ahead',
            goto: 'e_hall'
        }],
        start: true
    }, {
        // Look at the plushie
        id: 'e_plushie',
        text: 'Upon closer inspection, the toy is actually a large Winnie The Pooh plushie - ' +
            'slightly beat-up, but still soft.  However, its head is completely covered by a ' +
            'macabre latex mask that looks part human, part pig.  The mask is tightly affixed ' +
            'and can not be pulled off the toy, despite your efforts.',
        options: [{
            text: 'Cut the mask off the toy.',
            requires: 'scissors',
            goto: 'e_got_mask'
        }, {
            text: 'Head into the main atrium.',
            goto: 'e_hall'
        }]
    }, {
        // Get the mask off the plushie
        id: 'e_got_mask',
        text: 'By making a cut in the back of the latex mask, you are able to remove it from the plushie. ' +
            'The squashed facial features of Pooh stare back at you.  You don\'t feel like carrying him around, ' +
            'so you leave him back on his chair and head out into the atrium.',
        gives: 'mask',
        takes: 'scissors',
        next: 'e_hall'
    }, {
        // Main atrium
        id: 'e_hall',
        text: 'You stand in the main atrium of the studio. ' +
            'At the end of the room is a large, secure-looking double-door with curious red LEDs surrounding ' +
            'it.  There is a security camera pointing down from above the door.  A metal stairway leads up to ' +
            'a mezzanine.  There is a recreation room nearby.',
        options: [{
            text: 'Put the mask on and approach the main door.',
            requires: 'mask',
            goto: 'e_door_mask'
        }, {
            text: 'Approach the main door.',
            goto: 'e_door_nomask'
        }, {
            text: 'Investigate the upstairs area.',
            goto: 'e_upstairs'
        }, {
            text: 'Move into the rec area.',
            goto: 'e_recroom'
        }],
    }, {
        // Put on mask and use the main door
        id: 'e_door_mask',
        text: 'You pull the latex mask over your head.  It feels stuffy and tight, but after some adjustments ' +
            'you are able to see and breathe okay.  You approach the security door as the camera pings into ' +
            'life, scanning your features.  You tense as seconds pass.  To your relief, you hear a bright ' +
            '*ping* sound as the red LEDs fade and the electronic lock deactivates.  You grab the door ' +
            'handle and push your way out of the studio into a car park.  The door slams and re-locks behind you.',
        next: 'e_outside'
    }, {
        // Killed by the laser door
        id: 'e_door_nomask',
        text: 'Nearing the door, you are startled by a loud beep from the security camera as it pivots towards you. ' +
            'For a moment it scans your face, before an even louder alarm starts to blare around the studio.  You ' +
            'barely have a second to register the blinding light from the LEDs before an array of lasers blasts forth ' +
            'from the door frame, blowing you into a hundred smouldering chunks of various sizes.',
        gameover: 'lose'
    }, {
        // Upstairs
        id: 'e_upstairs',
        text: 'The mezzanine area contains a row of desks with powered-down laptops, and ageing computer chairs ' +
            'carelessly lying around.',
        extra: [{
            text: 'An overflowing desk tidy sits on the desk nearest to you.',
            requires: '!scissors'
        }],
        options: [{
            text: 'Check out the nearest desk.',
            requires: '!scissors',
            goto: 'e_get_scissors'
        }, {
            text: 'Head back downstairs.',
            goto: 'e_hall'
        }]
    }, {
        // Found the scissors
        id: 'e_get_scissors',
        text: 'Picking through the pens, pencils and paperclips in the desk tidy, you spot a small pair ' +
            'of safety scissors.  With nothing else but unusable computers around, you decide to head ' +
            'back downstairs.',
        gives: 'scissors',
        next: 'e_hall'
    }, {
        // Outside
        id: 'e_outside',
        text: 'The car park is rain-soaked and empty, save for a racing motorbike parked in front of ' +
            'the studio. Across the car park is an office building, the door slightly ajar.',
        options: [
            {
                text: 'Check out the bike.',
                requires: '!keys',
                goto: 'e_bike'
            },
            {
                text: 'Drive away on the bike.',
                requires: 'keys',
                goto: 'e_complete'
            },
            {
                text: 'Enter the office building.',
                goto: 'e_office'
            }
        ]
    }, {
        // Bike
        id: 'e_bike',
        text: 'The bike is medium-powered but in good condition - definitely roadworthy. The key is missing.',
        next: 'e_outside'
    },{
      // Office
        id: 'e_office',
        text: 'You are in a dimly-lit office where the tables and floor are strewn with empty liquor bottles, ' +
                'glasses and other party detritus.  At the back of the room is a kitchen.  A rickety metal stairway ' +
                'leads up to the second floor.',
        extra: [
            {
                text: 'A large figure is slumped on a chair in the corner. They are wearing a shirt and tie, and have ' +
                        'a grim latex mask, similar to your own, on their head.  The mask resembles a humanoid sheep. ' +
                        'The figure appears to be asleep or unconscious.',
                requires: '!keys'
            }
        ],
        options: [
            {
                text: 'Sneak past the figure to the kitchen area.',
                requires: '!keys',
                goto: 'e_kitchen'
            },
            {
                text: 'Head up the metal stairway.',
                requires: '!keys',
                goto: 'e_sheep_wake_stairs'
            },
            {
                text: 'Head up the metal stairway.',
                requires: 'keys',
                goto: 'e_office_upstairs'
            },
            {
                text: 'Leave the office.',
                goto: 'e_outside'
            }
        ]
    }, {
      // Office upstairs
        id: 'e_office_upstairs',
        text: 'You noisily creak your way up the metal staircase, but when you reach the top, you find yourself ' +
            'staring at an empty room.  This space must be unused.  Disappointed, you trudge back downstairs.',
        next: 'e_office'
    },{
        // Kitchen
        id: 'e_kitchen',
        text: 'The kitchen area is a disaster zone - glasses, bottles and rubbish everywhere. ' +
            'Amongst the carnage you see a piece of stale carrot cake, and a large, half-empty bottle of ' +
            'water.',
        options: [
            {
                text: 'Offer the cake to the sheep person.',
                goto: 'e_sheep_cake'
            },
            {
                text: 'Provide the sheep person with some water.',
                goto: 'e_sheep_water'
            },
            {
                text: 'Leave the kitchen area.',
                goto: 'e_office'
            }
        ]
    }, {
      // Sheep likes cake
        id: 'e_sheep_cake',
        text: 'You carefully gather up the cake and return to the masked figure. Slowly, you reach out ' +
            'and touch him on the shoulder.  The sheep person immediately sits bolt upright and glares at you. ' +
            'Spotting the cake, he swiftly grabs it out of your hands and, with a gleeful roar, barges past ' +
            'you and out the door, stuffing the cake into the mouth of the mask as he goes. You listen as his ' +
            'maniacal screams fade off into the distance.  On his seat, you see a set of keys, which appear to be ' +
            'for the motorbike outside.',
        gives: 'keys',
        next: 'e_office'
    }, {
        // Sheep hates water
        id: 'e_sheep_water',
        text: 'You retrieve the water bottle from the rubble of the counter, and approach the masked person. ' +
            'No sooner have you gently tapped him on the shoulder does he sit bolt upright with a grunt. ' +
            'For a second he glowers at you, then his gaze turns to the water in your hand. Snarling, the sheep ' +
            'person lashes out, sending the bottle flying out of your hands across the room.',
        next: 'e_sheep_kill'
    },
    {
      // Sheep wakes due to noisy stairs
        id: 'e_sheep_wake_stairs',
        text: 'The dilapidated metal stairs make a loud creaking and cracking sound as you ' +
            'take your first step onto them.  The noise immediately stirs the masked figure, ' +
            'who suddenly sits bolt upright and growls.',
        next: 'e_sheep_kill'
    }, {
        // Sheep kills player
        id: 'e_sheep_kill',
        text: 'With a bloodcurdling shriek, the sheep figure leaps out of his chair and charges at ' +
            'you. Before you can react he smashes into you, knocking you senseless, and dives on your helpless ' +
            'body.  The last thing you see is his thumbs headed straight for your eye sockets...',
        gameover: 'lose'
    },
    {
        // Win
        id: 'e_complete',
        text: 'You have escaped... for now.',
        gameover: 'win'
    }
];

/**
 * Parser module for the data format.
 * Reads the data object format and creates an internal copy with required 
 * transformations and parsing. Exposes methods to start/reset the game,
 * advance the game via choices/actions, and read the currently active entry.
 *
 * The module is just data-driven, and returns objects from its methods; it
 * does no handling of game display or user input directly.  It needs a frontend
 * written for it in order for a player to interact with it.
 **/
var CYOA = (function() {

    var ENTRY_DATA,
        currentEntryId, currentEntryData,
        inventory;

    function _init(entryData) {
        // clear state
        ENTRY_DATA = {};
        currentEntryId = null;
        currentEntryData = {};
        inventory = [];

        var startEntryId = null;

        // Parse entry data into internal object
        entryData.forEach(function(entry) {
            ENTRY_DATA[entry.id] = Object.create(entry);

            // Track the starting entry and warn of duplicates
            if (entry.start === true) {
                if (startEntryId !== null) {
                    console.error('More than one starting state defined:', startEntryId, entry.id);
                } else {
                    startEntryId = entry.id;
                }
            }

            // Process extra paragraphs if present
            if (entry.extra) {
                entry.extra.forEach(function(ext) {
                    // convert string options to single-item arrays for easier parsing
                    if (ext.requires && (typeof ext.requires === 'string')) {
                        ext.requires = [ext.requires];
                    }
                });
            }

            // 'Next' overrides all other options
            if (entry.next) {
                entry.options = [{
                    text: 'Continue...',
                    goto: entry.next
                }];
            }
            // Process and validate options
            if (entry.options) {
                entry.options.forEach(function(opt) {
                    // options must have a 'goto'
                    if (!opt.goto) console.error('Entry', entry.id, ' has option without a goto: ', opt.text);
                    // convert string options to single-item arrays for easier parsing
                    if (opt.requires && (typeof opt.requires === 'string')) {
                        opt.requires = [opt.requires];
                    }
                });
            }
        });

        // Set initial state from starting entry
        if (startEntryId === null) console.error('No start entry found');
        _setEntry(startEntryId);
    }

    // Inventory methods (accept string or array)

    function _addToInventory(items) {
        if (typeof items === 'string') items = [items];
        inventory = inventory.concat(items);
    }

    function _takeFromInventory(items) {
        if (typeof items === 'string') items = [items];
        var newInv = [];
        inventory.forEach(function(item) {
            if (items.indexOf(item) === -1) newInv.push(item);
        });
        inventory = newInv;
    }

    function _checkInventory(item) {
        return (inventory.indexOf(item) > -1);
    }

    // Utility method to check a 'requires'-format array against the current inventory
    function _hasRequirements(opt) {
        var isAvailable = true;
        if (opt.requires) {
            opt.requires.forEach(function(req) {
                if (req.charAt(0) === '!' && _checkInventory(req.substr(1))) isAvailable = false;
                if (req.charAt(0) !== '!' && !_checkInventory(req)) isAvailable = false;
            });
        }
        return isAvailable;
    }

    // Updates the current entry data to the given entry ID.
    // Composes the current entry data based on conditionals set in the entry data,
    // including required inventory to display options, etc.
    // Also makes changes to inventory and state based on the definition data.
    function _setEntry(id) {
        if (!id in ENTRY_DATA) console.error('Unable to change entry: invalid entry id', id);
        currentEntryId = id;

        var data = ENTRY_DATA[id];
        currentEntryData = {
            id: data.id,
            text: data.text,
            extra: []
        };

        // Add/remove inventory items in this entry
        if (data.gives) _addToInventory(data.gives);
        if (data.takes) _takeFromInventory(data.takes);

        // Update text with extras
        if (data.extra) {
            data.extra.forEach(function(ext) {
                if (_hasRequirements(ext)) currentEntryData.extra.push(ext.text);
            });
        }

        // State modifiers
        // TODO: make this more definitive and mutate options accordingly
        if (data.gameover) currentEntryData.gameover = data.gameover;

        // Define available options based on inventory requirements
        if (data.options) {
            currentEntryData.options = [];
            data.options.forEach(function(opt, idx) {
                if (_hasRequirements(opt)) {
                    currentEntryData.options.push({
                        text: opt.text,
                        goto: opt.goto
                    });
                }
            });
        }
        return currentEntryData;
    }

    function startGame(data) {
        _init(data);
    }

    function getCurrentEntry() {
        if (currentEntryData === {}) console.error('No current entry; has the game started?');
        return currentEntryData;
    }

    function getInventory() {
        return inventory;
    }

    // Changes the active entry according to the numeric ID of the option passed in,
    // if it is present in the current entry.
    function doOption(idx) {
        if (!currentEntryData.options) console.error('Can not complete option', idx);
        var opt = currentEntryData.options[idx];
        var newEntryId = opt.goto;
        if (!newEntryId in ENTRY_DATA) console.error('Cannot do option: invalid goto id', newEntryId);
        return _setEntry(newEntryId);
    }

    return {
        startGame: startGame,
        getCurrentEntry: getCurrentEntry,
        getInventory: getInventory,
        doOption: doOption
    };
})();

/**
 * Some simple jQuery DOM logic for demo purposes.
 * This could easily be expanded for better presentation,
 * per-location graphics, all kinds of stuff.
 **/
var Game = (function() {

    var DATA;

    // Container element to render into
    var $el = $('#output');

    // Text for game over scenarios
    var endMsgs = {
        win: 'You won! Play again...',
        lose: 'You failed.  Restart...'
    };

    // Reads the current entry data and puts DOM nodes
    // in the container to display the text and options
    function render(isStart) {
        var d = CYOA.getCurrentEntry();

        // Clear the container and write the body text
        $el.html('');
        if (isStart) $el.append('<p class="title">Deep Dream</p>');
        $el.append('<p>' + d.text + '</p>');

        d.extra.forEach(function(ext) {
            $el.append('<p>' + ext + '</p>');
        });

        // Write out a list of option or restart links in a list
        // (click handlers bound in init() will handle these)
        var $opts = $('<ul/>');
        if (d.gameover) {
            var $action = $('<li><a class="opt gameover ' + d.gameover + '" href="#">' +
                endMsgs[d.gameover] + '</a></li>');
            $opts.append($action);
        }
        if (d.options) {
            d.options.forEach(function(opt, idx) {
                var $opt = $('<li><a class="opt action" href="#" data-opt="' + idx + '">' +
                    opt.text + '</a></li>');
                $opts.append($opt);
            });
        }
        $el.append($opts);

        // Show current inventory
        if (!d.gameover) {
            var inv = CYOA.getInventory();
            if (inv.length) {
                $el.append('<p class="inv">You are carrying: ' + inv.join(', ') + '</p>');
            }
        }
    }

    function init(entryData) {

        DATA = entryData;

        // Click handlers for option links.  Bound to the document
        // as we destroy and rebuild the links per-entry.
        $(document).on('click', '.action', function(e) {
            e.preventDefault();
            var opt = $(this).attr('data-opt');
            console.log('do option', opt);
            if (CYOA.doOption(opt)) render();
        });

        // As above but for win/lose links.  Restart the game when used
        $(document).on('click', '.gameover', function(e) {
            e.preventDefault();
            _start();
        });

        _start();
    }

    function _start() {
        // Init the game and render the first entry
        CYOA.startGame(DATA);
        render(true);
    }

    return {
        init: init
    }

})();

// Kick off 
Game.init(ENTRIES);