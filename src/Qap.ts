import {CreateProps} from "./Model";
import {
    IAnyModelType,
    IModelType,
    Instance,
    ISimpleType, ITypeUnion,
    ModelPropertiesDeclarationToProperties,
    types
} from "mobx-state-tree";
import {ElementType, FC, ReactElement} from "react";

export namespace Qap {

    export const Of = CreateProps;

    export type OperationType = {
        id: string,
        nodeId: string;
    }
    export type CommandType = OperationType & {

    }

    export type QueryType = OperationType & {

    }

    export type OperationsType = {
        commands: {[key: string]: CommandType};
        queries: {[key: string]: QueryType};
    }

    export type ComponentType = {
        id: string,
        components: {[key: string]: ComponentType};
        operations: OperationsType,
    }
    export const Preprocess = (id: string, component: ComponentType, blacklisted: string[]) : ComponentType => {

        component.id = id;
        blacklisted.push(id);

        component.operations = component.operations || {commands: {}, queries: {}};

        Object.keys(component.operations.commands || {}).forEach((t) => {
            component.operations.commands[t].id = t
            blacklisted.push(t);
        });

        Object.keys(component.operations.queries || {}).forEach((t) => {
            component.operations.queries[t].id = t;
            blacklisted.push(t);
        });

        Object.keys(component.components || {}).forEach((t) => {
            const child = component.components[t];
            blacklisted.push(t);
            component.components[t] = Preprocess(`${component.id}/${t}`, child, blacklisted);
        })

        let grouped = blacklisted.reduce(function(obj, item) {
            obj[item] = obj[item] || 0;
            obj[item]++;
            return obj;
        }, {});

        var len = Object.values(grouped).filter((t) => t > 1).length

        if (len > 0) {
            throw new Error();
        }
        return component;
    }

    export const LocalStateModel = types.model({

    });

    export const RemoteStateModel = types.model().preProcessSnapshot((snap) => {
        if (typeof snap == "string") {
            return {}
        }
        return snap;
    });

    export const OperationBase = types.model({
        id: types.identifier,
        nodeId: types.string,
    })
    export const CommandModel = OperationBase.props({

    });
    export const QueryModel = OperationBase.props({

    });
    export const OperationModel = types.model({
        commands: types.map(CommandModel),
        queries: types.map(QueryModel),
    })
        .preProcessSnapshot((snap) => snap || {});
    export const ComponentModel = (env: Environment) => {
        return types.model({
            id: types.identifier,
            type: types.enumeration(Qap.TypeNames),
            props: Qap.UnionType,
            style: types.frozen({}),
            state: types.map(types.union(LocalStateModel, RemoteStateModel)),
            operations: OperationModel,
            variables: types.frozen({}),
            components: types.map(types.late(() => Qap.ModelContainerType)),
        });
    }

    export let UnionType: ITypeUnion<any, any, any>;
    export let ModelContainerType: IModelType<ModelPropertiesDeclarationToProperties<{type: ISimpleType<unknown>}>, {}>;
    export let TypeNames: string[] = [];
    export class Environment {

        private registrations: { [type: string]: { model: IAnyModelType, component } } = {};

        constructor(private readonly modules: IModule[]) {

        }

        public Initialize = () => {

            this.modules.forEach((m) => {
                const reg = new Registration();
                m.Load(reg);
                this.registrations = {...this.registrations, ...reg.Registrations};
            })


            if (!Qap.UnionType) {
                let type;

                Object.values(this.registrations).forEach((f) => {
                    Qap.TypeNames.push(f.model.name);
                    type = types.union(type, f.model);
                })

                Qap.UnionType = type;
            }

            if (!Qap.ModelContainerType) {
                Qap.ModelContainerType = Qap.ComponentModel(this);
            }
        }
    }


    type Props<T> = { model: Instance<T> };
    export type Component<T> = FC<Props<T>>;



        export abstract class Module implements IModule {
            public abstract Load(registration: IRegistration);
        }

        export interface IModule {
            Load(registration: IRegistration);
        }

        export interface IRegistration {
            Register(model: IAnyModelType, view: ElementType);
        }

        export class Registration implements IRegistration {

            constructor(public readonly Registrations: { [type: string]: { model: IAnyModelType, component } } = {}) {
            }

            public Register(model: IAnyModelType, view) {
                this.Registrations[model.name] = {model, component: view};
            }
        }




}