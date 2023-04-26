module.exports = function (w) {
    return {
        trace: true,
        files: [
            './src/**/*.ts'
        ],

        tests: [
            './tests/**/*Tests.tsx'
        ],
        testFramework: "mocha",
        env: {
            type: "node"
        }
    };
};