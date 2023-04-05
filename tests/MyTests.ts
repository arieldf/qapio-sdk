import { suite, test } from "@testdeck/mocha";
import { expect } from 'chai';

class TestBase {
    @test
    basic() {
        // expected fail :/
        expect(false).to.equal(false);
    }
}

@suite
class Hello extends TestBase {
    @test
    world() {
        // expected fail :/
        expect(false).to.equal(true);
    }
}