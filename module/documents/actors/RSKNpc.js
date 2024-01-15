import RSKAction from "../../data/items/RSKAction.js";
import RSKActor from "./RSKActor.js";

export default class RSKNpc extends RSKActor {
    testActions = [];

    prepareData() {
        super.prepareData();
        this.testActions = [];
        this.testActions.push(RSKAction.fromSource({ id: "testAction", label: "test action", damageEntries: { stab: 3 } }));
        console.log(this.testActions);
    }

    getArmourValue() {
        return this.system.armourValue;
    }
}