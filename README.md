# rsk (alpha)
An Unofficial FoundryVTT system for playing [RuneScape Kingdoms](https://steamforged.com/pages/runescape-kingdoms#products).

**Note: This system does not provide any content, you will need to populate the item and actor sheets within your foundry world.**

## Install
In FoundryVTT, use the following url in the 'Manifest URL' field.    
`https://raw.githubusercontent.com/qmarsala/rsk-system/main/system.json`

## What the system provides now
* sheets to create and manage characters and items
* statuses that can be applied to characters/npc's
    * many statuses don't yet affect the actor, and are more for tracking what statuses currently should be applied
* basic inventory tracking
* dice formulas for rolling skill checks with advantage, disadvantage, and applying modifiers.

#### Automation:
In this pre-release state, a lot of game play mechanics will need to be manually tracked.    
Though there are a few things that have automation already:
- Applying backgrounds during character creation
- Calculating max life, prayer, and summoning points
- Rolling various skill checks
- Resting
- Improving your Character (leveling)
- Spending 'Ammo' when an action requires it (prayer/summoning points, runes, arrows/bolts/darts)
- Consumables (potions, food, etc)
- Applying damage (partial automation)
    - Death status will automatically be applied
    - Armour Soak, Attack and Damage Type specific strength/weaknesses will be taken into account when calculating damage taken
    - Button in chat for easy access to damage application from an action
    - No qualities or effects have automation yet
- Death/Resurrection
    - remove statuses 
    - restore health/prayer/summoning points

    
#### Tips for creating your content
- Spells, Familiars, and Prayers need to be given to each character
    - to help with this you can create a 'codex' item for each group
    - ie: a "Spell Book" codex that contains all Spell Items each character should have
      - first, create the spell items in your world
      - next, create an codex named "Standard Spell Book"
      - then, drag and drop the spells into the "Standard Spell Book" sheet.
      - lastly, drag and drop the "Standard Spell Book" item onto the character sheets and it will import all the Spell items into the character's sheet
      - repeat for prayers, and familiars
- 'itemCollections' are similar and should be used to implement 'Starting Gear Packages'
- Death Actor
    - there is a special actor "Death" that can be assigned a roll table (for death consequences)
        - create a roll table, fill in consequences, drag and drop onto death actor sheet
    - when a player interacts with Death's token, they will be able to roll for consequences and accept a resurrection
        - the consequences themselves currently need to be resolved by the player
    - resurrection will reset stats and effects, the button to do so will appear after rolling the correct amount of consequences
    - I like to put Death in a special scene called "Death's Office" and move players there on death

    
## Roadmap
* Improved UI/UX
* Character Creator
* Quest Log
* Automation
    * Use margin to boost outcome
    * Combat Action automation
        * enforce valid targetting rules (range, type, etc)
        * damage over time
        * qualities/effects
        * and more...
    * Action Macros for common skill checks:
        * Disarming a trap, Fishing, etc..
        * Easily created by dragging and dropping skills, abilities, items onto the hot bar
    * Crafting System
        * consuming materials and providing the new item after making the appropriate skill check
* Module friendly api to enable community modules to extend the system
* and more...
