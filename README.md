# rsk (alpha)
A FoundryVTT system for playing [RuneScape Kingdoms](https://steamforged.com/pages/runescape-kingdoms#products).

**Note: This system does not provide any content, you will need to populate the item and actor sheets within your foundry world.**

### Roadmap
* Improved UI/UX
* Automation
    * Combat Action automation
        * range, dots, qualities and effects, margin bonuses, and more
    * Action Macros for things like Identifying or Disarming a trap, Fishing, etc..
* and more...

### What the system provides
* sheets to create and manage characters and items
* statuses that can be applied to characters/npc's
* basic inventory tracking
* dice formulas for rolling skill checks with advantage, disadvantage, and applying modifiers.

#### Automation:
In this pre-release state, a lot of game play mechanics will need to be manually tracked.    
Though there are a few things that have automation already:
- Applying backgrounds during character creation
- Rolling various skill checks
- Spending runes when casting spells
- Spending prayer/summoning points when praying/summoning
- Applying damage
    - Death status will automatically be applied
    - Base Armour Soak will be calculated and subtracted from Damage to take
        - no margin bonus, qualities, damage/attack type automation yet
- Resting
- Improving your Character (leveling)
- Death/Resurrection

#### Tips for creating your content
- Spells, Familiars, and Prayers need to be given to each character
    - to help with this you can create an 'actionCollection' item for each group
    - ie: a "Spell Book" action collection that contains all Spell Items each character should have
      - first, create the spell items in your world
      - next, create an action collection named "Standard Spell Book"
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