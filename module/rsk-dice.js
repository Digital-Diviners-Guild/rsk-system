//todo:
//check for triples
//check for success (need to know the TN)

export default class RSKDice {
    static addButtonListener = (html) => {
        html.find('.roll-dice').click(async ev => {
            //for now a simple way to roll 3d6, later - cool stuff
            let r = Roll.create("3d6");
            await r.evaluate();
            r.toMessage({});
        });
    }
}
