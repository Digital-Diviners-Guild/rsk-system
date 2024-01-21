# rsk (alpha)
A FoundryVTT system for playing [RuneScape Kingdoms](https://steamforged.com/pages/runescape-kingdoms#products).

**Note: This system does not provide any content, you will need to populate the item and actor sheets within your foundry world.**

### What the system provides
* sheets to create and manage characters and items
* statuses that can be applied to characters/npc's
* basic inventory tracking
* dice formulas for rolling skill checks with advantage, disadvantage, and applying modifiers.

#### Automation:
In this pre-release state, a lot of game play mechanics will need to be manually tracked.    
Though there are a few things that have automation already.
- Applying backgrounds during character creation
- Rolling various skill checks
- Spending runes when casting spells
- Spending prayer/summoning points when praying/summoning
- Applying damage (currently just armour soak, no margin bonus, qualities, damage/attack type automation)
- Resting
- Improving your Character (leveling)

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

### Roadmap
* Improved UI/UX
* More Automation
    * Combat Action automation
        * range, dots, qualities, margin bonuses, and more
    * Action Macros for things like Identifying or Disarming a trap, Fishing, etc..
    * Death Consequences
* and more...