Hooks.on("createMeasuredTemplate", (MeasuredTemplateDocument) => {
    if (MeasuredTemplateDocument.flags?.dnd5e?.item) {
        if (MeasuredTemplateDocument.user == game.user) {
            if (fromUuidSync(MeasuredTemplateDocument.flags.dnd5e.item).name == "Spirit Guardians") {

                let tokenAnchor;

                // Unlinked tokens
                if (MeasuredTemplateDocument.flags.dnd5e.item.startsWith("Scene")) {
                    const tokenStringCaptures = MeasuredTemplateDocument.flags.dnd5e.item.match("([^.]*.){4}");
                    tokenAnchor = fromUuidSync(tokenStringCaptures[0].substring(0, tokenStringCaptures[0].length - 1)).object;
                }

                // Linked tokens
                else {
                    const tokenStringCaptures = MeasuredTemplateDocument.flags.dnd5e.item.match("([^.]*.){2}");
                    tokenAnchor = MeasuredTemplateDocument.parent.tokens.find((tokenDocument) => tokenDocument.actorId == tokenStringCaptures[1].substring(0, tokenStringCaptures[1].length - 1)).object;
                }

                new Sequence()
                    .effect()
                    .name(`${tokenAnchor.document.name}'s Spirit Guardians`)
                    .attachTo(tokenAnchor)
                    .persist()
                    .shape("circle", {
                        lineSize: 4,
                        lineColor: MeasuredTemplateDocument.user.color.css,
                        radius: MeasuredTemplateDocument.distance / MeasuredTemplateDocument.parent.grid.distance,
                        gridUnits: true,
                    })
                    .play()

                    MeasuredTemplateDocument.delete();
            }
        }
    };
});