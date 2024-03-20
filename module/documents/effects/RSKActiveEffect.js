export default class RSKActiveEffect extends ActiveEffect {
    get isSuppressed() {
        return this.determineSuppression()
    }

    determineSuppression() {
        //todo: should we have a flag on the parent that holds onto the condition?
        // it could apply 'on usage'
        // 'on equip'
        // 'on success'

        //todo: would this come through flags then?
        // could be 'success', 'equip', 'usage'
        //   condition: new fields.StringField(),
        const condition = this.getFlag("rsk", "condition", "")
        if (condition) {
            //todo: handle equip condition logic
            //todo: handle success condition logic - these effects should be just data on an item 
            // until the success roll happens, so maybe we really only care about the equip condition?
        }else{
            return this.parent.type === "consumable";
        }
    }
}