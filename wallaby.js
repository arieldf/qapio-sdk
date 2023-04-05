module.exports = function (w) {
    console.log("LHD")
    return {
        files: [
            './src/**/*.ts'
        ],

        tests: [
            './tests/**/*Tests.ts'
        ],
        testFramework: "mocha",
        env: {
            type: "node"
        }
    };
};