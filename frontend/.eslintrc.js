module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    rules: {
        semi: ['error', 'never'],
        'import/extensions': ['off'],
        'react/jsx-filename-extension': ['off'],
        'max-len': ['warn', { code: 150 }],
        indent: ['error', 4, { SwitchCase: 1 }],
        'import/prefer-default-export': ['off'],
        'react/jsx-one-expression-per-line': ['off'],
        'import/no-unresolved': ['off'],
        'comma-dangle': ['off'],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['off'],
        'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
        'jsx-a11y/media-has-caption': ['off'],
        'no-unused-vars': 'off', // ts does it better
        '@typescript-eslint/no-unused-vars': 'error', // ts does it better
        'no-shadow': 'off', // ts does it better
        '@typescript-eslint/no-shadow': ['error'], // ts does it better
        'consistent-return': ['off'],
        'react/require-default-props': ['off'],
        'no-undef': ['off'], // ts does it better
        'default-case': ['off'], // ts does it better
        'no-spaced-func': ['off'],
        'func-call-spacing': ['off'],
        'import/no-extraneous-dependencies': ['off'],
        'object-curly-newline': ['off'],
        'arrow-body-style': ['off'],
        'react/jsx-props-no-spreading': ['off'],
        'react/destructuring-assignment': ['off'],
        'func-names': ['off'],
        'arrow-parens': ['off'],
        'react/jsx-curly-newline': ['off']
    }
}
