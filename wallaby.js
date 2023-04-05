module.exports = function (w) {
    return {
        trace: true,
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