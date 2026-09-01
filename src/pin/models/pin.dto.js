"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPinDto = toPinDto;
function toPinDto(model) {
    return {
        Name: model.Name,
        Content: model.Content,
        Pos: {
            x: model.X,
            y: model.Y,
        },
        MapID: model.MapID,
        ID: model.ID,
    };
}
//# sourceMappingURL=pin.dto.js.map