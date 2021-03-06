exports.handler = function (event, context) {
    var slot;
    if (event.request.intent && event.request.intent.slots) {
        var slotName = Object.keys(event.request.intent.slots)[0];
        slot = event.request.intent.slots[slotName];
    }

    var confirm = false;
    var directiveType = "Dialog.ElicitSlot";
    if (event.request.intent.slots.size.value === "small") {
        confirm = true;
    }

    var elicitSlot = "size";
    var confirmSlot = undefined;
    var ssml = "what size do you want";
    if (event.request.intent.slots.size.value) {
        nextSlot = "temperament";
        ssml = "Are you looking for a family dog?";
        if (confirm && event.request.intent.slots.size.confirmationStatus == "NONE") {
            ssml = "small?";
            directiveType = "Dialog.ConfirmSlot";
            elicitSlot = undefined;
            confirmSlot = "size";
        }
    }

    if (event.request.intent.slots.temperament.value) {
        elicitSlot = "energy";
        ssml = "Do you prefer high energy dogs?";
    }

    if (event.request.intent.slots.energy.value) {
        event.request.dialogState = "COMPLETED";
    }

    if (confirm && event.request.dialogState === "COMPLETED") {
        var response = {
            response: {
                card: {
                    content: "content",
                    image: {
                        largeImageUrl: "largeImageUrl",
                        smallImageUrl: "smallImageUrl"
                    },
                    text: "text",
                    title: "title"
                },
                outputSpeech: {
                    ssml: "Done with dialog"
                },
                reprompt: {
                    outputSpeech: {
                        text: "TEXT"
                    }
                }
            },
            success: true,
            slot: slot
        };
    } else if (event.request.dialogState === "COMPLETED") {
        var response = {
            response: {
                card: {
                    content: "content",
                    image: {
                        largeImageUrl: "largeImageUrl",
                        smallImageUrl: "smallImageUrl"
                    },
                    text: "text",
                    title: "title"
                },
                directives: [
                    {
                        updatedIntent: {
                            name: "PetMatchIntent",
                            confirmationStatus: "NONE",
                        },
                        type: "Dialog.ConfirmIntent"
                    }
                ],
                outputSpeech: {
                    ssml: "Done with dialog"
                },
                reprompt: {
                    outputSpeech: {
                        text: "TEXT"
                    }
                }
            },
            success: true,
            slot: slot
        };
    } else {
        var response = {
            response: {
                card: {
                    content: "content",
                    image: {
                        largeImageUrl: "largeImageUrl",
                        smallImageUrl: "smallImageUrl"
                    },
                    text: "text",
                    title: "title"
                },
                directives: [
                    {
                        updatedIntent: {
                            name: "PetMatchIntent",
                            confirmationStatus: "NONE",
                        },
                        slotToElicit: elicitSlot,
                        slotToConfirm: confirmSlot,
                        type: directiveType
                    }
                ],
                outputSpeech: {
                    ssml: ssml
                },
                reprompt: {
                    outputSpeech: {
                        text: "TEXT"
                    }
                }
            },
            success: true,
            slot: slot
        };
    }



    if (event.request.intent) {
        response.intent = event.request.intent.name;
    }

    // We increment a counter in our session every time for testing purposes
    var sessionCounter = 0;
    if (event.session && event.session.attributes && event.session.attributes.counter !== undefined) {
        sessionCounter = event.session.attributes.counter;
        sessionCounter++;
    }

    response.sessionAttributes = { counter: sessionCounter, sessionId: event.session.sessionId };
    if (event.request.intent && event.request.intent.name === "AMAZON.StopIntent") {
        response.response = { shouldEndSession: true };
    }
    context.done(null, response);
};