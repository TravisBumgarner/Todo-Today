import type { Configuration } from 'webpack';
import path from 'path'
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      sharedComponents: path.resolve(__dirname, 'src/react-src/sharedComponents/'),
      modals: path.resolve(__dirname, 'src/react-src/modals/'),
      sharedTypes: path.resolve(__dirname, 'src/react-src/sharedTypes.ts'),
      theme: path.resolve(__dirname, 'src/react-src/theme.tsx'),
      colors: path.resolve(__dirname, 'src/react-src/colors.tsx'),
      utilities: path.resolve(__dirname, 'src/react-src/utilities.ts'),
      Context: path.resolve(__dirname, 'src/react-src/Context.tsx'),
      database: path.resolve(__dirname, 'src/react-src/database.ts')
    }
  },
};
