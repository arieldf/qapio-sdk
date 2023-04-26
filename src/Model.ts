import {IModelType, ModelPropertiesDeclaration, ModelPropertiesDeclarationToProperties, types} from "mobx-state-tree";

const Model = types.model({});

export const CreateProps = <P extends ModelPropertiesDeclaration = {}>(type: string, properties: P): IModelType<ModelPropertiesDeclarationToProperties<P>, {}> => {
    return types.model({
        ...properties,
    }).actions((self) => {
        return {

        }
    })
        .named(type);
}