export default class RSKChatLog extends ChatLog {

}


// this might be sorta how we could defer applying outcomes?
// though we need to think about only applying it once like a background
// what about undo?
export function onRenderChatMessage(app, html, data) {
    html.find(".test")
        .click(e => {
            const outcome = app.flags.rsk.outcome;
            if (app.flags.rsk.appliedTo?.includes(outcome.target)) return;

            // this fails to properly account for 1 prayer at a time rule
            //  if you roll twice, then apply both, there will have been no active prayers
            //  during either calculation.  We need to 'applyOutcome' on the target and let it
            //  check in real time what needs to be removed.  and removed effects may only be needed
            //  for counters like anti poison?
            const target = Actor.get(outcome.target);
            target.deleteEmbeddedDocuments("ActiveEffect", outcome.actorRemovedEffects);
            target.createEmbeddedDocuments("ActiveEffect", outcome.actorAddedEffects);
            target.update(outcome.actorUpdates);

            const appliedTo = app.flags.rsk.appliedTo ?? [];
            app.update({ "flags.rsk.appliedTo": [...appliedTo, outcome.target] });
        });
}