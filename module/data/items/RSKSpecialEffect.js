import { fields } from "../fields.js";
import { uiService } from "../../rsk-ui-service.js";
import { localizeText } from "../../rsk-localize.js";

export default class RSKSpecialEffect extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            effectType, // "auto|prompt"; //?? do we need something like this? it could be a generic prompt asking for x and y
            // used would be like 'block' and we could show an extra usage button in the inventory for items with usage effects
            // always would be like 'heavy' which forces it to tke an extra slot both in inv and equipped
            appliesWhen, // "action|equipped|used|always";
            triggerMargin, // 1;
            changes, //[{}]; // the changes to make the effect with
            duration, // ""; // duration in turns for the effect

            // special effects are mostly 'statuses' that trigger at certain times
            // but not always
            // sometimes they need to trigger the actor to make a decision (like how much damage would you like to convert to soak next turn)
            // do we need any of these properties instead of or in addition to 'changes'?
            // if a special effect is just applying a status, then it would be good to have 'statusesAdded'
            damageEntries,
            statusesAdded,
            statusesRemoved,
            effectsAdded,
            effectsRemoved,
        };
    }


    // apply...
    // orig idea was to take an outcome, and return a new one with the deltas applied
    // but what about 'equipped' and 'always'... they don't operate on an 
    // outcome.
    async apply(actionOutcome) {
        //if its a dialog, open the X Y prompt to get our needed params
        //if its auto, do the things

        // we will make a new outcome with the updates.
        return { ...actionOutcome };
    }
}