"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPinModel = toPinModel;
function toPinModel(model) {
    return {
        Name: model.Name,
        Content: model.Content,
        MapID: model.MapID,
        ID: model.ID,
        X: model.Pos.x,
        Y: model.Pos.y,
    };
}
//# sourceMappingURL=pin.model.js.map