import { suite, test } from "@testdeck/mocha";
import {assert} from 'chai';
import {CreateProps} from "../src/Model";
import {Qap} from "../src/Qap";
import {types} from "mobx-state-tree";
import Environment = Qap.Environment;
import * as React from "react";


export const MyModel = Qap.Of("hello", {
    name: types.string
})

export const MyModel1 = Qap.Of("hello1", {
    names: types.string,
    age: types.number
})

export const MyComponent: Qap.Component<typeof MyModel> = (model) => {
    return <div></div>;
}

export class MyModule extends Qap.Module {
    Load(registration: Qap.IRegistration) {
        registration.Register(MyModel, MyComponent)
        registration.Register(MyModel1, MyComponent)
    }

}

@suite
class Hello {
    @test
    props() {

        const sut = Qap.Of("hello", {
            name: types.string
        })

        // expected fail :/
        sut.create({
            name: "hd"
        })
    }

    @test
    componentModel() {


        const env = new Environment([new MyModule()]);
        env.Initialize();

        const ui = {
            type: "hello1",
            state: {
              a: ""
            },
            props: {
                names: "",
                age: 12
            },
            operations: {
                commands: {
                    A: {
                        nodeId: "A"
                    }
                },
                queries: {
                    "kA": {
                        nodeId: "a"
                    }
                }
            },
            components: {
                a: {
                    type: "hello1",
                    props: {
                        names: "",
                        age: 263
                    }
                }
            }
        };

        const enhanced = Qap.Preprocess("root", ui, []);

        console.log(enhanced)

        const ComponentModel = Qap.ModelContainerType.create(enhanced);



    }
}